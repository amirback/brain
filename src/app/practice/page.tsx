"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { QUESTIONS, topicById } from "@/lib/content";
import { formatForecast, isStuck, pickQuestion, readiness } from "@/lib/engine";
import { mockQuestions } from "@/lib/advisor";
import type { Question } from "@/lib/types";
import { QuestionCard } from "@/components/QuestionCard";
import { Bar, Btn, Card, Confetti, CountUp, Modal, Reveal } from "@/components/ui";
import { IconArrow, IconBolt, IconCheck, IconClock, IconCross, IconParent, IconTrend } from "@/components/Icons";

type Mode = "practice" | "checkpoint" | "mock" | "fix";
const LEN = { practice: 6, checkpoint: 5 } as const;

function PracticeInner() {
  const { d, pick, lang } = useI18n();
  const { user, ready, role, recordAnswer, finishCheckpoint, finishMock, requestHelp, unlock } = useStore();
  const router = useRouter();
  const params = useSearchParams();

  const mockId = params.get("mock");
  const fixId = params.get("fix");
  const topicParam = params.get("t");
  const mode: Mode = mockId ? "mock" : fixId ? "fix" : params.get("mode") === "checkpoint" ? "checkpoint" : "practice";

  const [step, setStep] = useState(0);
  const [asked, setAsked] = useState<string[]>([]);
  const [current, setCurrent] = useState<Question | null>(null);
  const [right, setRight] = useState(0);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [eloStart, setEloStart] = useState<number | null>(null);
  const [mStart, setMStart] = useState(0);
  const [fStart, setFStart] = useState(0);
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fire, setFire] = useState(0);
  const [stuckOpen, setStuckOpen] = useState(false);
  const [stuckSent, setStuckSent] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user || role !== "student") router.replace("/start");
  }, [ready, user, role, router]);

  const mock = user?.mocks.find((m) => m.id === (mockId ?? fixId)) ?? null;

  /** A mock test and a mistakes review both work from a fixed question list. */
  const fixedSet: Question[] = useMemo(() => {
    if (!user || !mock) return [];
    if (mode === "mock") return mockQuestions(mock, user.elo);
    if (mode === "fix") return QUESTIONS.filter((q) => (mock.wrongQids ?? []).includes(q.id));
    return [];
  }, [user, mock, mode]);

  const total = mode === "mock" || mode === "fix" ? Math.max(1, fixedSet.length) : LEN[mode];

  // snapshot the "before" numbers once, for the summary screen
  useEffect(() => {
    if (!user || eloStart !== null) return;
    setEloStart(user.elo);
    setMStart(topicParam ? (user.mastery[topicParam] ?? 0) : 0);
    setFStart(formatForecast(readiness(user, user.activeSubject), user.goal).numeric);
  }, [user, eloStart, topicParam]);

  // serve the next question
  useEffect(() => {
    if (!user || current || done) return;
    if (mode === "mock" || mode === "fix") {
      const q = fixedSet[step];
      if (q) setCurrent(q);
      else setDone(true);
      return;
    }
    const target = mode === "checkpoint" ? user.elo + 40 : user.elo + 60;
    const q = pickQuestion({
      subject: user.activeSubject,
      topic: topicParam ?? undefined,
      target,
      excludeIds: asked,
      answers: user.answers,
    });
    if (q) setCurrent(q);
    else setDone(true);
  }, [user, current, done, asked, mode, topicParam, fixedSet, step]);

  const onAnswered = (correct: boolean) => {
    if (!current) return;
    recordAnswer({
      qid: current.id, topic: current.topic, subject: current.subject,
      correct, difficulty: current.difficulty,
      mode: mode === "mock" || mode === "fix" ? "practice" : mode,
    });
    if (correct) setRight((r) => r + 1);
    else setWrongIds((w) => [...w, current.id]);
  };

  const onNext = () => {
    if (!current || !user) return;
    setAsked((a) => [...a, current.id]);
    setCurrent(null);

    if (topicParam && !stuckSent && isStuck(user.answers, topicParam)) setStuckOpen(true);

    if (step + 1 >= total) {
      if (mode === "checkpoint") finishCheckpoint();
      if (user.answers.length + 1 >= 20) unlock("tasks20");
      if (topicParam && (user.mastery[topicParam] ?? 0) >= 0.7) unlock("mastered");
      if (user.elo >= 1000) unlock("elo1000");
      setFire((f) => f + 1);
      setDone(true);
      return;
    }
    setStep((s) => s + 1);
  };

  // Record the mock result once, when its run finishes.
  useEffect(() => {
    if (!done || saved || mode !== "mock" || !mock) return;
    finishMock(mock.id, right, wrongIds, lang);
    setSaved(true);
  }, [done, saved, mode, mock, right, wrongIds, lang, finishMock]);

  const summary = useMemo(() => {
    if (!user) return null;
    const eloDelta = eloStart === null ? 0 : user.elo - eloStart;
    const mNow = topicParam ? (user.mastery[topicParam] ?? 0) : 0;
    const view = formatForecast(readiness(user, user.activeSubject), user.goal);
    return { eloDelta, mNow, mDelta: mNow - mStart, view, fDelta: view.numeric - fStart };
  }, [user, eloStart, mStart, fStart, topicParam]);

  if (!ready || !user) return null;

  const topic = topicParam ? topicById(topicParam) : null;
  const title =
    mode === "mock" ? d.mock.title
    : mode === "fix" ? d.mock.fixTitle
    : mode === "checkpoint" ? d.practice.checkTitle
    : topic ? pick(topic.title)
    : d.practice.title;

  /* ---------------- mock result ---------------- */
  if (done && mode === "mock" && mock && summary) {
    const pct = Math.round((right / total) * 100);
    return (
      <div className="relative mx-auto max-w-lg px-4 py-12">
        <div className="relative">
          <Confetti fire={fire} />
        </div>
        <Reveal>
          <h1 className="font-display text-center text-[clamp(24px,5.5vw,34px)] font-extrabold tracking-[-0.02em]">
            {d.mock.resultTitle}
          </h1>
        </Reveal>
        <Reveal delay={80}>
          <Card className="mt-7">
            <div className="text-center">
              <div className="font-display text-6xl font-extrabold tabular-nums">
                <CountUp to={right} />
                <span className="text-3xl text-dim"> / {total}</span>
              </div>
              <div className="mt-2 text-[13px] font-semibold text-mute tabular-nums">{pct}%</div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-5 text-center">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.mock.correct}</div>
                <div className="font-display mt-1.5 text-2xl font-extrabold tabular-nums text-brand">{right}</div>
              </div>
              <div className="border-l border-line">
                <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.mock.mistakes}</div>
                <div className="font-display mt-1.5 text-2xl font-extrabold tabular-nums">{wrongIds.length}</div>
              </div>
            </div>
          </Card>
        </Reveal>
        <Reveal delay={140}>
          <div className="mt-4 flex flex-col gap-2">
            {wrongIds.length > 0 && (
              <Btn href={`/practice?fix=${mock.id}`} size="lg" full className="arrow-slide">
                {d.mock.fixStart}
                <span className="arr">
                  <IconArrow size={18} />
                </span>
              </Btn>
            )}
            <Btn href="/dashboard" variant="outline" size="lg" full>
              {d.practice.toDash}
            </Btn>
          </div>
        </Reveal>
      </div>
    );
  }

  /* ---------------- fix / practice summary ---------------- */
  if (done && summary) {
    return (
      <div className="relative mx-auto max-w-lg px-4 py-12">
        <div className="relative">
          <Confetti fire={fire} />
        </div>
        <Reveal>
          <h1 className="font-display text-center text-[clamp(24px,5.5vw,34px)] font-extrabold tracking-[-0.02em]">
            {mode === "fix" ? d.mock.fixDone : d.practice.sessionDone}
          </h1>
          <p className="mt-2 text-center text-[14px] text-dim">{title}</p>
        </Reveal>

        <Reveal delay={80}>
          <Card className="mt-7">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.practice.accuracy}</div>
                <div className="font-display mt-1.5 text-2xl font-extrabold tabular-nums">
                  <CountUp to={Math.round((right / total) * 100)} suffix="%" />
                </div>
                <div className="mt-0.5 text-[11px] tabular-nums text-dim">
                  {right} / {total}
                </div>
              </div>
              <div className="border-x border-line">
                <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.practice.eloChange}</div>
                <div className="font-display mt-1.5 text-2xl font-extrabold tabular-nums">{user.elo}</div>
                <div className={`mt-0.5 text-[11px] font-bold tabular-nums ${summary.eloDelta >= 0 ? "text-brand" : "text-dim"}`}>
                  {summary.eloDelta >= 0 ? "+" : ""}
                  {summary.eloDelta}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.practice.forecastNow}</div>
                <div className="font-display mt-1.5 text-2xl font-extrabold tabular-nums">{summary.view.value}</div>
                <div className={`mt-0.5 text-[11px] font-bold tabular-nums ${summary.fDelta >= 0 ? "text-brand" : "text-dim"}`}>
                  {summary.fDelta >= 0 ? "+" : ""}
                  {summary.fDelta}
                </div>
              </div>
            </div>

            {topic && (
              <div className="mt-5 border-t border-line pt-4">
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-[12.5px] font-semibold text-mute">{d.practice.masteryUp}</span>
                  <span className="text-[12.5px] font-bold tabular-nums">
                    {Math.round(summary.mNow * 100)}%
                    {summary.mDelta > 0 && <span className="ml-1.5 text-brand">+{Math.round(summary.mDelta * 100)}</span>}
                  </span>
                </div>
                <Bar value={summary.mNow} />
              </div>
            )}
          </Card>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-4 flex gap-2">
            <Btn href="/dashboard" variant="outline" size="lg" full>
              {d.practice.toDash}
            </Btn>
            {mode === "practice" && (
              <Btn
                size="lg"
                full
                className="arrow-slide"
                onClick={() => {
                  setStep(0);
                  setRight(0);
                  setWrongIds([]);
                  setDone(false);
                  setCurrent(null);
                  setEloStart(user.elo);
                  setMStart(topicParam ? (user.mastery[topicParam] ?? 0) : 0);
                  setFStart(formatForecast(readiness(user, user.activeSubject), user.goal).numeric);
                }}
              >
                {d.practice.more}
                <span className="arr">
                  <IconArrow size={18} />
                </span>
              </Btn>
            )}
          </div>
        </Reveal>
      </div>
    );
  }

  /* ---------------- run ---------------- */
  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between gap-3 text-[12px] font-semibold">
          <span className="truncate text-paper">{title}</span>
          <span className="shrink-0 tabular-nums text-dim">
            {step + 1} / {total}
          </span>
        </div>
        <Bar value={step / total} h={5} />
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line2 px-2.5 py-1 text-[11px] font-bold tabular-nums text-mute">
          <IconBolt size={12} />
          {user.elo}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line2 px-2.5 py-1 text-[11px] font-bold tabular-nums text-mute">
          <IconTrend size={12} />
          {formatForecast(readiness(user, user.activeSubject), user.goal).value} /{" "}
          {formatForecast(readiness(user, user.activeSubject), user.goal).max}
        </span>
        {mode === "mock" && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber/40 bg-amber/10 px-2.5 py-1 text-[11px] font-bold text-amber">
            <IconClock size={12} />
            {d.mock.noHints}
          </span>
        )}
        {mode === "fix" && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-2.5 py-1 text-[11px] font-bold text-brand">
            <IconCross size={12} />
            {d.mock.fixTitle}
          </span>
        )}
      </div>

      {current && (
        <QuestionCard
          q={current}
          index={step}
          total={total}
          showHint={mode !== "mock"}
          onAnswered={onAnswered}
          onNext={onNext}
          lastOfSet={step === total - 1}
        />
      )}

      <Modal open={stuckOpen} onClose={() => setStuckOpen(false)} title={d.practice.stuckTitle}>
        {stuckSent ? (
          <div className="flex items-start gap-3 rounded-2xl border border-brand/40 bg-brand/8 p-4">
            <IconCheck size={20} />
            <p className="text-[14px] leading-relaxed text-mute">{d.practice.stuckSent}</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-start gap-3.5 rounded-2xl border border-line bg-coal p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/12 text-brand">
                <IconParent size={20} />
              </span>
              <p className="pt-0.5 text-[14px] leading-relaxed text-mute">{d.practice.stuckBody}</p>
            </div>
            <div className="flex gap-2">
              <Btn
                full
                onClick={() => {
                  if (topicParam) requestHelp(topicParam);
                  setStuckSent(true);
                }}
              >
                {d.practice.stuckCta}
              </Btn>
              <Btn variant="outline" onClick={() => setStuckOpen(false)}>
                {d.practice.stuckLater}
              </Btn>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-lg px-4 py-20 text-center text-dim">…</div>}>
      <PracticeInner />
    </Suspense>
  );
}
