import type { MockStudent } from "./types";

// Demo classmates for the league and the teacher panel.
// Names are common Kazakhstani names; numbers are hand-tuned so the
// class looks alive: a couple of leaders, a solid middle, someone stuck.

export const CLASSMATES: MockStudent[] = [
  {
    id: "m1", name: "Айым", elo: 1512, hours: 47.5, streak: 21, lastActiveDays: 0,
    mastery: { linear: 0.92, quadratic: 0.81, functions: 0.77 },
  },
  {
    id: "m2", name: "Данияр", elo: 1288, hours: 31.2, streak: 6, lastActiveDays: 0,
    mastery: { linear: 0.85, quadratic: 0.64, functions: 0.58 },
  },
  {
    id: "m3", name: "Томирис", elo: 1174, hours: 26.8, streak: 12, lastActiveDays: 1,
    mastery: { linear: 0.78, quadratic: 0.55, functions: 0.61 },
  },
  {
    id: "m4", name: "Алишер", elo: 1051, hours: 19.4, streak: 3, lastActiveDays: 0,
    mastery: { linear: 0.71, quadratic: 0.48, functions: 0.35 },
  },
  {
    id: "m5", name: "Аружан", elo: 967, hours: 22.1, streak: 9, lastActiveDays: 2,
    mastery: { linear: 0.66, quadratic: 0.31, functions: 0.52 }, stuck: "quadratic",
  },
  {
    id: "m6", name: "Мирас", elo: 902, hours: 12.7, streak: 1, lastActiveDays: 0,
    mastery: { linear: 0.58, quadratic: 0.36, functions: 0.29 },
  },
  {
    id: "m7", name: "Санжар", elo: 845, hours: 9.3, streak: 0, lastActiveDays: 4,
    mastery: { linear: 0.44, quadratic: 0.22, functions: 0.31 }, stuck: "linear",
  },
  {
    id: "m8", name: "Инкар", elo: 793, hours: 6.9, streak: 2, lastActiveDays: 1,
    mastery: { linear: 0.39, quadratic: 0.18, functions: 0.24 },
  },
];

// A rich pre-baked profile so "demo mode" instantly shows a lived-in dashboard.
// Three weeks of history: an unbroken 9-day streak up to today, with gaps
// before it, adding up to ~47.5 hours of tracked study time.
const SESSIONS: [number, number][] = [
  [0, 1860], [1, 7200], [2, 5400], [3, 9000], [4, 6300], [5, 8100], [6, 4500], [7, 10800], [8, 7200],
  [10, 9000], [11, 7200], [13, 10800], [14, 6300], [15, 8100], [17, 9000], [18, 12600], [19, 7200],
  [20, 9000], [22, 9000], [23, 7200], [25, 8100], [26, 7200],
];

export function demoSeed() {
  const now = Date.now();
  const day = 24 * 3600 * 1000;
  const dstr = (offset: number) => new Date(now - offset * day).toISOString().slice(0, 10);
  const secondsByDay: Record<string, number> = {};
  for (const [offset, secs] of SESSIONS) secondsByDay[dstr(offset)] = secs;
  return {
    name: "Амир",
    grade: 9,
    goal: "ent" as const,
    examDate: new Date(now + 290 * day).toISOString().slice(0, 10),
    createdAt: now - 9 * day,
    elo: 1147,
    eloHistory: [
      { ts: now - 9 * day, elo: 800 },
      { ts: now - 8 * day, elo: 872 },
      { ts: now - 7 * day, elo: 918 },
      { ts: now - 6 * day, elo: 987 },
      { ts: now - 5 * day, elo: 1024 },
      { ts: now - 4 * day, elo: 1061 },
      { ts: now - 3 * day, elo: 1090 },
      { ts: now - 2 * day, elo: 1118 },
      { ts: now - 1 * day, elo: 1132 },
      { ts: now, elo: 1147 },
    ],
    mastery: { linear: 0.82, quadratic: 0.47, functions: 0.63 },
    attempts: { linear: 14, quadratic: 11, functions: 9 },
    answers: [],
    // Tracks what forecast() computes from the mastery/elo below, so the
    // dashboard number and its weekly delta agree with the trend line.
    forecastHistory: [
      { ts: now - 9 * day, score: 18 },
      { ts: now - 8 * day, score: 20 },
      { ts: now - 6 * day, score: 25 },
      { ts: now - 4 * day, score: 27 },
      { ts: now - 2 * day, score: 29 },
      { ts: now, score: 31 },
    ],
    streakDates: [dstr(8), dstr(7), dstr(6), dstr(5), dstr(4), dstr(3), dstr(2), dstr(1), dstr(0)],
    secondsByDay,
    lastCheckpoint: now - 5 * day,
    diagnosticDone: true,
    goalSwitches: 0,
    tasks: [],
    materials: [],
    customTopics: [],
    achievements: ["firstDiag", "streak3", "elo1000", "mastered", "checkin"],
  };
}
