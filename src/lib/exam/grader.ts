import { ACADEMIC, ALL_LINKERS, ERROR_RULES, HEDGES, LINKERS, MISSPELLINGS, SUBORDINATORS } from "./lexicon";
import type { CriterionScore, EL, GraderNote, SpeakingPrompt, WritingPrompt } from "./types";

/**
 * Band estimator for produced language.
 *
 * There is no model call behind this — the app is a static site — so the honest
 * design is a transparent rubric: measurable features of the text are mapped onto
 * the four IELTS criteria, and every deduction is reported with the fragment that
 * caused it. A student can therefore see *why* the band is what it is, which is
 * the part that actually teaches. It reads a real essay closely enough to separate
 * a 5.0 from a 7.0; it is not, and does not claim to be, a certified examiner, and
 * it never awards 9.
 */

const BAND_FLOOR = 3;
const BAND_CEILING = 8.5;

export interface TextMetrics {
  words: string[];
  wordCount: number;
  sentences: string[];
  paragraphs: string[];
  /** Guiraud's index: unique / sqrt(total). Stable across lengths, unlike raw TTR. */
  rootTTR: number;
  avgSentence: number;
  sentenceSpread: number;
  linkerGroups: string[];
  linkerCount: number;
  subordinators: number;
  hedges: number;
  academicHits: string[];
  numbers: number;
  topWordShare: number;
  longSentences: string[];
  misspelled: { wrong: string; right: string }[];
  errors: { id: string; criterion: string; quote: string; en: string; ru: string; weight: number }[];
}

const WORD_RE = /[A-Za-z']+/g;

export function analyse(text: string): TextMetrics {
  const clean = text.replace(/\r/g, "");
  const paragraphs = clean.split(/\n\s*\n+/).map((p) => p.trim()).filter(Boolean);
  const sentences = clean
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.replace(WORD_RE, "").length < s.length);
  const words = (clean.toLowerCase().match(WORD_RE) ?? []).filter(Boolean);
  const wordCount = words.length;

  const content = words.filter((w) => w.length > 3);
  const unique = new Set(content).size;
  const rootTTR = content.length > 0 ? unique / Math.sqrt(content.length) : 0;

  const lengths = sentences.map((s) => (s.match(WORD_RE) ?? []).length);
  const avgSentence = lengths.length > 0 ? lengths.reduce((a, b) => a + b, 0) / lengths.length : 0;
  const variance =
    lengths.length > 1
      ? lengths.reduce((a, b) => a + (b - avgSentence) ** 2, 0) / (lengths.length - 1)
      : 0;

  const lower = ` ${clean.toLowerCase()} `;
  const linkerGroups = Object.entries(LINKERS)
    .filter(([, list]) => list.some((l) => lower.includes(` ${l} `) || lower.includes(` ${l},`)))
    .map(([g]) => g);
  const linkerCount = ALL_LINKERS.reduce(
    (n, l) => n + (lower.split(` ${l} `).length - 1) + (lower.split(` ${l},`).length - 1),
    0
  );
  const subordinators = SUBORDINATORS.reduce((n, s) => n + (lower.split(` ${s} `).length - 1), 0);
  const hedges = HEDGES.reduce((n, h) => n + (lower.split(h).length - 1), 0);
  const academicHits = [...new Set(ACADEMIC.filter((a) => lower.includes(a)))];
  const numbers = (clean.match(/\d[\d.,]*\s*%?/g) ?? []).length;

  const freq = new Map<string, number>();
  for (const w of content) freq.set(w, (freq.get(w) ?? 0) + 1);
  const topWordShare = content.length > 0 ? Math.max(0, ...freq.values()) / content.length : 0;

  const longSentences = sentences.filter((s) => (s.match(WORD_RE) ?? []).length > 45);

  const misspelled: TextMetrics["misspelled"] = [];
  for (const w of new Set(words)) {
    const right = MISSPELLINGS[w];
    if (right) misspelled.push({ wrong: w, right });
  }

  const errors: TextMetrics["errors"] = [];
  for (const rule of ERROR_RULES) {
    const re = new RegExp(rule.re.source, rule.re.flags.includes("g") ? rule.re.flags : `${rule.re.flags}g`);
    const seen = new Set<string>();
    let m: RegExpExecArray | null;
    while ((m = re.exec(clean)) !== null) {
      const quote = m[0].trim();
      if (seen.has(quote.toLowerCase())) continue;
      seen.add(quote.toLowerCase());
      errors.push({
        id: rule.id, criterion: rule.criterion, quote,
        en: rule.en, ru: rule.ru, weight: rule.weight ?? 1,
      });
      if (m.index === re.lastIndex) re.lastIndex += 1;
    }
  }

  return {
    words, wordCount, sentences, paragraphs, rootTTR, avgSentence,
    sentenceSpread: Math.sqrt(variance), linkerGroups, linkerCount, subordinators,
    hedges, academicHits, numbers, topWordShare, longSentences, misspelled, errors,
  };
}

