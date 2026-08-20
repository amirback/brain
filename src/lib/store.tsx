"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type {
  AnswerLog, ClassRecord, CustomTopic, Goal, InboxMessage, Lang, ParentState, Role, Space,
  StudentState, SubjectId, TeacherMaterial, TeacherState, TeacherTask,
} from "./types";
import type { Attempt } from "./exam/types";
import { applyElo, eloDelta, makeCode, masteryStep, readiness, START_ELO } from "./engine";
import { defaultSubjects } from "./content";
import { demoSpace, DEMO_CLASS_CODE, demoClassRecord } from "./mock";
import { todayStr } from "./store-helpers";
import { mockResultMessage, planMock } from "./advisor";
import { slimStudent } from "./share";
import { joinRoster, lookupClass, lookupStudent, publishClass, publishStudent, pullRoster } from "./sync";

export { todayStr };
export { streakLength, totalSeconds, weekSeconds, lastNDays, fmtHours } from "./store-helpers";
export { DEMO_CLASS_CODE };

const LS_KEY = "brain.space.v3";

const emptySpace = (): Space => ({
  role: null,
  activeStudent: null,
  students: {},
  // The demo class always exists, so a code is never a dead end.
  classes: { [DEMO_CLASS_CODE]: demoClassRecord() },
  pendingClass: null,
  teacher: null,
  parent: null,
  helpRequests: [],
});

function freshStudent(a: {
  name: string; email: string | null; grade: number; goal: Goal; subjects: SubjectId[]; examDate: string | null;
}): StudentState {
  const subjects = a.subjects.length > 0 ? a.subjects : defaultSubjects(a.goal);
  return {
    code: makeCode("ST"),
    email: a.email,
    name: a.name,
    grade: a.grade,
    goal: a.goal,
    subjects,
    activeSubject: subjects[0],
    examDate: a.examDate,
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
    mocks: [],
    inbox: [],
    examAttempts: [],
    lessonProgress: {},
    lastLesson: null,
    lastNudge: null,
  };
}

export interface JoinResult {
  ok: boolean;
  className?: string;
  teacherName?: string;
}

interface StoreCtx {
  space: Space;
  ready: boolean;
  user: StudentState | null;
  viewedStudent: StudentState | null;
  role: Role | null;

  setRole: (r: Role) => void;
  createStudent: (a: { name: string; email: string | null; grade: number; goal: Goal; subjects: SubjectId[]; examDate: string | null }) => void;
  createTeacher: (a: { name: string; email: string | null; school: string; className: string; subject: SubjectId }) => void;
  createParent: (a: { name: string; email: string | null }) => void;
  /** Signs back into a profile stored on this device by its email. */
  signInByEmail: (email: string) => Role | null;
  joinClass: (classCode: string) => Promise<JoinResult>;
  /** Joins a class carried inside an invite link — works on any device. */
  joinByInvite: (cls: ClassRecord) => JoinResult;
  /** Leaves the current class, keeping all progress. */
  leaveClass: () => void;
  linkChild: (studentCode: string) => Promise<boolean>;
  /** Stores a child snapshot that arrived through a share link. */
  adoptChild: (student: StudentState) => boolean;
  /** Restores a profile from a recovery link, on any device. */
  restoreProfile: (student: StudentState) => void;
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
  classRoster: () => StudentState[];
  /** Pulls classmates who joined from other devices. */
  refreshRoster: () => Promise<number>;

