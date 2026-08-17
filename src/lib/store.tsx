"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { AnswerLog, Goal, TeacherTask, TeacherMaterial, CustomTopic, UserState } from "./types";
import { applyElo, eloDelta, forecast, masteryStep, START_ELO } from "./engine";
import { demoSeed } from "./mock";

const LS_KEY = "brain.user.v1";
const LS_REQ = "brain.help-requests.v1";

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function freshUser(name: string, grade: number, goal: Goal, examDate: string | null): UserState {
  return {
    name,
    grade,
    goal,
    examDate,
    createdAt: Date.now(),
    elo: START_ELO,
    eloHistory: [{ ts: Date.now(), elo: START_ELO }],
    mastery: {},
    attempts: {},
    answers: [],
    forecastHistory: [],
    streakDates: [],
    secondsByDay: {},
    lastCheckpoint: null,
    diagnosticDone: false,
    goalSwitches: 0,
    tasks: [],
    materials: [],
    customTopics: [],
    achievements: [],
  };
}

export interface HelpRequest {
  id: string;
  student: string;
  topic: string;
  ts: number;
}

interface StoreCtx {
  user: UserState | null;
  ready: boolean;
  createUser: (name: string, grade: number, goal: Goal, examDate: string | null) => void;
  seedDemo: () => void;
  resetAll: () => void;
  recordAnswer: (log: Omit<AnswerLog, "ts">) => { delta: number; elo: number };
  finishDiagnostic: () => void;
  finishCheckpoint: () => void;
  switchGoal: (goal: Goal) => number;
  toggleTask: (id: string) => void;
  addTask: (t: Omit<TeacherTask, "id" | "done">) => void;
  addMaterial: (m: Omit<TeacherMaterial, "id">) => void;
  addCustomTopic: (c: Omit<CustomTopic, "id">) => void;
  requestHelp: (topic: string) => void;
  helpRequests: HelpRequest[];
  unlock: (a: string) => void;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserState | null>(null);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [ready, setReady] = useState(false);
  const userRef = useRef<UserState | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UserState;
        userRef.current = parsed;
        setUser(parsed);
      }
      const req = window.localStorage.getItem(LS_REQ);
      if (req) setHelpRequests(JSON.parse(req));
    } catch {
      // corrupted storage — start clean
    }
    setReady(true);
  }, []);

  // The ref is updated synchronously, not just on the next render, so two
  // mutations fired in the same tick (finish a session, then unlock a badge)
  // both build on fresh state instead of the second clobbering the first.
  const persist = useCallback((u: UserState | null) => {
    userRef.current = u;
    setUser(u);
    if (u) window.localStorage.setItem(LS_KEY, JSON.stringify(u));
    else window.localStorage.removeItem(LS_KEY);
  }, []);

  const persistReq = useCallback((r: HelpRequest[]) => {
    setHelpRequests(r);
    window.localStorage.setItem(LS_REQ, JSON.stringify(r));
  }, []);

  // Active-time tracking: while the tab is visible, add seconds to today's
  // bucket and keep the streak date list fresh. Persists every tick.
  useEffect(() => {
    const TICK = 20;
    const iv = window.setInterval(() => {
      const u = userRef.current;
      if (!u || document.visibilityState !== "visible") return;
      const day = todayStr();
      const next: UserState = {
        ...u,
        secondsByDay: { ...u.secondsByDay, [day]: (u.secondsByDay[day] ?? 0) + TICK },
        streakDates: u.streakDates.includes(day) ? u.streakDates : [...u.streakDates, day],
      };
      persist(next);
    }, 20000);
    return () => window.clearInterval(iv);
  }, [persist]);

  const createUser = useCallback((name: string, grade: number, goal: Goal, examDate: string | null) => {
    persist(freshUser(name, grade, goal, examDate));
  }, [persist]);

  const seedDemo = useCallback(() => {
    persist(demoSeed());
  }, [persist]);

  const resetAll = useCallback(() => {
    persist(null);
    persistReq([]);
  }, [persist, persistReq]);

  const recordAnswer = useCallback((log: Omit<AnswerLog, "ts">) => {
    const u = userRef.current;
    if (!u) return { delta: 0, elo: START_ELO };
    const delta = eloDelta(u.elo, log.difficulty, log.correct, log.mode);
    const elo = applyElo(u.elo, delta);
    const prevM = u.mastery[log.topic] ?? 0;
    const nextM = masteryStep(prevM, log.correct, log.difficulty);
    const day = todayStr();
    const next: UserState = {
      ...u,
      elo,
      eloHistory: [...u.eloHistory.slice(-120), { ts: Date.now(), elo }],
      mastery: { ...u.mastery, [log.topic]: nextM },
      attempts: { ...u.attempts, [log.topic]: (u.attempts[log.topic] ?? 0) + 1 },
      answers: [...u.answers.slice(-400), { ...log, ts: Date.now() }],
      streakDates: u.streakDates.includes(day) ? u.streakDates : [...u.streakDates, day],
    };
    next.forecastHistory = [...u.forecastHistory.slice(-120), { ts: Date.now(), score: forecast(next) }];
    persist(next);
    return { delta, elo };
  }, [persist]);

  const finishDiagnostic = useCallback(() => {
    const u = userRef.current;
    if (!u) return;
    persist({ ...u, diagnosticDone: true });
  }, [persist]);

  const finishCheckpoint = useCallback(() => {
    const u = userRef.current;
    if (!u) return;
    const ach = u.achievements.includes("checkin") ? u.achievements : [...u.achievements, "checkin"];
    persist({ ...u, lastCheckpoint: Date.now(), achievements: ach });
  }, [persist]);

  // The headline feature: switching the goal keeps every topic's mastery.
  // Returns how many topics carried over, for the confirmation screen.
  const switchGoal = useCallback((goal: Goal): number => {
    const u = userRef.current;
    if (!u) return 0;
    const carried = Object.entries(u.mastery).filter(([, m]) => m > 0.1).length;
    persist({ ...u, goal, goalSwitches: u.goalSwitches + 1 });
    return carried;
  }, [persist]);

  const toggleTask = useCallback((id: string) => {
    const u = userRef.current;
    if (!u) return;
    persist({ ...u, tasks: u.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) });
  }, [persist]);

  const addTask = useCallback((t: Omit<TeacherTask, "id" | "done">) => {
    const u = userRef.current;
    if (!u) return;
    persist({ ...u, tasks: [...u.tasks, { ...t, id: `t${Date.now()}`, done: false }] });
  }, [persist]);

  const addMaterial = useCallback((m: Omit<TeacherMaterial, "id">) => {
    const u = userRef.current;
    if (!u) return;
    persist({ ...u, materials: [...u.materials, { ...m, id: `m${Date.now()}` }] });
  }, [persist]);

  const addCustomTopic = useCallback((c: Omit<CustomTopic, "id">) => {
    const u = userRef.current;
    if (!u) return;
    persist({ ...u, customTopics: [...u.customTopics, { ...c, id: `c${Date.now()}` }] });
  }, [persist]);

  const requestHelp = useCallback((topic: string) => {
    const u = userRef.current;
    persistReq([...helpRequests, { id: `r${Date.now()}`, student: u?.name ?? "—", topic, ts: Date.now() }]);
  }, [helpRequests, persistReq]);

  const unlock = useCallback((a: string) => {
    const u = userRef.current;
    if (!u || u.achievements.includes(a)) return;
    persist({ ...u, achievements: [...u.achievements, a] });
  }, [persist]);

  return (
    <Ctx.Provider
      value={{
        user, ready, createUser, seedDemo, resetAll, recordAnswer,
        finishDiagnostic, finishCheckpoint, switchGoal, toggleTask,
        addTask, addMaterial, addCustomTopic, requestHelp, helpRequests, unlock,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStore(): StoreCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("StoreProvider missing");
  return ctx;
}

// ---------- derived helpers ----------

export function streakLength(dates: string[]): number {
  if (dates.length === 0) return 0;
  const set = new Set(dates);
  let len = 0;
  const d = new Date();
  // streak counts up to today, or up to yesterday if today has no activity yet
  if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
  while (set.has(d.toISOString().slice(0, 10))) {
    len += 1;
    d.setDate(d.getDate() - 1);
  }
  return len;
}

export function totalSeconds(byDay: Record<string, number>): number {
  return Object.values(byDay).reduce((a, b) => a + b, 0);
}

export function weekSeconds(byDay: Record<string, number>): number {
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    sum += byDay[d.toISOString().slice(0, 10)] ?? 0;
  }
  return sum;
}

export function lastNDays(byDay: Record<string, number>, n: number): { date: string; seconds: number }[] {
  const out: { date: string; seconds: number }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({ date: key, seconds: byDay[key] ?? 0 });
  }
  return out;
}

export function fmtHours(seconds: number, hourLabel: string, minLabel: string): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h === 0) return `${m}${minLabel}`;
  return `${h}${hourLabel} ${m}${minLabel}`;
}
