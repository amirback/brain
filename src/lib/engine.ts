import { QUESTIONS, topicsOf } from "./content";
import type { AnswerLog, Goal, Question, StudentState, SubjectId } from "./types";

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
  return Math.round(K_BY_MODE[mode] * ((correct ? 1 : 0) - e));
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
  return Math.min(1, Math.max(0, prev + alpha * (target - prev)));
}

export type MasteryBand = "none" | "weak" | "mid" | "strong";

export function masteryBand(m: number | undefined, attempts: number | undefined): MasteryBand {
  if (!attempts) return "none";
  if ((m ?? 0) < 0.35) return "weak";
  if ((m ?? 0) < 0.7) return "mid";
  return "strong";
}

/**
 * Readiness on a 0..1 scale for one subject: weighted topic mastery carries
 * most of it, and the Elo rating adds a difficulty-calibrated correction so
 * grinding easy questions can't inflate the number.
 */
export function readiness(
  user: Pick<StudentState, "mastery" | "elo" | "attempts">,
  subject: SubjectId
): number {
  let covered = 0;
  let sum = 0;
  for (const tp of topicsOf(subject)) {
    if (user.attempts[tp.id]) {
      sum += (user.mastery[tp.id] ?? 0) * tp.weight;
      covered += tp.weight;
    }
  }
  const masteryPart = covered > 0 ? sum / covered : 0;
  const eloPart = Math.min(1, Math.max(0, (user.elo - 600) / 900));
  return Math.min(1, Math.max(0, 0.72 * masteryPart + 0.28 * eloPart));
}

export interface ForecastView {
  value: string;
  max: string;
  /** Numeric form, used for deltas between two points in time. */
  numeric: number;
}

/**
 * The same readiness number, expressed on whatever scale the student's goal
 * actually uses: UNT profile points, an SAT composite, or an IELTS band.
 */
export function formatForecast(raw: number, goal: Goal): ForecastView {
  if (goal === "sat") {
    // SAT composite runs 400–1600, rounded to the nearest 10 like a real report.
    const n = Math.round((400 + raw * 1200) / 10) * 10;
    return { value: String(n), max: "1600", numeric: n };
  }
  if (goal === "ielts") {
    // Bands run 4.0–9.0 in half steps.
    const n = Math.min(9, Math.round((4 + raw * 5) * 2) / 2);
    return { value: n.toFixed(1), max: "9.0", numeric: n };
  }
  const n = Math.round(raw * 50);
  return { value: String(n), max: "50", numeric: n };
}

export function forecastOf(user: StudentState): ForecastView {
  return formatForecast(readiness(user, user.activeSubject), user.goal);
}

// Pick the next question closest to a target rating, avoiding repeats
// from the current session and preferring ones never answered correctly.
export function pickQuestion(opts: {
  subject?: SubjectId;
  topic?: string;
  target: number;
  excludeIds: string[];
  answers: AnswerLog[];
}): Question | null {
  const solvedRight = new Set(opts.answers.filter((a) => a.correct).map((a) => a.qid));
  let pool = QUESTIONS.filter((q) => !opts.excludeIds.includes(q.id));
  if (opts.topic) pool = pool.filter((q) => q.topic === opts.topic);
  else if (opts.subject) pool = pool.filter((q) => q.subject === opts.subject);
  if (pool.length === 0) return null;
  const fresh = pool.filter((q) => !solvedRight.has(q.id));
  const source = fresh.length > 0 ? fresh : pool;
  const sorted = [...source].sort(
    (a, b) => Math.abs(a.difficulty - opts.target) - Math.abs(b.difficulty - opts.target)
  );
  const top = sorted.slice(0, 3);
  return top[Math.floor(Math.random() * top.length)];
}

/** The diagnostic walks the subject's topics in turn. */
export function nextDiagnosticTopic(step: number, subject: SubjectId): string | undefined {
  const list = topicsOf(subject);
  if (list.length === 0) return undefined;
  return list[step % list.length].id;
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
export function recommend(
  user: Pick<StudentState, "mastery" | "attempts">,
  subject: SubjectId
): Recommendation[] {
  const rec: Recommendation[] = [];
  const scored = topicsOf(subject).map((tp) => ({
    id: tp.id,
    attempts: user.attempts[tp.id] ?? 0,
    m: user.mastery[tp.id] ?? 0,
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
  return recent.filter((a) => !a.correct).length >= 3;
}

export const CHECKPOINT_INTERVAL_DAYS = 4;

export function checkpointDue(lastCheckpoint: number | null, createdAt: number): boolean {
  return Date.now() - (lastCheckpoint ?? createdAt) > CHECKPOINT_INTERVAL_DAYS * 24 * 3600 * 1000;
}

export function daysUntilCheckpoint(lastCheckpoint: number | null, createdAt: number): number {
  const passed = (Date.now() - (lastCheckpoint ?? createdAt)) / (24 * 3600 * 1000);
  return Math.max(0, Math.ceil(CHECKPOINT_INTERVAL_DAYS - passed));
}

/** Short human-readable code used to link a student to a teacher or parent. */
export function makeCode(prefix: string): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 4; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `${prefix}-${out}`;
}
