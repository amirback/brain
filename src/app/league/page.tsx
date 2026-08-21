"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { streakLength, totalSeconds, useStore } from "@/lib/store";
import { Bar, Btn, Card, Reveal } from "@/components/ui";
import { IconBolt, IconClock, IconFlame, IconTrophy } from "@/components/Icons";

type Row = { id: string; name: string; elo: number; hours: number; streak: number; me: boolean };

export default function LeaguePage() {
  const { d } = useI18n();
  const { user, space, ready } = useStore();
  const [tab, setTab] = useState<"elo" | "hours">("elo");

  const rows: Row[] = useMemo(() => {
    const list: Row[] = Object.values(space.students).map((s) => ({
      id: s.code,
      name: s.name,
      elo: s.elo,
      hours: totalSeconds(s.secondsByDay) / 3600,
      streak: streakLength(s.streakDates),
      me: s.code === user?.code,
    }));
    return list.sort((a, b) => (tab === "elo" ? b.elo - a.elo : b.hours - a.hours));
  }, [space, user, tab]);

  const myIdx = rows.findIndex((r) => r.me);
  const ahead = myIdx > 0 ? rows[myIdx - 1] : null;
  const me = myIdx >= 0 ? rows[myIdx] : null;
  const gap = ahead && me ? (tab === "elo" ? ahead.elo - me.elo : ahead.hours - me.hours) : 0;
  const max = tab === "elo" ? Math.max(...rows.map((r) => r.elo), 1) : Math.max(...rows.map((r) => r.hours), 1);

  if (!ready) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
      <Reveal>
        <h1 className="font-display flex items-center gap-3 text-[clamp(26px,5.4vw,38px)] font-extrabold tracking-[-0.02em]">
          <IconTrophy size={30} />
          {d.lead.title}
        </h1>
        <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-mute">{d.lead.sub}</p>
      </Reveal>

      <Reveal delay={60}>
        <div className="mt-6 inline-flex rounded-2xl border border-line bg-mist p-1">
          {(["elo", "hours"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`press inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-bold transition-colors ${
                tab === t ? "bg-brand text-paper" : "text-mute hover:text-ink"
              }`}
            >
              {t === "elo" ? <IconBolt size={15} /> : <IconClock size={15} />}
              {t === "elo" ? d.lead.tabElo : d.lead.tabHours}
            </button>
          ))}
        </div>
      </Reveal>

      {ahead && gap > 0 && (
        <Reveal delay={100}>
          <Card className="mt-4 border-brand/35 bg-brand/6">
            <div className="flex items-center gap-3.5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand/15 text-[15px] font-extrabold text-brand">
                {ahead.name.slice(0, 1)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-bold">
                  {d.lead.catchUp}: {ahead.name}
                </div>
                <div className="mt-0.5 text-[12.5px] tabular-nums text-dim">
                  {tab === "elo" ? `${Math.round(gap)} ${d.common.elo}` : `${gap.toFixed(1)} ${d.common.hour}`}
                </div>
              </div>
            </div>
          </Card>
        </Reveal>
      )}

      {rows.length === 0 ? (
        <Reveal delay={120}>
          <Card className="mt-5 text-center">
            <p className="text-[14px] text-mute">{d.gates.needStart}</p>
            <Btn href="/start" className="mt-4">
              {d.nav.start}
            </Btn>
          </Card>
        </Reveal>
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          {rows.map((r, i) => {
            const val = tab === "elo" ? r.elo : r.hours;
            return (
              <Reveal key={r.id} delay={Math.min(300, i * 45)}>
                <div
                  className={`flex items-center gap-3.5 rounded-2xl border p-3.5 ${
                    r.me ? "border-brand bg-brand/8" : i === 0 ? "border-amber/35 bg-amber/5" : "border-line bg-card"
                  }`}
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[13px] font-extrabold tabular-nums ${
                      i === 0 ? "bg-amber text-ink" : r.me ? "bg-brand text-paper" : "bg-haze text-dim"
                    }`}
                  >
                    {i + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="truncate text-[15px] font-bold">{r.name}</span>
                      {r.me && (
                        <span className="shrink-0 rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand">
                          {d.lead.you}
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5">
                      <Bar value={val / max} h={5} tone={r.me ? "brand" : i === 0 ? "amber" : "dim"} />
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="font-display text-[17px] font-extrabold leading-none tabular-nums">
                      {tab === "elo" ? r.elo : r.hours.toFixed(1)}
                    </div>
                    <div className="mt-1 flex items-center justify-end gap-1 text-[11px] tabular-nums text-dim">
                      <IconFlame size={11} />
                      {r.streak}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