  saveLessonProgress: (topic: string, section: number) => void;
  /** Stores a finished SAT/IELTS attempt and returns it. */
  saveAttempt: (attempt: Attempt) => void;
  finishMock: (mockId: string, score: number, wrongQids: string[], lang: Lang) => void;
  syncInbox: (messages: InboxMessage[]) => void;
  markInboxRead: (id?: string) => void;
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
        // Older saves may predate the class registry; make sure it exists.
        if (!parsed.classes) parsed.classes = {};
        if (parsed.pendingClass === undefined) parsed.pendingClass = null;
        if (!parsed.classes[DEMO_CLASS_CODE]) parsed.classes[DEMO_CLASS_CODE] = demoClassRecord();
        ref.current = parsed;
        setSpace(parsed);
      }
    } catch {
      // corrupted storage — start clean
    }
    setReady(true);
  }, []);

  /**
   * Repair attempts saved before answer shuffling existed — see
   * `exam/migrate-attempts.ts`. Loaded dynamically and only when there is
   * something to repair, because the repair needs the question pools and those
   * are far too large to sit in the root layout's bundle.
   */
  // The ref is updated synchronously so two mutations in the same tick
  // (finish a session, then unlock a badge) both build on fresh state.
  const persist = useCallback((s: Space) => {
    ref.current = s;
    setSpace(s);
    window.localStorage.setItem(LS_KEY, JSON.stringify(s));
  }, []);

  useEffect(() => {
    if (!ready) return;
    const stale = Object.values(ref.current.students).some((st) =>
      (st.examAttempts ?? []).some((a) => !a.shuffled)
    );
    if (!stale) return;

    let cancelled = false;
    void import("./exam/migrate-attempts").then(({ migrateAttempts }) => {
      if (cancelled) return;
      const s = ref.current;
      const students = { ...s.students };
      let changed = false;
      for (const [id, st] of Object.entries(students)) {
        const out = migrateAttempts(st.examAttempts ?? []);
        if (out.changed) {
          students[id] = { ...st, examAttempts: out.attempts };
          changed = true;
        }
      }
      if (changed) persist({ ...s, students });
    });
    return () => { cancelled = true; };
  }, [ready, persist]);

  const currentStudent = (s: Space): StudentState | null =>
    s.activeStudent ? (s.students[s.activeStudent] ?? null) : null;

  // Snapshots go out at most once a minute, and only for students who joined
  // a class or handed out a parent code — nobody else needs to be reachable.
  const lastPush = useRef(0);
  const pushSnapshot = useCallback((st: StudentState, force = false) => {
    if (!force && Date.now() - lastPush.current < 60000) return;
    lastPush.current = Date.now();
    void publishStudent(st);
  }, []);

  // Returning the same object from `fn` means "nothing changed" — persisting
  // anyway would hand React a new reference every time and spin any effect
  // that depends on the student.
  const mutateStudent = useCallback(
    (fn: (st: StudentState) => StudentState) => {
      const s = ref.current;
      const st = currentStudent(s);
      if (!st) return;
      const next = fn(st);
      if (next === st) return;
      persist({ ...s, students: { ...s.students, [st.code]: next } });
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

  const createStudent = useCallback((a: {
    name: string; email: string | null; grade: number; goal: Goal; subjects: SubjectId[]; examDate: string | null;
  }) => {
    const s = ref.current;
    const st = freshStudent(a);
    // An invite opened before signing up applies to this brand-new profile.
    if (s.pendingClass && s.classes[s.pendingClass]) st.classCode = s.pendingClass;
    persist({
      ...s,
      role: "student",
      activeStudent: st.code,
      students: { ...s.students, [st.code]: st },
      pendingClass: null,
    });
  }, [persist]);

  /** Creating a teacher also registers their class, so the code is joinable. */
  const createTeacher = useCallback((a: {
    name: string; email: string | null; school: string; className: string; subject: SubjectId;
  }) => {
    const s = ref.current;
    const code = makeCode("CL");
    const teacher: TeacherState = { ...a, code, createdAt: Date.now() };
    const record: ClassRecord = {
      code,
      teacherName: a.name,
      school: a.school,
      className: a.className,
      subject: a.subject,
      createdAt: Date.now(),
    };
    persist({ ...s, role: "teacher", teacher, classes: { ...s.classes, [code]: record } });
    void publishClass(record);
  }, [persist]);

  const createParent = useCallback((a: { name: string; email: string | null }) => {
    const parent: ParentState = { name: a.name, email: a.email, childCode: null };
    persist({ ...ref.current, role: "parent", parent });
  }, [persist]);

  /** Finds a profile saved on this device by email and signs back into it. */
  const signInByEmail = useCallback((email: string): Role | null => {
    const s = ref.current;
    const needle = email.trim().toLowerCase();
    if (!needle) return null;
    const student = Object.values(s.students).find((st) => st.email?.toLowerCase() === needle);
    if (student) {
      persist({ ...s, role: "student", activeStudent: student.code });
      return "student";
    }
    if (s.teacher?.email?.toLowerCase() === needle) {
      persist({ ...s, role: "teacher" });
      return "teacher";
    }
    if (s.parent?.email?.toLowerCase() === needle) {
      persist({ ...s, role: "parent" });
      return "parent";
    }
    return null;
  }, [persist]);

  /**
   * A student types the code their teacher read out. The class is looked up
   * locally first, then in the shared store so a code from another device works.
   */
  const joinClass = useCallback(async (classCode: string): Promise<JoinResult> => {
    const s = ref.current;
    const st = currentStudent(s);
    const code = classCode.trim().toUpperCase();
    if (!st) return { ok: false };

    const record: ClassRecord | null = s.classes[code] ?? (await lookupClass(code));
    if (!record) return { ok: false };

    const classmate = Object.values(s.students).find((x) => x.classCode === code && x.code !== st.code);
    const joined: StudentState = {
      ...st,
      classCode: code,
      tasks: st.tasks.length > 0 ? st.tasks : (classmate?.tasks ?? []),
      materials: st.materials.length > 0 ? st.materials : (classmate?.materials ?? []),
      customTopics: st.customTopics.length > 0 ? st.customTopics : (classmate?.customTopics ?? []),
    };
    persist({
      ...ref.current,
      classes: { ...ref.current.classes, [code]: record },
      students: { ...ref.current.students, [st.code]: joined },
    });
    // Announce the student so the teacher's panel can find them.
    void joinRoster(code, st.code).then(() => pushSnapshot(joined, true));
    return { ok: true, className: record.className, teacherName: record.teacherName };
  }, [persist, pushSnapshot]);

  /** Leaves the current class without touching any progress. */
  const leaveClass = useCallback(() => {
    mutateStudent((st) => (st.classCode ? { ...st, classCode: null } : st));
  }, [mutateStudent]);

  /**
   * An invite link brings the class with it, so the class is registered here
   * even though this browser never saw the teacher who created it.
   */
  const joinByInvite = useCallback((cls: ClassRecord): JoinResult => {
    const s = ref.current;
    const st = currentStudent(s);
    const classes = { ...s.classes, [cls.code]: cls };
    if (!st) {
      // No profile yet: hold the invite so it lands on the next student created.
      persist({ ...s, classes, pendingClass: cls.code });
      return { ok: true, className: cls.className, teacherName: cls.teacherName };
    }
    const joined = { ...st, classCode: cls.code };
    persist({ ...s, classes, students: { ...s.students, [st.code]: joined } });
    void joinRoster(cls.code, st.code).then(() => pushSnapshot(joined, true));
    return { ok: true, className: cls.className, teacherName: cls.teacherName };
  }, [persist, pushSnapshot]);

  /** A shared snapshot of a child, opened by a parent on their own phone. */
  const adoptChild = useCallback((student: StudentState): boolean => {
    const s = ref.current;
    if (!student?.code) return false;
    persist({
      ...s,
      role: "parent",
      students: { ...s.students, [student.code]: student },
      parent: { name: s.parent?.name ?? "", email: s.parent?.email ?? null, childCode: student.code },
    });
    return true;
  }, [persist]);

  /** Recovery link: the profile travels inside the URL, so any device can take it. */
  const restoreProfile = useCallback((student: StudentState) => {
    const s = ref.current;
    persist({
      ...s,
      role: "student",
      activeStudent: student.code,
      students: { ...s.students, [student.code]: student },
    });
  }, [persist]);

  const linkChild = useCallback(async (studentCode: string): Promise<boolean> => {
    const s = ref.current;
    const code = studentCode.trim().toUpperCase();
    const child: StudentState | null = s.students[code] ?? (await lookupStudent(code));
    if (!child) return false;
    persist({
      ...ref.current,
      students: { ...ref.current.students, [code]: child },
      parent: { name: ref.current.parent?.name ?? "", email: ref.current.parent?.email ?? null, childCode: code },
    });
    return true;
  }, [persist]);

  const seedDemo = useCallback(() => persist(demoSpace()), [persist]);
  const resetAll = useCallback(() => persist(emptySpace()), [persist]);
  const switchRole = useCallback(() => persist({ ...ref.current, role: null }), [persist]);

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
    // The planner watches progress and schedules a mock once enough is covered.
    const mock = planMock(next);
    if (mock) next.mocks = [...next.mocks, mock];
    persist({ ...s, students: { ...s.students, [st.code]: next } });
    pushSnapshot(next);
    return { delta, elo };
  }, [persist]);

  const finishDiagnostic = useCallback(() => {
    mutateStudent((st) => {
      if (st.diagnosticDone) return st;
      const next = { ...st, diagnosticDone: true };
      pushSnapshot(next, true);
      return next;
    });
  }, [mutateStudent, pushSnapshot]);

  const finishCheckpoint = useCallback(() => {
    mutateStudent((st) => ({
      ...st,
      lastCheckpoint: Date.now(),
      achievements: st.achievements.includes("checkin") ? st.achievements : [...st.achievements, "checkin"],
    }));
  }, [mutateStudent]);

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
    mutateStudent((st) => (st.activeSubject === sub ? st : { ...st, activeSubject: sub }));
  }, [mutateStudent]);

  const addSubject = useCallback((sub: SubjectId) => {
    mutateStudent((st) =>
      st.subjects.includes(sub) ? st : { ...st, subjects: [...st.subjects, sub], activeSubject: sub }
    );
  }, [mutateStudent]);

  const toggleTask = useCallback((id: string) => {
    mutateStudent((st) => ({ ...st, tasks: st.tasks.map((x) => (x.id === id ? { ...x, done: !x.done } : x)) }));
  }, [mutateStudent]);

  /** Anything a teacher hands out lands with every student in their class. */
  const spreadToClass = useCallback((fn: (st: StudentState) => StudentState) => {
    const s = ref.current;
    if (!s.teacher) return;
    const students = { ...s.students };
    for (const [code, st] of Object.entries(students)) {
      if (st.classCode === s.teacher.code) students[code] = fn(st);
    }
    persist({ ...s, students });
  }, [persist]);

  const addTask = useCallback((task: Omit<TeacherTask, "id" | "done">) => {
    const full: TeacherTask = { ...task, id: `t${Date.now()}`, done: false };
    spreadToClass((st) => ({ ...st, tasks: [...st.tasks, full] }));
  }, [spreadToClass]);

  const addMaterial = useCallback((m: Omit<TeacherMaterial, "id">) => {
    const full: TeacherMaterial = { ...m, id: `m${Date.now()}` };
    spreadToClass((st) => ({ ...st, materials: [...st.materials, full] }));
  }, [spreadToClass]);

  const addCustomTopic = useCallback((c: Omit<CustomTopic, "id">) => {
    const full: CustomTopic = { ...c, id: `c${Date.now()}` };
    spreadToClass((st) => ({ ...st, customTopics: [...st.customTopics, full] }));
  }, [spreadToClass]);

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

  /** Pulls students who joined this class from other devices. */
  const refreshRoster = useCallback(async (): Promise<number> => {
    const s = ref.current;
    if (!s.teacher) return 0;
    const remote = await pullRoster(s.teacher.code);
    if (remote.length === 0) return 0;
    const students = { ...ref.current.students };
    let added = 0;
    for (const r of remote) {
      if (!students[r.code]) added += 1;
      students[r.code] = { ...r, classCode: s.teacher.code };
    }
    persist({ ...ref.current, students });
    return added;
  }, [persist]);

  const saveLessonProgress = useCallback((topic: string, section: number) => {
    mutateStudent((st) => {
      const reached = Math.max(st.lessonProgress[topic] ?? 0, section);
      if (reached === (st.lessonProgress[topic] ?? 0) && st.lastLesson === topic) return st;
      return { ...st, lessonProgress: { ...st.lessonProgress, [topic]: reached }, lastLesson: topic };
    });
  }, [mutateStudent]);

  /**
   * Attempts carry the student's own writing, so the list is capped — twenty full
   * essays is already generous next to a 5 MB localStorage budget.
   */
  const saveAttempt = useCallback((attempt: Attempt) => {
    mutateStudent((st) => ({
      ...st,
      examAttempts: [{ ...attempt, shuffled: true as const }, ...(st.examAttempts ?? [])].slice(0, 20),
    }));
  }, [mutateStudent]);

  const finishMock = useCallback((mockId: string, score: number, wrongQids: string[], lang: Lang) => {
    const s = ref.current;
    const st = currentStudent(s);
    if (!st) return;
    const mocks = st.mocks.map((m) =>
      m.id === mockId ? { ...m, status: "done" as const, score, wrongQids, takenAt: Date.now() } : m
    );
    const done = mocks.find((m) => m.id === mockId);
    const inbox = done ? [mockResultMessage(done, lang), ...st.inbox] : st.inbox;
    persist({ ...s, students: { ...s.students, [st.code]: { ...st, mocks, inbox } } });
  }, [persist]);

  const syncInbox = useCallback((messages: InboxMessage[]) => {
    if (messages.length === 0) return;
    mutateStudent((st) => {
      const known = new Set(st.inbox.map((m) => m.id));
      const fresh = messages.filter((m) => !known.has(m.id));
      if (fresh.length === 0) return st;
      const nudged = fresh.some((m) => m.kind === "motivation");
      return {
        ...st,
        inbox: [...fresh, ...st.inbox].slice(0, 40),
        lastNudge: nudged ? todayStr() : st.lastNudge,
      };
    });
  }, [mutateStudent]);

  const markInboxRead = useCallback((id?: string) => {
    mutateStudent((st) => {
      if (!st.inbox.some((m) => (!id || m.id === id) && !m.read)) return st;
      return { ...st, inbox: st.inbox.map((m) => (!id || m.id === id ? { ...m, read: true } : m)) };
    });
  }, [mutateStudent]);

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
        setRole, createStudent, createTeacher, createParent, signInByEmail,
        joinClass, joinByInvite, leaveClass, linkChild, adoptChild, restoreProfile,
        seedDemo, resetAll, switchRole,
        recordAnswer, finishDiagnostic, finishCheckpoint, switchGoal,
        setActiveSubject, addSubject, toggleTask, addTask, addMaterial,
        addCustomTopic, requestHelp, unlock, classRoster, refreshRoster,
        saveLessonProgress, saveAttempt, finishMock, syncInbox, markInboxRead,
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
