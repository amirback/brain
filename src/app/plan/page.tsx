"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { topicById } from "@/lib/content";
import { buildPlan, type PlanDay } from "@/lib/plan";
import { Bar, Btn, Card, Reveal } from "@/components/ui";
import { IconArrow, IconBolt, IconBook, IconCheck, IconClock, IconRefresh, IconTarget } from "@/components/Icons";

/**
 * The whole run-up to the next test, one day at a time.
 *
 * This is the page that answers "what am I supposed to do today", which the app
 * previously left to the student to work out from a knowledge map and a deadline.
 */
export default function PlanPage() {
  const { d, pick } = useI18n();
  const { user, ready, role } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!user || role !== "student") router.replace("/start");
  }, [ready, user, role, router]);

  const plan = useMemo(
    () => (user ? buildPlan(user, (id) => {
      const tp = topicById(id);
      return tp ? pick(tp.title) : id;
    }) : null),
    [user, pick]
  );

  if (!ready || !user || !plan) return null;

  const sub =
    plan.target.kind === "mock" ? d.plan.subMock
      : plan.target.kind === "exam" ? d.plan.subExam
        : d.plan.subOpen;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <Reveal>
        <h1 className="font-display text-[clamp(26px,5.6vw,38px)] font-extrabold tracking-[-0.02em]">
          {d.plan.title}
        </h1>
        <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-mute">{sub}</p>
      </Reveal>

      {plan.target.daysLeft !== null && (
        <Reveal delay={60}>
          <Card className="mt-6 border-brand/35">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand/12 text-brand">
                  <IconTarget size={21} />
                </span>
                <div>
                  <div className="font-display text-2xl font-extrabold tabular-nums">
                    {plan.target.daysLeft} {d.plan.days}
                  </div>
                  <div className="text-[12.5px] text-dim">
                    {plan.target.kind === "mock" ? d.plan.daysLeftToMock : d.plan.daysLeftToExam}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-lg font-extrabold tabular-nums">
                  {plan.doneCount} / {plan.days.length}
                </div>
                <div className="text-[11.5px] text-dim">{d.plan.doneOf}</div>
              </div>
            </div>
            <div className="mt-4">
              <Bar value={plan.doneCount / Math.max(1, plan.days.length)} h={5} />
            </div>
          </Card>
        </Reveal>
      )}

      <div className="mt-5 flex flex-col gap-2.5">
        {plan.days.map((day, i) => (
          <Reveal key={day.date} delay={90 + i * 40}>
            <DayCard day={day} label={dayLabel(day, d)} pick={pick} d={d} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={90 + plan.days.length * 40}>
        <Card className="mt-6">
          <h2 className="font-display text-[15.5px] font-extrabold">{d.plan.whyTitle}</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-mute">{d.plan.whyBody}</p>
        </Card>
      </Reveal>
    </div>
  );
}

function dayLabel(day: PlanDay, d: { plan: { today: string; tomorrow: string; inDays: string; days: string } }): string {
  if (day.offset === 0) return d.plan.today;
  if (day.offset === 1) return d.plan.tomorrow;
  return `${d.plan.inDays} ${day.offset} ${d.plan.days}`;
}

const KIND_ICON = {
  lesson: IconBook,
  practice: IconBolt,
  fix: IconRefresh,
  review: IconRefresh,
  mock: IconClock,
  exam: IconTarget,
} as const;

function DayCard({
  day, label, pick, d,
}: {
  day: PlanDay;
  label: string;
  pick: (v: { ru: string; kk: string; en: string }) => string;
  d: {
    plan: {
      kinds: Record<string, string>;
      status: Record<string, string>;
      startNow: string;
      doneToday: string;
    };
  };
}) {
  const Icon = KIND_ICON[day.kind];
  const isToday = day.status === "today";
  const isDone = day.status === "done";

  return (
    <div
      className={`rounded-2xl border px-4 py-3.5 transition-colors ${
        isToday ? "border-brand/45 bg-brand/6" : isDone ? "border-line bg-card opacity-70" : "border-line bg-card"
      }`}
    >
      <div className="flex items-start gap-3.5">
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
            isDone ? "bg-brand/15 text-brand" : isToday ? "bg-brand text-paper" : "bg-haze text-mute"
          }`}
        >
          {isDone ? <IconCheck size={18} /> : <Icon size={18} />}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isToday ? "text-brand" : "text-dim"}`}>
              {label}
            </span>
            <span className="text-[11px] font-semibold text-dim">· {d.plan.kinds[day.kind]}</span>
            <span className="text-[11px] font-semibold tabular-nums text-dim">· {day.minutes} мин</span>
          </div>
          <div className="mt-1 text-[15px] font-bold leading-snug">{pick(day.title)}</div>
          <p className="mt-1 text-[13px] leading-relaxed text-mute">{pick(day.detail)}</p>

          {isToday && !isDone && (
            <Btn href={day.href} size="sm" className="arrow-slide mt-3">
              {d.plan.startNow}
              <span className="arr"><IconArrow size={15} /></span>
            </Btn>
          )}
          {isToday && isDone && (
            <div className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-brand">
              <IconCheck size={14} />
              {d.plan.doneToday}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
