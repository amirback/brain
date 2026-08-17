export type Lang = "ru" | "kk" | "en";

export type L = { ru: string; kk: string; en: string };

export type Role = "student" | "teacher" | "parent";

export type Goal = "ent" | "olymp" | "school" | "sat" | "ielts";

export type SubjectId = "math" | "english" | "kazakh" | "history" | "sat" | "ielts";

export interface Subject {
  id: SubjectId;
  title: L;
  blurb: L;
  /** Goals this subject belongs to — drives what a student is offered. */
  goals: Goal[];
}

export interface Question {
  id: string;
  subject: SubjectId;
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
  subject: SubjectId;
  title: L;
  blurb: L;
  weight: number; // share within its subject, sums to ~1 per subject
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
  subject: SubjectId;
  correct: boolean;
  difficulty: number;
  ts: number;
  mode: "diagnostic" | "practice" | "checkpoint";
}

/** Forecast is stored scale-free (0..1) so switching goals re-scales it. */
export interface ForecastPoint {
  ts: number;
  raw: number;
}

export interface EloPoint {
  ts: number;
  elo: number;
}

export interface TeacherTask {
  id: string;
  title: string;
  topic: string;
  subject: SubjectId;
  due: string; // ISO date
  note?: string;
  done: boolean;
  from: string; // teacher name
}

export interface TeacherMaterial {
  id: string;
  title: string;
  url: string;
  topic: string;
}

export interface CustomTopic {
  id: string;
  subject: SubjectId;
  name: string;
  desc: string;
}

export interface StudentState {
  code: string; // the code a teacher or parent uses to find this student
  name: string;
  grade: number;
  goal: Goal;
  subjects: SubjectId[];
  activeSubject: SubjectId;
  examDate: string | null;
  createdAt: number;
  classCode: string | null; // the teacher's class this student joined
  elo: number;
  eloHistory: EloPoint[];
  mastery: Record<string, number>; // topic id -> 0..1
  attempts: Record<string, number>; // topic id -> answered count
  answers: AnswerLog[];
  forecastHistory: ForecastPoint[];
  streakDates: string[]; // "YYYY-MM-DD" of active days
  secondsByDay: Record<string, number>;
  lastCheckpoint: number | null;
  diagnosticDone: boolean;
  goalSwitches: number;
  tasks: TeacherTask[];
  materials: TeacherMaterial[];
  customTopics: CustomTopic[];
  achievements: string[];
}

export interface TeacherState {
  code: string; // class code students type in to join
  name: string;
  school: string;
  className: string;
  subject: SubjectId;
  createdAt: number;
}

export interface ParentState {
  name: string;
  childCode: string | null;
}

export interface HelpRequest {
  id: string;
  student: string;
  studentCode: string;
  classCode: string | null;
  topic: string;
  ts: number;
}

/**
 * Everything lives in one space keyed by code — the same shape a server
 * would hold, so roles can look each other up by code instead of each
 * browser knowing only about itself.
 */
export interface Space {
  role: Role | null;
  activeStudent: string | null; // student code
  students: Record<string, StudentState>;
  teacher: TeacherState | null;
  parent: ParentState | null;
  helpRequests: HelpRequest[];
}

export interface MockStudent {
  id: string;
  name: string;
  elo: number;
  hours: number;
  streak: number;
  mastery: Record<string, number>;
  lastActiveDays: number;
  stuck?: string;
}
