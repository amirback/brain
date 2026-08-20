import Anthropic from "@anthropic-ai/sdk";
import type { MentorProfile, MentorTurn } from "@/lib/mentor-prompt";
import { buildSystem, MAX_MESSAGE_CHARS, trimHistory } from "@/lib/mentor-prompt";

/**
 * The mentor's language-model backend.
 *
 * This route only exists on a server — Vercel. The GitHub Pages build is a
 * static export and deletes this directory before building, which is fine: the
 * client falls back to the rule-based mentor in `lib/advisor.ts` whenever this
 * endpoint is missing or fails, so the app never loses the feature outright,
 * only the open-ended half of it.
 *
 * Replies stream as plain UTF-8 text rather than SSE. There is exactly one
 * text stream and no tool calls, so an event envelope would buy nothing and
 * cost the client a parser.
 */

export const runtime = "nodejs";
// Every reply depends on the request body, so there is nothing to cache.
export const dynamic = "force-dynamic";

/**
 * Sonnet 5 rather than Opus: a mentor chat is short replies to ordinary
 * questions, which Sonnet answers just as well for roughly a third of the cost
 * per message. Overridable without a code change — set MENTOR_MODEL in the
 * environment to try another one.
 */
const MODEL = process.env.MENTOR_MODEL || "claude-sonnet-5";

/**
 * Health check: is a key actually reaching this deployment?
 *
 * Returns whether one is present and what shape it has — never the key itself,
 * and never enough of it to be useful to anyone. Without this, the only way to
 * tell "no key" from "bad key" is to read server logs, which is a slow loop
 * when someone is configuring a deploy for the first time.
 */
export async function GET(request: Request): Promise<Response> {
  const raw = process.env.ANTHROPIC_API_KEY;
  const key = raw ?? "";

  /**
   * `?probe=1` makes one real, minimal request so the actual API error is
   * visible. A configured key that still fails — no credit, wrong key, a model
   * the account cannot reach — is otherwise indistinguishable from success
   * until a student hits it. Costs one token, so it is opt-in.
   */
  if (new URL(request.url).searchParams.get("probe") === "1" && key) {
    try {
      await new Anthropic({ apiKey: key }).messages.create({
        model: MODEL,
        max_tokens: 1,
        messages: [{ role: "user", content: "ok" }],
      });
      return Response.json({ probe: "ok", model: MODEL });
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        return Response.json({
          probe: "failed",
          status: error.status,
          type: error.type,
          // Anthropic's messages name the cause plainly ("credit balance is
          // too low") and carry nothing secret.
          message: error.message,
          model: MODEL,
        });
      }
      return Response.json({ probe: "failed", message: String(error), model: MODEL });
    }
  }

  return Response.json({
    // `present: false` means no such variable reached this deployment at all.
    // `present: true` with length 0 means it arrived empty — a paste that
    // didn't take. The two need different fixes, and the earlier version of
    // this check could not tell them apart.
    present: raw !== undefined,
    configured: key.length > 0,
    // A correct key starts with sk-ant- and is long; these two catch a
    // truncated paste or the wrong value pasted in.
    looksValid: key.startsWith("sk-ant-") && key.length > 40,
    length: key.length,
    // Variable NAMES only, never values — this is what catches a typo or a
    // key stored under a name the code doesn't read.
    seen: Object.keys(process.env).filter((k) => /anthropic|claude|mentor/i.test(k)),
    model: MODEL,
  });
}

interface MentorRequest {
  message?: unknown;
  history?: unknown;
  profile?: unknown;
}

