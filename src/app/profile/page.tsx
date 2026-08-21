"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { fmtHours, streakLength, totalSeconds, useStore } from "@/lib/store";
import { SUBJECTS, defaultSubjects, subjectsForGoal } from "@/lib/content";
import type { Goal, SubjectId } from "@/lib/types";
import { Btn, Card, Modal, Reveal } from "@/components/ui";
import { LangSwitch } from "@/components/Header";
import { JoinClassModal } from "../dashboard/page";
import { childShareLink, recoveryLink } from "@/lib/share";
import {
  IconBolt, IconBook, IconCheck, IconClock, IconFlame, IconGlobe,
  IconLock, IconParent, IconRefresh, IconSpark, IconTarget, IconTeacher, IconTrophy, IconUser,
} from "@/components/Icons";

const ACH_ICON = {
  firstDiag: IconTarget,
  streak3: IconFlame,
  elo1000: IconBolt,
  mastered: IconTrophy,
  tasks20: IconCheck,
  checkin: IconRefresh,
} as const;

type AchKey = keyof typeof ACH_ICON;

const GOAL_ICON: Record<Goal, typeof IconTarget> = {
  ent: IconTarget,
  olymp: IconTrophy,
  school: IconBook,
  sat: IconBolt,
  ielts: IconGlobe,
};

