import type { ItemSet } from "./types";
import { shuffleExamItem } from "../shuffle-answers";
import { READING_1_ITEMS as RAW_READING_1, READING_1_PASSAGES } from "./content/ielts-reading-1";
import { READING_2_ITEMS as RAW_READING_2, READING_2_PASSAGES } from "./content/ielts-reading-2";
import { LISTENING_ITEMS as RAW_LISTENING_1, LISTENING_SCRIPTS } from "./content/ielts-listening";
import { LISTENING_ITEMS_2 as RAW_LISTENING_2, LISTENING_SCRIPTS_2 } from "./content/ielts-listening-2";

/**
 * Shuffled once, here, because this file is the only way into the IELTS items —
 * every set, slice and pool below is built from these four arrays, so they cannot
 * drift apart. True/False/Not Given keeps its printed order; `shuffleExamItem`
 * recognises those sets and leaves them alone.
 */
const READING_1_ITEMS = RAW_READING_1.map(shuffleExamItem);
const READING_2_ITEMS = RAW_READING_2.map(shuffleExamItem);
const LISTENING_ITEMS = RAW_LISTENING_1.map(shuffleExamItem);
const LISTENING_ITEMS_2 = RAW_LISTENING_2.map(shuffleExamItem);

/**
 * IELTS sets.
 *
 * Reading is one 60-minute test of forty questions across three passages, which is
 * the real format — splitting it into short drills would remove the thing that makes
 * Reading hard, which is budgeting an hour across texts of rising difficulty. The
 * shorter single-passage sets exist alongside it for targeted practice.
 */

export const IELTS_READING_FULL: ItemSet = {
  id: "ielts-reading-full",
  exam: "ielts",
  section: "reading",
  title: "Academic Reading — full test",
  subtitle: {
    en: "Three passages, forty questions, sixty minutes — no extra transfer time, exactly as on the day.",
    ru: "Три текста, сорок вопросов, шестьдесят минут — без дополнительного времени на перенос ответов, как на реальном экзамене.",
  },
  minutes: 60,
  difficulty: "hard",
  items: [...READING_1_ITEMS, ...READING_2_ITEMS],
  passages: [...READING_1_PASSAGES, ...READING_2_PASSAGES],
};

export const IELTS_READING_P1: ItemSet = {
  id: "ielts-reading-p1",
  exam: "ielts",
  section: "reading",
  title: "Passage 1 — True/False/Not Given and completion",
  subtitle: {
    en: "The two question types that decide Reading band 6: deciding when the text simply does not say.",
    ru: "Два типа заданий, которые решают band 6 в Reading: понять, когда в тексте просто ничего не сказано.",
  },
  minutes: 20,
  difficulty: "medium",
  items: READING_1_ITEMS.slice(0, 13),
  passages: [READING_1_PASSAGES[0]],
};

export const IELTS_READING_P2: ItemSet = {
  id: "ielts-reading-p2",
  exam: "ielts",
  section: "reading",
  title: "Passage 2 — Matching headings and summary",
  subtitle: {
    en: "Headings test paragraph purpose, not paragraph vocabulary — the most commonly mis-practised type.",
    ru: "Заголовки проверяют назначение абзаца, а не его лексику — тип, который чаще всего тренируют неправильно.",
  },
  minutes: 20,
  difficulty: "hard",
  items: READING_1_ITEMS.slice(13),
  passages: [READING_1_PASSAGES[1]],
};

export const IELTS_READING_P3: ItemSet = {
  id: "ielts-reading-p3",
  exam: "ielts",
  section: "reading",
  title: "Passage 3 — Yes/No/Not Given and matching information",
  subtitle: {
    en: "The hardest passage: questions about what the writer thinks, not about what is stated.",
    ru: "Самый сложный текст: вопросы о том, что думает автор, а не о том, что написано.",
  },
  minutes: 20,
  difficulty: "hard",
  items: READING_2_ITEMS,
  passages: READING_2_PASSAGES,
};

export const IELTS_LISTENING_FULL: ItemSet = {
  id: "ielts-listening-full",
  exam: "ielts",
  section: "listening",
  title: "Listening — full test",
  subtitle: {
    en: "All four sections, forty questions: a booking conversation, an information talk, an academic discussion and a lecture, read aloud with a separate voice per speaker.",
    ru: "Все четыре раздела, сорок вопросов: разговор о записи на курс, информационная лекция, академическое обсуждение и лекция — с отдельным голосом на каждого говорящего.",
  },
  minutes: 40,
  difficulty: "medium",
  items: [...LISTENING_ITEMS, ...LISTENING_ITEMS_2],
  scripts: [...LISTENING_SCRIPTS, ...LISTENING_SCRIPTS_2],
};

/** Sections 1–2 alone, for a shorter sitting. */
export const IELTS_LISTENING_HALF: ItemSet = {
  id: "ielts-listening-12",
  exam: "ielts",
  section: "listening",
  title: "Listening — sections 1 and 2",
  subtitle: {
    en: "Form completion and an information talk: the two everyday-context sections, where spelling and numbers decide the mark.",
    ru: "Заполнение формы и информационная лекция — два бытовых раздела, где балл решают орфография и числа.",
  },
  minutes: 22,
  difficulty: "medium",
  items: LISTENING_ITEMS,
  scripts: LISTENING_SCRIPTS,
};

/** Sections 3–4 alone: the academic half, and the harder one. */
export const IELTS_LISTENING_ACADEMIC: ItemSet = {
  id: "ielts-listening-34",
  exam: "ielts",
  section: "listening",
  title: "Listening — sections 3 and 4",
  subtitle: {
    en: "A three-way academic discussion and an uninterrupted lecture — where marks go to speaker attribution and to facts stated once.",
    ru: "Академическое обсуждение втроём и непрерывная лекция — здесь баллы решают «кто это сказал» и факты, названные один раз.",
  },
  minutes: 22,
  difficulty: "hard",
  items: LISTENING_ITEMS_2,
  scripts: LISTENING_SCRIPTS_2,
};

export const IELTS_SETS: ItemSet[] = [
  IELTS_READING_FULL,
  IELTS_LISTENING_FULL,
  IELTS_READING_P1,
  IELTS_READING_P2,
  IELTS_READING_P3,
  IELTS_LISTENING_HALF,
  IELTS_LISTENING_ACADEMIC,
];

export const ieltsSetById = (id: string) => IELTS_SETS.find((s) => s.id === id);

export const IELTS_READING_POOL = [...READING_1_ITEMS, ...READING_2_ITEMS];
export const IELTS_LISTENING_POOL = [...LISTENING_ITEMS, ...LISTENING_ITEMS_2];
