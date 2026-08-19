import type { ClassRecord, Space, StudentState, SubjectId } from "./types";
import { readiness, START_ELO } from "./engine";

/** The built-in class any student can join to see a populated teacher panel. */
export const DEMO_CLASS_CODE = "CL-DEMO";

/** Registered in every space so the demo code always resolves to a real class. */
export function demoClassRecord(): ClassRecord {
  return {
    code: DEMO_CLASS_CODE,
    teacherName: "Гүлнар Серікқызы",
    school: "НИШ №1",
    className: "9 «Б»",
    subject: "math",
    createdAt: Date.now(),
  };
}

const DAY = 24 * 3600 * 1000;

interface Seed {
  code: string;
  name: string;
  grade: number;
  elo: number;
  hours: number;
  streak: number;
  lastActiveDays: number;
  mastery: Record<string, number>;
  subject: SubjectId;
}

/**
 * Classmates are stored as real student records, not a separate mock shape —
 * the teacher panel then reads exactly the same data a live class would give it.
 */
const SEEDS: Seed[] = [
  { code: "ST-AIYM", name: "Айым", grade: 9, elo: 1512, hours: 47.5, streak: 21, lastActiveDays: 0, subject: "math",
    mastery: { linear: 0.92, quadratic: 0.81, functions: 0.77 } },
  { code: "ST-DANI", name: "Данияр", grade: 9, elo: 1288, hours: 31.2, streak: 6, lastActiveDays: 0, subject: "math",
    mastery: { linear: 0.85, quadratic: 0.64, functions: 0.58 } },
  { code: "ST-TOMI", name: "Томирис", grade: 9, elo: 1174, hours: 26.8, streak: 12, lastActiveDays: 1, subject: "english",
    mastery: { linear: 0.78, quadratic: 0.55, functions: 0.61, "en-tenses": 0.72, "en-articles": 0.5 } },
  { code: "ST-ALIS", name: "Алишер", grade: 9, elo: 1051, hours: 19.4, streak: 3, lastActiveDays: 0, subject: "math",
    mastery: { linear: 0.71, quadratic: 0.48, functions: 0.35 } },
  { code: "ST-ARUZ", name: "Аружан", grade: 9, elo: 967, hours: 22.1, streak: 9, lastActiveDays: 2, subject: "math",
    mastery: { linear: 0.66, quadratic: 0.31, functions: 0.52 } },
  { code: "ST-MIRA", name: "Мирас", grade: 9, elo: 902, hours: 12.7, streak: 1, lastActiveDays: 0, subject: "history",
    mastery: { linear: 0.58, quadratic: 0.36, functions: 0.29, "hs-khanate": 0.44 } },
  { code: "ST-SANZ", name: "Санжар", grade: 9, elo: 845, hours: 9.3, streak: 0, lastActiveDays: 4, subject: "math",
    mastery: { linear: 0.44, quadratic: 0.22, functions: 0.31 } },
  { code: "ST-INKA", name: "Инкар", grade: 9, elo: 793, hours: 6.9, streak: 2, lastActiveDays: 1, subject: "kazakh",
    mastery: { linear: 0.39, quadratic: 0.18, functions: 0.24, "kz-septik": 0.41 } },
];

const dstr = (offset: number) => new Date(Date.now() - offset * DAY).toISOString().slice(0, 10);

function buildStudent(s: Seed): StudentState {
  // Spread the recorded hours across the streak plus a tail of earlier days.
  const secondsByDay: Record<string, number> = {};
  const totalSec = Math.round(s.hours * 3600);
  const spread = Math.max(s.streak, 6);
  let left = totalSec;
  for (let i = 0; i < spread; i++) {
    const share = i === spread - 1 ? left : Math.round(totalSec / spread);
    secondsByDay[dstr(i + s.lastActiveDays)] = Math.max(0, share);
    left -= share;
  }
  const streakDates: string[] = [];
  for (let i = 0; i < s.streak; i++) streakDates.push(dstr(i + s.lastActiveDays));

  const attempts: Record<string, number> = {};
  for (const k of Object.keys(s.mastery)) attempts[k] = 6 + Math.round(s.mastery[k] * 8);

  const base: StudentState = {
    code: s.code,
    email: null,
    name: s.name,
    grade: s.grade,
    goal: "ent",
    subjects: Array.from(new Set<SubjectId>(["math", s.subject])),
    activeSubject: s.subject,
    examDate: new Date(Date.now() + 290 * DAY).toISOString().slice(0, 10),
    createdAt: Date.now() - 30 * DAY,
    classCode: DEMO_CLASS_CODE,
    elo: s.elo,
    eloHistory: Array.from({ length: 8 }, (_, i) => ({
      ts: Date.now() - (7 - i) * DAY,
      elo: Math.round(START_ELO + ((s.elo - START_ELO) * (i + 1)) / 8),
    })),
    mastery: s.mastery,
    attempts,
    answers: [],
    forecastHistory: [],
    streakDates,
    secondsByDay,
    lastCheckpoint: Date.now() - 5 * DAY,
    diagnosticDone: true,
    goalSwitches: 0,
    tasks: [],
    materials: [],
    customTopics: [],
    achievements: ["firstDiag", "checkin"],
    mocks: [],
    inbox: [],
    lessonProgress: {},
    lastLesson: null,
    lastNudge: null,
  };
  base.forecastHistory = [
    { ts: Date.now() - 8 * DAY, raw: Math.max(0, readiness(base, base.activeSubject) - 0.16) },
    { ts: Date.now() - 6 * DAY, raw: Math.max(0, readiness(base, base.activeSubject) - 0.11) },
    { ts: Date.now() - 3 * DAY, raw: Math.max(0, readiness(base, base.activeSubject) - 0.05) },
    { ts: Date.now(), raw: readiness(base, base.activeSubject) },
  ];
  return base;
}

