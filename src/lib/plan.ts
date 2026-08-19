import type { L, StudentState, SubjectId } from "./types";
import { LESSONS, lessonStepCount, topicsOf } from "./content";
import { todayStr } from "./store-helpers";

/**
 * The study plan.
 *
 * Scheduling a mock test and then leaving the student to guess what to do for the
 * four days before it was the biggest hole in the product: the app knew the gaps
 * and knew the deadline, but never joined them into "here is today's work".
 *
 * The plan is derived, not stored. It is a pure function of the student's state
 * and today's date, so it re-plans itself the moment mastery moves — which is the
 * behaviour you want anyway: finish a topic early and tomorrow's slot changes.
 * Completion is derived the same way, from lesson progress and answer timestamps,
 * so there is no second source of truth to fall out of sync.
 */

export type PlanTaskKind = "lesson" | "practice" | "fix" | "review" | "mock" | "exam";

export type PlanStatus = "done" | "today" | "upcoming" | "missed";

export interface PlanDay {
  /** YYYY-MM-DD */
  date: string;
  /** Days from today: 0 is today, negative is behind. */
  offset: number;
  kind: PlanTaskKind;
  topic?: string;
  title: L;
  detail: L;
  href: string;
  minutes: number;
  status: PlanStatus;
}

const t = (ru: string, kk: string, en: string): L => ({ ru, kk, en });

