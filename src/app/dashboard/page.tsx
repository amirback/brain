"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { fmtHours, lastNDays, streakLength, totalSeconds, useStore, weekSeconds } from "@/lib/store";
import { subjectById, topicById, topicsOf } from "@/lib/content";
import { checkpointDue, daysUntilCheckpoint, formatForecast, masteryBand, readiness, recommend } from "@/lib/engine";
import { advise, buildMessages } from "@/lib/advisor";
import { buildPlan } from "@/lib/plan";
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

  // Today's slot in the run-up to the next test, recomputed from mastery on
  // every render — finishing a topic early moves tomorrow's work by itself.
  const plan = useMemo(
    () => (user ? buildPlan(user, (id) => {
      const tp = topicById(id);
      return tp ? pick(tp.title) : id;
    }) : null),
    [user, pick]
  );

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

  /**
   * Only genuinely time-critical items get an alert row. Anything that is
   * merely "fine" drops to the rail as a one-line status, which is what keeps
   * a healthy dashboard from filling up with cards that say nothing is wrong.
   */
  const alerts: {
    key: string; tone: "amber" | "brand"; icon: React.ReactNode;
    title: string; note: string; cta: string; href?: string; onClick?: () => void;
  }[] = [];

  if (derived.mock && derived.mockDays !== null && derived.mockDays <= 1) {
    alerts.push({
      key: "mock",
      tone: "amber",
      icon: <IconClock size={18} />,
      title: d.mock.scheduled,
      note: `${derived.mock.size} ${d.mock.questions} · ${
        derived.mockDays > 0
          ? `${d.mock.dueIn} ${derived.mockDays} ${d.common.day}`
          : derived.mockDays === 0
            ? d.mock.dueToday
            : d.mock.overdue
      }`,
      cta: d.mock.start,
      href: `/mock?id=${derived.mock.id}`,
    });
  }
  if (derived.dueCheckpoint) {
    alerts.push({
      key: "checkpoint",
      tone: "brand",
      icon: <IconRefresh size={18} />,
      title: d.dash.checkpoint,
      note: d.dash.checkpointDue,
      cta: d.dash.checkpointCta,
      href: "/practice?mode=checkpoint",
    });
  }
  if (!user.classCode) {
    alerts.push({
      key: "class",
      tone: "amber",
      icon: <IconTeacher size={18} />,
      title: d.codes.notInClass,
      note: d.codes.notInClassHint,
      cta: d.codes.joinCta,
      onClick: () => setJoinOpen(true),
    });
  }
  if (user.goal === "sat" || user.goal === "ielts") {
    alerts.push({
      key: "exam",
      tone: "brand",
      icon: <IconTarget size={18} />,
      title: user.goal === "sat" ? d.exam.satTitle : d.exam.ieltsTitle,
      note: user.goal === "sat" ? d.exam.satBlurb : d.exam.ieltsBlurb,
      cta: d.exam.start,
      href: user.goal === "sat" ? "/sat" : "/ielts",
    });
  }

  const mapRows = [
    ...topicsOf(derived.subject).map((t) => ({ id: t.id, title: pick(t.title) })),
    ...user.customTopics.filter((c) => c.subject === derived.subject).map((c) => ({ id: c.id, title: c.name })),
  ];
  const mapStats = {
    total: mapRows.length,
    mastered: mapRows.filter((t) => (user.mastery[t.id] ?? 0) >= 0.7).length,
  };

  /** The next three days of the plan — the rail's guaranteed content. */
  const upcoming = (plan?.days ?? []).filter((day) => day.offset > 0).slice(0, 3);

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

      {/* ================= TIER 1 — today =================
          One task, one action, unmistakably the most important thing on the
          page. Everything below is deliberately quieter so it cannot compete. */}
      {plan?.today && (
        <Reveal delay={40}>
          <div
            className={`mt-5 overflow-hidden rounded-3xl border ${
              plan.today.status === "done" ? "border-line bg-card" : "border-brand/50 bg-brand/8"
            }`}
          >
            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
              {/* The icon set hard-codes brand orange, so a solid orange badge
                  would hide the glyph. A tint keeps it legible; the emphasis
                  comes from the panel and the solid CTA instead. */}
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-brand/30 bg-brand/15">
                {plan.today.status === "done" ? <IconCheck size={26} /> : <IconBolt size={26} />}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-bold uppercase tracking-wider">
                  <span className="text-brand">
                    {plan.today.status === "done" ? d.plan.doneToday : d.plan.todayTask}
                  </span>
                  {plan.target.daysLeft !== null && (
                    <span className="text-dim">
                      · {plan.target.daysLeft} {d.plan.days}{" "}
                      {plan.target.kind === "mock" ? d.plan.daysLeftToMock : d.plan.daysLeftToExam}
                    </span>
                  )}
                  <span className="text-dim">· {plan.today.minutes} {d.common.min}</span>
                </div>
                <h2 className="font-display mt-1.5 text-[clamp(19px,3.4vw,25px)] font-extrabold leading-tight">
                  {pick(plan.today.title)}
                </h2>
                <p className="mt-1.5 max-w-lg text-[13.5px] leading-relaxed text-mute">
                  {plan.today.status === "done" ? d.plan.doneTodayNote : pick(plan.today.detail)}
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-2 sm:w-[150px]">
                {plan.today.status !== "done" && (
                  <Btn href={plan.today.href} size="lg" full>
                    {d.plan.startNow}
                  </Btn>
                )}
                <Btn href="/plan" variant="outline" size={plan.today.status === "done" ? "lg" : "sm"} full>
                  {d.plan.open}
                </Btn>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* ================= TIER 2 — alerts =================
          Only things that are actually time-critical, as single compact rows.
          A status that is fine does not get a card here; it drops to the rail. */}
      {(alerts.length > 0) && (
        <Reveal delay={60}>
          <div className="mt-3 flex flex-col gap-2">
            {alerts.map((a) => (
              <div
                key={a.key}
                className={`flex flex-col gap-3 rounded-2xl border px-4 py-3 min-[420px]:flex-row min-[420px]:items-center ${
                  a.tone === "amber" ? "border-amber/40 bg-amber/8" : "border-brand/40 bg-brand/8"
                }`}
              >
                <span className="flex min-w-0 flex-1 items-center gap-3">
                  <span className={`shrink-0 ${a.tone === "amber" ? "text-amber" : "text-brand"}`}>{a.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-bold leading-snug">{a.title}</span>
                    <span className="line-clamp-2 text-[12.5px] leading-snug text-mute">{a.note}</span>
                  </span>
                </span>
                {a.href ? (
                  <Btn href={a.href} size="sm" className="w-full shrink-0 min-[420px]:w-auto">{a.cta}</Btn>
                ) : (
                  <Btn size="sm" className="w-full shrink-0 min-[420px]:w-auto" onClick={a.onClick}>{a.cta}</Btn>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {/* ================= TIER 3 — momentum =================
          Four numbers that answer "am I moving", at a quarter of the visual
          weight of the hero. Two columns on a phone rather than four tall
          stacked cards. */}
      <div className="mt-3 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <Reveal delay={70}>
          <StatTile label={d.dash.eloTitle} icon={<IconBolt size={14} />} value={String(user.elo)}>
            <div className="-mb-1 mt-1.5">
              <Sparkline points={user.eloHistory.slice(-14).map((p) => p.elo)} h={26} />
            </div>
          </StatTile>
        </Reveal>

        <Reveal delay={95}>
          <StatTile
            label={d.dash.streakTitle}
            icon={<IconFlame size={14} />}
            value={String(derived.streak)}
            suffix={d.dash.streakUnit}
          >
            <div className="mt-2 flex gap-1">
              {derived.days.slice(-7).map((day) => (
                <span
                  key={day.date}
                  className="h-4 flex-1 rounded"
                  style={{ background: day.seconds > 0 ? "#ff5c00" : "#2a2c33" }}
                  title={day.date}
                />
              ))}
            </div>
          </StatTile>
        </Reveal>

        <Reveal delay={120}>
          <StatTile
            label={d.dash.hours}
            icon={<IconClock size={14} />}
            value={(derived.total / 3600).toFixed(1)}
            suffix={d.common.hour}
          >
            <div className="mt-2 truncate text-[11.5px] text-dim">
              {fmtHours(derived.week, d.common.hour, d.common.min)} · {d.dash.hoursWeek}
            </div>
          </StatTile>
        </Reveal>

        <Reveal delay={145}>
          <StatTile
            label={d.dash.forecast}
            icon={<IconTrend size={14} />}
            value={derived.view.value}
            suffix={`/ ${derived.view.max}`}
            delta={derived.delta}
          >
            <div className="mt-2 truncate text-[11.5px] text-dim">{forecastUnit}</div>
          </StatTile>
        </Reveal>
      </div>

      {/* ================= TIER 4 — the work =================
          Left holds the tall signature content, right is a rail of short
          actionable lists. The rail is never empty because the plan always
          produces days, so no placeholder ever has to stretch. */}
      <div className="mt-3 grid gap-3 lg:grid-cols-[1.45fr_1fr] lg:items-start">
        {/* ---- left: knowledge map ---- */}
        <div className="flex flex-col gap-3">
          <Reveal delay={160}>
            <Card>
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2 className="font-display flex items-center gap-2 text-[17px] font-bold">
                  <IconMap size={17} />
                  {d.dash.mapTitle}
                </h2>
                {/* The wording is dropped on a phone so the heading stops wrapping. */}
                <span className="shrink-0 text-[11.5px] font-semibold tabular-nums text-dim">
                  {mapStats.mastered} / {mapStats.total}
                  <span className="hidden sm:inline"> {d.dash.mapDone}</span>
                </span>
              </div>

              <div className="grid gap-x-6 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {mapRows.map((t) => {
                  const m = user.mastery[t.id] ?? 0;
                  const a = user.attempts[t.id] ?? 0;
                  const band = masteryBand(m, a);
                  const tone = { none: "dim", weak: "dim", mid: "amber", strong: "brand" } as const;
                  return (
                    <Link key={t.id} href={`/learn?t=${t.id}`} className="group block">
                      <div className="mb-1.5 flex items-baseline justify-between gap-3">
                        <span className="truncate text-[13.5px] font-semibold transition-colors group-hover:text-brand">
                          {t.title}
                        </span>
                        <span className="shrink-0 text-[11px] font-bold tabular-nums text-dim">
                          {a === 0 ? "—" : `${Math.round(m * 100)}%`}
                        </span>
                      </div>
                      <Bar value={m} tone={tone[band]} h={6} />
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
            <Reveal delay={185}>
              <Card>
                <h2 className="font-display mb-3.5 text-[17px] font-bold">{d.dash.weakTitle}</h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {derived.weak.slice(0, 4).map((w) => (
                    <Link
                      key={w.t.id}
                      href={`/practice?t=${w.t.id}`}
                      className="press flex items-center gap-3 rounded-2xl border border-line bg-coal p-3 hover:border-brand/50"
                    >
                      <Ring value={w.m} size={40} stroke={5}>
                        <span className="text-[10px] font-extrabold tabular-nums">{Math.round(w.m * 100)}</span>
                      </Ring>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-bold">{pick(w.t.title)}</span>
                        <span className="block text-[11.5px] text-dim">
                          {w.a} {d.dash.solved}
                        </span>
                      </span>
                      <IconArrow size={15} />
                    </Link>
                  ))}
                </div>
              </Card>
            </Reveal>
          )}

          {/* Kept in the left column: the map plus weak spots alone leave the
              two sides badly uneven, and this is the taller of the two fillers. */}
          <Reveal delay={205}>
            <Card>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-[17px] font-bold">{d.dash.activity}</h2>
                <IconCheck size={15} />
              </div>
              <MiniBars
                values={derived.days.map((x) => Math.round(x.seconds / 60))}
                labels={derived.days.map((x) => x.date.slice(8))}
              />
            </Card>
          </Reveal>
        </div>

        {/* ---- right: the rail ---- */}
        <div className="flex flex-col gap-3">
          {/* the run-up, which always has content */}
          {upcoming.length > 0 && (
            <Reveal delay={175}>
              <Card>
                <div className="mb-3.5 flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-[17px] font-bold">{d.plan.ahead}</h2>
                  <Link href="/plan" className="shrink-0 text-[12px] font-bold text-brand hover:underline">
                    {d.plan.open}
                  </Link>
                </div>
                <div className="flex flex-col gap-2">
                  {upcoming.map((day) => (
                    <Link
                      key={day.date}
                      href={day.href}
                      className="press flex items-center gap-3 rounded-2xl border border-line bg-coal px-3.5 py-2.5 hover:border-brand/45"
                    >
                      {/* No fixed width: "TOMORROW" is far wider than "ЗАВТРА"
                          and a hard-coded column made them collide. */}
                      <span className="shrink-0 whitespace-nowrap text-[10.5px] font-bold uppercase tracking-wider text-dim">
                        {day.offset === 1 ? d.plan.tomorrow : `+${day.offset} ${d.plan.days}`}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-right text-[13.5px] font-semibold">
                        {pick(day.title)}
                      </span>
                      <IconArrow size={14} />
                    </Link>
                  ))}
                </div>
              </Card>
            </Reveal>
          )}

          {/* only rendered when a teacher actually assigned something */}
          {user.tasks.length > 0 && (
            <Reveal delay={195}>
              <Card>
                <div className="mb-3.5 flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-[17px] font-bold">{d.dash.tasksTitle}</h2>
                  <span className="shrink-0 text-[11.5px] font-bold tabular-nums text-dim">
                    {openTasks.length} / {user.tasks.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {user.tasks.map((t) => {
                    const topic = topicById(t.topic);
                    return (
                      <button
                        key={t.id}
                        onClick={() => toggleTask(t.id)}
                        className={`press flex items-center gap-3 rounded-2xl border p-3 text-left ${
                          t.done ? "border-line bg-coal/50 opacity-60" : "border-line bg-coal hover:border-line2"
                        }`}
                      >
                        <span
                          className={`grid h-5.5 w-5.5 shrink-0 place-items-center rounded-md border-2 ${
                            t.done ? "border-brand bg-brand" : "border-line2"
                          }`}
                          style={{ height: 22, width: 22 }}
                        >
                          {t.done && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#121317" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={`block truncate text-[13.5px] font-semibold ${t.done ? "line-through" : ""}`}>
                            {t.title}
                          </span>
                          <span className="mt-0.5 block truncate text-[11.5px] text-dim">
                            {topic ? pick(topic.title) : t.topic} · {t.from}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Card>
            </Reveal>
          )}

          {/* everything that is merely a status, as one-line rows */}
          <Reveal delay={215}>
            <Card pad="p-3">
              <div className="px-1.5 pb-1 pt-0.5 text-[11px] font-bold uppercase tracking-wider text-dim">
                {d.dash.railMore}
              </div>
              <div className="flex flex-col">
                {derived.resume && (
                  <RailRow
                    href={`/learn?t=${derived.resume.id}`}
                    icon={<IconBook size={16} />}
                    title={pick(derived.resume.title)}
                    note={d.lesson.resumeSub}
                  />
                )}
                <RailRow
                  href="/inbox"
                  icon={<IconSpark size={16} />}
                  title={d.inbox.title}
                  note={derived.unread > 0 ? `${derived.unread} ${d.inbox.unread}` : d.inbox.sub}
                  badge={derived.unread > 0 ? derived.unread : undefined}
                />
                {!derived.dueCheckpoint && (
                  <RailRow
                    icon={<IconRefresh size={16} />}
                    title={d.dash.checkpoint}
                    note={`${d.dash.checkpointFresh} ${daysUntilCheckpoint(user.lastCheckpoint, user.createdAt)} ${d.common.day}`}
                  />
                )}
                {derived.rival && (
                  <RailRow
                    href="/league"
                    icon={<IconTrophy size={16} />}
                    title={`${d.dash.rivalCatch} ${derived.rival.name}`}
                    note={`${derived.rival.elo - user.elo} ${d.common.elo} ${d.dash.rivalAhead} ${derived.rival.elo}`}
                  />
                )}
                {derived.tip && (
                  <RailRow
                    href="/assistant"
                    icon={<IconSpark size={16} />}
                    title={d.assistant.title}
                    note={pick(derived.tip.text)}
                  />
                )}
              </div>
            </Card>
          </Reveal>

        </div>
      </div>

      <JoinClassModal open={joinOpen} onClose={() => setJoinOpen(false)} onJoin={joinClass} />
    </div>
  );
}

/** A momentum number: quiet by design, so it cannot compete with the hero. */
function StatTile({
  label, icon, value, suffix, delta, children,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  suffix?: string;
  delta?: number;
  children?: React.ReactNode;
}) {
  return (
    <div className="h-full rounded-2xl border border-line bg-card p-3.5">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[10.5px] font-bold uppercase tracking-wider text-dim">{label}</span>
        <span className="shrink-0 text-dim">{icon}</span>
      </div>
      <div className="font-display mt-1 flex items-end gap-1.5 text-[clamp(20px,4.5vw,26px)] font-extrabold leading-none tabular-nums">
        {value}
        {suffix && <span className="mb-0.5 text-[11px] font-semibold text-dim">{suffix}</span>}
        {delta !== undefined && delta !== 0 && (
          <span className={`mb-0.5 text-[11px] font-bold ${delta > 0 ? "text-brand" : "text-dim"}`}>
            {delta > 0 ? "+" : ""}
            {delta}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/**
 * A one-line status. Rows sit flush against each other with a hairline rule
 * rather than becoming separate cards, so five statuses cost the height of one.
 */
function RailRow({
  href, icon, title, note, badge,
}: {
  href?: string;
  icon: React.ReactNode;
  title: string;
  note: string;
  badge?: number;
}) {
  const inner = (
    <span className="flex items-center gap-3 rounded-xl px-1.5 py-2.5 transition-colors">
      <span className="shrink-0 text-dim">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-semibold">{title}</span>
        <span className="block truncate text-[11.5px] text-dim">{note}</span>
      </span>
      {badge !== undefined && (
        <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-brand px-1.5 text-[10.5px] font-extrabold tabular-nums text-ink">
          {badge}
        </span>
      )}
      {href && <IconArrow size={14} />}
    </span>
  );

  const cls = "block border-t border-line first:border-t-0";
  return href ? (
    <Link href={href} className={`${cls} press hover:text-brand`}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

export function JoinClassModal({
  open, onClose, onJoin,
}: {
  open: boolean;
  onClose: () => void;
  onJoin: (code: string) => Promise<JoinResult>;
}) {
  const { d } = useI18n();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [joined, setJoined] = useState<JoinResult | null>(null);

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    // Pasting the invite link instead of the code is a common shortcut.
    const fromLink = code.match(/CL-[A-Z0-9]{4}/i)?.[0] ?? code;
    const res = await onJoin(fromLink);
    setBusy(false);
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
              if (e.key === "Enter" && code.trim().length >= 4) void submit();
            }}
            placeholder={d.codes.joinPh}
            maxLength={10}
            autoFocus
          />
          {error && <p className="mt-2 text-[12.5px] font-semibold text-red-400">{d.codes.joinFail}</p>}
          <p className="mt-3 text-[12px] leading-relaxed text-dim">{d.codes.demoHint}</p>
          <Btn full size="lg" className="mt-4" disabled={code.trim().length < 4 || busy} onClick={submit}>
            {busy ? d.common.loading : d.common.continue}
          </Btn>
        </>
      )}
    </Modal>
  );
}
