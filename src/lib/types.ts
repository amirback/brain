export type Lang = "ru" | "kk" | "en";

export type L = { ru: string; kk: string; en: string };

export type Goal = "ent" | "olymp" | "school";

export interface Question {
  id: string;
  topic: string;
  difficulty: number; // Elo-style rating, 700..1500
  stem: L;
  options: L[];
  correct: number;
  explain: L;
  hint: L;
}

export interface Topic {
  id: string;
  title: L;
  blurb: L;
  weight: number; // share in exam forecast, sums to 1 across core topics
  grades: [number, number];
  custom?: boolean;
}

export interface LessonSection {
  heading: L;
  body: L;
  formula?: string;
}

export interface Lesson {
  topic: string;
  intro: L;
  sections: LessonSection[];
  example: { problem: L; steps: L[] };
}

export interface AnswerLog {
  qid: string;
  topic: string;
  correct: boolean;
  difficulty: number;
  ts: number;
  mode: "diagnostic" | "practice" | "checkpoint";
}

export interface ForecastPoint {
  ts: number;
  score: number; // 0..50 profile math scale
}

export interface EloPoint {
  ts: number;
  elo: number;
}

export interface TeacherTask {
  id: string;
  title: string;
  topic: string;
  due: string; // ISO date
  note?: string;
  done: boolean;
}

export interface TeacherMaterial {
  id: string;
  title: string;
  url: string;
  topic: string;
}

export interface CustomTopic {
  id: string;
  name: string;
  desc: string;
}

export interface UserState {
  name: string;
  grade: number;
  goal: Goal;
  examDate: string | null;
  createdAt: number;
  elo: number;
  eloHistory: EloPoint[];
  mastery: Record<string, number>; // topic id -> 0..1
  attempts: Record<string, number>; // topic id -> answered count
  answers: AnswerLog[];
  forecastHistory: ForecastPoint[];
  streakDates: string[]; // "YYYY-MM-DD" of active days
  secondsByDay: Record<string, number>; // date -> active seconds
  lastCheckpoint: number | null;
  diagnosticDone: boolean;
  goalSwitches: number;
  tasks: TeacherTask[];
  materials: TeacherMaterial[];
  customTopics: CustomTopic[];
  achievements: string[];
}

export interface MockStudent {
  id: string;
  name: string;
  elo: number;
  hours: number;
  streak: number;
  mastery: Record<string, number>;
  lastActiveDays: number;
  stuck?: string; // topic id where the student is stuck
}
