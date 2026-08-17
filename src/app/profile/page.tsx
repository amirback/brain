"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { fmtHours, streakLength, totalSeconds, useStore } from "@/lib/store";
import type { Goal } from "@/lib/types";
import { Btn, Card, Modal, Reveal } from "@/components/ui";
import { LangSwitch } from "@/components/Header";
import {
  IconBolt, IconBook, IconCheck, IconClock, IconFlame, IconGlobe,
  IconLock, IconRefresh, IconSpark, IconTarget, IconTrophy, IconUser,
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

export default function ProfilePage() {
  const { d } = useI18n();
  const { user, ready, switchGoal, resetAll } = useStore();
  const router = useRouter();

  const [switchOpen, setSwitchOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [carried, setCarried] = useState<number | null>(null);

  useEffect(() => {
    if (ready && !user) router.replace("/start");
  }, [ready, user, router]);

  if (!ready || !user) return null;

  const streak = streakLength(user.streakDates);
  const hours = totalSeconds(user.secondsByDay);
  const goalLabel = d.start.goals[user.goal].t;

  const doSwitch = (g: Goal) => {
    const n = switchGoal(g);
    setCarried(n);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-brand text-2xl font-extrabold text-ink">
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
                {goalLabel}
              </span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
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

      {/* goal switch — the headline "progress never burns" feature */}
      <Reveal delay={100}>
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

      {/* achievements */}
      <Reveal delay={140}>
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
                    has ? "border-brand/40 bg-brand/6" : "border-line bg-coal opacity-55"
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

      {/* language */}
      <Reveal delay={180}>
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

      {/* data */}
      <Reveal delay={220}>
        <Card className="mt-3">
          <div className="flex items-start gap-3">
            <IconUser size={20} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] leading-relaxed text-dim">{d.profile.dataNote}</p>
              <button
                onClick={() => setResetOpen(true)}
                className="press mt-3 text-[13px] font-bold text-red-400 hover:text-red-300"
              >
                {d.profile.reset}
              </button>
            </div>
          </div>
        </Card>
      </Reveal>

      {/* ---------- goal switch modal ---------- */}
      <Modal
        open={switchOpen}
        onClose={() => {
          setSwitchOpen(false);
          setTimeout(() => setCarried(null), 250);
        }}
        title={d.profile.switchTitle}
      >
        {carried === null ? (
          <>
            <div className="mb-4 flex items-start gap-3 rounded-2xl border border-line bg-coal p-3.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/12 text-brand">
                <IconSpark size={18} />
              </span>
              <p className="pt-0.5 text-[13.5px] leading-relaxed text-mute">{d.profile.switchBody}</p>
            </div>
            <div className="flex flex-col gap-2">
              {(["ent", "olymp", "school"] as Goal[]).map((g) => {
                const Icon = { ent: IconTarget, olymp: IconTrophy, school: IconBook }[g];
                const active = user.goal === g;
                return (
                  <button
                    key={g}
                    disabled={active}
                    onClick={() => doSwitch(g)}
                    className={`press flex items-center gap-3.5 rounded-2xl border p-3.5 text-left ${
                      active ? "border-brand bg-brand/8 opacity-60" : "border-line bg-coal hover:border-brand"
                    }`}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line2 bg-soot text-mute">
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
            <div className="font-display mt-2 text-4xl font-extrabold text-brand tabular-nums">{carried}</div>
            <Btn
              full
              size="lg"
              className="mt-5"
              onClick={() => {
                setSwitchOpen(false);
                setTimeout(() => setCarried(null), 250);
              }}
            >
              {d.common.done}
            </Btn>
          </div>
        )}
      </Modal>

      {/* ---------- reset modal ---------- */}
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
