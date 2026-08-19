import type { ItemSet } from "./types";
import { READING_1_ITEMS, READING_1_PASSAGES } from "./content/ielts-reading-1";
import { READING_2_ITEMS, READING_2_PASSAGES } from "./content/ielts-reading-2";
import { LISTENING_ITEMS, LISTENING_SCRIPTS } from "./content/ielts-listening";

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
  title: "Listening — sections 1 and 2",
  subtitle: {
    en: "A form-completion conversation and an information talk, read aloud by the browser with a separate voice per speaker.",
    ru: "Разговор с заполнением формы и информационная лекция — браузер читает их вслух, у каждого говорящего свой голос.",
  },
  minutes: 22,
  difficulty: "medium",
  items: LISTENING_ITEMS,
  scripts: LISTENING_SCRIPTS,
};

export const IELTS_SETS: ItemSet[] = [
  IELTS_READING_FULL,
  IELTS_READING_P1,
  IELTS_READING_P2,
  IELTS_READING_P3,
  IELTS_LISTENING_FULL,
];

export const ieltsSetById = (id: string) => IELTS_SETS.find((s) => s.id === id);

export const IELTS_READING_POOL = [...READING_1_ITEMS, ...READING_2_ITEMS];
export const IELTS_LISTENING_POOL = LISTENING_ITEMS;
