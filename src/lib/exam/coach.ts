import type { EL, ExamItem, ItemResult, Level, SkillBreakdown } from "./types";

/**
 * Post-test analysis.
 *
 * Everything here is derived from the authored item — the correct answer, the
 * explanation, the named trap — plus what the student actually did. That keeps the
 * feedback specific ("you picked the option that uses the linear ratio instead of
 * cubing it") without pretending a language model is in the loop.
 */

export function pickEL(v: EL, lang: string): string {
  if (lang === "en") return v.en;
  if (lang === "kk") return v.kk ?? v.ru;
  return v.ru;
}

export interface MistakeAnalysis {
  /** What the student put down, rendered for display. */
  givenLabel: string | null;
  correctLabel: string;
  /** Ordered blocks: the reasoning, then the trap, then what to do next. */
  blocks: { kind: "why" | "trap" | "time" | "next"; text: EL }[];
}

function labelFor(item: ExamItem, value: number | string | null): string | null {
  if (value === null || value === "") return null;
  if (typeof value === "number") {
    const letter = String.fromCharCode(65 + value);
    return item.options ? `${letter}. ${item.options[value]}` : letter;
  }
  return String(value);
}

export function correctLabel(item: ExamItem): string {
  if (item.answer.kind === "choice") {
    const i = item.answer.correct;
    return item.options ? `${String.fromCharCode(65 + i)}. ${item.options[i]}` : String.fromCharCode(65 + i);
  }
  return item.answer.accept[0];
}

/** Median seconds across the attempt, used to flag questions that ate the clock. */
export function medianSeconds(results: ItemResult[]): number {
  const times = results.map((r) => r.seconds).filter((s) => s > 0).sort((a, b) => a - b);
  if (times.length === 0) return 0;
  return times[Math.floor(times.length / 2)];
}

export function analyseMistake(item: ExamItem, result: ItemResult, median: number): MistakeAnalysis {
  const blocks: MistakeAnalysis["blocks"] = [];
  const skipped = result.given === null || result.given === "";

  if (skipped) {
    blocks.push({
      kind: "why",
      text: {
        en: "You left this one blank. Nothing is deducted for a wrong answer on the SAT or IELTS, so an unanswered question is a point given away for free — always put something down.",
        ru: "Здесь пусто. Ни на SAT, ни на IELTS за неверный ответ не снимают, поэтому пропуск — это отданный балл. Всегда что-нибудь отмечай.",
      },
    });
  }

  blocks.push({ kind: "why", text: item.explain });
  if (item.trap && !skipped) blocks.push({ kind: "trap", text: item.trap });

  if (result.seconds > 0 && median > 0 && result.seconds > median * 2.2) {
    blocks.push({
      kind: "time",
      text: {
        en: `This question took you ${Math.round(result.seconds)} seconds against a median of ${Math.round(median)}. On a timed module the right move is to mark it, move on, and come back with whatever is left.`,
        ru: `На этот вопрос ушло ${Math.round(result.seconds)} секунд при медиане ${Math.round(median)}. В модуле с таймером правильная тактика — отметить, идти дальше и вернуться на остатке времени.`,
      },
    });
  }

  blocks.push({
    kind: "next",
    text: {
      en: `Reinforce this by working through more "${item.topic}" questions — that tag is what the practice drill below is filtered by.`,
      ru: `Закрепи это темой «${item.topic}» — именно по этому тегу отфильтрована тренировка ниже.`,
    },
  });

  return {
    givenLabel: labelFor(item, result.given),
    correctLabel: correctLabel(item),
    blocks,
  };
}

/** Items sharing the missed item's topic, hardest-last, for the follow-up drill. */
export function similarItems(item: ExamItem, pool: ExamItem[], limit = 5): ExamItem[] {
  const rank: Record<Level, number> = { easy: 0, medium: 1, hard: 2 };
  const sameTopic = pool.filter((x) => x.id !== item.id && x.topic === item.topic);
  const sameSkill = pool.filter((x) => x.id !== item.id && x.skill === item.skill && x.topic !== item.topic);
  return [...sameTopic, ...sameSkill]
    .sort((a, b) => rank[a.difficulty] - rank[b.difficulty])
    .slice(0, limit);
}

/** Every item the student got wrong or skipped, in the order they were asked. */
export function mistakesOf(items: ExamItem[], results: ItemResult[]): { item: ExamItem; result: ItemResult }[] {
  const byId = new Map(results.map((r) => [r.id, r]));
  return items
    .map((item) => ({ item, result: byId.get(item.id) }))
    .filter((x): x is { item: ExamItem; result: ItemResult } => !!x.result && !x.result.correct);
}

/** Drill built from the weakest topics: the "fix mistakes, then practise again" loop. */
export function fixPlan(items: ExamItem[], results: ItemResult[], pool: ExamItem[], limit = 12): ExamItem[] {
  const missed = mistakesOf(items, results);
  const seen = new Set(items.map((i) => i.id));
  const out: ExamItem[] = [];
  for (const { item } of missed) {
    for (const cand of similarItems(item, pool, 3)) {
      if (seen.has(cand.id)) continue;
      seen.add(cand.id);
      out.push(cand);
      if (out.length >= limit) return out;
    }
  }
  return out;
}

export interface Verdict {
  headline: EL;
  detail: EL;
}

/** A short reading of the score report, pinned to the two weakest skills. */
export function verdict(bySkill: SkillBreakdown[], share: number): Verdict {
  const weak = bySkill.filter((s) => s.total >= 2).slice(0, 2);
  const names = weak.map((s) => s.skill).join(" и ");
  const namesEn = weak.map((s) => s.skill).join(" and ");

  if (share >= 0.85) {
    return {
      headline: { en: "Strong result — you are working at target level.", ru: "Сильный результат — ты работаешь на целевом уровне." },
      detail: {
        en: `Accuracy is high across the board. The remaining points are in ${namesEn}; at this level the gain comes from timing, not from new material.`,
        ru: `Точность высокая почти везде. Оставшиеся баллы — в разделах ${names}; на этом уровне рост даёт тайминг, а не новый материал.`,
      },
    };
  }
  if (share >= 0.6) {
    return {
      headline: { en: "Solid base with two clear gaps.", ru: "Хорошая база и два ясных пробела." },
      detail: {
        en: `You are steady on most categories. ${namesEn} is where the score is leaking — work those before adding anything new.`,
        ru: `В большинстве категорий стабильно. Балл утекает в разделах ${names} — их и закрывай прежде, чем брать новое.`,
      },
    };
  }
  if (share >= 0.35) {
    return {
      headline: { en: "The fundamentals need another pass.", ru: "Основам нужен ещё один проход." },
      detail: {
        en: `Errors are spread rather than concentrated, which usually means method rather than knowledge. Start with ${namesEn} and slow down deliberately — accuracy first, speed later.`,
        ru: `Ошибки размазаны, а не собраны в одном месте — обычно это вопрос метода, а не знаний. Начни с разделов ${names} и намеренно сбавь темп: сначала точность, скорость потом.`,
      },
    };
  }
  return {
    headline: { en: "Start from the explanations, not from another test.", ru: "Начинай с разборов, а не со следующего теста." },
    detail: {
      en: `Taking another full test now would not tell you anything new. Read every explanation below, then run the targeted drill — ${namesEn} first.`,
      ru: `Ещё один полный тест сейчас ничего нового не покажет. Прочитай все разборы ниже, потом пройди точечную тренировку — начиная с разделов ${names}.`,
    },
  };
}
