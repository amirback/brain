"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { topicById } from "@/lib/content";
import { mockQuestions } from "@/lib/advisor";
import type { Question } from "@/lib/types";
import { Bar, Btn, Card, Confetti, CountUp, Modal, Reveal } from "@/components/ui";
import { IconArrow, IconClock, IconGrid } from "@/components/Icons";

/**
 * Mock test in the shape of a real digital exam (Bluebook-style):
 * a running clock, a question navigator, "mark for review", free movement
 * between questions, and a review screen before submitting. Nothing is graded
 * until the student submits.
 */

const SECONDS_PER_QUESTION = 75;

function MockInner() {
  const { d, pick, lang } = useI18n();
  const { user, ready, role, recordAnswer, finishMock } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const mockId = params.get("id");

  const [phase, setPhase] = useState<"intro" | "run" | "review" | "done">("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [navOpen, setNavOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [left, setLeft] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [result, setResult] = useState<{ score: number; wrong: string[] } | null>(null);
  const [fire, setFire] = useState(0);

  useEffect(() => {
    if (!ready) return;
    if (!user || role !== "student") router.replace("/start");
  }, [ready, user, role, router]);

  const mock = user?.mocks.find((m) => m.id === mockId) ?? null;

  const questions: Question[] = useMemo(
    () => (user && mock ? mockQuestions(mock, user.elo) : []),
    [user, mock]
  );

  const total = questions.length;
  const answeredCount = Object.keys(answers).length;

  const submit = useCallback(() => {
    if (!user || !mock || phase === "done") return;
    let score = 0;
    const wrong: string[] = [];
    for (const q of questions) {
      const picked = answers[q.id];
      const correct = picked === q.correct;
      if (correct) score += 1;
      else wrong.push(q.id);
      // Every answer still feeds the adaptive model, exactly like practice.
      recordAnswer({
        qid: q.id, topic: q.topic, subject: q.subject,
        correct, difficulty: q.difficulty, mode: "practice",
      });
    }
    finishMock(mock.id, score, wrong, lang);
    setResult({ score, wrong });
    setFire((f) => f + 1);
    setPhase("done");
  }, [user, mock, questions, answers, phase, recordAnswer, finishMock, lang]);

  // The clock only runs while the test is open.
  useEffect(() => {
    if (phase !== "run" && phase !== "review") return;
    const iv = window.setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          window.clearInterval(iv);
          setTimedOut(true);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => window.clearInterval(iv);
  }, [phase]);

  useEffect(() => {
    // Клиентские данные (localStorage, язык браузера, скролл) во время SSR
   // прочитать нельзя — только после монтирования. Это требуемый паттерн,
   // а не каскад рендеров.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (timedOut && phase !== "done") submit();
  }, [timedOut, phase, submit]);

  if (!ready || !user) return null;

  if (!mock || total === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-[15px] text-mute">{d.mock.noneYet}</p>
        <Btn href="/dashboard" className="mt-5">
          {d.practice.toDash}
        </Btn>
      </div>
    );
  }

  const q = questions[index];
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const lowTime = left > 0 && left < 120;

  /* ---------------- intro ---------------- */
  if (phase === "intro") {
    const names = mock.topics.map((t) => topicById(t)).filter(Boolean).map((t) => pick(t!.title));
    return (
      <div className="mx-auto max-w-lg px-4 py-12 sm:py-16">
        <Reveal>
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-3xl border border-line2 bg-card">
            <IconClock size={30} />
          </div>
          <h1 className="font-display text-center text-[clamp(26px,5.6vw,36px)] font-extrabold tracking-[-0.02em]">
            {d.mock.title}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-center text-[14.5px] leading-relaxed text-mute">
            {d.mock.bbDirections}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <Card className="mt-7">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.mock.questions}</div>
                <div className="font-display mt-1.5 text-3xl font-extrabold tabular-nums">{total}</div>
              </div>
              <div className="border-l border-line">
                <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.mock.bbTimer}</div>
                <div className="font-display mt-1.5 text-3xl font-extrabold tabular-nums">
                  {Math.round((total * SECONDS_PER_QUESTION) / 60)} {d.common.min}
                </div>
              </div>
            </div>
            <div className="mt-5 border-t border-line pt-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.teacher.giveTopic}</div>
              <div className="mt-1.5 text-[14px] font-semibold">{names.join(" · ")}</div>
            </div>
          </Card>
        </Reveal>

        <Reveal delay={140}>
          <Btn
            size="lg"
            full
            className="arrow-slide mt-5"
            onClick={() => {
              setLeft(total * SECONDS_PER_QUESTION);
              setPhase("run");
            }}
          >
            {d.mock.bbStart}
            <span className="arr">
              <IconArrow size={18} />
            </span>
          </Btn>
        </Reveal>
      </div>
    );
  }

  /* ---------------- result ---------------- */
  if (phase === "done" && result) {
    const pct = Math.round((result.score / total) * 100);
    return (
      <div className="relative mx-auto max-w-lg px-4 py-12">
        <div className="relative">
          <Confetti fire={fire} />
        </div>
        <Reveal>
          <h1 className="font-display text-center text-[clamp(24px,5.5vw,34px)] font-extrabold tracking-[-0.02em]">
            {d.mock.resultTitle}
          </h1>
          {timedOut && <p className="mt-2 text-center text-[13px] font-semibold text-amber">{d.mock.bbTimeUp}</p>}
        </Reveal>
        <Reveal delay={80}>
          <Card className="mt-7">
            <div className="text-center">
              <div className="font-display text-6xl font-extrabold tabular-nums">
                <CountUp to={result.score} />
                <span className="text-3xl text-dim"> / {total}</span>
              </div>
              <div className="mt-2 text-[13px] font-semibold tabular-nums text-mute">{pct}%</div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-5 text-center">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.mock.correct}</div>
                <div className="font-display mt-1.5 text-2xl font-extrabold tabular-nums text-brand">{result.score}</div>
              </div>
              <div className="border-l border-line">
                <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.mock.mistakes}</div>
                <div className="font-display mt-1.5 text-2xl font-extrabold tabular-nums">{result.wrong.length}</div>
              </div>
            </div>
          </Card>
        </Reveal>
        <Reveal delay={140}>
          <div className="mt-4 flex flex-col gap-2">
            {result.wrong.length > 0 && (
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

  /* ---------------- review screen ---------------- */
  if (phase === "review") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
        <ExamBar left={`${mm}:${ss}`} lowTime={lowTime} label={d.mock.bbTimer} onNav={() => setNavOpen(true)} navLabel={d.mock.bbNav} />
        <h1 className="font-display mt-6 text-2xl font-extrabold">{d.mock.bbReview}</h1>
        <p className="mt-2 text-[14px] text-mute">{d.mock.bbReviewSub}</p>

        <div className="mt-4 flex flex-wrap gap-3 text-[12.5px] font-semibold">
          <span className="text-brand tabular-nums">
            {answeredCount} {d.mock.bbAnswered}
          </span>
          <span className="text-dim tabular-nums">
            {total - answeredCount} {d.mock.bbUnanswered}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-5 gap-2 sm:grid-cols-8">
          {questions.map((qq, i) => {
            const done = answers[qq.id] !== undefined;
            const isMarked = marked[qq.id];
            return (
              <button
                key={qq.id}
                onClick={() => {
                  setIndex(i);
                  setPhase("run");
                }}
                className={`press relative grid h-12 place-items-center rounded-xl border text-[14px] font-bold tabular-nums transition-colors ${
                  done ? "border-brand bg-brand/12 text-brand" : "border-line bg-mist text-dim hover:border-line2"
                }`}
              >
                {i + 1}
                {isMarked && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-amber" />}
              </button>
            );
          })}
        </div>

        <Btn size="lg" full className="mt-6" onClick={() => setConfirmOpen(true)}>
          {d.mock.bbSubmit}
        </Btn>

        <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title={d.mock.bbConfirm}>
          <p className="text-[14px] leading-relaxed text-mute">{d.mock.bbConfirmBody}</p>
          <div className="mt-5 flex gap-2">
            <Btn variant="outline" full onClick={() => setConfirmOpen(false)}>
              {d.common.cancel}
            </Btn>
            <Btn full onClick={submit}>
              {d.mock.bbSubmit}
            </Btn>
          </div>
        </Modal>

        <NavSheet
          open={navOpen}
          onClose={() => setNavOpen(false)}
          questions={questions}
          answers={answers}
          marked={marked}
          onPick={(i) => {
            setIndex(i);
            setPhase("run");
            setNavOpen(false);
          }}
          d={d}
        />
      </div>
    );
  }

  /* ---------------- running the test ---------------- */
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-8">
      <ExamBar left={`${mm}:${ss}`} lowTime={lowTime} label={d.mock.bbTimer} onNav={() => setNavOpen(true)} navLabel={d.mock.bbNav} />

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-[12.5px] font-bold tabular-nums text-dim">
          {d.mock.bbQuestion} {index + 1} {d.mock.bbOf} {total}
        </span>
        <button
          onClick={() => setMarked((m) => ({ ...m, [q.id]: !m[q.id] }))}
          className={`press inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[12px] font-bold transition-colors ${
            marked[q.id] ? "border-amber bg-amber/12 text-amber" : "border-line2 text-mute hover:border-amber hover:text-amber"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${marked[q.id] ? "bg-amber" : "bg-line2"}`} />
          {marked[q.id] ? d.mock.bbMarked : d.mock.bbMark}
        </button>
      </div>

      <div className="mt-2">
        <Bar value={(index + 1) / total} h={4} />
      </div>

      <div key={q.id} className="slide-up mt-5 rounded-3xl border border-line bg-card p-5 sm:p-6">
        <p className="font-display text-[19px] font-bold leading-snug sm:text-[21px]">{pick(q.stem)}</p>
        <div className="mt-5 flex flex-col gap-2">
          {q.options.map((o, i) => {
            const picked = answers[q.id] === i;
            return (
              <button
                key={i}
                onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                className={`press flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
                  picked ? "border-brand bg-brand/8" : "border-line bg-mist hover:border-line2"
                }`}
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[12px] font-extrabold ${
                    picked ? "bg-brand text-paper" : "bg-haze text-dim"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1 text-[15px] font-semibold">{pick(o)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Btn variant="outline" size="lg" disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))}>
          {d.mock.bbBack}
        </Btn>
        {index === total - 1 ? (
          <Btn size="lg" full onClick={() => setPhase("review")}>
            {d.mock.bbFinishReview}
          </Btn>
        ) : (
          <Btn size="lg" full className="arrow-slide" onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}>
            {d.mock.bbNext}
            <span className="arr">
              <IconArrow size={18} />
            </span>
          </Btn>
        )}
      </div>

      <NavSheet
        open={navOpen}
        onClose={() => setNavOpen(false)}
        questions={questions}
        answers={answers}
        marked={marked}
        onPick={(i) => {
          setIndex(i);
          setNavOpen(false);
        }}
        d={d}
      />
    </div>
  );
}

/* ---------------- pieces ---------------- */

function ExamBar({
  left, lowTime, label, onNav, navLabel,
}: {
  left: string; lowTime: boolean; label: string; onNav: () => void; navLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-card px-4 py-3">
      <div className="flex items-center gap-2.5">
        <IconClock size={17} />
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-dim">{label}</div>
          <div className={`font-display text-lg font-extrabold tabular-nums ${lowTime ? "text-amber" : ""}`}>{left}</div>
        </div>
      </div>
      <button
        onClick={onNav}
        className="press inline-flex items-center gap-2 rounded-xl border border-line2 px-3 py-2 text-[12.5px] font-bold text-mute hover:border-brand hover:text-brand"
      >
        <IconGrid size={15} />
        {navLabel}
      </button>
    </div>
  );
}

function NavSheet({
  open, onClose, questions, answers, marked, onPick, d,
}: {
  open: boolean;
  onClose: () => void;
  questions: Question[];
  answers: Record<string, number>;
  marked: Record<string, boolean>;
  onPick: (i: number) => void;
  d: { mock: { bbNav: string; bbAnswered: string; bbUnanswered: string; bbMarked: string } };
}) {
  const answered = questions.filter((q) => answers[q.id] !== undefined).length;
  return (
    <Modal open={open} onClose={onClose} title={d.mock.bbNav} wide>
      <div className="mb-4 flex flex-wrap gap-4 text-[12px] font-semibold">
        <span className="inline-flex items-center gap-1.5 text-brand">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand" />
          {answered} {d.mock.bbAnswered}
        </span>
        <span className="inline-flex items-center gap-1.5 text-dim">
          <span className="h-2.5 w-2.5 rounded-sm bg-line2" />
          {questions.length - answered} {d.mock.bbUnanswered}
        </span>
        <span className="inline-flex items-center gap-1.5 text-amber">
          <span className="h-2.5 w-2.5 rounded-full bg-amber" />
          {d.mock.bbMarked}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
        {questions.map((q, i) => {
          const done = answers[q.id] !== undefined;
          return (
            <button
              key={q.id}
              onClick={() => onPick(i)}
              className={`press relative grid h-12 place-items-center rounded-xl border text-[14px] font-bold tabular-nums ${
                done ? "border-brand bg-brand/12 text-brand" : "border-line bg-mist text-dim hover:border-line2"
              }`}
            >
              {i + 1}
              {marked[q.id] && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-amber" />}
            </button>
          );
        })}
      </div>
    </Modal>
  );
}

export default function MockPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-lg px-4 py-20 text-center text-dim">…</div>}>
      <MockInner />
    </Suspense>
  );
}