export default function ProfilePage() {
  const { d, pick } = useI18n();
  const { user, ready, role, switchGoal, resetAll, addSubject, setActiveSubject, joinClass, leaveClass, space } = useStore();
  const router = useRouter();

  const [switchOpen, setSwitchOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [subjectsOpen, setSubjectsOpen] = useState(false);
  const [carried, setCarried] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState<"" | "child" | "recovery">("");

  useEffect(() => {
    if (!ready) return;
    if (!user || role !== "student") router.replace("/start");
  }, [ready, user, role, router]);

  if (!ready || !user) return null;

  const streak = streakLength(user.streakDates);
  const hours = totalSeconds(user.secondsByDay);
  const teacherName = user.classCode && space.teacher?.code === user.classCode ? space.teacher.name : null;

  const copyLink = async (kind: "child" | "recovery") => {
    if (!user) return;
    try {
      await navigator.clipboard.writeText(kind === "child" ? childShareLink(user) : recoveryLink(user));
      setShared(kind);
      window.setTimeout(() => setShared(""), 2400);
    } catch {
      // clipboard blocked — nothing else to fall back on here
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(user.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — the code stays visible
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-brand text-2xl font-extrabold text-paper">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h1 className="font-display truncate text-[clamp(24px,5vw,34px)] font-extrabold tracking-[-0.02em]">
              {user.name}
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[12px]">
              <span className="rounded-full border border-line2 px-2.5 py-1 font-semibold text-mute tabular-nums">
                {user.grade} {d.start.gradeSuffix}
              </span>
              <span className="rounded-full border border-brand/40 bg-brand/8 px-2.5 py-1 font-semibold text-brand">
                {d.start.goals[user.goal].t}
              </span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* student code — how a teacher or parent finds this student */}
      <Reveal delay={40}>
        <Card className="mt-5 border-brand/30 bg-brand/5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-brand">{d.codes.yourCode}</div>
              <div className="font-display mt-1 text-2xl font-extrabold tracking-[0.14em]">{user.code}</div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-mute">{d.codes.yourCodeHint}</p>
            </div>
            <Btn size="sm" variant={copied ? "outline" : "primary"} onClick={copyCode} className="shrink-0">
              {copied ? (
                <>
                  <IconCheck size={15} />
                  {d.codes.copied}
                </>
              ) : (
                d.codes.copy
              )}
            </Btn>
          </div>
        </Card>
      </Reveal>

      {/* cross-device links: these carry the data, so they work anywhere */}
      <Reveal delay={55}>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Card>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line2 bg-haze text-mute">
                <IconParent size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-[14px] font-bold">{d.codes.shareChild}</h3>
                <p className="mt-1 text-[12px] leading-snug text-dim">{d.codes.shareChildHint}</p>
                <Btn
                  size="sm"
                  variant={shared === "child" ? "primary" : "outline"}
                  className="mt-3"
                  onClick={() => copyLink("child")}
                >
                  {shared === "child" ? (
                    <>
                      <IconCheck size={14} />
                      {d.codes.linkCopied}
                    </>
                  ) : (
                    d.codes.copyLink
                  )}
                </Btn>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line2 bg-haze text-mute">
                <IconLock size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-[14px] font-bold">{d.codes.recovery}</h3>
                <p className="mt-1 text-[12px] leading-snug text-dim">{d.codes.recoveryHint}</p>
                <Btn
                  size="sm"
                  variant={shared === "recovery" ? "primary" : "outline"}
                  className="mt-3"
                  onClick={() => copyLink("recovery")}
                >
                  {shared === "recovery" ? (
                    <>
                      <IconCheck size={14} />
                      {d.codes.linkCopied}
                    </>
                  ) : (
                    d.codes.copyLink
                  )}
                </Btn>
              </div>
            </div>
          </Card>
        </div>
      </Reveal>

      {/* class membership */}
      <Reveal delay={70}>
        <Card className="mt-3">
          <div className="flex items-center gap-3.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-line2 bg-haze text-mute">
              <IconTeacher size={20} />
            </span>
            <div className="min-w-0 flex-1">
              {user.classCode ? (
                <>
                  <div className="text-[14px] font-bold">
                    {space.classes[user.classCode]?.className ?? teacherName ?? d.codes.classCode}
                  </div>
                  <div className="mt-0.5 text-[12.5px] text-dim">
                    <span className="tabular-nums">{user.classCode}</span>
                    {space.classes[user.classCode]?.teacherName ? ` · ${space.classes[user.classCode].teacherName}` : ""}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-[14px] font-bold">{d.codes.notInClass}</div>
                  <div className="mt-0.5 text-[12.5px] leading-snug text-dim">{d.codes.notInClassHint}</div>
                </>
              )}
            </div>
            {user.classCode ? (
              <Btn
                size="sm"
                variant="outline"
                className="shrink-0"
                onClick={() => {
                  leaveClass();
                  setJoinOpen(true);
                }}
              >
                {d.codes.changeClass}
              </Btn>
            ) : (
              <Btn size="sm" variant="outline" onClick={() => setJoinOpen(true)} className="shrink-0">
                {d.codes.joinCta}
              </Btn>
            )}
          </div>
        </Card>
      </Reveal>

      {/* stats */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        {[
          { l: d.common.elo, v: String(user.elo), Icon: IconBolt },
          { l: d.dash.streakTitle, v: String(streak), Icon: IconFlame },
          { l: d.dash.hours, v: fmtHours(hours, d.common.hour, d.common.min), Icon: IconClock },
        ].map((s, i) => (
          <Reveal key={s.l} delay={i * 50}>
            <Card pad="p-4">
              <s.Icon size={17} />
              <div className="font-display mt-2 text-xl font-extrabold tabular-nums">{s.v}</div>
              <div className="mt-0.5 text-[10.5px] uppercase tracking-wider text-dim">{s.l}</div>
            </Card>
          </Reveal>
        ))}
      </div>

      {/* subjects */}
      <Reveal delay={100}>
        <Card className="mt-3">
          <div className="mb-3.5 flex items-start justify-between gap-4">
            <h2 className="font-display text-lg font-bold">{d.subjects.title}</h2>
            <Btn size="sm" variant="outline" onClick={() => setSubjectsOpen(true)} className="shrink-0">
              {d.subjects.add}
            </Btn>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.subjects.map((s) => {
              const sub = SUBJECTS.find((x) => x.id === s);
              const active = s === user.activeSubject;
              return (
                <button
                  key={s}
                  onClick={() => setActiveSubject(s)}
                  className={`press rounded-2xl border px-3.5 py-2 text-[13px] font-bold transition-colors ${
                    active ? "border-brand bg-brand/10 text-brand" : "border-line bg-mist text-mute hover:border-line2"
                  }`}
                >
                  {sub ? pick(sub.title) : s}
                </button>
              );
            })}
          </div>
        </Card>
      </Reveal>

      {/* goal switch */}
      <Reveal delay={130}>
        <Card className="mt-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="font-display text-lg font-bold">{d.profile.goal}</h2>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-mute">{d.profile.switchBody}</p>
            </div>
            <Btn size="sm" variant="outline" onClick={() => setSwitchOpen(true)} className="shrink-0">
              {d.profile.switchGoal}
            </Btn>
          </div>
        </Card>
      </Reveal>

      {/* past mock tests */}
      {user.mocks.some((m) => m.status === "done") && (
        <Reveal delay={145}>
          <Card className="mt-3">
            <h2 className="font-display mb-3.5 text-lg font-bold">{d.mock.history}</h2>
            <div className="flex flex-col gap-2">
              {user.mocks
                .filter((m) => m.status === "done")
                .sort((a, b) => (b.takenAt ?? 0) - (a.takenAt ?? 0))
                .slice(0, 4)
                .map((m) => (
                  <div key={m.id} className="flex items-center gap-3.5 rounded-2xl border border-line bg-mist p-3.5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-haze text-mute">
                      <IconClock size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-bold tabular-nums">
                        {m.score} / {m.size}
                      </div>
                      <div className="text-[12px] text-dim">
                        {new Date(m.takenAt ?? m.createdAt).toISOString().slice(0, 10)}
                      </div>
                    </div>
                    {(m.wrongQids?.length ?? 0) > 0 && (
                      <Btn href={`/practice?fix=${m.id}`} size="sm" variant="outline" className="shrink-0">
                        {d.mock.fixStart}
                      </Btn>
                    )}
                  </div>
                ))}
            </div>
          </Card>
        </Reveal>
      )}

      {/* achievements */}
      <Reveal delay={160}>
        <Card className="mt-3">
          <h2 className="font-display mb-4 text-lg font-bold">{d.profile.achievements}</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {(Object.keys(ACH_ICON) as AchKey[]).map((k) => {
              const has = user.achievements.includes(k);
              const Icon = has ? ACH_ICON[k] : IconLock;
              return (
                <div
                  key={k}
                  className={`rounded-2xl border p-3.5 transition-colors ${
                    has ? "border-brand/40 bg-brand/6" : "border-line bg-mist opacity-55"
                  }`}
                >
                  <span className={has ? "text-brand" : "text-dim"}>
                    <Icon size={20} />
                  </span>
                  <div className="mt-2 text-[13px] font-bold leading-tight">{d.profile.achList[k].t}</div>
                  <div className="mt-1 text-[11px] leading-snug text-dim">
                    {has ? d.profile.achList[k].d : d.profile.locked}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </Reveal>

      <Reveal delay={190}>
        <Card className="mt-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <IconGlobe size={20} />
              <h2 className="font-display text-[15px] font-bold">{d.profile.lang}</h2>
            </div>
            <LangSwitch />
          </div>
        </Card>
      </Reveal>

      <Reveal delay={220}>
        <Card className="mt-3">
          <div className="flex items-start gap-3">
            <IconUser size={20} />
            <div className="min-w-0 flex-1">
              {user.email && (
                <div className="mb-2 text-[13.5px] font-semibold">
                  {d.auth.emailLabel}: <span className="text-mute">{user.email}</span>
                </div>
              )}
              <p className="text-[13px] leading-relaxed text-dim">{user.email ? d.auth.localNote : d.profile.dataNote}</p>
              <button onClick={() => setResetOpen(true)} className="press mt-3 text-[13px] font-bold text-red-400 hover:text-red-300">
                {d.profile.reset}
              </button>
            </div>
          </div>
        </Card>
      </Reveal>

      {/* ---------- modals ---------- */}
      <GoalSwitchModal
        open={switchOpen}
        current={user.goal}
        carried={carried}
        onClose={() => {
          setSwitchOpen(false);
          setTimeout(() => setCarried(null), 250);
        }}
        onSwitch={(g) => setCarried(switchGoal(g, defaultSubjects(g)))}
      />

      <Modal open={subjectsOpen} onClose={() => setSubjectsOpen(false)} title={d.subjects.add}>
        <p className="mb-4 text-[13.5px] leading-relaxed text-mute">{d.subjects.pickHint}</p>
        <div className="flex flex-col gap-2">
          {subjectsForGoal(user.goal)
            .filter((s) => !user.subjects.includes(s.id))
            .map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  addSubject(s.id as SubjectId);
                  setSubjectsOpen(false);
                }}
                className="press rounded-2xl border border-line bg-mist p-3.5 text-left hover:border-brand"
              >
                <div className="text-[14.5px] font-bold">{pick(s.title)}</div>
                <div className="mt-0.5 text-[12px] text-dim">{pick(s.blurb)}</div>
              </button>
            ))}
          {subjectsForGoal(user.goal).filter((s) => !user.subjects.includes(s.id)).length === 0 && (
            <p className="py-4 text-center text-[13.5px] text-dim">{d.common.done}</p>
          )}
        </div>
      </Modal>

      <JoinClassModal open={joinOpen} onClose={() => setJoinOpen(false)} onJoin={joinClass} />

      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title={d.profile.reset}>
        <p className="text-[14px] leading-relaxed text-mute">{d.profile.resetConfirm}</p>
        <div className="mt-5 flex gap-2">
          <Btn variant="outline" full onClick={() => setResetOpen(false)}>
            {d.common.cancel}
          </Btn>
          <Btn
            full
            className="!border-red-500/50 !bg-red-500/90 hover:!bg-red-500"
            onClick={() => {
              resetAll();
              router.push("/");
            }}
          >
            {d.profile.resetYes}
          </Btn>
        </div>
      </Modal>
    </div>
  );
}

function GoalSwitchModal({
  open, current, carried, onClose, onSwitch,
}: {
  open: boolean;
  current: Goal;
  carried: number | null;
  onClose: () => void;
  onSwitch: (g: Goal) => void;
}) {
  const { d } = useI18n();
  return (
    <Modal open={open} onClose={onClose} title={d.profile.switchTitle}>
      {carried === null ? (
        <>
          <div className="mb-4 flex items-start gap-3 rounded-2xl border border-line bg-mist p-3.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/12 text-brand">
              <IconSpark size={18} />
            </span>
            <p className="pt-0.5 text-[13.5px] leading-relaxed text-mute">{d.profile.switchBody}</p>
          </div>
          <div className="flex flex-col gap-2">
            {(["ent", "olymp", "school", "sat", "ielts"] as Goal[]).map((g) => {
              const Icon = GOAL_ICON[g];
              const active = current === g;
              return (
                <button
                  key={g}
                  disabled={active}
                  onClick={() => onSwitch(g)}
                  className={`press flex items-center gap-3.5 rounded-2xl border p-3.5 text-left ${
                    active ? "border-brand bg-brand/8 opacity-60" : "border-line bg-mist hover:border-brand"
                  }`}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line2 bg-haze text-mute">
                    <Icon size={19} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] font-bold">{d.start.goals[g].t}</span>
                    <span className="block text-[12px] leading-snug text-dim">{d.start.goals[g].d}</span>
                  </span>
                  {active && <IconCheck size={19} />}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="slide-up text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-3xl bg-brand/12 text-brand">
            <IconCheck size={28} />
          </div>
          <p className="font-display text-[17px] font-bold">{d.profile.switchDone}</p>
          <div className="font-display mt-2 text-4xl font-extrabold tabular-nums text-brand">{carried}</div>
          <Btn full size="lg" className="mt-5" onClick={onClose}>
            {d.common.done}
          </Btn>
        </div>
      )}
    </Modal>
  );
}
