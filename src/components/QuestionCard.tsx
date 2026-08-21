"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { Question } from "@/lib/types";
import { Btn } from "./ui";
import { IconArrow, IconCheck, IconCross, IconHelp } from "./Icons";

interface Props {
  q: Question;
  index: number;
  total: number;
  showHint?: boolean;
  allowSkip?: boolean;
  onAnswered: (correct: boolean) => void;
  onNext: () => void;
  lastOfSet?: boolean;
}

export function QuestionCard({ q, index, total, showHint = true, allowSkip = false, onAnswered, onNext, lastOfSet }: Props) {
  const { d, pick } = useI18n();
  const [picked, setPicked] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [hint, setHint] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setPicked(null);
    setLocked(false);
    setHint(false);
    setShake(false);
  }, [q.id]);

  const correct = picked !== null && picked === q.correct;

  const submit = () => {
    if (picked === null || locked) return;
    setLocked(true);
    const ok = picked === q.correct;
    if (!ok) {
      setShake(true);
      window.setTimeout(() => setShake(false), 420);
    }
    onAnswered(ok);
  };

  const skip = () => {
    if (locked) return;
    setLocked(true);
    setPicked(-1);
    onAnswered(false);
  };

  const feedback = correct
    ? d.feedback.correct[index % d.feedback.correct.length]
    : d.feedback.wrong[index % d.feedback.wrong.length];

  return (
    <div className={`rounded-3xl border border-line bg-card p-5 sm:p-6 ${shake ? "shake" : ""}`}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="text-[12px] font-bold uppercase tracking-wider text-dim">
          {d.diag.qOf} {index + 1} <span className="text-line2">/</span> {total}
        </span>
        <span className="flex items-center gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: i < Math.round((q.difficulty - 600) / 200) ? "#8a79e8" : "#ece7e0" }}
            />
          ))}
          <span className="ml-1 text-[11px] font-semibold text-dim tabular-nums">{q.difficulty}</span>
        </span>
      </div>

      <p key={q.id} className="slide-up font-display text-[19px] font-bold leading-snug sm:text-[21px]">
        {pick(q.stem)}
      </p>

      {hint && !locked && (
        <div className="slide-up mt-4 flex items-start gap-2.5 rounded-2xl border border-amber/30 bg-amber/8 p-3.5">
          <span className="mt-0.5 shrink-0 text-amber">
            <IconHelp size={17} />
          </span>
          <p className="text-[13.5px] leading-relaxed text-amber/90">{pick(q.hint)}</p>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-2">
        {q.options.map((o, i) => {
          const isPicked = picked === i;
          const isRight = locked && i === q.correct;
          const isWrongPick = locked && isPicked && i !== q.correct;
          return (
            <button
              key={i}
              disabled={locked}
              onClick={() => setPicked(i)}
              className={`press flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
                isRight
                  ? "border-brand bg-brand/12"
                  : isWrongPick
                    ? "border-red-500/50 bg-red-500/8"
                    : isPicked
                      ? "border-brand bg-brand/6"
                      : "border-line bg-mist hover:border-line2"
              } ${locked && !isRight && !isWrongPick ? "opacity-45" : ""}`}
            >
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[12px] font-extrabold ${
                  isWrongPick
                    ? "bg-red-500/80 text-ink"
                    : isRight || isPicked
                      ? "bg-brand text-paper"
                      : "bg-haze text-dim"
                }`}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 text-[15px] font-semibold">{pick(o)}</span>
              {isRight && <IconCheck size={20} />}
              {isWrongPick && (
                <span className="text-red-400">
                  <IconCross size={20} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!locked ? (
        <div className="mt-5 flex items-center gap-2">
          <Btn onClick={submit} disabled={picked === null} full size="lg">
            {d.practice.answerBtn}
          </Btn>
          {showHint && !hint && (
            <Btn variant="outline" size="lg" onClick={() => setHint(true)}>
              <IconHelp size={17} />
            </Btn>
          )}
          {allowSkip && (
            <Btn variant="ghost" size="lg" onClick={skip} className="shrink-0 text-dim">
              {d.diag.dontKnow}
            </Btn>
          )}
        </div>
      ) : (
        <div className="slide-up mt-5">
          <div
            className={`rounded-2xl border p-4 ${
              correct ? "border-brand/40 bg-brand/8 flash-ok" : "border-line2 bg-haze/60"
            }`}
          >
            <div className={`flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-wider ${correct ? "text-brand" : "text-mute"}`}>
              {correct ? <IconCheck size={17} /> : <IconCross size={17} />}
              {feedback}
            </div>
            <p className="mt-2.5 text-[14px] leading-relaxed text-mute">
              <span className="font-bold text-ink">{d.practice.explain}: </span>
              {pick(q.explain)}
            </p>
          </div>
          <Btn onClick={onNext} full size="lg" className="arrow-slide mt-3">
            {lastOfSet ? d.practice.finish : d.practice.nextQ}
            <span className="arr">
              <IconArrow size={18} />
            </span>
          </Btn>
        </div>
      )}
    </div>
  );
}
