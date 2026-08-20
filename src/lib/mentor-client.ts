import type { MentorProfile, MentorTurn } from "./mentor-prompt";

/**
 * Client half of the mentor.
 *
 * The route only exists on a server build, so this is written to fail softly:
 * any 404, 503, network error, or missing body means "no model available", and
 * the caller falls back to the rule-based mentor. The student never sees a
 * broken chat — at worst they get the narrower answer.
 */

export class MentorUnavailable extends Error {
  constructor(public readonly reason: string) {
    super(`mentor unavailable: ${reason}`);
    this.name = "MentorUnavailable";
  }
}

export interface AskMentorOptions {
  message: string;
  history: MentorTurn[];
  profile: MentorProfile;
  /** Called with each chunk of text as it arrives. */
  onChunk: (text: string) => void;
  signal?: AbortSignal;
}

/**
 * Streams a reply, calling `onChunk` as text arrives, and resolves with the
 * full text. Throws `MentorUnavailable` when the backend cannot serve at all —
 * which is the signal to use the offline mentor instead.
 */
export async function askMentor(opts: AskMentorOptions): Promise<string> {
  let response: Response;
  try {
    // The trailing slash matters: `trailingSlash: true` in next.config.ts makes
    // the bare path a 308 redirect, costing an extra round trip on every reply.
    response = await fetch("/api/mentor/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message: opts.message,
        history: opts.history,
        profile: opts.profile,
      }),
      signal: opts.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new MentorUnavailable("network");
  }

  if (!response.ok || !response.body) {
    // A static build has no route at all; an unset key answers 503. Both mean
    // the same thing to the caller.
    let reason = `http_${response.status}`;
    try {
      const payload = (await response.json()) as { error?: string };
      if (payload?.error) reason = payload.error;
    } catch {
      // Non-JSON error body — the status is enough.
    }
    throw new MentorUnavailable(reason);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let full = "";

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      if (!text) continue;
      full += text;
      opts.onChunk(text);
    }
  } finally {
    reader.releaseLock();
  }

  // An empty stream is a failure the route could not report mid-flight.
  if (!full.trim()) throw new MentorUnavailable("empty");
  return full;
}
