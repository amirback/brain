import type { Lang, StudentState } from "./types";
import { subjectById, topicById, topicsOf } from "./content";
import { formatForecast, readiness } from "./engine";
import { streakLength, totalSeconds, weekSeconds } from "./store-helpers";

/**
 * The mentor's system prompt and the slice of the student's profile that goes
 * with it.
 *
 * Only derived facts travel to the API — name, grade, goal, ratings, topic
 * mastery. No answer history, no email, no class or parent codes: the model
 * needs the shape of the student's progress, not their identity graph. The
 * whole profile otherwise never leaves the browser, and that should stay true
 * of everything the mentor doesn't actually need.
 */

export interface MentorContext {
  system: string;
  /** Sent to the route; kept small enough to read in a network trace. */
  profile: MentorProfile;
}

export interface MentorProfile {
  name: string;
  grade: number;
  goal: string;
  subject: string;
  lang: Lang;
  elo: number;
  streakDays: number;
  hoursTotal: number;
  minutesThisWeek: number;
  forecast: string;
  forecastMax: string;
  examDate: string | null;
  daysToExam: number | null;
  topics: { title: string; mastery: number; attempts: number }[];
  scheduledMock: { inDays: number; questions: number } | null;
}

export function buildProfile(st: StudentState, lang: Lang): MentorProfile {
  const subject = subjectById(st.activeSubject);
  const view = formatForecast(readiness(st, st.activeSubject), st.goal);
  const daysToExam = st.examDate
    ? Math.max(0, Math.ceil((new Date(st.examDate).getTime() - Date.now()) / 864e5))
    : null;
  const mock = st.mocks.find((m) => m.status === "scheduled");

  return {
    name: st.name,
    grade: st.grade,
    goal: st.goal,
    subject: subject ? subject.title[lang] : st.activeSubject,
    lang,
    elo: st.elo,
    streakDays: streakLength(st.streakDates),
    hoursTotal: Math.round((totalSeconds(st.secondsByDay) / 3600) * 10) / 10,
    minutesThisWeek: Math.round(weekSeconds(st.secondsByDay) / 60),
    forecast: view.value,
    forecastMax: view.max,
    examDate: st.examDate,
    daysToExam,
    topics: topicsOf(st.activeSubject).map((tp) => ({
      title: tp.title[lang],
      mastery: Math.round((st.mastery[tp.id] ?? 0) * 100),
      attempts: st.attempts[tp.id] ?? 0,
    })),
    scheduledMock: mock
      ? {
          inDays: Math.max(0, Math.ceil((mock.dueAt - Date.now()) / 864e5)),
          questions: mock.size,
        }
      : null,
  };
}

/** Renders the profile as the compact block the model reads. */
function profileBlock(p: MentorProfile): string {
  const topics = p.topics
    .map((t) => `  - ${t.title}: ${t.attempts === 0 ? "not started" : `${t.mastery}% mastered, ${t.attempts} answered`}`)
    .join("\n");

  return [
    `name: ${p.name}`,
    `grade: ${p.grade}`,
    `goal: ${p.goal}`,
    `current subject: ${p.subject}`,
    `rating (Elo): ${p.elo}`,
    `streak: ${p.streakDays} days`,
    `study time: ${p.hoursTotal} h total, ${p.minutesThisWeek} min this week`,
    `score forecast: ${p.forecast} of ${p.forecastMax}`,
    p.daysToExam !== null ? `days to the exam: ${p.daysToExam}` : "exam date: not set",
    p.scheduledMock
      ? `scheduled mock test: in ${p.scheduledMock.inDays} days, ${p.scheduledMock.questions} questions`
      : "scheduled mock test: none",
    `topics:\n${topics}`,
  ].join("\n");
}

const LANGUAGE_NAME: Record<Lang, string> = {
  ru: "Russian",
  kk: "Kazakh",
  en: "English",
};

/**
 * The behavioural half of the prompt.
 *
 * Written for Claude Opus 5, which follows instructions closely and by default
 * writes longer than a chat bubble wants — hence the explicit brevity and
 * scope lines rather than trusting the default register.
 */
export function buildSystem(p: MentorProfile): string {
  return `You are the study mentor inside Brain, a learning platform for school students in Kazakhstan preparing for the UNT, SAT or IELTS. You are talking to one student.

## The student
${profileBlock(p)}

## Language
Reply in the same language the student writes in. If they write in Russian, reply in Russian; Kazakh, reply in Kazakh; English, reply in English. Their interface is currently set to ${LANGUAGE_NAME[p.lang]}, but the language of their message wins over that. If they explicitly ask you to switch language, switch.

## What you are here for
Answer whatever the student asks. Study questions, exam strategy, a topic they cannot get through, why they lost motivation, whether they will be ready in time, or something unrelated to studying entirely — all of it is fair. You are a mentor, not a lookup service, and refusing to engage with a question because it is "off topic" is the wrong instinct.

## Honesty
The profile above is the only thing you know about this student. Never invent a number, a topic result, a date, or a past conversation that is not in it. If you do not know something, say so plainly — that includes facts about the world you are unsure of, since you have no internet access here. A wrong fact delivered confidently is worse than an admitted gap, especially to someone studying for an exam.

## How to write
Keep replies to the length the question needs — usually two or three short paragraphs, no headers, no bullet lists unless the student asked for steps. This is a chat bubble on a phone, not a document. Lead with the answer, then the reason.

Be concrete about this student rather than generic: their weakest topic, their actual forecast, the days left before their test. Give one clear next action when the question calls for one, and do not stack three alternatives.

Do not open with praise or restate their question back to them. Do not use emoji.

## Boundaries
You are not a doctor, lawyer, or therapist. If a message suggests the student is in real distress — self-harm, abuse, a crisis — say clearly that you are not the right help, and point them to a trusted adult or a professional. Do not attempt to counsel them through it.

Do not do a student's graded work for them when the point is that they learn it. Explain the method, work a similar example, then hand the actual problem back.`;
}

export function buildContext(st: StudentState, lang: Lang): MentorContext {
  const profile = buildProfile(st, lang);
  return { system: buildSystem(profile), profile };
}

/** Chat history the client sends; kept short so the request stays cheap. */
export interface MentorTurn {
  role: "user" | "assistant";
  content: string;
}

export const MAX_HISTORY_TURNS = 12;

/** Trims history to the last N turns, always starting on a user message. */
export function trimHistory(turns: MentorTurn[]): MentorTurn[] {
  const tail = turns.slice(-MAX_HISTORY_TURNS);
  const firstUser = tail.findIndex((t) => t.role === "user");
  return firstUser <= 0 ? tail : tail.slice(firstUser);
}

/** Belt-and-braces cap so a pasted essay cannot blow up the request. */
export const MAX_MESSAGE_CHARS = 4000;

export function topicHint(st: StudentState, lang: Lang): string | undefined {
  const weakest = topicsOf(st.activeSubject)
    .filter((tp) => (st.attempts[tp.id] ?? 0) > 0)
    .sort((a, b) => (st.mastery[a.id] ?? 0) - (st.mastery[b.id] ?? 0))[0];
  void lang;
  return weakest ? topicById(weakest.id)?.id : undefined;
}
