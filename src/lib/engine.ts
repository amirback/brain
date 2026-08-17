import { QUESTIONS, TOPICS } from "./content";
import type { AnswerLog, Question, UserState } from "./types";

// Elo-based adaptive engine.
// The student and every question carry a rating on the same scale.
// A correct answer is a "win" against the question, a wrong one is a "loss".
// Expected score follows the logistic curve, so beating a hard question
// moves the rating much more than beating an easy one.

export const START_ELO = 800;
export const ELO_MIN = 400;
export const ELO_MAX = 2400;

const K_BY_MODE = { diagnostic: 48, practice: 24, checkpoint: 32 } as const;

export function expectedScore(student: number, question: number): number {
  return 1 / (1 + Math.pow(10, (question - student) / 400));
}

export function eloDelta(student: number, question: number, correct: boolean, mode: AnswerLog["mode"]): number {
  const e = expectedScore(student, question);
  const k = K_BY_MODE[mode];
  return Math.round(k * ((correct ? 1 : 0) - e));
}

export function applyElo(current: number, delta: number): number {
  return Math.min(ELO_MAX, Math.max(ELO_MIN, current + delta));
}

// Mastery is an exponential moving average of results per topic,
// weighted by question difficulty: solving hard questions proves more.
export function masteryStep(prev: number, correct: boolean, difficulty: number): number {
  const weight = Math.min(1.25, Math.max(0.6, difficulty / 1000));
  const target = correct ? Math.min(1, 0.55 + 0.45 * (weight - 0.35)) : 0;
  const alpha = correct ? 0.28 : 0.22;
  const next = prev + alpha * (target - prev);
  return Math.min(1, Math.max(0, next));
}

export type MasteryBand = "none" | "weak" | "mid" | "strong";

export function masteryBand(m: number | undefined, attempts: number | undefined): MasteryBand {
  if (!attempts) return "none";
  if ((m ?? 0) < 0.35) return "weak";
  if ((m ?? 0) < 0.7) return "mid";
  return "strong";
}

// Forecast maps the state onto the 50-point profile-math scale of the UNT.
// Weighted topic mastery carries most of it; the Elo rating adds a
// difficulty-calibrated correction so grinding easy questions can't inflate it.
export function forecast(user: Pick<UserState, "mastery" | "elo" | "attempts">): number {
  let covered = 0;
  let sum = 0;
  for (const t of TOPICS) {
    const m = user.mastery[t.id];
    if (user.attempts[t.id]) {
      sum += (m ?? 0) * t.weight;
      covered += t.weight;
    }
  }
  const masteryPart = covered > 0 ? sum / covered : 0;
  const eloPart = Math.min(1, Math.max(0, (user.elo - 600) / 900));
  const raw = 0.72 * masteryPart + 0.28 * eloPart;
  return Math.round(raw * 50);
}

// Pick the next question closest to a target rating, avoiding repeats
// from the current session and preferring ones never answered correctly.
export function pickQuestion(opts: {
  topic?: string;
  target: number;
  excludeIds: string[];
  answers: AnswerLog[];
}): Question | null {
  const solvedRight = new Set(opts.answers.filter((a) => a.correct).map((a) => a.qid));
  let pool = QUESTIONS.filter((q) => !opts.excludeIds.includes(q.id));
  if (opts.topic) pool = pool.filter((q) => q.topic === opts.topic);
  if (pool.length === 0) return null;
  const fresh = pool.filter((q) => !solvedRight.has(q.id));
  const source = fresh.length > 0 ? fresh : pool;
  const sorted = [...source].sort(
    (a, b) => Math.abs(a.difficulty - opts.target) - Math.abs(b.difficulty - opts.target)
  );
  const top = sorted.slice(0, 3);
  return top[Math.floor(Math.random() * top.length)];
}

// Diagnostic runs round-robin across topics while the target rating
// follows a staircase: up on success, down on failure.
export function nextDiagnosticTopic(step: number): string {
  return TOPICS[step % TOPICS.length].id;
}

export function nextTarget(prev: number, correct: boolean): number {
  return Math.min(1500, Math.max(650, prev + (correct ? 110 : -130)));
}

export interface Recommendation {
  topic: string;
  kind: "start" | "continue" | "review";
}

// The plan: weakest covered topics first, then untouched ones,
// then reviews of mastered material (lightweight spaced repetition).
export function recommend(user: Pick<UserState, "mastery" | "attempts">): Recommendation[] {
  const rec: Recommendation[] = [];
  const scored = TOPICS.map((t) => ({
    id: t.id,
    attempts: user.attempts[t.id] ?? 0,
    m: user.mastery[t.id] ?? 0,
  }));
  const weak = scored.filter((s) => s.attempts > 0 && s.m < 0.7).sort((a, b) => a.m - b.m);
  const untouched = scored.filter((s) => s.attempts === 0);
  const strong = scored.filter((s) => s.attempts > 0 && s.m >= 0.7).sort((a, b) => a.m - b.m);
  for (const w of weak) rec.push({ topic: w.id, kind: "continue" });
  for (const u of untouched) rec.push({ topic: u.id, kind: "start" });
  for (const s of strong) rec.push({ topic: s.id, kind: "review" });
  return rec.slice(0, 3);
}

export function isStuck(answers: AnswerLog[], topic: string): boolean {
  const recent = answers.filter((a) => a.topic === topic).slice(-5);
  if (recent.length < 4) return false;
  const wrong = recent.filter((a) => !a.correct).length;
  return wrong >= 3;
}

export const CHECKPOINT_INTERVAL_DAYS = 4;

export function checkpointDue(lastCheckpoint: number | null, createdAt: number): boolean {
  const base = lastCheckpoint ?? createdAt;
  return Date.now() - base > CHECKPOINT_INTERVAL_DAYS * 24 * 3600 * 1000;
}

export function daysUntilCheckpoint(lastCheckpoint: number | null, createdAt: number): number {
  const base = lastCheckpoint ?? createdAt;
  const passed = (Date.now() - base) / (24 * 3600 * 1000);
  return Math.max(0, Math.ceil(CHECKPOINT_INTERVAL_DAYS - passed));
}