const dayKey = (offset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

/** How many reader steps a lesson has — matches what /learn renders. */
export function lessonSteps(topicId: string): number {
  const lesson = LESSONS.find((l) => l.topic === topicId);
  return lesson ? lessonStepCount(lesson) : 0;
}

export function lessonDone(st: StudentState, topicId: string): boolean {
  const total = lessonSteps(topicId);
  return total > 0 && (st.lessonProgress[topicId] ?? 0) >= total - 1;
}

/** Answers the student logged on a given calendar date. */
function answersOn(st: StudentState, date: string): number {
  return st.answers.filter((a) => new Date(a.ts).toISOString().slice(0, 10) === date).length;
}

interface Slot {
  kind: PlanTaskKind;
  topic?: string;
  minutes: number;
}

/**
 * What still needs doing, hardest gap first: topics never opened, then weak ones,
 * then the ones held above the line that only need a refresh.
 */
function backlog(st: StudentState, subject: SubjectId): Slot[] {
  const topics = topicsOf(subject);
  const scored = topics.map((tp) => ({
    id: tp.id,
    weight: tp.weight,
    attempts: st.attempts[tp.id] ?? 0,
    mastery: st.mastery[tp.id] ?? 0,
    read: lessonDone(st, tp.id),
  }));

  const untouched = scored
    .filter((s) => s.attempts === 0)
    .sort((a, b) => b.weight - a.weight);
  const weak = scored
    .filter((s) => s.attempts > 0 && s.mastery < 0.5)
    .sort((a, b) => a.mastery - b.mastery);
  const mid = scored
    .filter((s) => s.attempts > 0 && s.mastery >= 0.5 && s.mastery < 0.75)
    .sort((a, b) => a.mastery - b.mastery);

  const slots: Slot[] = [];
  // A topic never opened needs the lesson before the practice; one already
  // attempted needs drilling, not re-reading.
  for (const s of untouched) {
    if (!s.read) slots.push({ kind: "lesson", topic: s.id, minutes: 25 });
    slots.push({ kind: "practice", topic: s.id, minutes: 20 });
  }
  for (const s of weak) {
    if (!s.read) slots.push({ kind: "lesson", topic: s.id, minutes: 25 });
    slots.push({ kind: "practice", topic: s.id, minutes: 20 });
  }
  for (const s of mid) slots.push({ kind: "review", topic: s.id, minutes: 15 });
  return slots;
}

const TITLES: Record<PlanTaskKind, L> = {
  lesson: t("Урок", "Сабақ", "Lesson"),
  practice: t("Практика", "Практика", "Practice"),
  fix: t("Работа над ошибками", "Қателермен жұмыс", "Fix your mistakes"),
  review: t("Повторение", "Қайталау", "Review"),
  mock: t("Мок-тест", "Мок-тест", "Mock test"),
  exam: t("Экзамен", "Емтихан", "Exam"),
};

function detailFor(kind: PlanTaskKind, topicName: string): L {
  switch (kind) {
    case "lesson":
      return t(
        `Разобрать тему «${topicName}» с нуля: теория, примеры и разборы.`,
        `«${topicName}» тақырыбын нөлден игеру: теория, мысалдар және талдаулар.`,
        `Work through "${topicName}" from scratch: theory, examples and worked problems.`
      );
    case "practice":
      return t(
        `Решить задачи по теме «${topicName}». Сложность подстроится под твой уровень.`,
        `«${topicName}» тақырыбы бойынша есептер шығару. Күрделілік деңгейіңе бейімделеді.`,
        `Drill "${topicName}". The difficulty adapts to your level.`
      );
    case "review":
      return t(
        `Короткое повторение по теме «${topicName}», чтобы не растерять её к тесту.`,
        `«${topicName}» тақырыбын тестке дейін ұмытпау үшін қысқаша қайталау.`,
        `A short review of "${topicName}" so it holds until the test.`
      );
    case "fix":
      return t(
        "Разобрать вопросы, в которых ошибся, и закрепить их похожими заданиями.",
        "Қателескен сұрақтарды талдап, ұқсас тапсырмалармен бекіту.",
        "Go through what you got wrong and consolidate it with similar questions."
      );
    case "mock":
      return t(
        "Полный тест с таймером. Это проверка всего, что разобрал за эти дни.",
        "Таймері бар толық тест. Осы күндері игергеннің бәрін тексеру.",
        "A full timed test — the check on everything you covered this week."
      );
    case "exam":
      return t("День экзамена.", "Емтихан күні.", "Exam day.");
  }
}

export interface Plan {
  days: PlanDay[];
  /** The milestone the plan is built towards. */
  target: { kind: "mock" | "exam" | "open"; date: string | null; daysLeft: number | null };
  today: PlanDay | null;
  doneCount: number;
}

const HORIZON_WITHOUT_TARGET = 7;

/**
 * Builds the schedule from today up to the next mock (or the exam, or a rolling
 * week if neither exists). The last two days before a mock are always review and
 * mistakes rather than new material — cramming a new topic the night before a test
 * is how students lose the topics they already had.
 */
export function buildPlan(st: StudentState, topicName: (id: string) => string): Plan {
  const mock = st.mocks.find((m) => m.status === "scheduled");
  const examMs = st.examDate ? new Date(st.examDate).getTime() : null;

  let horizon: number;
  let target: Plan["target"];
  if (mock) {
    horizon = Math.max(1, Math.min(10, Math.ceil((mock.dueAt - Date.now()) / 864e5)));
    target = { kind: "mock", date: dayKey(horizon), daysLeft: horizon };
  } else if (examMs && examMs > Date.now()) {
    const toExam = Math.ceil((examMs - Date.now()) / 864e5);
    horizon = Math.min(HORIZON_WITHOUT_TARGET, toExam);
    target = { kind: "exam", date: st.examDate, daysLeft: toExam };
  } else {
    horizon = HORIZON_WITHOUT_TARGET;
    target = { kind: "open", date: null, daysLeft: null };
  }

  const queue = backlog(st, st.activeSubject);
  const hasMistakes = st.answers.filter((a) => !a.correct).length >= 3;

  const slots: Slot[] = [];
  for (let i = 0; i < horizon; i++) {
    const isLast = i === horizon - 1;
    const isDayBefore = i === horizon - 2;

    if (mock && isLast) {
      slots.push({ kind: "mock", minutes: 25 });
      continue;
    }
    // The day before a test is for consolidating, never for new theory.
    if (mock && isDayBefore && horizon >= 3) {
      slots.push({ kind: hasMistakes ? "fix" : "review", minutes: 20 });
      continue;
    }
    const next = queue.shift();
    slots.push(next ?? { kind: hasMistakes ? "fix" : "review", minutes: 20 });
  }

  const today = todayStr();
  const days: PlanDay[] = slots.map((slot, i) => {
    const date = dayKey(i);
    const name = slot.topic ? topicName(slot.topic) : "";

    let status: PlanStatus = i === 0 ? "today" : "upcoming";
    if (slot.kind === "lesson" && slot.topic && lessonDone(st, slot.topic)) status = "done";
    else if (slot.kind === "mock") {
      const done = st.mocks.find((m) => m.id === mock?.id)?.status === "done";
      if (done) status = "done";
    } else if (i === 0 && answersOn(st, today) >= 6) status = "done";

    const href =
      slot.kind === "lesson" && slot.topic
        ? `/learn?t=${slot.topic}`
        : slot.kind === "mock" && mock
          ? `/mock?id=${mock.id}`
          : slot.kind === "fix"
            ? "/practice?mode=checkpoint"
            : slot.topic
              ? `/practice?t=${slot.topic}`
              : "/practice";

    return {
      date,
      offset: i,
      kind: slot.kind,
      topic: slot.topic,
      title: slot.topic
        ? t(`${TITLES[slot.kind].ru}: ${name}`, `${TITLES[slot.kind].kk}: ${name}`, `${TITLES[slot.kind].en}: ${name}`)
        : TITLES[slot.kind],
      detail: detailFor(slot.kind, name),
      href,
      minutes: slot.minutes,
      status,
    };
  });

  return {
    days,
    target,
    today: days[0] ?? null,
    doneCount: days.filter((d) => d.status === "done").length,
  };
}
