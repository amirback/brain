"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import {
  drawModule, MIX_EASIER, MIX_HARDER, MIX_MIXED, poolFor,
  SAT_BLUEPRINT, SAT_BREAK_AFTER, SAT_BREAK_MINUTES, seededRandom,
} from "@/lib/exam/sets";
import { gradeItems, routesToHard, satReport } from "@/lib/exam/scoring";
import { pickEL, verdict } from "@/lib/exam/coach";
import type { Attempt, ExamItem, ItemResult } from "@/lib/exam/types";
import { Runner, type RunnerDone } from "@/components/exam/Runner";
import { runnerLabels } from "@/components/exam/labels";
import { Review, SkillTable } from "@/components/exam/Review";
import { Bar, Btn, Card, Confetti, CountUp, Reveal } from "@/components/ui";
import { IconArrow, IconChart, IconClock, IconTarget } from "@/components/Icons";

/**
 * Full digital SAT simulation.
 *
 * The part that matters is the routing: module 1 is graded the moment it is
 * submitted, and its raw score decides whether module 2 is drawn from the harder
 * or the easier mix — which in turn caps or unlocks the top of that section's
 * scale. That is the actual mechanic of the real test, and it is why a "short demo
 * test" cannot stand in for it.
 */
export default function SatMockPage() {
  const { d, lang } = useI18n();
  const { user, ready, role, saveAttempt } = useStore();
  const router = useRouter();

  const [phase, setPhase] = useState<"intro" | "module" | "break" | "report">("intro");
  const [stage, setStage] = useState(0);
  const [modules, setModules] = useState<ExamItem[][]>([]);
  const [results, setResults] = useState<ItemResult[][]>([]);
  const [routed, setRouted] = useState<{ rw: boolean; math: boolean }>({ rw: false, math: false });
  const [breakLeft, setBreakLeft] = useState(SAT_BREAK_MINUTES * 60);
  const [fire, setFire] = useState(0);
  // Both are stamped when the test actually begins, not during render.
  const seed = useRef(0);
  const startedAt = useRef(0);

  useEffect(() => {
    if (!ready) return;
    if (!user || role !== "student") router.replace("/start");
  }, [ready, user, role, router]);

  /** Builds the module about to be shown, using the routing decided so far. */
  const buildStage = useCallback((index: number, routing: { rw: boolean; math: boolean }, prior: ExamItem[][]) => {
    const spec = SAT_BLUEPRINT[index];
    const rand = seededRandom(seed.current + index * 7919);
    const exclude = new Set(prior.flat().map((i) => i.id));
    const mix =
      spec.stage === 1
        ? MIX_MIXED
        : (spec.section === "rw" ? routing.rw : routing.math)
          ? MIX_HARDER
          : MIX_EASIER;
    return drawModule(poolFor(spec.section), spec.count, mix, exclude, rand);
  }, []);

  const begin = useCallback(() => {
    seed.current = Date.now();
    startedAt.current = Date.now();
    const first = buildStage(0, { rw: false, math: false }, []);
    setModules([first]);
    setResults([]);
    setRouted({ rw: false, math: false });
    setStage(0);
    setPhase("module");
  }, [buildStage]);

  const finishModule = useCallback((r: RunnerDone) => {
    const spec = SAT_BLUEPRINT[stage];
    const graded = gradeItems(modules[stage], r.answers, r.seconds);
    const nextResults = [...results, graded];
    setResults(nextResults);

    // Module 1 of a section decides the form of module 2.
    let nextRouting = routed;
    if (spec.stage === 1) {
      const hard = routesToHard(graded.filter((g) => g.correct).length, graded.length);
      nextRouting = spec.section === "rw" ? { ...routed, rw: hard } : { ...routed, math: hard };
      setRouted(nextRouting);
    }

    const nextStage = stage + 1;
    if (nextStage >= SAT_BLUEPRINT.length) {
      setPhase("report");
      setFire((f) => f + 1);
      return;
    }

    const nextModule = buildStage(nextStage, nextRouting, modules);
    setModules((m) => [...m, nextModule]);
    setStage(nextStage);
    if (spec.id === SAT_BREAK_AFTER) {
      setBreakLeft(SAT_BREAK_MINUTES * 60);
      setPhase("break");
    } else {
      setPhase("module");
    }
  }, [stage, modules, results, routed, buildStage]);

  /* The break clock, which resumes the test on its own when it runs out. */
  useEffect(() => {
    if (phase !== "break") return;
    const iv = window.setInterval(() => {
      setBreakLeft((v) => {
        if (v <= 1) {
          window.clearInterval(iv);
          setPhase("module");
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => window.clearInterval(iv);
  }, [phase]);

  /* The report, assembled once every module is in. */
  const report = useMemo(() => {
    if (results.length < SAT_BLUEPRINT.length) return null;
    const rw = [...results[0], ...results[1]];
    const math = [...results[2], ...results[3]];
    return satReport({
      rw: { results: rw, routedHard: routed.rw },
      math: { results: math, routedHard: routed.math },
    });
  }, [results, routed]);

  const savedRef = useRef(false);
  useEffect(() => {
    if (phase !== "report" || !report || savedRef.current) return;
    savedRef.current = true;
    const attempt: Attempt = {
      id: `a${Date.now()}`,
      kind: "sat-mock",
      setId: "sat-full",
      title: "SAT — full test",
      startedAt: startedAt.current,
      finishedAt: Date.now(),
      results: results.flat(),
      sat: report,
    };
    saveAttempt(attempt);
  }, [phase, report, results, saveAttempt]);

  if (!ready || !user) return null;

  /* ---------------- intro ---------------- */
  if (phase === "intro") {
    const totalQ = SAT_BLUEPRINT.reduce((n, m) => n + m.count, 0);
    const totalMin = SAT_BLUEPRINT.reduce((n, m) => n + m.minutes, 0) + SAT_BREAK_MINUTES;
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <Reveal>
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-3xl border border-line2 bg-card">
            <IconTarget size={30} />
          </div>
          <h1 className="font-display text-center text-[clamp(24px,5.5vw,34px)] font-extrabold tracking-[-0.02em]">
            {d.exam.satTitle} — {d.exam.fullTest}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-center text-[14.5px] leading-relaxed text-mute">
            {d.exam.mockIntro}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <Card className="mt-7">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.exam.questions}</div>
                <div className="font-display mt-1.5 text-3xl font-extrabold tabular-nums">{totalQ}</div>
              </div>
              <div className="border-l border-line">
                <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.exam.minutes}</div>
                <div className="font-display mt-1.5 text-3xl font-extrabold tabular-nums">{totalMin}</div>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-2 border-t border-line pt-4">
              {SAT_BLUEPRINT.map((m) => (
                <div key={m.id} className="flex items-center justify-between text-[13px]">
                  <span className="font-semibold">{m.title}</span>
                  <span className="tabular-nums text-dim">
                    {m.count} · {m.minutes} {d.exam.minutes}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between text-[13px] text-dim">
                <span className="font-semibold">{d.exam.breakTitle}</span>
                <span className="tabular-nums">{SAT_BREAK_MINUTES} {d.exam.minutes}</span>
              </div>
            </div>
          </Card>
        </Reveal>

        <Reveal delay={130}>
          <Card className="mt-4 border-brand/30">
            <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.exam.adaptiveTitle}</div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-mute">{d.exam.routingNote}</p>
          </Card>
        </Reveal>

        <Reveal delay={180}>
          <Btn size="lg" full className="arrow-slide mt-5" onClick={begin}>
            {d.exam.start}
            <span className="arr"><IconArrow size={18} /></span>
          </Btn>
        </Reveal>
      </div>
    );
  }

  /* ---------------- break ---------------- */
  if (phase === "break") {
    const mm = String(Math.floor(breakLeft / 60)).padStart(2, "0");
    const ss = String(breakLeft % 60).padStart(2, "0");
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <Reveal>
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-3xl border border-line2 bg-card">
            <IconClock size={30} />
          </div>
          <h1 className="font-display text-[clamp(24px,5.5vw,32px)] font-extrabold">{d.exam.breakTitle}</h1>
          <p className="mx-auto mt-3 max-w-sm text-[14.5px] leading-relaxed text-mute">{d.exam.breakBody}</p>
          <div className="font-display mt-8 text-6xl font-extrabold tabular-nums">{mm}:{ss}</div>
          <div className="mx-auto mt-4 max-w-xs">
            <Bar value={1 - breakLeft / (SAT_BREAK_MINUTES * 60)} h={5} />
          </div>
          <Btn variant="outline" size="lg" className="mt-8" onClick={() => setPhase("module")}>
            {d.exam.breakSkip}
          </Btn>
        </Reveal>
      </div>
    );
  }

  /* ---------------- a module ---------------- */
  if (phase === "module") {
    const spec = SAT_BLUEPRINT[stage];
    const items = modules[stage];
    if (!spec || !items) return null;
    return (
      <div>
        <div className="mx-auto max-w-2xl px-4 pt-5">
          <div className="flex items-center justify-between text-[11.5px] font-bold uppercase tracking-wider text-dim">
            <span>{d.exam.moduleLabel} {stage + 1} / {SAT_BLUEPRINT.length}</span>
            {spec.stage === 2 && (
              <span className={(spec.section === "rw" ? routed.rw : routed.math) ? "text-brand" : "text-amber"}>
                {(spec.section === "rw" ? routed.rw : routed.math) ? d.exam.routedHard : d.exam.routedEasy}
              </span>
            )}
          </div>
        </div>
        <Runner
          key={spec.id}
          items={items}
          minutes={spec.minutes}
          title={spec.title}
          labels={runnerLabels(d)}
          onDone={finishModule}
        />
      </div>
    );
  }

  /* ---------------- report ---------------- */
  if (!report) return null;
  const allItems = modules.flat();
  const allResults = results.flat();
  const share = allResults.filter((r) => r.correct).length / Math.max(1, allResults.length);
  const v = verdict(report.bySkill, share);

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
            <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.exam.composite}</div>
            <div className="font-display mt-1 text-6xl font-extrabold tabular-nums">
              <CountUp to={report.composite} />
              <span className="text-3xl text-dim"> / 1600</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
            <SectionCard
              title={d.exam.sectionRW}
              scaled={report.rw.scaled}
              raw={report.rw.raw}
              total={report.rw.total}
              hard={report.rw.routedHard}
              rawLabel={d.exam.rawScore}
              routeLabel={report.rw.routedHard ? d.exam.routedHard : d.exam.routedEasy}
            />
            <SectionCard
              title={d.exam.sectionMath}
              scaled={report.math.scaled}
              raw={report.math.raw}
              total={report.math.total}
              hard={report.math.routedHard}
              rawLabel={d.exam.rawScore}
              routeLabel={report.math.routedHard ? d.exam.routedHard : d.exam.routedEasy}
              bordered
            />
          </div>
        </Card>
      </Reveal>

      <Reveal delay={110}>
        <Card className="mt-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.exam.adaptiveTitle}</div>
          <p className="mt-2 text-[13.5px] leading-relaxed text-mute">{d.exam.adaptiveBody}</p>
          <p className="mt-3 border-t border-line pt-3 text-[13.5px] leading-relaxed text-mute">
            {report.rw.routedHard && report.math.routedHard
              ? d.exam.routingHardNote
              : d.exam.routingEasyNote}
          </p>
        </Card>
      </Reveal>

      <Reveal delay={150}>
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

      <Reveal delay={190}>
        <SkillTable rows={report.bySkill} title={d.exam.bySkill} />
      </Reveal>

      <Reveal delay={220}>
        <h2 className="font-display mt-8 text-[19px] font-extrabold">{d.exam.toFix}</h2>
        <p className="mt-1.5 text-[13.5px] text-mute">{d.exam.fixBlurb}</p>
        <div className="mt-4">
          <Review items={allItems} results={allResults} pool={[...poolFor("rw"), ...poolFor("math")]} />
        </div>
      </Reveal>

      <div className="mt-8 flex flex-col gap-2">
        <Btn href="/sat" variant="outline" size="lg" full>{d.exam.satTitle}</Btn>
        <Btn href="/dashboard" variant="ghost" size="lg" full>{d.practice.toDash}</Btn>
      </div>
    </div>
  );
}

function SectionCard({
  title, scaled, raw, total, hard, rawLabel, routeLabel, bordered,
}: {
  title: string; scaled: number; raw: number; total: number; hard: boolean;
  rawLabel: string; routeLabel: string; bordered?: boolean;
}) {
  return (
    <div className={bordered ? "border-l border-line pl-4" : ""}>
      <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{title}</div>
      <div className="font-display mt-1 text-3xl font-extrabold tabular-nums">{scaled}</div>
      <div className="mt-1 text-[12px] tabular-nums text-dim">
        {rawLabel} {raw}/{total}
      </div>
      <div className={`mt-2 inline-block rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
        hard ? "bg-brand/12 text-brand" : "bg-amber/12 text-amber"
      }`}>
        {routeLabel}
      </div>
    </div>
  );
}
