"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { fmtHours, lastNDays, streakLength, totalSeconds, useStore, weekSeconds } from "@/lib/store";
import { subjectById, topicById, topicsOf } from "@/lib/content";
import { checkpointDue, daysUntilCheckpoint, formatForecast, masteryBand, readiness, recommend } from "@/lib/engine";
import { advise, buildMessages } from "@/lib/advisor";
import type { JoinResult } from "@/lib/store";
import { Bar, Btn, Card, MiniBars, Modal, Reveal, Ring, Sparkline } from "@/components/ui";
import {
  IconArrow, IconBolt, IconBook, IconCheck, IconClock, IconFlame, IconMap,
  IconRefresh, IconSpark, IconTarget, IconTeacher, IconTrend, IconTrophy,
} from "@/components/Icons";

export default function Dashboard() {
  const { d, pick, lang } = useI18n();
  const { user, ready, role, toggleTask, setActiveSubject, joinClass, space, syncInbox } = useStore();
  const router = useRouter();
  const [joinOpen, setJoinOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/start");
    else if (role === "teacher") router.replace("/teacher");
    else if (role === "parent") router.replace("/parent");
  }, [ready, user, role, router]);

  // Opening the dashboard is when reminders get generated.
  useEffect(() => {
    if (!user || role !== "student") return;
    syncInbox(buildMessages(user, lang));
    // Runs on entry only: syncInbox writes to `user`, so watching it would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, lang]);

  const derived = useMemo(() => {
    if (!user) return null;
    const subject = user.activeSubject;
    const streak = streakLength(user.streakDates);
    const total = totalSeconds(user.secondsByDay);
    const week = weekSeconds(user.secondsByDay);
    const days = lastNDays(user.secondsByDay, 14);
    const raw = readiness(user, subject);
    const view = formatForecast(raw, user.goal);
    const weekAgo = user.forecastHistory.find((p) => p.ts > Date.now() - 7 * 864e5);
    const delta = weekAgo ? view.numeric - formatForecast(weekAgo.raw, user.goal).numeric : 0;
    const recs = recommend(user, subject);
    const weak = topicsOf(subject)
      .map((tp) => ({ t: tp, m: user.mastery[tp.id] ?? 0, a: user.attempts[tp.id] ?? 0 }))
      .filter((x) => x.a > 0 && x.m < 0.7)
      .sort((a, b) => a.m - b.m);
    const rivals = Object.values(space.students).filter((s) => s.code !== user.code);
    const rival = [...rivals].sort((a, b) => a.elo - b.elo).find((c) => c.elo > user.elo) ?? null;
    const dueCheckpoint = checkpointDue(user.lastCheckpoint, user.createdAt);
    const mock = user.mocks.find((mk) => mk.status === "scheduled") ?? null;
    const mockDays = mock ? Math.ceil((mock.dueAt - Date.now()) / 864e5) : null;
    const lastMock = [...user.mocks].filter((mk) => mk.status === "done").sort((a, b) => (b.takenAt ?? 0) - (a.takenAt ?? 0))[0] ?? null;
    const unread = user.inbox.filter((mm) => !mm.read).length;
    const tip = advise(user)[0] ?? null;
    const resume = user.lastLesson ? topicById(user.lastLesson) : null;
    const daysLeft = user.examDate
      ? Math.max(0, Math.ceil((new Date(user.examDate).getTime() - Date.now()) / 864e5))
      : null;
    return {
      subject, streak, total, week, days, view, delta, recs, weak, rival,
      dueCheckpoint, daysLeft, mock, mockDays, lastMock, unread, tip, resume,
    };
  }, [user, space]);

  if (!ready || !user || !derived) return null;

  const goalLabel = d.start.goals[user.goal].t;
  const forecastUnit =
    user.goal === "sat" ? d.dash.forecastUnitSat : user.goal === "ielts" ? d.dash.forecastUnitIelts : d.dash.forecastUnit;
  const openTasks = user.tasks.filter((t) => !t.done);

  if (!user.diagnosticDone) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-3xl border border-line2 bg-card">
          <IconTarget size={26} />
        </div>
        <h1 className="font-display text-2xl font-extrabold">
          {d.dash.hello}, {user.name}
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-mute">{d.dash.noDiag}</p>
        <Btn href="/diagnostic" size="lg" className="mt-6">
          {d.dash.goDiag}
        </Btn>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[clamp(26px,5vw,38px)] font-extrabold tracking-[-0.02em]">
              {d.dash.hello}, {user.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[12.5px]">
              <span className="rounded-full border border-line2 px-2.5 py-1 font-semibold text-mute">{goalLabel}</span>
              {derived.daysLeft !== null && (
                <span className="rounded-full border border-brand/40 bg-brand/8 px-2.5 py-1 font-semibold text-brand tabular-nums">
                  {derived.daysLeft} {d.dash.daysToExam}
                </span>
              )}
              <span className="rounded-full border border-line2 px-2.5 py-1 font-semibold text-mute tabular-nums">
                {user.grade} {d.start.gradeSuffix}
              </span>
            </div>
          </div>
          <Btn href="/league" variant="outline" size="sm" className="arrow-slide">
            <IconTrophy size={15} />
            {d.nav.leaderboard}
          </Btn>
        </div>
      </Reveal>

      {/* subject tabs */}
      <Reveal delay={30}>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {user.subjects.map((s) => {
            const sub = subjectById(s);
            const active = s === derived.subject;
            return (
              <button
                key={s}
                onClick={() => setActiveSubject(s)}
                className={`press rounded-2xl border px-4 py-2.5 text-[13.5px] font-bold transition-colors ${
                  active ? "border-brand bg-brand text-ink" : "border-line bg-card text-mute hover:border-line2 hover:text-paper"
                }`}
              >
                {sub ? pick(sub.title) : s}
              </button>
            );
          })}
          <Link
            href="/profile"
            className="press rounded-2xl border border-dashed border-line2 px-4 py-2.5 text-[13.5px] font-bold text-dim hover:border-brand hover:text-brand"
          >
            + {d.subjects.add}
          </Link>
        </div>
      </Reveal>

      {/* class link status — this is how a teacher can see this student at all */}
      {!user.classCode && (
        <Reveal delay={50}>
          <Card className="mt-4 border-amber/35 bg-amber/6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber/15 text-amber">
                <IconTeacher size={21} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-[15px] font-bold">{d.codes.notInClass}</h3>
                <p className="mt-1 text-[13.5px] leading-relaxed text-mute">{d.codes.notInClassHint}</p>
              </div>
              <Btn size="sm" onClick={() => setJoinOpen(true)} className="w-full shrink-0 sm:w-auto">
                {d.codes.joinCta}
              </Btn>
            </div>
          </Card>
        </Reveal>
      )}

      {/* stats */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal delay={40}>
          <Card className="h-full">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.dash.eloTitle}</span>
              <IconBolt size={16} />
            </div>
            <div className="font-display mt-1.5 text-3xl font-extrabold tabular-nums">{user.elo}</div>
            <div className="mt-2 -mb-1">
              <Sparkline points={user.eloHistory.slice(-14).map((p) => p.elo)} h={40} />
            </div>
          </Card>
        </Reveal>

        <Reveal delay={80}>
          <Card className="h-full">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.dash.streakTitle}</span>
              <IconFlame size={16} />
            </div>
            <div className="font-display mt-1.5 flex items-end gap-2 text-3xl font-extrabold tabular-nums">
              {derived.streak}
              <span className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-dim">{d.dash.streakUnit}</span>
            </div>
            <div className="mt-3 flex gap-1">
              {derived.days.slice(-7).map((day) => (
                <span
                  key={day.date}
                  className="h-6 flex-1 rounded-md"
                  style={{ background: day.seconds > 0 ? "#ff5c00" : "#2a2c33" }}
                  title={day.date}
                />
              ))}
            </div>
          </Card>
        </Reveal>

        <Reveal delay={120}>
          <Card className="h-full">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.dash.hours}</span>
              <IconClock size={16} />
            </div>
            <div className="font-display mt-1.5 text-3xl font-extrabold tabular-nums">
              {(derived.total / 3600).toFixed(1)}
              <span className="text-lg text-dim">{d.common.hour}</span>
            </div>
            <div className="mt-1 text-[12px] text-dim">
              {fmtHours(derived.week, d.common.hour, d.common.min)} · {d.dash.hoursWeek}
            </div>
          </Card>
        </Reveal>

        <Reveal delay={160}>
          <Card className="h-full">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.dash.forecast}</span>
              <IconTrend size={16} />
            </div>
            <div className="font-display mt-1.5 flex items-end gap-2 text-3xl font-extrabold tabular-nums">
              {derived.view.value}
              <span className="mb-1 text-lg text-dim">/ {derived.view.max}</span>
              {derived.delta !== 0 && (
                <span className={`mb-1.5 text-[12px] font-bold ${derived.delta > 0 ? "text-brand" : "text-dim"}`}>
                  {derived.delta > 0 ? "+" : ""}
                  {derived.delta}
                </span>
              )}
            </div>
            <div className="mt-1 text-[12px] text-dim">{forecastUnit}</div>
          </Card>
        </Reveal>
      </div>

      {/* what the mentor says today */}
      {derived.tip && (
        <Reveal delay={60}>
          <Card className="mt-3 border-brand/30 bg-brand/5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-start gap-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/12 text-brand">
                  <IconSpark size={19} />
                </span>
                <p className="pt-0.5 text-[14px] leading-relaxed text-mute">{pick(derived.tip.text)}</p>
              </div>
              <Btn href="/assistant" size="sm" variant="outline" className="w-full shrink-0 sm:w-auto">
                {d.assistant.open}
              </Btn>
            </div>
          </Card>
        </Reveal>
      )}

      {/* scheduled mock test with its deadline */}
      {derived.mock && (
        <Reveal delay={70}>
          <Card className={`mt-3 ${derived.mockDays !== null && derived.mockDays <= 1 ? "border-amber/45 bg-amber/6" : ""}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-start gap-3.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-amber/40 bg-amber/12 text-amber">
                  <IconClock size={20} />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-[15px] font-bold">{d.mock.scheduled}</h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-mute">
                    {derived.mock.size} {d.mock.questions} ·{" "}
                    {derived.mockDays !== null && derived.mockDays > 0
                      ? `${d.mock.dueIn} ${derived.mockDays} ${d.common.day}`
                      : derived.mockDays === 0
                        ? d.mock.dueToday
                        : d.mock.overdue}
                  </p>
                </div>
              </div>
              <Btn href={`/practice?mock=${derived.mock.id}`} size="sm" className="w-full shrink-0 sm:w-auto">
                {d.mock.start}
              </Btn>
            </div>
          </Card>
        </Reveal>
      )}

      {/* resume the lesson the student left */}
      {derived.resume && (
        <Reveal delay={75}>
          <Link href={`/learn?t=${derived.resume.id}`} className="group mt-3 block">
            <Card hover className="flex items-center gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-line2 bg-soot text-mute">
                <IconBook size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-dim">{d.lesson.resumeSub}</span>
                <span className="mt-0.5 block truncate text-[15px] font-bold">{pick(derived.resume.title)}</span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-[12.5px] font-bold text-brand">
                <span className="hidden sm:inline">{d.lesson.resume}</span>
                <IconArrow size={14} />
              </span>
            </Card>
          </Link>
        </Reveal>
      )}

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.35fr_1fr]">
        <div className="flex flex-col gap-3">
          <Reveal delay={80}>
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold">{d.dash.yourPlan}</h2>
                <span className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.common.today}</span>
              </div>
              <div className="flex flex-col gap-2">
                {derived.recs.map((r, i) => {
                  const t = topicById(r.topic);
                  if (!t) return null;
                  const m = user.mastery[r.topic] ?? 0;
                  const label = r.kind === "start" ? d.dash.startTopic : r.kind === "review" ? d.dash.repeatTopic : d.dash.continueTopic;
                  return (
                    <Link
                      key={r.topic}
                      href={`/learn?t=${r.topic}`}
                      className="group flex items-center gap-4 rounded-2xl border border-line bg-coal p-3.5 press hover:border-brand/50 hover:bg-brand/5"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line2 bg-soot text-[13px] font-extrabold tabular-nums text-mute">
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-bold">{pick(t.title)}</span>
                        <span className="mt-1.5 block">
                          <Bar value={m} h={5} tone={m < 0.35 ? "dim" : m < 0.7 ? "amber" : "brand"} />
                        </span>
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1.5 text-[12.5px] font-bold text-brand">
                        <span className="hidden sm:inline">{label}</span>
                        <IconArrow size={14} />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </Card>
          </Reveal>

          <Reveal delay={120}>
            <Card className={derived.dueCheckpoint ? "border-brand/45 bg-brand/6" : ""}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl border ${
                      derived.dueCheckpoint ? "border-brand/40 bg-brand/12 text-brand" : "border-line2 bg-soot text-mute"
                    }`}
                  >
                    <IconRefresh size={21} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-[15px] font-bold">{d.dash.checkpoint}</h3>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-mute">
                      {derived.dueCheckpoint
                        ? d.dash.checkpointDue
                        : `${d.dash.checkpointFresh} ${daysUntilCheckpoint(user.lastCheckpoint, user.createdAt)} ${d.common.day}`}
                    </p>
                  </div>
                </div>
                {derived.dueCheckpoint && (
                  <Btn href="/practice?mode=checkpoint" size="sm" className="w-full shrink-0 sm:w-auto">
                    {d.dash.checkpointCta}
                  </Btn>
                )}
              </div>
            </Card>
          </Reveal>

          <Reveal delay={160}>
            <Card>
              <h2 className="font-display mb-3.5 text-lg font-bold">{d.dash.tasksTitle}</h2>
              {user.tasks.length === 0 ? (
                <p className="text-[13.5px] leading-relaxed text-dim">{d.dash.tasksEmpty}</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {user.tasks.map((t) => {
                    const topic = topicById(t.topic);
                    return (
                      <button
                        key={t.id}
                        onClick={() => toggleTask(t.id)}
                        className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left press ${
                          t.done ? "border-line bg-coal/50 opacity-60" : "border-line bg-coal hover:border-line2"
                        }`}
                      >
                        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 ${t.done ? "border-brand bg-brand" : "border-line2"}`}>
                          {t.done && (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#121317" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={`block truncate text-[14.5px] font-semibold ${t.done ? "line-through" : ""}`}>{t.title}</span>
                          <span className="mt-0.5 block text-[12px] text-dim">
                            {topic ? pick(topic.title) : t.topic} · {d.dash.taskDue} {t.due} · {t.from}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
              {openTasks.length > 0 && (
                <div className="mt-3 text-[12px] text-dim tabular-nums">
                  {openTasks.length} / {user.tasks.length}
                </div>
              )}
            </Card>
          </Reveal>
        </div>

        <div className="flex flex-col gap-3">
          <Reveal delay={100}>
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display flex items-center gap-2 text-lg font-bold">
                  <IconMap size={18} />
                  {d.dash.mapTitle}
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  ...topicsOf(derived.subject).map((t) => ({ id: t.id, title: pick(t.title) })),
                  ...user.customTopics
                    .filter((c) => c.subject === derived.subject)
                    .map((c) => ({ id: c.id, title: c.name })),
                ].map((t) => {
                  const m = user.mastery[t.id] ?? 0;
                  const a = user.attempts[t.id] ?? 0;
                  const band = masteryBand(m, a);
                  const tone = { none: "dim", weak: "dim", mid: "amber", strong: "brand" } as const;
                  return (
                    <Link key={t.id} href={`/learn?t=${t.id}`} className="group block">
                      <div className="mb-1.5 flex items-baseline justify-between gap-3">
                        <span className="truncate text-[14px] font-semibold transition-colors group-hover:text-brand">{t.title}</span>
                        <span className="shrink-0 text-[11.5px] font-bold tabular-nums text-dim">
                          {a === 0 ? "—" : `${Math.round(m * 100)}%`}
                        </span>
                      </div>
                      <Bar value={m} tone={tone[band]} h={7} />
                    </Link>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-line pt-3.5 text-[11px] text-dim">
                {[
                  { c: "#ff5c00", l: d.dash.mapLegend.strong },
                  { c: "#ffb800", l: d.dash.mapLegend.mid },
                  { c: "#3a3d47", l: d.dash.mapLegend.weak },
                ].map((x) => (
                  <span key={x.l} className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm" style={{ background: x.c }} />
                    {x.l}
                  </span>
                ))}
              </div>
            </Card>
          </Reveal>

          {derived.weak.length > 0 && (
            <Reveal delay={140}>
              <Card>
                <h2 className="font-display mb-3.5 text-lg font-bold">{d.dash.weakTitle}</h2>
                <div className="flex flex-col gap-2">
                  {derived.weak.slice(0, 2).map((w) => (
                    <Link
                      key={w.t.id}
                      href={`/practice?t=${w.t.id}`}
                      className="flex items-center gap-3.5 rounded-2xl border border-line bg-coal p-3 press hover:border-brand/50"
                    >
                      <Ring value={w.m} size={44} stroke={5}>
                        <span className="text-[10.5px] font-extrabold tabular-nums">{Math.round(w.m * 100)}</span>
                      </Ring>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-bold">{pick(w.t.title)}</span>
                        <span className="block text-[12px] text-dim">
                          {w.a} {d.dash.solved}
                        </span>
                      </span>
                      <IconArrow size={16} />
                    </Link>
                  ))}
                </div>
              </Card>
            </Reveal>
          )}

          {derived.rival && (
            <Reveal delay={180}>
              <Card>
                <div className="flex items-center gap-3.5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-soot text-[15px] font-extrabold text-mute">
                    {derived.rival.name.slice(0, 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-bold">
                      {d.dash.rivalCatch} {derived.rival.name}
                    </div>
                    <div className="mt-0.5 text-[12px] text-dim tabular-nums">
                      {derived.rival.elo - user.elo} {d.common.elo} {d.dash.rivalAhead} {derived.rival.elo}
                    </div>
                  </div>
                  <Btn href="/league" variant="outline" size="sm">
                    <IconTrophy size={14} />
                  </Btn>
                </div>
                <div className="mt-3">
                  <Bar value={user.elo / derived.rival.elo} h={6} />
                </div>
              </Card>
            </Reveal>
          )}

          <Reveal delay={200}>
            <Link href="/inbox" className="group block">
              <Card hover className="flex items-center gap-3.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-line2 bg-soot text-mute">
                  <IconSpark size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-bold">{d.inbox.title}</span>
                  <span className="block text-[12px] text-dim">
                    {derived.unread > 0 ? `${derived.unread} ${d.inbox.unread}` : d.inbox.sub}
                  </span>
                </span>
                {derived.unread > 0 && (
                  <span className="grid h-6 min-w-6 shrink-0 place-items-center rounded-full bg-brand px-1.5 text-[11px] font-extrabold text-ink tabular-nums">
                    {derived.unread}
                  </span>
                )}
              </Card>
            </Link>
          </Reveal>

          <Reveal delay={220}>
            <Card>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold">{d.dash.activity}</h2>
                <IconCheck size={16} />
              </div>
              <MiniBars
                values={derived.days.map((x) => Math.round(x.seconds / 60))}
                labels={derived.days.map((x) => x.date.slice(8))}
              />
            </Card>
          </Reveal>
        </div>
      </div>

      <JoinClassModal open={joinOpen} onClose={() => setJoinOpen(false)} onJoin={joinClass} />
    </div>
  );
}

export function JoinClassModal({
  open, onClose, onJoin,
}: {
  open: boolean;
  onClose: () => void;
  onJoin: (code: string) => JoinResult;
}) {
  const { d } = useI18n();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [joined, setJoined] = useState<JoinResult | null>(null);

  const submit = () => {
    const res = onJoin(code);
    if (res.ok) {
      setJoined(res);
      setError(false);
      window.setTimeout(() => {
        onClose();
        setJoined(null);
        setCode("");
      }, 1400);
    } else {
      setError(true);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={d.codes.joinTitle}>
      {joined ? (
        <div className="slide-up flex items-start gap-3 rounded-2xl border border-brand/40 bg-brand/8 p-4">
          <IconCheck size={22} />
          <div className="min-w-0">
            <div className="text-[14.5px] font-bold text-brand">{d.codes.joinOk}</div>
            <div className="mt-0.5 text-[13px] text-mute">
              {joined.className}
              {joined.teacherName ? ` · ${joined.teacherName}` : ""}
            </div>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-4 text-[13.5px] leading-relaxed text-mute">{d.codes.joinHint}</p>
          <input
            className="field text-center font-display text-lg font-bold uppercase tracking-[0.18em]"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && code.trim().length >= 4) submit();
            }}
            placeholder={d.codes.joinPh}
            maxLength={10}
            autoFocus
          />
          {error && <p className="mt-2 text-[12.5px] font-semibold text-red-400">{d.codes.joinFail}</p>}
          <p className="mt-3 text-[12px] leading-relaxed text-dim">{d.codes.demoHint}</p>
          <Btn full size="lg" className="mt-4" disabled={code.trim().length < 4} onClick={submit}>
            {d.common.continue}
          </Btn>
        </>
      )}
    </Modal>
  );
}
