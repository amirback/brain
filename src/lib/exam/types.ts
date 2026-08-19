/**
 * Exam trainer model.
 *
 * This is deliberately separate from the school-subject model in `lib/types.ts`.
 * A school question is one localised MCQ; an exam item belongs to a timed module,
 * carries a skill tag the score report breaks down by, and may be a grid-in or a
 * gap-fill rather than a choice. Mixing the two would have bent both out of shape.
 *
 * Item text (stems, options, passages) stays in English on purpose — that is the
 * language of the real SAT and IELTS, and translating it would train the wrong
 * thing. Explanations are bilingual, because that is where a student in Kazakhstan
 * actually needs their own language.
 */

export type ExamId = "sat" | "ielts";

/** Explanation text. `kk` falls back to `ru` when it isn't written yet. */
export interface EL {
  en: string;
  ru: string;
  kk?: string;
}

export type Level = "easy" | "medium" | "hard";

/** SAT sections and IELTS skills share one runner, so they share one union. */
export type SatSection = "rw" | "math";
export type IeltsSkill = "reading" | "listening" | "writing" | "speaking";
export type ExamSection = SatSection | IeltsSkill;

/**
 * How an item is answered.
 * - `choice`: one of N options (SAT MCQ, IELTS TFNG / matching / MCQ)
 * - `text`: typed answer checked against accepted spellings (SAT grid-in,
 *   IELTS completion tasks). Comparison is case- and space-insensitive.
 */
export type ExamAnswer =
  | { kind: "choice"; correct: number }
  | { kind: "text"; accept: string[]; maxWords?: number };

export interface ExamItem {
  id: string;
  /** Reporting category shown in the score breakdown. */
  skill: string;
  /** Finer tag used to pick follow-up practice after a mistake. */
  topic: string;
  difficulty: Level;
  /** Set when the item hangs off a shared passage. */
  passage?: string;
  /** Shown above the stem: "Questions 14-18", "Complete the notes", etc. */
  instruction?: string;
  stem: string;
  /** Extra English context printed above the question (short SAT passages). */
  context?: string;
  options?: string[];
  answer: ExamAnswer;
  explain: EL;
  /** Why the tempting wrong answer is wrong — the part students actually need. */
  trap?: EL;
}

export interface Passage {
  id: string;
  title: string;
  /** "Literature", "Science", "Academic reading" — printed as a label. */
  genre: string;
  /** Paragraphs. Rendered with a letter label when `lettered` is set. */
  paragraphs: string[];
  /** IELTS matching-headings passages label paragraphs A, B, C… */
  lettered?: boolean;
  wordCount?: number;
}

/** A spoken section: the app reads `script` aloud with speech synthesis. */
export interface ListeningScript {
  id: string;
  title: string;
  /** "A conversation between two students about…" — read before the audio. */
  setting: string;
  /** Speaker turns. `voice` picks a different synthesis voice per speaker. */
  turns: { speaker: string; text: string; voice?: "a" | "b" | "c" }[];
}

export interface ItemSet {
  id: string;
  exam: ExamId;
  section: ExamSection;
  title: string;
  subtitle: EL;
  /** Real exam timing for this block. */
  minutes: number;
  difficulty: Level;
  items: ExamItem[];
  passages?: Passage[];
  scripts?: ListeningScript[];
}

/* ---------------- writing and speaking ---------------- */

export interface WritingPrompt {
  id: string;
  task: 1 | 2;
  /** Task 1 chart type, Task 2 essay type — drives the model-answer skeleton. */
  kind: string;
  minutes: number;
  minWords: number;
  prompt: string;
  /** Task 1 needs data to describe; drawn as a small chart, not an image file. */
  chart?: ChartSpec;
  /** Phrases a strong answer is expected to engage with. */
  keywords: string[];
  /** What the examiner is looking for, in the student's language. */
  guidance: EL;
  modelOutline: string[];
}

export interface ChartSpec {
  kind: "bar" | "line" | "pie" | "table" | "process";
  caption: string;
  /** Category labels along the x axis (or row labels for a table). */
  labels: string[];
  series: { name: string; values: number[] }[];
  unit: string;
  /** Process diagrams describe stages instead of numbers. */
  stages?: string[];
}

export interface SpeakingPrompt {
  id: string;
  part: 1 | 2 | 3;
  topic: string;
  /** Part 1 and 3 are question lists; Part 2 is a single cue card. */
  questions: string[];
  /** Part 2 bullet points. */
  bullets?: string[];
  /** Seconds the student is expected to speak for. */
  target: number;
  /** Vocabulary that lifts an answer on this topic. */
  upgrades: { plain: string; better: string }[];
}

/* ---------------- attempts ---------------- */

export interface ItemResult {
  id: string;
  skill: string;
  topic: string;
  difficulty: Level;
  /** Index for choice items, typed string for text items, null if skipped. */
  given: number | string | null;
  correct: boolean;
  seconds: number;
}

export type AttemptKind =
  | "sat-practice"
  | "sat-mock"
  | "ielts-reading"
  | "ielts-listening"
  | "ielts-writing"
  | "ielts-speaking"
  | "ielts-mock";

export interface Attempt {
  id: string;
  kind: AttemptKind;
  /** Set id, or the mock blueprint id. */
  setId: string;
  title: string;
  startedAt: number;
  finishedAt: number;
  results: ItemResult[];
  /** Filled in for SAT mocks. */
  sat?: SatScoreReport;
  /** Filled in for IELTS attempts. */
  ielts?: IeltsScoreReport;
  /** Writing and speaking store the produced text plus its analysis. */
  written?: WrittenResponse[];
}

export interface WrittenResponse {
  promptId: string;
  task: string;
  text: string;
  seconds: number;
  band: number;
  criteria: CriterionScore[];
  notes: GraderNote[];
}

export interface CriterionScore {
  id: "ta" | "cc" | "lr" | "gra" | "fc" | "pr";
  band: number;
  /** What earned this band and what would lift it. */
  why: EL;
}

export interface GraderNote {
  kind: "good" | "fix" | "tip";
  /** The exact fragment being commented on, when there is one. */
  quote?: string;
  message: EL;
}

export interface SatScoreReport {
  rw: { raw: number; total: number; scaled: number; routedHard: boolean };
  math: { raw: number; total: number; scaled: number; routedHard: boolean };
  composite: number;
  bySkill: SkillBreakdown[];
}

export interface IeltsScoreReport {
  listening?: { raw: number; total: number; band: number };
  reading?: { raw: number; total: number; band: number };
  writing?: number;
  speaking?: number;
  overall?: number;
  bySkill: SkillBreakdown[];
}

export interface SkillBreakdown {
  skill: string;
  correct: number;
  total: number;
}