/** The signed-in demo student: three weeks of history, a real weak topic. */
function demoMe(): StudentState {
  const sessions: [number, number][] = [
    [0, 1860], [1, 7200], [2, 5400], [3, 9000], [4, 6300], [5, 8100], [6, 4500], [7, 10800], [8, 7200],
    [10, 9000], [11, 7200], [13, 10800], [14, 6300], [15, 8100], [17, 9000], [18, 12600], [19, 7200],
    [20, 9000], [22, 9000], [23, 7200], [25, 8100], [26, 7200],
  ];
  const secondsByDay: Record<string, number> = {};
  for (const [off, sec] of sessions) secondsByDay[dstr(off)] = sec;

  const me: StudentState = {
    code: "ST-AMIR",
    email: "amir@example.kz",
    name: "Амир",
    grade: 9,
    goal: "ent",
    subjects: ["math", "english", "history"],
    activeSubject: "math",
    examDate: new Date(Date.now() + 290 * DAY).toISOString().slice(0, 10),
    createdAt: Date.now() - 27 * DAY,
    classCode: DEMO_CLASS_CODE,
    elo: 1147,
    eloHistory: [800, 872, 918, 987, 1024, 1061, 1090, 1118, 1132, 1147].map((elo, i) => ({
      ts: Date.now() - (9 - i) * DAY,
      elo,
    })),
    mastery: { linear: 0.82, quadratic: 0.47, functions: 0.63, "en-tenses": 0.58, "hs-khanate": 0.4 },
    attempts: { linear: 14, quadratic: 11, functions: 9, "en-tenses": 7, "hs-khanate": 5 },
    answers: [],
    forecastHistory: [],
    streakDates: [dstr(8), dstr(7), dstr(6), dstr(5), dstr(4), dstr(3), dstr(2), dstr(1), dstr(0)],
    secondsByDay,
    lastCheckpoint: Date.now() - 5 * DAY,
    diagnosticDone: true,
    goalSwitches: 0,
    tasks: [],
    materials: [],
    customTopics: [],
    achievements: ["firstDiag", "streak3", "elo1000", "mastered", "checkin"],
    mocks: [
      {
        id: "mk-demo",
        subject: "math",
        topics: ["linear", "quadratic", "functions"],
        createdAt: Date.now() - 2 * DAY,
        dueAt: Date.now() + 2 * DAY,
        size: 10,
        status: "scheduled",
      },
    ],
    inbox: [],
    lessonProgress: { linear: 2 },
    lastLesson: "linear",
    lastNudge: null,
  };
  const now = readiness(me, "math");
  me.forecastHistory = [
    { ts: Date.now() - 9 * DAY, raw: Math.max(0, now - 0.26) },
    { ts: Date.now() - 8 * DAY, raw: Math.max(0, now - 0.22) },
    { ts: Date.now() - 6 * DAY, raw: Math.max(0, now - 0.12) },
    { ts: Date.now() - 4 * DAY, raw: Math.max(0, now - 0.08) },
    { ts: Date.now() - 2 * DAY, raw: Math.max(0, now - 0.04) },
    { ts: Date.now(), raw: now },
  ];
  return me;
}

/** A fully populated space: a student, their class, classmates and a teacher. */
export function demoSpace(): Space {
  const me = demoMe();
  const students: Record<string, StudentState> = { [me.code]: me };
  for (const s of SEEDS) students[s.code] = buildStudent(s);

  return {
    role: "student",
    activeStudent: me.code,
    students,
    classes: { [DEMO_CLASS_CODE]: demoClassRecord() },
    pendingClass: null,
    teacher: {
      code: DEMO_CLASS_CODE,
      email: "teacher@example.kz",
      name: "Гүлнар Серікқызы",
      school: "НИШ №1",
      className: "9 «Б»",
      subject: "math",
      createdAt: Date.now() - 60 * DAY,
    },
    parent: { name: "Родитель", email: "parent@example.kz", childCode: me.code },
    helpRequests: [
      {
        id: "r-demo",
        student: "Аружан",
        studentCode: "ST-ARUZ",
        classCode: DEMO_CLASS_CODE,
        topic: "quadratic",
        ts: Date.now() - 6 * 3600 * 1000,
      },
    ],
  };
}
