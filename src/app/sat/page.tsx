"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { SAT_SETS, SAT_BLUEPRINT } from "@/lib/exam/sets";
import { pickEL } from "@/lib/exam/coach";
import { Btn, Card, Reveal, SectionLabel } from "@/components/ui";
import { IconArrow, IconChart, IconClock, IconTarget } from "@/components/Icons";

/** SAT hub: the practice blocks on one side, the full adaptive simulation on the other. */
export default function SatHub() {
  const { d, lang } = useI18n();
  const { user, ready, role } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!user || role !== "student") router.replace("/start");
  }, [ready, user, role, router]);

  const attempts = useMemo(() => user?.examAttempts ?? [], [user]);
  const lastMock = useMemo(() => attempts.find((a) => a.kind === "sat-mock"), [attempts]);

  const totalQuestions = SAT_BLUEPRINT.reduce((n, m) => n + m.count, 0);
  const totalMinutes = SAT_BLUEPRINT.reduce((n, m) => n + m.minutes, 0);

  if (!ready || !user) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <Reveal>
        <h1 className="font-display text-[clamp(28px,6vw,40px)] font-extrabold tracking-[-0.02em]">
          {d.exam.satTitle}
        </h1>
        <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-mute">{d.exam.satBlurb}</p>
      </Reveal>

      {/* ---- full test ---- */}
      <Reveal delay={70}>
        <Card className="mt-7 border-brand/35">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand/12 text-brand">
              <IconTarget size={21} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-[19px] font-extrabold">{d.exam.fullTest}</h2>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-mute">{d.exam.mockIntro}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4 text-center">
            <Stat label={d.exam.questions} value={String(totalQuestions)} />
            <Stat label={d.exam.minutes} value={String(totalMinutes)} bordered />
            <Stat label={d.exam.moduleLabel} value={String(SAT_BLUEPRINT.length)} bordered />
          </div>

          {lastMock?.sat && (
            <div className="mt-4 rounded-xl border border-line2 bg-coal px-3.5 py-3">
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-dim">{d.exam.lastResult}</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-2xl font-extrabold tabular-nums">{lastMock.sat.composite}</span>
                <span className="text-[12.5px] text-dim">/ 1600</span>
                <span className="ml-auto text-[12px] font-semibold tabular-nums text-mute">
                  RW {lastMock.sat.rw.scaled} · Math {lastMock.sat.math.scaled}
                </span>
              </div>
            </div>
          )}

          <Btn href="/sat/mock" size="lg" full className="arrow-slide mt-4">
            {lastMock ? d.exam.retake : d.exam.start}
            <span className="arr"><IconArrow size={18} /></span>
          </Btn>
        </Card>
      </Reveal>

      {/* ---- practice sets ---- */}
      <Reveal delay={120}>
        <SectionLabel>{d.exam.practiceSets}</SectionLabel>
      </Reveal>

      <div className="mt-3 flex flex-col gap-3">
        {SAT_SETS.map((s, i) => {
          const done = attempts.filter((a) => a.setId === s.id);
          const best = done.reduce(
            (m, a) => Math.max(m, a.results.filter((r) => r.correct).length),
            0
          );
          return (
            <Reveal key={s.id} delay={150 + i * 50}>
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-soot px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-dim">
                        {s.section === "rw" ? d.exam.sectionRW : d.exam.sectionMath}
                      </span>
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-dim">
                        {d.exam.level[s.difficulty]}
                      </span>
                    </div>
                    <h3 className="font-display mt-2 text-[17px] font-extrabold">{s.title}</h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-mute">{pickEL(s.subtitle, lang)}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-3.5 text-[12.5px] font-semibold text-dim">
                  <span className="inline-flex items-center gap-1.5">
                    <IconChart size={14} /> {s.items.length} {d.exam.questions}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <IconClock size={14} /> {s.minutes} {d.exam.minutes}
                  </span>
                  {done.length > 0 ? (
                    <span className="text-brand tabular-nums">
                      {d.exam.lastResult}: {best}/{s.items.length}
                    </span>
                  ) : (
                    <span>{d.exam.noAttempts}</span>
                  )}
                </div>

                <Btn href={`/sat/practice?set=${s.id}`} variant="outline" full className="mt-3.5">
                  {done.length > 0 ? d.exam.retake : d.exam.start}
                </Btn>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, bordered }: { label: string; value: string; bordered?: boolean }) {
  return (
    <div className={bordered ? "border-l border-line" : ""}>
      <div className="text-[10.5px] font-bold uppercase tracking-wider text-dim">{label}</div>
      <div className="font-display mt-1 text-2xl font-extrabold tabular-nums">{value}</div>
    </div>
  );
}
