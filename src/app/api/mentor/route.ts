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
export function GET(): Response {
  const raw = process.env.ANTHROPIC_API_KEY;
  const key = raw ?? "";
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

    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta" &&
              event.delta.text
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          const final = await stream.finalMessage();
          if (final.stop_reason === "refusal") {
            // Nothing useful was produced; say so in the stream rather than
            // ending on an empty bubble.
            controller.enqueue(encoder.encode(refusalNote(profile.lang)));
          }
        } catch (error) {
          console.error("mentor stream failed", error);
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

    return new Response(body, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
        // Proxies that buffer would defeat the point of streaming.
        "x-accel-buffering": "no",
      },
    });
  } catch (error) {
    // Typed first, so a rate limit is not reported as a bad request.
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
      console.error("mentor api error", error.status, error.message);
      return Response.json({ error: "mentor_failed" }, { status: 502 });
    }
    console.error("mentor unexpected error", error);
    return Response.json({ error: "mentor_failed" }, { status: 500 });
  }
}

function refusalNote(lang: string): string {
  if (lang === "kk") return "Бұл сұраққа жауап бере алмаймын. Оқу туралы сұрасаң, көмектесемін.";
  if (lang === "en") return "I can't answer that one. Ask me about your studies and I'll help.";
  return "На этот вопрос ответить не могу. Спроси про учёбу — помогу.";
}

function streamErrorNote(lang: string): string {
  if (lang === "kk") return "\n\n(Жауап үзіліп қалды. Қайта сұрап көр.)";
  if (lang === "en") return "\n\n(The answer was cut off. Try asking again.)";
  return "\n\n(Ответ оборвался. Попробуй спросить ещё раз.)";
}
