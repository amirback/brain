import type { ClassRecord, StudentState } from "./types";

/**
 * Cross-device links.
 *
 * There is no server yet, so a short code typed on another phone has nothing
 * to resolve against. These links carry the payload itself: the class record,
 * a child's progress snapshot, or a whole profile for recovery. Anyone opening
 * the link gets the real data, on any device, with no account.
 *
 * The payload rides in the URL hash so it never reaches a server or a log.
 */

const enc = new TextEncoder();
const dec = new TextDecoder();

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function pack(value: unknown): string {
  return toBase64Url(enc.encode(JSON.stringify(value)));
}

export function unpack<T>(payload: string): T | null {
  try {
    return JSON.parse(dec.decode(fromBase64Url(payload))) as T;
  } catch {
    return null;
  }
}

/* ---------------- what each link carries ---------------- */

export type SharePayload =
  | { kind: "join"; cls: ClassRecord }
  | { kind: "child"; student: StudentState }
  | { kind: "restore"; student: StudentState };

/**
 * A profile trimmed for transport: the answer log is the bulky part and only
 * its recent tail matters for advice, so older entries are dropped.
 */
export function slimStudent(st: StudentState): StudentState {
  const keepDays = 45;
  const cutoff = Date.now() - keepDays * 864e5;
  const secondsByDay: Record<string, number> = {};
  for (const [day, secs] of Object.entries(st.secondsByDay)) {
    if (new Date(day).getTime() >= cutoff) secondsByDay[day] = secs;
  }
  return {
    ...st,
    answers: st.answers.slice(-40),
    eloHistory: st.eloHistory.slice(-30),
    forecastHistory: st.forecastHistory.slice(-30),
    streakDates: st.streakDates.slice(-keepDays),
    secondsByDay,
    inbox: st.inbox.slice(0, 10),
  };
}

function base(): string {
  if (typeof window === "undefined") return "";
  // Keeps the deployed base path (/brain on Pages) without hardcoding it.
  const path = window.location.pathname.replace(/\/(start|teacher|parent|profile|dashboard)\/?$/, "");
  return `${window.location.origin}${path}`;
}

export function classInviteLink(cls: ClassRecord): string {
  return `${base()}/start/#join=${pack({ kind: "join", cls } satisfies SharePayload)}`;
}

export function childShareLink(st: StudentState): string {
  return `${base()}/parent/#child=${pack({ kind: "child", student: slimStudent(st) } satisfies SharePayload)}`;
}

export function recoveryLink(st: StudentState): string {
  return `${base()}/start/#restore=${pack({ kind: "restore", student: slimStudent(st) } satisfies SharePayload)}`;
}

/** Reads and clears a payload from the current URL hash. */
export function readHashPayload(): SharePayload | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return null;
  const [key, value] = hash.split("=");
  if (!value) return null;
  if (key !== "join" && key !== "child" && key !== "restore") return null;
  const parsed = unpack<SharePayload>(value);
  if (!parsed || parsed.kind !== key) return null;
  return parsed;
}

export function clearHash() {
  if (typeof window === "undefined") return;
  history.replaceState(null, "", window.location.pathname + window.location.search);
}
