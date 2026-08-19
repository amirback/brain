import type { ClassRecord, StudentState } from "./types";

/**
 * Cross-device sync for codes.
 *
 * A four-character code is useless on someone else's phone unless both phones
 * can look it up somewhere. There is no backend yet, so codes resolve through
 * a public keyless key-value store: the teacher publishes the class under its
 * code, the student publishes a progress snapshot under theirs, and anyone
 * typing the code pulls it back.
 *
 * Two honest limits, both stated in the UI and the README:
 * the store is public, so nothing private goes in here (emails are stripped),
 * and if it is unreachable the app falls back to local data and share links.
 */

const BASE = "https://textdb.dev/api/data/";
const NS = "brain-v1-";
const TIMEOUT = 7000;

const keyFor = (kind: "class" | "roster" | "student", code: string) =>
  `${NS}${kind}-${code.trim().toUpperCase()}`;

async function withTimeout<T>(run: (signal: AbortSignal) => Promise<T>): Promise<T | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    return await run(ctrl.signal);
  } catch {
    return null; // offline, blocked, or the store is down — callers fall back
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Everything is wrapped in { v } before sending. The store rewrites bare
 * arrays into a shape of its own, so an explicit envelope keeps reads and
 * writes symmetrical whatever the value is.
 */
async function put(key: string, value: unknown): Promise<boolean> {
  const res = await withTimeout((signal) =>
    fetch(BASE + key, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ v: value }),
      signal,
    })
  );
  return Boolean(res?.ok);
}

async function get<T>(key: string): Promise<T | null> {
  const res = await withTimeout((signal) => fetch(BASE + key, { signal, cache: "no-store" }));
  if (!res || !res.ok) return null;
  const text = await res.text().catch(() => "");
  if (!text.trim()) return null;
  try {
    const parsed = JSON.parse(text) as { v?: T } | T;
    if (parsed && typeof parsed === "object" && "v" in parsed) return (parsed as { v: T }).v ?? null;
    return parsed as T;
  } catch {
    return null;
  }
}

/* ---------------- what gets published ---------------- */

/** Never publish contact details — the store is public. */
function publicSnapshot(st: StudentState): StudentState {
  return {
    ...st,
    email: null,
    answers: st.answers.slice(-20),
    eloHistory: st.eloHistory.slice(-20),
    forecastHistory: st.forecastHistory.slice(-20),
    streakDates: st.streakDates.slice(-45),
    inbox: [],
  };
}

export async function publishClass(cls: ClassRecord): Promise<boolean> {
  return put(keyFor("class", cls.code), cls);
}

export async function lookupClass(code: string): Promise<ClassRecord | null> {
  const raw = await get<ClassRecord>(keyFor("class", code));
  return raw && typeof raw === "object" && typeof raw.code === "string" ? raw : null;
}

export async function publishStudent(st: StudentState): Promise<boolean> {
  return put(keyFor("student", st.code), publicSnapshot(st));
}

export async function lookupStudent(code: string): Promise<StudentState | null> {
  const raw = await get<StudentState>(keyFor("student", code));
  return raw && typeof raw === "object" && typeof raw.code === "string" ? raw : null;
}

/**
 * The roster is just the list of student codes that joined a class.
 * An unset key can come back as anything, so the shape is checked, not assumed.
 */
export async function joinRoster(classCode: string, studentCode: string): Promise<void> {
  const key = keyFor("roster", classCode);
  const current = await lookupRoster(classCode);
  if (current.includes(studentCode)) return;
  await put(key, [...current, studentCode].slice(-60));
}

export async function lookupRoster(classCode: string): Promise<string[]> {
  const raw = await get<unknown>(keyFor("roster", classCode));
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string");
}

/** Pulls every student of a class, skipping any that fail to load. */
export async function pullRoster(classCode: string): Promise<StudentState[]> {
  const codes = await lookupRoster(classCode);
  const results = await Promise.all(codes.map((c) => lookupStudent(c)));
  return results.filter((s): s is StudentState => Boolean(s?.code));
}