function bad(message: string, status = 400): Response {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Not an error the student caused — the client quietly uses the offline
    // mentor instead of showing them a broken chat.
    return Response.json({ error: "mentor_unconfigured" }, { status: 503 });
  }

  let body: MentorRequest;
  try {
    body = (await request.json()) as MentorRequest;
  } catch {
    return bad("Body must be JSON.");
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) return bad("A message is required.");
  if (message.length > MAX_MESSAGE_CHARS) return bad("Message is too long.");
  if (!body.profile || typeof body.profile !== "object") return bad("A profile is required.");

  const profile = body.profile as MentorProfile;
  const history = Array.isArray(body.history)
    ? trimHistory(
        (body.history as MentorTurn[]).filter(
          (t) =>
            t &&
            (t.role === "user" || t.role === "assistant") &&
            typeof t.content === "string" &&
            t.content.length > 0 &&
            t.content.length <= MAX_MESSAGE_CHARS
        )
      )
    : [];

  const client = new Anthropic({ apiKey });

  try {
    const stream = client.messages.stream({
      model: MODEL,
      // Replies are chat bubbles, not documents. A lower ceiling is also the
      // simplest guard against one runaway answer eating the budget.
      max_tokens: 1024,
      // Low effort keeps both the latency and the token spend down; thinking
      // stays adaptive, which is the documented recommendation for Sonnet 5.
      output_config: { effort: "low" },
      system: buildSystem(profile),
      messages: [...history, { role: "user", content: message }],
    });

    /**
     * Wait for the model's first token before committing to a 200.
     *
     * Streaming failures land *inside* the response body, where the client has
     * already seen a success status and treats whatever arrives as the answer.
     * That turned an empty credit balance into "(the answer was cut off)" shown
     * to the student, instead of the silent fall back to the offline mentor.
     * Holding the status until the first token means a failure that happens
     * before any output is still reported as a failure — and once text starts
     * flowing, this costs nothing, because that is when a stream would have
     * begun emitting anyway.
     */
    const iterator = stream[Symbol.asyncIterator]();
    let firstText = "";
    try {
      for (;;) {
        const next = await iterator.next();
        if (next.done) break;
        const event = next.value;
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta" &&
          event.delta.text
        ) {
          firstText = event.delta.text;
          break;
        }
      }
    } catch (error) {
      stream.abort();
      return apiErrorResponse(error);
    }

    if (!firstText) {
      // Ended without producing anything — a refusal, or an empty completion.
      // The offline mentor is a better answer than an empty bubble.
      stream.abort();
      return Response.json({ error: "mentor_empty" }, { status: 502 });
    }

    const encoder = new TextEncoder();
    const replyStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          controller.enqueue(encoder.encode(firstText));
          for (;;) {
            const next = await iterator.next();
            if (next.done) break;
            const event = next.value;
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta" &&
              event.delta.text
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } catch (error) {
          // Text was already delivered, so the status is spent. Say plainly
          // that the rest is missing rather than ending mid-sentence.
          console.error("mentor stream failed mid-reply", error);
          controller.enqueue(encoder.encode(streamErrorNote(profile.lang)));
        } finally {
          controller.close();
        }
      },
      cancel() {
        // The student navigated away mid-answer; stop paying for the rest.
        stream.abort();
      },
    });

    return new Response(replyStream, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
        // Proxies that buffer would defeat the point of streaming.
        "x-accel-buffering": "no",
      },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

/**
 * Maps an SDK error onto a status the client can act on. Typed first, so a
 * rate limit is not reported as a bad request — and every branch here is a
 * signal to fall back to the offline mentor, never something to show a student.
 */
function apiErrorResponse(error: unknown): Response {
  if (error instanceof Anthropic.RateLimitError) {
    return Response.json({ error: "mentor_busy" }, { status: 429 });
  }
  if (error instanceof Anthropic.AuthenticationError) {
    console.error("mentor auth failed — check ANTHROPIC_API_KEY");
    return Response.json({ error: "mentor_unconfigured" }, { status: 503 });
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return Response.json({ error: "mentor_unreachable" }, { status: 503 });
  }
  if (error instanceof Anthropic.APIError) {
    // A 400 here is usually the account, not the request: an empty credit
    // balance arrives as invalid_request_error.
    console.error("mentor api error", error.status, error.message);
    return Response.json({ error: "mentor_failed", status: error.status }, { status: 502 });
  }
  console.error("mentor unexpected error", error);
  return Response.json({ error: "mentor_failed" }, { status: 500 });
}

function streamErrorNote(lang: string): string {
  if (lang === "kk") return "\n\n(Жауап үзіліп қалды. Қайта сұрап көр.)";
  if (lang === "en") return "\n\n(The answer was cut off. Try asking again.)";
  return "\n\n(Ответ оборвался. Попробуй спросить ещё раз.)";
}