const clamp = (v: number) => Math.max(BAND_FLOOR, Math.min(BAND_CEILING, Math.round(v * 2) / 2));

function errorWeight(m: TextMetrics, criterion: string): number {
  return m.errors.filter((e) => e.criterion === criterion).reduce((s, e) => s + e.weight, 0);
}

/** Did the answer engage with the ideas the prompt asks about? */
function coverage(m: TextMetrics, keywords: string[]): number {
  if (keywords.length === 0) return 1;
  const lower = m.words.join(" ");
  const hit = keywords.filter((k) => {
    const stem = k.toLowerCase().split(/\s+/)[0].slice(0, 6);
    return stem.length > 2 && lower.includes(stem);
  }).length;
  return hit / keywords.length;
}

export interface WritingGrade {
  band: number;
  criteria: CriterionScore[];
  notes: GraderNote[];
  metrics: TextMetrics;
}

export function gradeWriting(text: string, prompt: WritingPrompt): WritingGrade {
  const m = analyse(text);
  const notes: GraderNote[] = [];
  const el = (en: string, ru: string): EL => ({ en, ru });

  const lower = text.toLowerCase();
  const hasOverview = /\b(overall|in general|it is clear that|the most striking|broadly speaking)\b/i.test(text);
  const hasPosition =
    /\b(i would argue|in my view|in my opinion|this essay will|i believe|i agree|i disagree|this essay argues)\b/i.test(text);
  const cover = coverage(m, prompt.keywords);
  const short = m.wordCount < prompt.minWords;
  const veryShort = m.wordCount < prompt.minWords * 0.6;

  /* ---------- Task achievement / response ---------- */
  let ta = 6;
  if (veryShort) ta = 4;
  else if (short) ta -= 1;
  if (m.wordCount > prompt.minWords * 2.6) ta -= 0.5;
  if (prompt.task === 1) {
    ta += hasOverview ? 0.5 : -1.5;
    if (m.numbers < 3) ta -= 0.5;
  } else {
    ta += hasPosition ? 0.5 : -1;
  }
  ta += cover >= 0.75 ? 1 : cover >= 0.5 ? 0.25 : -1;
  if (m.paragraphs.length < 3) ta -= 0.5;
  ta = clamp(ta);

  /* ---------- Coherence and cohesion ---------- */
  let cc = 5.5;
  if (m.paragraphs.length <= 1) cc = Math.min(cc, 4);
  else if (m.paragraphs.length === 2) cc -= 0.5;
  else if (m.paragraphs.length <= 5) cc += 0.5;
  else cc -= 0.25;
  const groups = m.linkerGroups.length;
  cc += groups >= 4 ? 1 : groups === 3 ? 0.5 : groups === 2 ? 0 : groups === 1 ? -0.5 : -1;
  if (m.sentences.length > 0 && m.linkerCount / m.sentences.length > 0.85) cc -= 0.5;
  if (/\b(this|these|such|which|the former|the latter)\b/i.test(text)) cc += 0.25;
  cc -= errorWeight(m, "cc") * 0.25;
  cc = clamp(cc);

  /* ---------- Lexical resource ---------- */
  let lr = 5.5;
  lr += m.rootTTR > 6 ? 1 : m.rootTTR > 4.5 ? 0.5 : m.rootTTR > 3.5 ? -0.25 : -1;
  const acPer100 = m.wordCount > 0 ? (m.academicHits.length / m.wordCount) * 100 : 0;
  lr += acPer100 > 3 ? 1 : acPer100 >= 1 ? 0.5 : acPer100 > 0 ? -0.25 : -1;
  if (m.topWordShare > 0.04) lr -= 0.5;
  lr -= Math.min(1.5, m.misspelled.length * 0.3);
  lr -= Math.min(1.5, errorWeight(m, "lr") * 0.3);
  lr = clamp(lr);

  /* ---------- Grammatical range and accuracy ---------- */
  let gra = 5.5;
  gra += m.sentenceSpread > 8 ? 0.5 : m.sentenceSpread > 3 ? 0.25 : -0.5;
  const subPer = m.sentences.length > 0 ? m.subordinators / m.sentences.length : 0;
  gra += subPer > 0.8 ? 0.5 : subPer >= 0.3 ? 0.25 : -0.75;
  if (m.hedges > 1) gra += 0.25;
  gra -= Math.min(2, errorWeight(m, "gra") * 0.35);
  gra -= Math.min(0.9, m.longSentences.length * 0.3);
  gra = clamp(gra);

  const band = clamp((ta + cc + lr + gra) / 4);

  /* ---------- notes ---------- */
  if (veryShort) {
    notes.push({
      kind: "fix",
      message: el(
        `Only ${m.wordCount} words — the task needs at least ${prompt.minWords}. An under-length answer is capped by the examiner before content is even judged.`,
        `Всего ${m.wordCount} слов, а нужно минимум ${prompt.minWords}. За недобор объёма экзаменатор режет балл ещё до оценки содержания.`
      ),
    });
  } else if (short) {
    notes.push({
      kind: "fix",
      message: el(
        `${m.wordCount} words against a ${prompt.minWords}-word minimum. Add one developed example rather than padding the introduction.`,
        `${m.wordCount} слов при минимуме ${prompt.minWords}. Добавь один развёрнутый пример, а не воду во введении.`
      ),
    });
  }

  if (prompt.task === 1 && !hasOverview) {
    notes.push({
      kind: "fix",
      message: el(
        "There is no overview paragraph. Task 1 requires one sentence naming the two or three biggest patterns — without it Task Achievement cannot pass band 5.",
        "Нет overview. В Task 1 обязателен абзац с 1–2 предложениями о главных тенденциях — без него Task Achievement выше 5 не поднимется.",
      ),
    });
  }
  if (prompt.task === 1 && m.numbers < 3) {
    notes.push({
      kind: "fix",
      message: el(
        "Almost no figures are quoted. Task 1 wants selected data as evidence: name the highest, the lowest and the crossover point.",
        "Почти нет цифр. В Task 1 данные — это доказательство: назови максимум, минимум и точку пересечения.",
      ),
    });
  }
  if (prompt.task === 2 && !hasPosition) {
    notes.push({
      kind: "fix",
      message: el(
        "Your position is not stated anywhere. Put it in the introduction and repeat it in the conclusion — the examiner looks for a clear stance.",
        "Твоя позиция нигде не заявлена. Сформулируй её во введении и повтори в заключении — экзаменатор ищет чёткую позицию.",
      ),
    });
  }
  if (cover < 0.5) {
    notes.push({
      kind: "fix",
      message: el(
        "Part of the question is not answered. Re-read the prompt and check that every element it names appears in your response.",
        "Часть вопроса осталась без ответа. Перечитай задание и проверь, что каждый его пункт есть в твоём тексте.",
      ),
    });
  }
  if (m.paragraphs.length <= 1) {
    notes.push({
      kind: "fix",
      message: el(
        "The answer is one block of text. Split it into introduction, body paragraphs and conclusion — paragraphing alone is worth a band on Coherence.",
        "Текст одним куском. Раздели на введение, основные абзацы и заключение — одно только абзацирование стоит балла в Coherence.",
      ),
    });
  }

  for (const e of m.errors.slice(0, 8)) {
    notes.push({ kind: "fix", quote: e.quote, message: el(e.en, e.ru) });
  }
  for (const s of m.misspelled.slice(0, 5)) {
    notes.push({
      kind: "fix",
      quote: s.wrong,
      message: el(`Spelling: "${s.wrong}" should be "${s.right}".`, `Орфография: «${s.wrong}» → «${s.right}».`),
    });
  }
  for (const s of m.longSentences.slice(0, 2)) {
    notes.push({
      kind: "fix",
      quote: `${s.slice(0, 70)}…`,
      message: el(
        "This sentence runs past 45 words. Cut it in two — long sentences lose accuracy marks, not gain range marks.",
        "Предложение длиннее 45 слов. Разбей на два — длина не даёт баллов за range, но теряет за accuracy.",
      ),
    });
  }

  if (m.linkerGroups.length >= 3) {
    notes.push({
      kind: "good",
      message: el(
        `Cohesion is varied — you used ${m.linkerGroups.length} different kinds of connector.`,
        `Хорошая связность: использовано ${m.linkerGroups.length} разных типа коннекторов.`
      ),
    });
  }
  if (m.academicHits.length >= 4) {
    notes.push({
      kind: "good",
      quote: m.academicHits.slice(0, 4).join(", "),
      message: el("Strong academic vocabulary — keep this register.", "Сильная академическая лексика — держи этот регистр."),
    });
  }
  if (prompt.task === 1 && hasOverview) {
    notes.push({
      kind: "good",
      message: el("The overview is there, which is the single biggest Task 1 marker.", "Overview на месте — это главный маркер Task 1."),
    });
  }

  const lowest = [
    { id: "ta" as const, band: ta },
    { id: "cc" as const, band: cc },
    { id: "lr" as const, band: lr },
    { id: "gra" as const, band: gra },
  ].sort((a, b) => a.band - b.band)[0];
  notes.push({ kind: "tip", message: NEXT_STEP[lowest.id] });

  const criteria: CriterionScore[] = [
    {
      id: "ta", band: ta,
      why: el(
        `${m.wordCount} words, ${m.paragraphs.length} paragraphs, ${Math.round(cover * 100)}% of the prompt's ideas addressed.`,
        `${m.wordCount} слов, абзацев — ${m.paragraphs.length}, раскрыто ${Math.round(cover * 100)}% пунктов задания.`
      ),
    },
    {
      id: "cc", band: cc,
      why: el(
        `${m.linkerCount} connectors from ${m.linkerGroups.length} categories across ${m.sentences.length} sentences.`,
        `${m.linkerCount} коннекторов из ${m.linkerGroups.length} категорий на ${m.sentences.length} предложений.`
      ),
    },
    {
      id: "lr", band: lr,
      why: el(
        `Lexical variety index ${m.rootTTR.toFixed(1)}, ${m.academicHits.length} academic items, ${m.misspelled.length} spelling slips.`,
        `Индекс разнообразия ${m.rootTTR.toFixed(1)}, академических слов — ${m.academicHits.length}, орфографических ошибок — ${m.misspelled.length}.`
      ),
    },
    {
      id: "gra", band: gra,
      why: el(
        `Average sentence ${Math.round(m.avgSentence)} words (spread ${m.sentenceSpread.toFixed(1)}), ${m.subordinators} subordinate clauses, ${m.errors.filter((e) => e.criterion === "gra").length} grammar flags.`,
        `Средняя длина предложения ${Math.round(m.avgSentence)} слов (разброс ${m.sentenceSpread.toFixed(1)}), придаточных — ${m.subordinators}, грамматических замечаний — ${m.errors.filter((e) => e.criterion === "gra").length}.`
      ),
    },
  ];

  void lower;
  return { band, criteria, notes, metrics: m };
}

