"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { TOPICS } from "@/lib/content";
import { forecast, nextDiagnosticTopic, nextTarget, pickQuestion } from "@/lib/engine";
import type { Question } from "@/lib/types";
import { QuestionCard } from "@/components/QuestionCard";
import { Btn, Card, Confetti, CountUp, Bar, Reveal } from "@/components/ui";
import { IconArrow, IconBolt, IconMap, IconSpark, IconTrend } from "@/components/Icons";

const TOTAL = 9;

export default function DiagnosticPage() {
  const { d, pick } = useI18n();
  const { user, ready, recordAnswer, finishDiagnostic, unlock } = useStore();
  const router = useRouter();

  const [phase, setPhase] = useState<"intro" | "run" | "done">("intro");
  const [step, setStep] = useState(0);
  const [target, setTarget] = useState(850);
  const [asked, setAsked] = useState<string[]>([]);
  const [current, setCurrent] = useState<Question | null>(null);
  const [rightCount, setRightCount] = useState(0);
  const [fire, setFire] = useState(0);

  useEffect(() => {
    if (ready && !user) router.replace("/start");
  }, [ready, user, router]);

  const advance = (nextStep: number, nextT: number, excluded: string[]) => {
    const topic = nextDiagnosticTopic(nextStep);
    const q = pickQuestion({ topic, target: nextT, excludeIds: excluded, answers: user?.answers ?? [] });
    setCurrent(q);
  };

  const begin = () => {
    setPhase("run");
    advance(0, 850, []);
  };

  const onAnswered = (correct: boolean) => {
    if (!current) return;
    recordAnswer({ qid: current.id, topic: current.topic, correct, difficulty: current.difficulty, mode: "diagnostic" });
    if (correct) setRightCount((c) => c + 1);
    setTarget((t) => nextTarget(t, correct));
  };

  const onNext = () => {
    if (!current) return;
    const excluded = [...asked, current.id];
    setAsked(excluded);
    const nextStep = step + 1;
    if (nextStep >= TOTAL) {
      finishDiagnostic();
      unlock("firstDiag");
      setFire((f) => f + 1);
      setPhase("done");
      return;
    }
    setStep(nextStep);
    advance(nextStep, nextTarget(target, false) === target ? target : target, excluded);
  };

  // recompute the question whenever the target/step changes mid-run
  useEffect(() => {
    if (phase !== "run" || current) return;
    advance(step, target, asked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, step, target, current]);

  const score = useMemo(() => (user ? forecast(user) : 0), [user]);

  if (!ready || !user) return null;

  /* ---------------- intro ---------------- */
  if (phase === "intro") {
    return (
      <div className="relative overflow-hidden">
        <div className="glow-orb -top-28 left-1/2 h-[360px] w-[360px] -translate-x-1/2 opacity-60" aria-hidden="true" />
        <div className="relative mx-auto max-w-lg px-4 py-16 text-center">
          <Reveal>
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-3xl border border-line2 bg-card">
              <IconSpark size={30} />
            </div>
            <h1 className="font-display text-[clamp(30px,6.5vw,42px)] font-extrabold tracking-[-0.02em]">
              {d.diag.title}
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-[15.5px] leading-relaxed text-mute">{d.diag.sub}</p>
            <div className="mx-auto mt-7 grid max-w-xs grid-cols-3 gap-2">
              {TOPICS.map((t) => (
                <div key={t.id} className="rounded-2xl border border-line bg-card p-3">
                  <div className="text-[11px] font-bold leading-tight">{pick(t.title).split(" ")[0]}</div>
                  <div className="mt-1 text-[10px] text-dim tabular-nums">{Math.round(t.weight * 100)}%</div>
                </div>
              ))}
            </div>
            <Btn onClick={begin} size="lg" className="arrow-slide mt-8">
              {d.diag.begin}
              <span className="arr">
                <IconArrow size={18} />
              </span>
            </Btn>
            <p className="mt-4 text-[12.5px] text-dim">{d.diag.skipNote}</p>
          </Reveal>
        </div>
      </div>
    );
  }

  /* ---------------- run ---------------- */
  if (phase === "run") {
    return (
      <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between text-[12px] font-semibold text-dim">
            <span>{d.diag.title}</span>
            <span className="tabular-nums">
              {step + 1} / {TOTAL}
            </span>
          </div>
          <Bar value={(step + (current ? 0 : 1)) / TOTAL} h={5} />
        </div>
        {current && (
          <QuestionCard
            q={current}
            index={step}
            total={TOTAL}
            showHint={false}
            allowSkip
            onAnswered={onAnswered}
            onNext={onNext}
            lastOfSet={step === TOTAL - 1}
          />
        )}
      </div>
    );
  }

  /* ---------------- result ---------------- */
  return (
    <div className="relative mx-auto max-w-2xl px-4 py-12">
      <div className="relative">
        <Confetti fire={fire} />
      </div>
      <Reveal>
        <h1 className="font-display text-center text-[clamp(26px,5.5vw,38px)] font-extrabold tracking-[-0.02em]">
          {d.diag.resultTitle}
        </h1>
      </Reveal>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Reveal delay={80}>
          <Card className="h-full">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-dim">
              <IconBolt size={15} />
              {d.diag.resultElo}
            </div>
            <div className="font-display mt-2 text-5xl font-extrabold tabular-nums">
              <CountUp to={user.elo} />
            </div>
            <div className="mt-1 text-[12.5px] text-dim">
              {rightCount} / {TOTAL} · {Math.round((rightCount / TOTAL) * 100)}%
            </div>
          </Card>
        </Reveal>

        <Reveal delay={140}>
          <Card className="h-full">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-dim">
              <IconTrend size={15} />
              {d.diag.resultForecast}
            </div>
            <div className="font-display mt-2 flex items-end gap-2 text-5xl font-extrabold tabular-nums">
              <CountUp to={score} />
              <span className="mb-1.5 text-xl text-dim">/ 50</span>
            </div>
            <div className="mt-1 text-[12.5px] text-dim">{d.diag.resultForecastNote}</div>
          </Card>
        </Reveal>
      </div>

      <Reveal delay={200}>
        <Card className="mt-3">
          <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-dim">
            <IconMap size={15} />
            {d.dash.mapTitle}
          </div>
          <div className="flex flex-col gap-3.5">
            {TOPICS.map((t) => {
              const m = user.mastery[t.id] ?? 0;
              return (
                <div key={t.id}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="text-[14px] font-semibold">{pick(t.title)}</span>
                    <span className="text-[12px] font-bold tabular-nums text-mute">{Math.round(m * 100)}%</span>
                  </div>
                  <Bar value={m} tone={m < 0.35 ? "dim" : m < 0.7 ? "amber" : "brand"} />
                </div>
              );
            })}
          </div>
        </Card>
      </Reveal>

      <Reveal delay={260}>
        <Btn href="/dashboard" size="lg" full className="arrow-slide mt-5">
          {d.diag.toPlan}
          <span className="arr">
            <IconArrow size={18} />
          </span>
        </Btn>
      </Reveal>
    </div>
  );
}
