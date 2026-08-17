import type { Goal, Lesson, Question, Subject, SubjectId, Topic } from "../types";
import { t } from "./util";
import { mathLessons, mathQuestions, mathTopics } from "./math";
import { englishLessons, englishQuestions, englishTopics } from "./english";
import { kazakhLessons, kazakhQuestions, kazakhTopics } from "./kazakh";
import { historyLessons, historyQuestions, historyTopics } from "./history";
import { satLessons, satQuestions, satTopics } from "./sat";
import { ieltsLessons, ieltsQuestions, ieltsTopics } from "./ielts";

export const SUBJECTS: Subject[] = [
  {
    id: "math",
    title: t("Математика", "Математика", "Mathematics"),
    blurb: t("Алгебра и функции", "Алгебра және функциялар", "Algebra and functions"),
    goals: ["ent", "olymp", "school"],
  },
  {
    id: "english",
    title: t("Английский язык", "Ағылшын тілі", "English"),
    blurb: t("Грамматика и лексика", "Грамматика және лексика", "Grammar and vocabulary"),
    goals: ["ent", "school", "olymp"],
  },
  {
    id: "kazakh",
    title: t("Казахский язык", "Қазақ тілі", "Kazakh"),
    blurb: t("Грамматика и сөз таптары", "Грамматика және сөз таптары", "Grammar and parts of speech"),
    goals: ["ent", "school"],
  },
  {
    id: "history",
    title: t("История Казахстана", "Қазақстан тарихы", "History of Kazakhstan"),
    blurb: t("От саков до независимости", "Сақтардан тәуелсіздікке дейін", "From the Saka to independence"),
    goals: ["ent", "school"],
  },
  {
    id: "sat",
    title: t("SAT", "SAT", "SAT"),
    blurb: t("Math и Reading & Writing", "Math және Reading & Writing", "Math and Reading & Writing"),
    goals: ["sat"],
  },
  {
    id: "ielts",
    title: t("IELTS", "IELTS", "IELTS"),
    blurb: t("Reading, Writing, лексика", "Reading, Writing, лексика", "Reading, Writing, vocabulary"),
    goals: ["ielts"],
  },
];

export const TOPICS: Topic[] = [
  ...mathTopics,
  ...englishTopics,
  ...kazakhTopics,
  ...historyTopics,
  ...satTopics,
  ...ieltsTopics,
];

export const LESSONS: Lesson[] = [
  ...mathLessons,
  ...englishLessons,
  ...kazakhLessons,
  ...historyLessons,
  ...satLessons,
  ...ieltsLessons,
];

export const QUESTIONS: Question[] = [
  ...mathQuestions,
  ...englishQuestions,
  ...kazakhQuestions,
  ...historyQuestions,
  ...satQuestions,
  ...ieltsQuestions,
];

export const topicById = (id: string) => TOPICS.find((x) => x.id === id);
export const lessonByTopic = (id: string) => LESSONS.find((l) => l.topic === id);
export const subjectById = (id: SubjectId) => SUBJECTS.find((s) => s.id === id);
export const topicsOf = (subject: SubjectId) => TOPICS.filter((x) => x.subject === subject);
export const questionsOf = (subject: SubjectId) => QUESTIONS.filter((q) => q.subject === subject);
export const subjectsForGoal = (goal: Goal) => SUBJECTS.filter((s) => s.goals.includes(goal));

/** Default selection offered when a student picks a goal. */
export function defaultSubjects(goal: Goal): SubjectId[] {
  if (goal === "sat") return ["sat"];
  if (goal === "ielts") return ["ielts"];
  if (goal === "olymp") return ["math"];
  return ["math"];
}