const NEXT_STEP: Record<"ta" | "cc" | "lr" | "gra", EL> = {
  ta: {
    en: "Your weakest criterion is Task Response. Before writing, spend one minute listing every part of the question, then give each part its own paragraph.",
    ru: "Слабее всего Task Response. Перед письмом потрать минуту: выпиши все пункты вопроса и дай каждому отдельный абзац.",
  },
  cc: {
    en: "Your weakest criterion is Coherence. Start each body paragraph with a topic sentence that states its one idea, then keep every other sentence serving it.",
    ru: "Слабее всего Coherence. Начинай каждый абзац с topic sentence — одной мыслью, — и все остальные предложения должны работать на неё.",
  },
  lr: {
    en: "Your weakest criterion is Lexical Resource. Pick the noun you repeated most and find two precise synonyms for it before your next attempt.",
    ru: "Слабее всего Lexical Resource. Возьми существительное, которое повторяется чаще всего, и найди к нему два точных синонима перед следующей попыткой.",
  },
  gra: {
    en: "Your weakest criterion is Grammar. Rewrite three of your short sentences as complex ones using although, which and because — range and accuracy both count.",
    ru: "Слабее всего Grammar. Перепиши три коротких предложения в сложные через although, which и because — считаются и разнообразие, и точность.",
  },
};

