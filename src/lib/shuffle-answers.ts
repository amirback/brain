/**
 * Answer-order shuffling.
 *
 * Every question bank in this project was authored with the correct answer
 * written first, which is the natural way to write one and a fatal way to ship
 * one: 99% of the school questions could be answered by always picking A. That
 * makes the diagnostic, the Elo rating and the score forecast measure nothing.
 *
 * The fix is applied to the data once, at module load, so nothing downstream —
 * the runner, the review screen, the mock assembler, the teacher's panel — has
 * to know about it or can disagree about the order.
 *
 * The permutation is derived from the question's id, not from random(), so a
 * question always looks the same: the order a student saw while answering is
 * the order they see in the review, and two devices agree.
 */

/** FNV-1a: small, stable, and spreads ids well enough across permutations. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Answer sets whose order carries meaning and must never be shuffled.
 * A True/False/Not Given item with the options jumbled is not a harder
 * question, it is a broken one — the real exam always prints them in order.
 */
const FIXED_ORDER: string[][] = [
  ["true", "false", "not given"],
  ["yes", "no", "not given"],
];

export function hasFixedOrder(options: readonly string[]): boolean {
  const norm = options.map((o) => o.trim().toLowerCase());
  return FIXED_ORDER.some(
    (set) => set.length === norm.length && set.every((v, i) => v === norm[i])
  );
}

/**
 * Returns `order`, where `order[newIndex] = oldIndex`, or `null` when the set
 * must keep the order it was written in.
 */
export function permutationFor(id: string, count: number, options?: readonly string[]): number[] | null {
  if (count < 2) return null;
  if (options && hasFixedOrder(options)) return null;

  const rand = seeded(hash(id));
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/**
 * Rewrites "Вариант B" / "only option D" / "Варианты A, C и D" so an explanation
 * still names the option it means after the shuffle.
 *
 * Anchored to the option keyword on purpose. A bare letter is not safe to touch:
 * the geometry explanations are full of "angle A", "cos(90° − A)" and
 * "triangle ABC", and remapping those would quietly corrupt the mathematics.
 *
 * The keyword matches in either case, because explanations say both "Вариант A"
 * at the start of a sentence and "only option A" in the middle of one — but the
 * letter stays strictly uppercase, so "the option a teacher gives" is left alone.
 * The lookbehind stops "adoption" from matching as "option".
 */
const OPTION_REF =
  /(?<!\p{L})([Вв]ариант(?:ы|а)?|[Нн]ұсқа(?:лар)?|[Oo]ptions?)(\s+[A-D](?:\s*(?:или|және|and|or|и|,)\s*[A-D])*)/gu;

export function remapOptionLetters(text: string, order: number[]): string {
  const letter = (oldLetter: string) => {
    const next = order.indexOf(oldLetter.charCodeAt(0) - 65);
    return next < 0 ? oldLetter : String.fromCharCode(65 + next);
  };

  return text.replace(
    OPTION_REF,
    (_match, keyword: string, list: string) => keyword + list.replace(/[A-D]/g, letter)
  );
}

/** Applies a permutation to an options array. */
export function reorder<T>(options: readonly T[], order: number[]): T[] {
  return order.map((oldIndex) => options[oldIndex]);
}

/** Where the previously-correct option ended up. */
export function movedCorrect(correct: number, order: number[]): number {
  const next = order.indexOf(correct);
  return next < 0 ? correct : next;
}

/* ---------------- appliers ---------------- */

type Localised = { ru: string; kk: string; en: string };
type ExamText = { en: string; ru: string; kk?: string };

const remapL = <T extends Localised | ExamText>(v: T, order: number[]): T => ({
  ...v,
  en: remapOptionLetters(v.en, order),
  ru: remapOptionLetters(v.ru, order),
  ...(v.kk !== undefined ? { kk: remapOptionLetters(v.kk, order) } : {}),
});

/** School-subject question: localised options, a bare `correct` index. */
export function shuffleQuestion<
  Q extends { id: string; options: Localised[]; correct: number; explain: Localised; hint: Localised },
>(q: Q): Q {
  const order = permutationFor(q.id, q.options.length, q.options.map((o) => o.en));
  if (!order) return q;
  return {
    ...q,
    options: reorder(q.options, order),
    correct: movedCorrect(q.correct, order),
    explain: remapL(q.explain, order),
    hint: remapL(q.hint, order),
  };
}

/** Exam item: plain string options, the index nested inside `answer`. */
export function shuffleExamItem<
  I extends {
    id: string;
    options?: string[];
    answer: { kind: "choice"; correct: number } | { kind: "text"; accept: string[]; maxWords?: number };
    explain: ExamText;
    trap?: ExamText;
  },
>(item: I): I {
  if (item.answer.kind !== "choice" || !item.options) return item;
  const order = permutationFor(item.id, item.options.length, item.options);
  if (!order) return item;
  return {
    ...item,
    options: reorder(item.options, order),
    answer: { kind: "choice", correct: movedCorrect(item.answer.correct, order) },
    explain: remapL(item.explain, order),
    ...(item.trap ? { trap: remapL(item.trap, order) } : {}),
  };
}
