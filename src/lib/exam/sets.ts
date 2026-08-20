import type { ExamItem, ItemSet, Level } from "./types";
import { shuffleExamItem } from "../shuffle-answers";
import { SAT_RW_CRAFT } from "./content/sat-rw-craft";
import { SAT_RW_CONVENTIONS } from "./content/sat-rw-conventions";
import { SAT_RW_CRAFT_2 } from "./content/sat-rw-craft-2";
import { SAT_RW_CONVENTIONS_2 } from "./content/sat-rw-conventions-2";
import { SAT_MATH_ALGEBRA } from "./content/sat-math-algebra";
import { SAT_MATH_DATA } from "./content/sat-math-data";
import { SAT_MATH_2 } from "./content/sat-math-2";

/**
 * The pools must be large enough that a full mock can draw two modules per section
 * without reusing an item — 54 for Reading & Writing, 44 for Math. `scripts/exam-smoke.ts`
 * asserts this, because a pool that is one item short silently produces a shorter
 * module 2 rather than an error.
 */
export const SAT_RW_POOL: ExamItem[] = [
  ...SAT_RW_CRAFT, ...SAT_RW_CRAFT_2, ...SAT_RW_CONVENTIONS, ...SAT_RW_CONVENTIONS_2,
].map(shuffleExamItem);
export const SAT_MATH_POOL: ExamItem[] = [
  ...SAT_MATH_ALGEBRA, ...SAT_MATH_DATA, ...SAT_MATH_2,
].map(shuffleExamItem);

/* ---------------- deterministic shuffling ---------------- */

/**
 * A mock has to look the same when the student reopens the review screen, so the
 * module contents are drawn from a seed stored with the attempt rather than from
 * Math.random.
 */
export function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function shuffle<T>(list: T[], rand: () => number): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/* ---------------- module assembly ---------------- */

export type Mix = Record<Level, number>;

/** Module 1 is mixed; module 2 leans one way or the other, as on the real test. */
export const MIX_MIXED: Mix = { easy: 0.3, medium: 0.45, hard: 0.25 };
export const MIX_EASIER: Mix = { easy: 0.45, medium: 0.4, hard: 0.15 };
export const MIX_HARDER: Mix = { easy: 0.1, medium: 0.35, hard: 0.55 };

/**
 * Draws `count` items matching a difficulty mix, never reusing an id in `exclude`.
 * If a difficulty band runs dry the remainder is topped up from whatever is left,
 * so a short pool degrades into a shorter module rather than an empty one.
 */
export function drawModule(
  pool: ExamItem[],
  count: number,
  mix: Mix,
  exclude: Set<string>,
  rand: () => number
): ExamItem[] {
  const available = pool.filter((i) => !exclude.has(i.id));
  const byLevel: Record<Level, ExamItem[]> = {
    easy: shuffle(available.filter((i) => i.difficulty === "easy"), rand),
    medium: shuffle(available.filter((i) => i.difficulty === "medium"), rand),
    hard: shuffle(available.filter((i) => i.difficulty === "hard"), rand),
  };

  const picked: ExamItem[] = [];
  for (const level of ["easy", "medium", "hard"] as Level[]) {
    const want = Math.round(count * mix[level]);
    picked.push(...byLevel[level].splice(0, want));
  }
  // Top up (or trim) so the module is exactly the requested length when it can be.
  const leftovers = shuffle([...byLevel.easy, ...byLevel.medium, ...byLevel.hard], rand);
  while (picked.length < count && leftovers.length > 0) picked.push(leftovers.shift()!);

  // Conventions questions cluster at the end of a real R&W module; keeping the
  // published order (craft → information → conventions → expression) matters
  // because pacing strategy depends on it.
  const order = new Map(pool.map((it, i) => [it.id, i]));
  return picked.slice(0, count).sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
}

/* ---------------- SAT mock blueprint ---------------- */

export interface ModuleSpec {
  id: string;
  section: "rw" | "math";
  stage: 1 | 2;
  title: string;
  minutes: number;
  count: number;
}

/** Real digital SAT timing: two 32-minute R&W modules, two 35-minute Math modules. */
export const SAT_BLUEPRINT: ModuleSpec[] = [
  { id: "rw1", section: "rw", stage: 1, title: "Reading and Writing — Module 1", minutes: 32, count: 27 },
  { id: "rw2", section: "rw", stage: 2, title: "Reading and Writing — Module 2", minutes: 32, count: 27 },
  { id: "m1", section: "math", stage: 1, title: "Math — Module 1", minutes: 35, count: 22 },
  { id: "m2", section: "math", stage: 2, title: "Math — Module 2", minutes: 35, count: 22 },
];

/** The 10-minute break between the two sections, as on test day. */
export const SAT_BREAK_AFTER = "rw2";
export const SAT_BREAK_MINUTES = 10;

export function poolFor(section: "rw" | "math"): ExamItem[] {
  return section === "rw" ? SAT_RW_POOL : SAT_MATH_POOL;
}

/* ---------------- named practice sets ---------------- */

function set(a: {
  id: string; section: "rw" | "math"; title: string; ru: string; en: string;
  minutes: number; difficulty: Level; items: ExamItem[];
}): ItemSet {
  return {
    id: a.id,
    exam: "sat",
    section: a.section,
    title: a.title,
    subtitle: { en: a.en, ru: a.ru },
    minutes: a.minutes,
    difficulty: a.difficulty,
    items: a.items,
  };
}

export const SAT_SETS: ItemSet[] = [
  set({
    id: "sat-rw-craft",
    section: "rw",
    title: "Craft, Structure and Ideas",
    minutes: 40,
    difficulty: "medium",
    items: [...SAT_RW_CRAFT, ...SAT_RW_CRAFT_2].map(shuffleExamItem),
    ru: "Слова в контексте, структура текста, главная мысль, работа с доказательствами и выводы.",
    en: "Words in context, text structure, central ideas, command of evidence and inferences.",
  }),
  set({
    id: "sat-rw-conventions",
    section: "rw",
    title: "Conventions and Expression",
    minutes: 38,
    difficulty: "medium",
    items: [...SAT_RW_CONVENTIONS, ...SAT_RW_CONVENTIONS_2].map(shuffleExamItem),
    ru: "Пунктуация и границы предложений, согласование, связки и риторический синтез — самый быстрый раздел для роста балла.",
    en: "Punctuation and sentence boundaries, agreement, transitions and rhetorical synthesis — the fastest section to improve.",
  }),
  set({
    id: "sat-math-algebra",
    section: "math",
    title: "Algebra and Advanced Math",
    minutes: 35,
    difficulty: "hard",
    items: SAT_MATH_ALGEBRA.map(shuffleExamItem),
    ru: "Системы без решений и с бесконечным числом решений, дискриминант, показательные модели, дробные степени.",
    en: "Systems with no or infinite solutions, discriminants, exponential models and rational exponents.",
  }),
  set({
    id: "sat-math-data",
    section: "math",
    title: "Data, Geometry and Trigonometry",
    minutes: 50,
    difficulty: "hard",
    items: [...SAT_MATH_DATA, ...SAT_MATH_2].map(shuffleExamItem),
    ru: "Перевод единиц, проценты, таблицы и вероятность, окружности, объёмы и тригонометрия прямоугольного треугольника.",
    en: "Unit conversion, percentages, tables and probability, circles, volumes and right-triangle trigonometry.",
  }),
];

export function satSetById(id: string): ItemSet | undefined {
  return SAT_SETS.find((s) => s.id === id);
}
