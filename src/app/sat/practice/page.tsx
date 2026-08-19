"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { satSetById, SAT_MATH_POOL, SAT_RW_POOL } from "@/lib/exam/sets";
import { breakdown, gradeItems } from "@/lib/exam/scoring";
import { pickEL, verdict } from "@/lib/exam/coach";
import type { Attempt, ItemResult } from "@/lib/exam/types";
import { Runner, type RunnerDone } from "@/components/exam/Runner";
import { runnerLabels } from "@/components/exam/labels";
import { Review, SkillTable } from "@/components/exam/Review";
import { Btn, Card, Confetti, CountUp, Reveal } from "@/components/ui";
import { IconArrow, IconChart, IconClock } from "@/components/Icons";

/**
 * One practice block, start to finish: brief, timed run, score, and then the
 * per-question review that the whole trainer is built around.
 */
function PracticeInner() {
  const { d, lang } = useI18n();
  const { user, ready, role, recordAnswer, saveAttempt } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const setId = params.get("set");

  const [phase, setPhase] = useState<"intro" | "run" | "done">("intro");
  const [results, setResults] = useState<ItemResult[] | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [fire, setFire] = useState(0);

  useEffect(() => {
    if (!ready) return;
    if (!user || role !== "student") router.replace("/start");
  }, [ready, user, role, router]);

  const set = useMemo(() => (setId ? satSetById(setId) : undefined), [setId]);
  const pool = set?.section === "math" ? SAT_MATH_POOL : SAT_RW_POOL;

  const finish = useCallback((r: RunnerDone) => {
    if (!set) return;
    const graded = gradeItems(set.items, r.answers, r.seconds);
    setResults(graded);
    setElapsed(Object.values(r.seconds).reduce((a, b) => a + b, 0));
    setFire((f) => f + 1);
    setPhase("done");

    // Practice still feeds the adaptive model, so the dashboard forecast moves.
    for (const item of set.items) {
      const res = graded.find((g) => g.id === item.id);
      if (!res) continue;
      recordAnswer({
        qid: item.id,
        topic: item.topic,
        subject: "sat",
        correct: res.correct,
        difficulty: item.difficulty === "hard" ? 1300 : item.difficulty === "medium" ? 1050 : 850,
        mode: "practice",
      });
    }

    const attempt: Attempt = {
      id: `a${Date.now()}`,
      kind: "sat-practice",
      setId: set.id,
      title: set.title,
      startedAt: Date.now() - Math.round(elapsed * 1000),
      finishedAt: Date.now(),
      results: graded,
    };
    saveAttempt(attempt);
  }, [set, recordAnswer, saveAttempt, elapsed]);

  if (!ready || !user) return null;

  if (!set) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-[15px] text-mute">{d.exam.noAttempts}</p>
        <Btn href="/sat" className="mt-5">{d.exam.satTitle}</Btn>
      </div>
    );
  }

  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <Reveal>
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-3xl border border-line2 bg-card">
            <IconClock size={30} />
          </div>
          <h1 className="font-display text-center text-[clamp(24px,5.5vw,34px)] font-extrabold tracking-[-0.02em]">
            {set.title}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-center text-[14.5px] leading-relaxed text-mute">
            {pickEL(set.subtitle, lang)}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <Card className="mt-7">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.exam.questions}</div>
                <div className="font-display mt-1.5 text-3xl font-extrabold tabular-nums">{set.items.length}</div>
              </div>
              <div className="border-l border-line">
                <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.exam.minutes}</div>
                <div className="font-display mt-1.5 text-3xl font-extrabold tabular-nums">{set.minutes}</div>
              </div>
            </div>
            <p className="mt-5 border-t border-line pt-4 text-[13px] leading-relaxed text-mute">
              {d.exam.reviewSub}
            </p>
          </Card>
        </Reveal>
        <Reveal delay={140}>
          <Btn size="lg" full className="arrow-slide mt-5" onClick={() => setPhase("run")}>
            {d.exam.start}
            <span className="arr"><IconArrow size={18} /></span>
          </Btn>
        </Reveal>
      </div>
    );
  }

  if (phase === "run") {
    return (
      <Runner
        items={set.items}
        passages={set.passages}
        minutes={set.minutes}
        title={set.title}
        labels={runnerLabels(d)}
        onDone={finish}
      />
    );
  }

  /* ---------------- results ---------------- */
  if (!results) return null;
  const score = results.filter((r) => r.correct).length;
  const share = score / results.length;
  const rows = breakdown(results);
  const v = verdict(rows, share);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="relative"><Confetti fire={fire} /></div>

      <Reveal>
        <h1 className="font-display text-center text-[clamp(24px,5.5vw,34px)] font-extrabold tracking-[-0.02em]">
          {d.exam.resultTitle}
        </h1>
      </Reveal>

      <Reveal delay={70}>
        <Card className="mt-6">
          <div className="text-center">
            <div className="font-display text-6xl font-extrabold tabular-nums">
              <CountUp to={score} />
              <span className="text-3xl text-dim"> / {results.length}</span>
            </div>
            <div className="mt-2 text-[13px] font-semibold tabular-nums text-mute">{Math.round(share * 100)}%</div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5 text-center">
            <div>
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-dim">{d.exam.correct}</div>
              <div className="font-display mt-1.5 text-xl font-extrabold tabular-nums text-brand">{score}</div>
            </div>
            <div className="border-l border-line">
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-dim">{d.exam.mistakes}</div>
              <div className="font-display mt-1.5 text-xl font-extrabold tabular-nums">{results.length - score}</div>
            </div>
            <div className="border-l border-line">
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-dim">{d.exam.timeSpent}</div>
              <div className="font-display mt-1.5 text-xl font-extrabold tabular-nums">
                {Math.round(elapsed / 60)}
              </div>
            </div>
          </div>
        </Card>
      </Reveal>

      <Reveal delay={110}>
        <Card className="mt-4 border-brand/30">
          <div className="flex items-start gap-2.5">
            <IconChart size={18} />
            <div>
              <h2 className="font-display text-[15.5px] font-extrabold">{pickEL(v.headline, lang)}</h2>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-mute">{pickEL(v.detail, lang)}</p>
            </div>
          </div>
        </Card>
      </Reveal>

      <Reveal delay={150}>
        <SkillTable rows={rows} title={d.exam.bySkill} />
      </Reveal>

      <Reveal delay={190}>
        <h2 className="font-display mt-8 text-[19px] font-extrabold">{d.exam.toFix}</h2>
        <p className="mt-1.5 text-[13.5px] text-mute">{d.exam.fixBlurb}</p>
        <div className="mt-4">
          <Review items={set.items} results={results} pool={pool} />
        </div>
      </Reveal>

      <div className="mt-8 flex flex-col gap-2">
        <Btn href="/sat" variant="outline" size="lg" full>{d.exam.satTitle}</Btn>
        <Btn href="/dashboard" variant="ghost" size="lg" full>{d.practice.toDash}</Btn>
      </div>
    </div>
  );
}

export default function SatPracticePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-lg px-4 py-20 text-center text-dim">…</div>}>
      <PracticeInner />
    </Suspense>
  );
}
