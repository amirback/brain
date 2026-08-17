"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type {
  AnswerLog, CustomTopic, Goal, HelpRequest, ParentState, Role, Space,
  StudentState, SubjectId, TeacherMaterial, TeacherState, TeacherTask,
} from "./types";
import { applyElo, eloDelta, makeCode, masteryStep, readiness, START_ELO } from "./engine";
import { defaultSubjects } from "./content";
import { demoSpace, DEMO_CLASS_CODE } from "./mock";

const LS_KEY = "brain.space.v2";

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

const emptySpace = (): Space => ({
  role: null,
  activeStudent: null,
  students: {},
  teacher: null,
  parent: null,
  helpRequests: [],
});

function freshStudent(
  name: string, grade: number, goal: Goal, subjects: SubjectId[], examDate: string | null
): StudentState {
  return {
    code: makeCode("ST"),
    name,
    grade,
    goal,
    subjects: subjects.length > 0 ? subjects : defaultSubjects(goal),
    activeSubject: (subjects[0] ?? defaultSubjects(goal)[0]),
    examDate,
    createdAt: Date.now(),
    classCode: null,
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

interface StoreCtx {
  space: Space;
  ready: boolean;
  /** The signed-in student, or the child a parent is looking at. */
  user: StudentState | null;
  viewedStudent: StudentState | null;
  role: Role | null;

  setRole: (r: Role) => void;
  createStudent: (a: { name: string; grade: number; goal: Goal; subjects: SubjectId[]; examDate: string | null }) => void;
  createTeacher: (a: { name: string; school: string; className: string; subject: SubjectId }) => void;
  createParent: (name: string) => void;
  joinClass: (classCode: string) => boolean;
  linkChild: (studentCode: string) => boolean;
  seedDemo: () => void;
  resetAll: () => void;
  switchRole: () => void;

  recordAnswer: (log: Omit<AnswerLog, "ts">) => { delta: number; elo: number };
  finishDiagnostic: () => void;
  finishCheckpoint: () => void;
  switchGoal: (goal: Goal, subjects: SubjectId[]) => number;
  setActiveSubject: (s: SubjectId) => void;
  addSubject: (s: SubjectId) => void;
  toggleTask: (id: string) => void;
  addTask: (t: Omit<TeacherTask, "id" | "done">) => void;
  addMaterial: (m: Omit<TeacherMaterial, "id">) => void;
  addCustomTopic: (c: Omit<CustomTopic, "id">) => void;
  requestHelp: (topic: string) => void;
  unlock: (a: string) => void;
  /** Students who joined the signed-in teacher's class. */
  classRoster: () => StudentState[];
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [space, setSpace] = useState<Space>(emptySpace);
  const [ready, setReady] = useState(false);
  const ref = useRef<Space>(emptySpace());

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Space;
        ref.current = parsed;
        setSpace(parsed);
      }
    } catch {
      // corrupted storage — start clean
    }
    setReady(true);
  }, []);

  // The ref is updated synchronously so two mutations in the same tick
  // (finish a session, then unlock a badge) both build on fresh state.
  const persist = useCallback((s: Space) => {
    ref.current = s;
    setSpace(s);
    window.localStorage.setItem(LS_KEY, JSON.stringify(s));
  }, []);

  const currentStudent = (s: Space): StudentState | null =>
    s.activeStudent ? (s.students[s.activeStudent] ?? null) : null;

  /** Applies a change to the signed-in student and writes the space back. */
  const mutateStudent = useCallback(
    (fn: (st: StudentState) => StudentState) => {
      const s = ref.current;
      const st = currentStudent(s);
      if (!st) return;
      persist({ ...s, students: { ...s.students, [st.code]: fn(st) } });
    },
    [persist]
  );

  /* ---------- active-time tracking ---------- */
  useEffect(() => {
    const TICK = 20;
    const iv = window.setInterval(() => {
      const s = ref.current;
      const st = currentStudent(s);
      if (!st || document.visibilityState !== "visible") return;
      const day = todayStr();
      persist({
        ...s,
        students: {
          ...s.students,
          [st.code]: {
            ...st,
            secondsByDay: { ...st.secondsByDay, [day]: (st.secondsByDay[day] ?? 0) + TICK },
            streakDates: st.streakDates.includes(day) ? st.streakDates : [...st.streakDates, day],
          },
        },
      });
    }, 20000);
    return () => window.clearInterval(iv);
  }, [persist]);

  /* ---------- identity ---------- */

  const setRole = useCallback((r: Role) => {
    persist({ ...ref.current, role: r });
  }, [persist]);

  const createStudent = useCallback(
    (a: { name: string; grade: number; goal: Goal; subjects: SubjectId[]; examDate: string | null }) => {
      const st = freshStudent(a.name, a.grade, a.goal, a.subjects, a.examDate);
      const s = ref.current;
      persist({
        ...s,
        role: "student",
        activeStudent: st.code,
        students: { ...s.students, [st.code]: st },
      });
    },
    [persist]
  );

  const createTeacher = useCallback(
    (a: { name: string; school: string; className: string; subject: SubjectId }) => {
      const teacher: TeacherState = { ...a, code: makeCode("CL"), createdAt: Date.now() };
      persist({ ...ref.current, role: "teacher", teacher });
    },
    [persist]
  );

  const createParent = useCallback((name: string) => {
    const parent: ParentState = { name, childCode: null };
    persist({ ...ref.current, role: "parent", parent });
  }, [persist]);

  /** A student types the code their teacher read out in class. */
  const joinClass = useCallback((classCode: string): boolean => {
    const s = ref.current;
    const st = currentStudent(s);
    const code = classCode.trim().toUpperCase();
    if (!st) return false;
    // In this MVP the only class that exists is the one held in this space,
    // plus the seeded demo class every account can join.
    const known = s.teacher?.code === code || code === DEMO_CLASS_CODE;
    if (!known) return false;
    persist({ ...s, students: { ...s.students, [st.code]: { ...st, classCode: code } } });
    return true;
  }, [persist]);

  /** A parent types the code shown in their child's profile. */
  const linkChild = useCallback((studentCode: string): boolean => {
    const s = ref.current;
    const code = studentCode.trim().toUpperCase();
    if (!s.students[code]) return false;
    persist({ ...s, parent: { name: s.parent?.name ?? "", childCode: code } });
    return true;
  }, [persist]);

  const seedDemo = useCallback(() => {
    persist(demoSpace());
  }, [persist]);

  const resetAll = useCallback(() => {
    persist(emptySpace());
  }, [persist]);

  /** Back to the role picker without wiping any profile. */
  const switchRole = useCallback(() => {
    persist({ ...ref.current, role: null });
  }, [persist]);

  /* ---------- learning ---------- */

  const recordAnswer = useCallback((log: Omit<AnswerLog, "ts">) => {
    const s = ref.current;
    const st = currentStudent(s);
    if (!st) return { delta: 0, elo: START_ELO };
    const delta = eloDelta(st.elo, log.difficulty, log.correct, log.mode);
    const elo = applyElo(st.elo, delta);
    const nextM = masteryStep(st.mastery[log.topic] ?? 0, log.correct, log.difficulty);
    const day = todayStr();
    const next: StudentState = {
      ...st,
      elo,
      eloHistory: [...st.eloHistory.slice(-120), { ts: Date.now(), elo }],
      mastery: { ...st.mastery, [log.topic]: nextM },
      attempts: { ...st.attempts, [log.topic]: (st.attempts[log.topic] ?? 0) + 1 },
      answers: [...st.answers.slice(-400), { ...log, ts: Date.now() }],
      streakDates: st.streakDates.includes(day) ? st.streakDates : [...st.streakDates, day],
    };
    next.forecastHistory = [
      ...st.forecastHistory.slice(-120),
      { ts: Date.now(), raw: readiness(next, next.activeSubject) },
    ];
    persist({ ...s, students: { ...s.students, [st.code]: next } });
    return { delta, elo };
  }, [persist]);

  const finishDiagnostic = useCallback(() => {
    mutateStudent((st) => ({ ...st, diagnosticDone: true }));
  }, [mutateStudent]);

  const finishCheckpoint = useCallback(() => {
    mutateStudent((st) => ({
      ...st,
      lastCheckpoint: Date.now(),
      achievements: st.achievements.includes("checkin") ? st.achievements : [...st.achievements, "checkin"],
    }));
  }, [mutateStudent]);

  // Switching the goal keeps every topic's mastery; it only changes which
  // subjects are on the plan. Returns how many topics carried over.
  const switchGoal = useCallback((goal: Goal, subjects: SubjectId[]): number => {
    const s = ref.current;
    const st = currentStudent(s);
    if (!st) return 0;
    const carried = Object.entries(st.mastery).filter(([, m]) => m > 0.1).length;
    const list = subjects.length > 0 ? subjects : defaultSubjects(goal);
    persist({
      ...s,
      students: {
        ...s.students,
        [st.code]: {
          ...st,
          goal,
          subjects: list,
          activeSubject: list.includes(st.activeSubject) ? st.activeSubject : list[0],
          goalSwitches: st.goalSwitches + 1,
        },
      },
    });
    return carried;
  }, [persist]);

  const setActiveSubject = useCallback((sub: SubjectId) => {
    mutateStudent((st) => ({ ...st, activeSubject: sub }));
  }, [mutateStudent]);

  const addSubject = useCallback((sub: SubjectId) => {
    mutateStudent((st) =>
      st.subjects.includes(sub) ? st : { ...st, subjects: [...st.subjects, sub], activeSubject: sub }
    );
  }, [mutateStudent]);

  const toggleTask = useCallback((id: string) => {
    mutateStudent((st) => ({
      ...st,
      tasks: st.tasks.map((x) => (x.id === id ? { ...x, done: !x.done } : x)),
    }));
  }, [mutateStudent]);

  /** A teacher assigns work: it lands with every student in their class. */
  const addTask = useCallback((task: Omit<TeacherTask, "id" | "done">) => {
    const s = ref.current;
    if (!s.teacher) return;
    const full: TeacherTask = { ...task, id: `t${Date.now()}`, done: false };
    const students = { ...s.students };
    for (const [code, st] of Object.entries(students)) {
      if (st.classCode === s.teacher.code) students[code] = { ...st, tasks: [...st.tasks, full] };
    }
    persist({ ...s, students });
  }, [persist]);

  const addMaterial = useCallback((m: Omit<TeacherMaterial, "id">) => {
    const s = ref.current;
    if (!s.teacher) return;
    const full: TeacherMaterial = { ...m, id: `m${Date.now()}` };
    const students = { ...s.students };
    for (const [code, st] of Object.entries(students)) {
      if (st.classCode === s.teacher.code) students[code] = { ...st, materials: [...st.materials, full] };
    }
    persist({ ...s, students });
  }, [persist]);

  const addCustomTopic = useCallback((c: Omit<CustomTopic, "id">) => {
    const s = ref.current;
    if (!s.teacher) return;
    const full: CustomTopic = { ...c, id: `c${Date.now()}` };
    const students = { ...s.students };
    for (const [code, st] of Object.entries(students)) {
      if (st.classCode === s.teacher.code) students[code] = { ...st, customTopics: [...st.customTopics, full] };
    }
    persist({ ...s, students });
  }, [persist]);

  const requestHelp = useCallback((topic: string) => {
    const s = ref.current;
    const st = currentStudent(s);
    if (!st) return;
    persist({
      ...s,
      helpRequests: [
        ...s.helpRequests,
        { id: `r${Date.now()}`, student: st.name, studentCode: st.code, classCode: st.classCode, topic, ts: Date.now() },
      ],
    });
  }, [persist]);

  const unlock = useCallback((a: string) => {
    mutateStudent((st) => (st.achievements.includes(a) ? st : { ...st, achievements: [...st.achievements, a] }));
  }, [mutateStudent]);

  const classRoster = useCallback((): StudentState[] => {
    const s = ref.current;
    if (!s.teacher) return [];
    return Object.values(s.students).filter((st) => st.classCode === s.teacher!.code);
  }, []);

  const user = currentStudent(space);
  // A parent sees a child only after linking one by code — never whichever
  // student happens to be signed in on this device.
  const viewedStudent =
    space.role === "parent"
      ? (space.parent?.childCode ? (space.students[space.parent.childCode] ?? null) : null)
      : user;

  return (
    <Ctx.Provider
      value={{
        space, ready, user, viewedStudent, role: space.role,
        setRole, createStudent, createTeacher, createParent, joinClass, linkChild,
        seedDemo, resetAll, switchRole,
        recordAnswer, finishDiagnostic, finishCheckpoint, switchGoal,
        setActiveSubject, addSubject, toggleTask, addTask, addMaterial,
        addCustomTopic, requestHelp, unlock, classRoster,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export { DEMO_CLASS_CODE };

export function useStore(): StoreCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("StoreProvider missing");
  return ctx;
}

/* ---------- derived helpers ---------- */

export function streakLength(dates: string[]): number {
  if (dates.length === 0) return 0;
  const set = new Set(dates);
  let len = 0;
  const d = new Date();
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
  return h === 0 ? `${m}${minLabel}` : `${h}${hourLabel} ${m}${minLabel}`;
}
