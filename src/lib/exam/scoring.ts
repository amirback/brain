import type {
  ExamAnswer, ExamItem, IeltsScoreReport, ItemResult, SatScoreReport, SkillBreakdown,
} from "./types";

/* ---------------- answer checking ---------------- */

/**
 * Grid-ins and gap-fills: ignore case, spacing, articles and trailing periods.
 * Whitespace is collapsed and trimmed *before* the article is stripped — otherwise
 * a leading space stops the pattern from anchoring and " the bookshop" is marked
 * wrong while "the bookshop" is accepted.
 */
export function normalise(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[.,;:!?"'`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^(a|an|the)\s+/, "");
}

/** Numeric answers accept 1/2, 0.5 and .5 as the same value. */
function numeric(raw: string): number | null {
  const s = raw.replace(/\s/g, "");
  const frac = /^(-?\d+)\/(\d+)$/.exec(s);
  if (frac) {
    const d = Number(frac[2]);
    return d === 0 ? null : Number(frac[1]) / d;
  }
  if (/^-?(\d+\.?\d*|\.\d+)%?$/.test(s)) return Number(s.replace("%", ""));
  return null;
}

export function isCorrect(answer: ExamAnswer, given: number | string | null): boolean {
  if (given === null || given === "") return false;
  if (answer.kind === "choice") return given === answer.correct;
  const typed = String(given);
  const got = numeric(typed);
  for (const ok of answer.accept) {
    const want = numeric(ok);
    // Compare as numbers when both sides are numbers, so 0.5 === 1/2 === .5.
    if (got !== null && want !== null) {
      if (Math.abs(got - want) < 1e-9) return true;
      continue;
    }
    if (normalise(typed) === normalise(ok)) return true;
  }
  return false;
}

export function gradeItems(
  items: ExamItem[],
  given: Record<string, number | string>,
  seconds: Record<string, number> = {}
): ItemResult[] {
  return items.map((it) => {
    const g = given[it.id] ?? null;
    return {
      id: it.id,
      skill: it.skill,
      topic: it.topic,
      difficulty: it.difficulty,
      given: g,
      correct: isCorrect(it.answer, g),
      seconds: Math.round(seconds[it.id] ?? 0),
    };
  });
}

export function breakdown(results: ItemResult[]): SkillBreakdown[] {
  const map = new Map<string, SkillBreakdown>();
  for (const r of results) {
    const row = map.get(r.skill) ?? { skill: r.skill, correct: 0, total: 0 };
    row.total += 1;
    if (r.correct) row.correct += 1;
    map.set(r.skill, row);
  }
  return [...map.values()].sort((a, b) => a.correct / a.total - b.correct / b.total);
}

/* ---------------- SAT ---------------- */

/**
 * Digital SAT scaling.
 *
 * The real test is multistage adaptive: module 1 decides whether module 2 is the
 * easier or harder form, and taking the easier form caps how high the section can
 * score. We reproduce that shape rather than the College Board's exact (unpublished)
 * tables — a raw score is mapped through a piecewise-linear curve, then the ceiling
 * is pulled down when the student was routed to the lower module.
 */
const RW_CURVE: [number, number][] = [
  [0, 200], [5, 230], [10, 290], [15, 350], [20, 410],
  [27, 480], [34, 550], [40, 610], [45, 670], [50, 730], [54, 800],
];
const MATH_CURVE: [number, number][] = [
  [0, 200], [4, 240], [8, 300], [12, 370], [16, 440],
  [22, 520], [28, 600], [33, 670], [38, 740], [41, 780], [44, 800],
];

function interpolate(curve: [number, number][], raw: number): number {
  const x = Math.max(0, Math.min(curve[curve.length - 1][0], raw));
  for (let i = 1; i < curve.length; i++) {
    const [x0, y0] = curve[i - 1];
    const [x1, y1] = curve[i];
    if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return curve[curve.length - 1][1];
}

/** Routed to the easier module 2, a section realistically tops out near 600. */
const EASY_MODULE_CEILING = 600;

export function satSectionScore(raw: number, section: "rw" | "math", routedHard: boolean): number {
  const curve = section === "rw" ? RW_CURVE : MATH_CURVE;
  const value = interpolate(curve, raw);
  const capped = routedHard ? value : Math.min(EASY_MODULE_CEILING, value);
  return Math.round(capped / 10) * 10;
}

/** Module 1 performance decides the module 2 form, the way Bluebook does. */
export function routesToHard(correct: number, total: number): boolean {
  return correct / total >= 0.6;
}

export function satReport(a: {
  rw: { results: ItemResult[]; routedHard: boolean };
  math: { results: ItemResult[]; routedHard: boolean };
}): SatScoreReport {
  const rwRaw = a.rw.results.filter((r) => r.correct).length;
  const mathRaw = a.math.results.filter((r) => r.correct).length;
  const rwScaled = satSectionScore(rwRaw, "rw", a.rw.routedHard);
  const mathScaled = satSectionScore(mathRaw, "math", a.math.routedHard);
  return {
    rw: { raw: rwRaw, total: a.rw.results.length, scaled: rwScaled, routedHard: a.rw.routedHard },
    math: { raw: mathRaw, total: a.math.results.length, scaled: mathScaled, routedHard: a.math.routedHard },
    composite: rwScaled + mathScaled,
    bySkill: breakdown([...a.rw.results, ...a.math.results]),
  };
}

/* ---------------- IELTS ---------------- */

/** Published band conversions for Academic Reading and for Listening, out of 40. */
const READING_BANDS: [number, number][] = [
  [39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5],
  [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [0, 0],
];
const LISTENING_BANDS: [number, number][] = [
  [39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5],
  [23, 6], [18, 5.5], [16, 5], [13, 4.5], [11, 4], [8, 3.5], [6, 3], [4, 2.5], [0, 0],
];

/** Scales a short set up to the /40 the band table expects. */
export function ieltsBand(raw: number, total: number, skill: "reading" | "listening"): number {
  const scaled = total === 40 ? raw : Math.round((raw / Math.max(1, total)) * 40);
  const table = skill === "reading" ? READING_BANDS : LISTENING_BANDS;
  for (const [min, band] of table) if (scaled >= min) return band;
  return 0;
}

/** IELTS rounds a .25 average up to the half band and .75 up to the whole. */
export function roundBand(value: number): number {
  const whole = Math.floor(value);
  const rest = value - whole;
  if (rest < 0.25) return whole;
  if (rest < 0.75) return whole + 0.5;
  return whole + 1;
}

export function overallBand(parts: (number | undefined)[]): number | undefined {
  const got = parts.filter((p): p is number => typeof p === "number");
  if (got.length === 0) return undefined;
  return roundBand(got.reduce((s, x) => s + x, 0) / got.length);
}

export function ieltsReport(a: {
  listening?: { results: ItemResult[] };
  reading?: { results: ItemResult[] };
  writing?: number;
  speaking?: number;
}): IeltsScoreReport {
  const all: ItemResult[] = [];
  let listening: IeltsScoreReport["listening"];
  let reading: IeltsScoreReport["reading"];
  if (a.listening) {
    const raw = a.listening.results.filter((r) => r.correct).length;
    listening = { raw, total: a.listening.results.length, band: ieltsBand(raw, a.listening.results.length, "listening") };
    all.push(...a.listening.results);
  }
  if (a.reading) {
    const raw = a.reading.results.filter((r) => r.correct).length;
    reading = { raw, total: a.reading.results.length, band: ieltsBand(raw, a.reading.results.length, "reading") };
    all.push(...a.reading.results);
  }
  return {
    listening,
    reading,
    writing: a.writing,
    speaking: a.speaking,
    overall: overallBand([listening?.band, reading?.band, a.writing, a.speaking]),
    bySkill: breakdown(all),
  };
}

/** Bands are shown as 6.0 / 6.5, never 6 or 6.50. */
export function fmtBand(b: number): string {
  return b.toFixed(1);
}
