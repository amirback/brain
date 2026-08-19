"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ExamItem, Passage } from "@/lib/exam/types";
import { Bar, Btn, Modal } from "@/components/ui";
import { IconArrow, IconClock, IconGrid } from "@/components/Icons";

/**
 * One timed module, in the shape of a real digital exam: a running clock, free
 * movement between questions, mark-for-review, a navigator, and a review screen
 * before anything is graded. Nothing is scored until the module is submitted, so
 * the student can change an answer the way they could on test day.
 *
 * The component owns a single module only. Multi-module tests (the SAT mock has
 * four) compose it from the page, which is what lets module 2 be chosen from the
 * module 1 result.
 */

export interface RunnerDone {
  answers: Record<string, number | string>;
  seconds: Record<string, number>;
  timedOut: boolean;
}

export interface RunnerLabels {
  timer: string;
  nav: string;
  question: string;
  of: string;
  back: string;
  next: string;
  mark: string;
  marked: string;
  finishReview: string;
  review: string;
  reviewSub: string;
  answered: string;
  unanswered: string;
  submit: string;
  confirm: string;
  confirmBody: string;
  cancel: string;
  typeAnswer: string;
  passageLabel: string;
}

export function Runner({
  items, passages, minutes, title, labels, header, onDone,
}: {
  items: ExamItem[];
  passages?: Passage[];
  minutes: number;
  title: string;
  labels: RunnerLabels;
  /** Rendered under the clock on every question — the Listening audio player. */
  header?: React.ReactNode;
  onDone: (r: RunnerDone) => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [navOpen, setNavOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [left, setLeft] = useState(minutes * 60);

  // Per-question time is what makes the "you spent 4 minutes on question 3"
  // feedback possible, so we bank the elapsed time every time the index moves.
  const spent = useRef<Record<string, number>>({});
  // Stamped on mount rather than during render, so the value does not shift if
  // React re-renders the component before the student has answered anything.
  const enteredAt = useRef<number>(0);
  const submitted = useRef(false);

  const total = items.length;
  const q = items[index];
  const answeredCount = Object.keys(answers).filter((k) => answers[k] !== "").length;

  const bank = useCallback(() => {
    const id = items[index]?.id;
    // enteredAt is zero until the mount effect stamps it; banking against that
    // would credit the question with fifty-odd years of thinking time.
    if (!id || enteredAt.current === 0) return;
    const dt = (Date.now() - enteredAt.current) / 1000;
    spent.current[id] = (spent.current[id] ?? 0) + dt;
    enteredAt.current = Date.now();
  }, [items, index]);

  const go = useCallback((next: number) => {
    bank();
    setIndex(next);
  }, [bank]);

  const submit = useCallback((timedOut: boolean) => {
    if (submitted.current) return;
    submitted.current = true;
    bank();
    onDone({ answers, seconds: spent.current, timedOut });
  }, [answers, bank, onDone]);

  useEffect(() => {
    enteredAt.current = Date.now();
    const iv = window.setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          window.clearInterval(iv);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => window.clearInterval(iv);
  }, []);

  useEffect(() => {
    if (left === 0) submit(true);
  }, [left, submit]);

  const passage = useMemo(
    () => (q?.passage ? passages?.find((p) => p.id === q.passage) : undefined),
    [q, passages]
  );

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const lowTime = left > 0 && left < 300;

  /* ---------------- review screen ---------------- */
  if (reviewing) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <ExamBar left={`${mm}:${ss}`} lowTime={lowTime} labels={labels} onNav={() => setNavOpen(true)} title={title} />
        <h2 className="font-display mt-6 text-2xl font-extrabold">{labels.review}</h2>
        <p className="mt-2 text-[14px] text-mute">{labels.reviewSub}</p>

        <div className="mt-4 flex flex-wrap gap-3 text-[12.5px] font-semibold">
          <span className="text-brand tabular-nums">{answeredCount} {labels.answered}</span>
          <span className="text-dim tabular-nums">{total - answeredCount} {labels.unanswered}</span>
        </div>

        <Grid
          items={items} answers={answers} marked={marked}
          onPick={(i) => { setIndex(i); setReviewing(false); enteredAt.current = Date.now(); }}
        />

        <Btn size="lg" full className="mt-6" onClick={() => setConfirmOpen(true)}>{labels.submit}</Btn>

        <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title={labels.confirm}>
          <p className="text-[14px] leading-relaxed text-mute">{labels.confirmBody}</p>
          <div className="mt-5 flex gap-2">
            <Btn variant="outline" full onClick={() => setConfirmOpen(false)}>{labels.cancel}</Btn>
            <Btn full onClick={() => submit(false)}>{labels.submit}</Btn>
          </div>
        </Modal>
      </div>
    );
  }

  if (!q) return null;

  /* ---------------- running ---------------- */
  return (
    <div className={`mx-auto px-4 py-6 ${passage ? "max-w-6xl" : "max-w-2xl"}`}>
      <ExamBar left={`${mm}:${ss}`} lowTime={lowTime} labels={labels} onNav={() => setNavOpen(true)} title={title} />

      {header && <div className="mt-3">{header}</div>}

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-[12.5px] font-bold tabular-nums text-dim">
          {labels.question} {index + 1} {labels.of} {total}
        </span>
        <button
          onClick={() => setMarked((m) => ({ ...m, [q.id]: !m[q.id] }))}
          className={`press inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[12px] font-bold transition-colors ${
            marked[q.id] ? "border-amber bg-amber/12 text-amber" : "border-line2 text-mute hover:border-amber hover:text-amber"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${marked[q.id] ? "bg-amber" : "bg-line2"}`} />
          {marked[q.id] ? labels.marked : labels.mark}
        </button>
      </div>

      <div className="mt-2">
        <Bar value={(index + 1) / total} h={4} />
      </div>

      <div className={passage ? "mt-5 grid gap-5 lg:grid-cols-2" : "mt-5"}>
        {passage && (
          <div className="rounded-3xl border border-line bg-card p-5 lg:max-h-[68vh] lg:overflow-y-auto">
            <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{labels.passageLabel}</div>
            <h3 className="font-display mt-1.5 text-[17px] font-extrabold">{passage.title}</h3>
            <div className="mt-3 flex flex-col gap-3">
              {passage.paragraphs.map((p, i) => (
                <p key={i} className="text-[14.5px] leading-relaxed text-mute">
                  {passage.lettered && (
                    <span className="mr-2 font-display font-extrabold text-brand">{String.fromCharCode(65 + i)}</span>
                  )}
                  {p}
                </p>
              ))}
            </div>
          </div>
        )}

        <div key={q.id} className="slide-up rounded-3xl border border-line bg-card p-5 sm:p-6">
          {q.instruction && (
            <div className="mb-3 rounded-xl border border-line2 bg-coal px-3 py-2 text-[12.5px] font-semibold text-mute">
              {q.instruction}
            </div>
          )}
          {q.context && (
            <p className="mb-4 whitespace-pre-line border-l-2 border-line2 pl-4 text-[14.5px] leading-relaxed text-mute">
              {q.context}
            </p>
          )}
          <p className="font-display whitespace-pre-line text-[17px] font-bold leading-snug sm:text-[19px]">{q.stem}</p>

          {q.options ? (
            <div className="mt-5 flex flex-col gap-2">
              {q.options.map((o, i) => {
                const picked = answers[q.id] === i;
                return (
                  <button
                    key={i}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                    className={`press flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
                      picked ? "border-brand bg-brand/8" : "border-line bg-coal hover:border-line2"
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[12px] font-extrabold ${
                        picked ? "bg-brand text-ink" : "bg-soot text-dim"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1 text-[15px] font-semibold leading-snug">{o}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-dim">{labels.typeAnswer}</label>
              <input
                value={String(answers[q.id] ?? "")}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                inputMode="text"
                autoComplete="off"
                className="mt-2 w-full rounded-2xl border border-line bg-coal px-4 py-3.5 font-display text-[18px] font-bold outline-none focus:border-brand"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Btn variant="outline" size="lg" disabled={index === 0} onClick={() => go(Math.max(0, index - 1))}>
          {labels.back}
        </Btn>
        {index === total - 1 ? (
          <Btn size="lg" full onClick={() => { bank(); setReviewing(true); }}>{labels.finishReview}</Btn>
        ) : (
          <Btn size="lg" full className="arrow-slide" onClick={() => go(Math.min(total - 1, index + 1))}>
            {labels.next}
            <span className="arr"><IconArrow size={18} /></span>
          </Btn>
        )}
      </div>

      <Modal open={navOpen} onClose={() => setNavOpen(false)} title={labels.nav} wide>
        <div className="mb-4 flex flex-wrap gap-4 text-[12px] font-semibold">
          <span className="inline-flex items-center gap-1.5 text-brand">
            <span className="h-2.5 w-2.5 rounded-sm bg-brand" />{answeredCount} {labels.answered}
          </span>
          <span className="inline-flex items-center gap-1.5 text-dim">
            <span className="h-2.5 w-2.5 rounded-sm bg-line2" />{total - answeredCount} {labels.unanswered}
          </span>
          <span className="inline-flex items-center gap-1.5 text-amber">
            <span className="h-2.5 w-2.5 rounded-full bg-amber" />{labels.marked}
          </span>
        </div>
        <Grid items={items} answers={answers} marked={marked} onPick={(i) => { go(i); setNavOpen(false); }} />
      </Modal>
    </div>
  );
}

function Grid({
  items, answers, marked, onPick,
}: {
  items: ExamItem[];
  answers: Record<string, number | string>;
  marked: Record<string, boolean>;
  onPick: (i: number) => void;
}) {
  return (
    <div className="mt-5 grid grid-cols-5 gap-2 sm:grid-cols-9">
      {items.map((it, i) => {
        const done = answers[it.id] !== undefined && answers[it.id] !== "";
        return (
          <button
            key={it.id}
            onClick={() => onPick(i)}
            className={`press relative grid h-12 place-items-center rounded-xl border text-[14px] font-bold tabular-nums transition-colors ${
              done ? "border-brand bg-brand/12 text-brand" : "border-line bg-coal text-dim hover:border-line2"
            }`}
          >
            {i + 1}
            {marked[it.id] && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-amber" />}
          </button>
        );
      })}
    </div>
  );
}

function ExamBar({
  left, lowTime, labels, onNav, title,
}: {
  left: string; lowTime: boolean; labels: RunnerLabels; onNav: () => void; title: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-card px-4 py-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <IconClock size={17} />
        <div className="min-w-0">
          <div className="truncate text-[10px] font-bold uppercase tracking-wider text-dim">{title}</div>
          <div className={`font-display text-lg font-extrabold tabular-nums ${lowTime ? "text-amber" : ""}`}>{left}</div>
        </div>
      </div>
      <button
        onClick={onNav}
        className="press inline-flex shrink-0 items-center gap-2 rounded-xl border border-line2 px-3 py-2 text-[12.5px] font-bold text-mute hover:border-brand hover:text-brand"
      >
        <IconGrid size={15} />
        {labels.nav}
      </button>
    </div>
  );
}