/* ---------------- speaking ---------------- */

export interface SpeakingGrade {
  band: number;
  criteria: CriterionScore[];
  notes: GraderNote[];
  metrics: TextMetrics;
  /** Words per minute, when the answer was actually timed. */
  wpm: number | null;
}

/**
 * Speaking is graded from the transcript plus how long the student spoke.
 * Pronunciation is deliberately left unscored: nothing here listens to audio, and
 * inventing a number for it would be the dishonest part of an otherwise fair rubric.
 */
export function gradeSpeaking(text: string, prompt: SpeakingPrompt, seconds: number): SpeakingGrade {
  const m = analyse(text);
  const el = (en: string, ru: string): EL => ({ en, ru });
  const notes: GraderNote[] = [];
  const wpm = seconds > 5 ? Math.round((m.wordCount / seconds) * 60) : null;

  const expected = prompt.part === 2 ? 180 : 60;
  const lengthRatio = m.wordCount / expected;

  /* Fluency and coherence */
  let fc = 5.5;
  fc += lengthRatio >= 0.9 ? 1 : lengthRatio >= 0.6 ? 0.25 : lengthRatio >= 0.35 ? -0.75 : -1.5;
  if (wpm !== null) {
    if (wpm >= 110 && wpm <= 170) fc += 0.5;
    else if (wpm < 70) fc -= 0.75;
  }
  fc += m.linkerGroups.length >= 3 ? 0.5 : m.linkerGroups.length >= 2 ? 0.25 : -0.5;
  if (m.sentences.length >= 5) fc += 0.25;
  fc = clamp(fc);

  /* Lexical resource */
  let lr = 5.5;
  lr += m.rootTTR > 5.5 ? 1 : m.rootTTR > 4 ? 0.5 : m.rootTTR > 3 ? 0 : -1;
  const upgradesUsed = prompt.upgrades.filter((u) => text.toLowerCase().includes(u.better.toLowerCase().split(/\s+/)[0]));
  lr += Math.min(1, upgradesUsed.length * 0.4);
  lr -= Math.min(1, errorWeight(m, "lr") * 0.25);
  lr = clamp(lr);

  /* Grammatical range and accuracy */
  let gra = 5.5;
  const subPer = m.sentences.length > 0 ? m.subordinators / m.sentences.length : 0;
  gra += subPer > 0.7 ? 0.75 : subPer >= 0.3 ? 0.25 : -0.75;
  gra += m.sentenceSpread > 5 ? 0.5 : 0;
  gra -= Math.min(1.75, errorWeight(m, "gra") * 0.35);
  gra = clamp(gra);

  const band = clamp((fc + lr + gra) / 3);

  if (lengthRatio < 0.6) {
    notes.push({
      kind: "fix",
      message: el(
        prompt.part === 2
          ? `You produced ${m.wordCount} words. Part 2 expects roughly ${expected} — cover all four bullet points and add one personal detail to each.`
          : `Only ${m.wordCount} words. Never stop at a bare answer: give the answer, a reason, and an example.`,
        prompt.part === 2
          ? `Ты сказал ${m.wordCount} слов. В Part 2 ждут около ${expected} — раскрой все пункты карточки и добавь к каждому личную деталь.`
          : `Всего ${m.wordCount} слов. Никогда не отвечай односложно: ответ → причина → пример.`
      ),
    });
  }
  if (wpm !== null && wpm < 70) {
    notes.push({
      kind: "fix",
      message: el(
        `You spoke at ${wpm} words per minute. Long pauses cost Fluency marks — keep talking even if you have to rephrase.`,
        `Темп ${wpm} слов в минуту. Долгие паузы бьют по Fluency — продолжай говорить, даже если приходится переформулировать.`
      ),
    });
  }
  const unused = prompt.upgrades.filter((u) => !upgradesUsed.includes(u)).slice(0, 3);
  for (const u of unused) {
    notes.push({
      kind: "tip",
      quote: u.plain,
      message: el(`Upgrade this to "${u.better}".`, `Замени на «${u.better}».`),
    });
  }
  if (m.linkerGroups.length >= 3) {
    notes.push({ kind: "good", message: el("Your answer was easy to follow.", "За ответом легко следить.") });
  }

  const criteria: CriterionScore[] = [
    {
      id: "fc", band: fc,
      why: el(
        `${m.wordCount} words${wpm !== null ? ` at ${wpm} wpm` : ""}, ${m.linkerGroups.length} connector types.`,
        `${m.wordCount} слов${wpm !== null ? `, темп ${wpm} сл/мин` : ""}, типов коннекторов — ${m.linkerGroups.length}.`
      ),
    },
    {
      id: "lr", band: lr,
      why: el(
        `Variety index ${m.rootTTR.toFixed(1)}, ${upgradesUsed.length} of ${prompt.upgrades.length} target phrases used.`,
        `Индекс разнообразия ${m.rootTTR.toFixed(1)}, использовано ${upgradesUsed.length} из ${prompt.upgrades.length} целевых выражений.`
      ),
    },
    {
      id: "gra", band: gra,
      why: el(
        `${m.subordinators} subordinate clauses across ${m.sentences.length} sentences.`,
        `${m.subordinators} придаточных на ${m.sentences.length} предложений.`
      ),
    },
    {
      id: "pr", band: 0,
      why: el(
        "Pronunciation is not scored — nothing here analyses audio, so any number would be invented.",
        "Pronunciation не оценивается: аудио здесь никто не анализирует, любая цифра была бы выдуманной.",
      ),
    },
  ];

  return { band, criteria, notes, metrics: m, wpm };
}
