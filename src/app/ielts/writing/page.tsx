"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { ieltsWritingById, writingTask1, writingTask2 } from "@/lib/exam/content/ielts-writing";
import { gradeWriting, type WritingGrade } from "@/lib/exam/grader";
import { fmtBand } from "@/lib/exam/scoring";
import { pickEL } from "@/lib/exam/coach";
import type { Attempt, CriterionScore } from "@/lib/exam/types";
import { Chart } from "@/components/exam/Chart";
import { Bar, Btn, Card, Reveal, SectionLabel } from "@/components/ui";
import { IconArrow, IconCheck, IconClock, IconCross, IconSpark } from "@/components/Icons";

/**
 * IELTS Writing: prompt → answer → band with criterion breakdown → rewrite.
 *
 * The rewrite loop is the point. A band number on its own teaches nothing; a band
 * plus the exact fragments that cost marks, followed by a second attempt scored the
 * same way, is what actually moves a student.
 */
function WritingInner() {
  const { d, lang } = useI18n();
  const { user, ready, role, saveAttempt } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const promptId = params.get("p");

  const [text, setText] = useState("");
  const [grade, setGrade] = useState<WritingGrade | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const started = useRef<number | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!user || role !== "student") router.replace("/start");
  }, [ready, user, role, router]);

  const prompt = useMemo(() => (promptId ? ieltsWritingById(promptId) : undefined), [promptId]);

  // The clock starts when the first character is typed, not when the page opens.
  useEffect(() => {
    if (!text || started.current !== null) return;
    started.current = Date.now();
  }, [text]);

  useEffect(() => {
    const iv = window.setInterval(() => {
      if (started.current !== null && !grade) {
        setElapsed(Math.round((Date.now() - started.current) / 1000));
      }
    }, 1000);
    return () => window.clearInterval(iv);
  }, [grade]);

  const words = useMemo(() => (text.match(/[A-Za-z']+/g) ?? []).length, [text]);

  const check = useCallback(() => {
    if (!prompt) return;
    const g = gradeWriting(text, prompt);
    setGrade(g);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const attempt: Attempt = {
      id: `a${Date.now()}`,
      kind: "ielts-writing",
      setId: prompt.id,
      title: `IELTS Writing Task ${prompt.task}`,
      startedAt: started.current ?? Date.now(),
      finishedAt: Date.now(),
      results: [],
      ielts: { writing: g.band, bySkill: [] },
      written: [{
        promptId: prompt.id,
        task: `Task ${prompt.task}`,
        text,
        seconds: elapsed,
        band: g.band,
        criteria: g.criteria,
        notes: g.notes,
      }],
    };
    saveAttempt(attempt);
  }, [prompt, text, elapsed, saveAttempt]);

  const rewrite = useCallback(() => {
    if (grade) setHistory((h) => [...h, grade.band]);
    setGrade(null);
    started.current = Date.now();
    setElapsed(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [grade]);

  if (!ready || !user) return null;

  /* ---------------- prompt picker ---------------- */
  if (!prompt) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <h1 className="font-display text-[clamp(26px,5.5vw,36px)] font-extrabold tracking-[-0.02em]">
          {d.exam.writingTitle}
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-mute">{d.exam.graderNote}</p>

        {[
          { list: writingTask1, label: `${d.exam.taskLabel} 1` },
          { list: writingTask2, label: `${d.exam.taskLabel} 2` },
        ].map(({ list, label }) => (
          <div key={label}>
            <SectionLabel>{label}</SectionLabel>
            <div className="mt-3 flex flex-col gap-3">
              {list.map((p) => (
                <Card key={p.id}>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-soot px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-dim">
                      {p.kind}
                    </span>
                    <span className="text-[11px] font-bold tabular-nums text-dim">
                      {p.minutes} {d.exam.minutes} · {p.minWords} {d.exam.wordsLabel}
                    </span>
                  </div>
                  <p className="mt-2.5 whitespace-pre-line text-[14px] leading-relaxed">{p.prompt}</p>
                  <Btn href={`/ielts/writing?p=${p.id}`} variant="outline" full className="mt-3.5">
                    {d.exam.start}
                  </Btn>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ---------------- graded ---------------- */
  if (grade) {
    const prev = history[history.length - 1];
    const fixes = grade.notes.filter((n) => n.kind === "fix");
    const goods = grade.notes.filter((n) => n.kind === "good");
    const tips = grade.notes.filter((n) => n.kind === "tip");

    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Reveal>
          <Card>
            <div className="text-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.exam.bandScore}</div>
              <div className="font-display mt-1 text-6xl font-extrabold tabular-nums">{fmtBand(grade.band)}</div>
              {prev !== undefined && (
                <div className="mt-2 text-[13px] font-semibold tabular-nums text-mute">
                  {d.exam.prevBand} {fmtBand(prev)}
                  {grade.band > prev && <span className="ml-1.5 text-brand">+{fmtBand(grade.band - prev)}</span>}
                </div>
              )}
              <div className="mt-2 text-[12.5px] tabular-nums text-dim">
                {grade.metrics.wordCount} {d.exam.wordsLabel} · {Math.round(elapsed / 60)} {d.exam.minutes}
              </div>
            </div>
          </Card>
        </Reveal>

        <Reveal delay={70}>
          <Card className="mt-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.exam.criteriaTitle}</div>
            <div className="mt-4 flex flex-col gap-4">
              {grade.criteria.map((c) => (
                <Criterion key={c.id} c={c} label={d.exam.criteria[c.id]} lang={lang} />
              ))}
            </div>
          </Card>
        </Reveal>

        {fixes.length > 0 && (
          <Reveal delay={110}>
            <h2 className="font-display mt-8 text-[19px] font-extrabold">{d.exam.notesTitle}</h2>
            <div className="mt-3 flex flex-col gap-2">
              {fixes.map((n, i) => (
                <div key={i} className="rounded-2xl border border-amber/35 bg-amber/6 px-4 py-3">
                  <div className="flex gap-2.5">
                    <IconCross size={15} />
                    <div className="min-w-0">
                      {n.quote && (
                        <code className="mb-1 block truncate rounded bg-soot px-1.5 py-0.5 text-[12px] text-amber">
                          {n.quote}
                        </code>
                      )}
                      <p className="text-[13.5px] leading-relaxed text-mute">{pickEL(n.message, lang)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {goods.length > 0 && (
          <Reveal delay={140}>
            <h2 className="font-display mt-7 text-[19px] font-extrabold">{d.exam.goodTitle}</h2>
            <div className="mt-3 flex flex-col gap-2">
              {goods.map((n, i) => (
                <div key={i} className="rounded-2xl border border-brand/30 bg-brand/6 px-4 py-3">
                  <div className="flex gap-2.5">
                    <IconCheck size={15} />
                    <div className="min-w-0">
                      {n.quote && <code className="mb-1 block text-[12px] text-brand">{n.quote}</code>}
                      <p className="text-[13.5px] leading-relaxed text-mute">{pickEL(n.message, lang)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {tips.map((n, i) => (
          <Reveal key={i} delay={170}>
            <Card className="mt-4 border-line2">
              <div className="flex gap-2.5">
                <IconSpark size={16} />
                <p className="text-[13.5px] leading-relaxed text-mute">{pickEL(n.message, lang)}</p>
              </div>
            </Card>
          </Reveal>
        ))}

        <Reveal delay={200}>
          <Card className="mt-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.exam.modelOutline}</div>
            <ol className="mt-3 flex flex-col gap-2">
              {prompt.modelOutline.map((s, i) => (
                <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-mute">
                  <span className="font-display font-extrabold text-brand">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </Card>
        </Reveal>

        <Reveal delay={230}>
          <Card className="mt-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.exam.yourText}</div>
            <p className="mt-2 whitespace-pre-line text-[13.5px] leading-relaxed text-mute">{text}</p>
          </Card>
          <p className="mt-4 text-[12px] leading-relaxed text-dim">{d.exam.graderNote}</p>
        </Reveal>

        <div className="mt-6 flex flex-col gap-2">
          <Btn size="lg" full className="arrow-slide" onClick={rewrite}>
            {d.exam.rewrite}
            <span className="arr"><IconArrow size={18} /></span>
          </Btn>
          <Btn href="/ielts" variant="outline" size="lg" full>{d.exam.ieltsTitle}</Btn>
        </div>
      </div>
    );
  }

  /* ---------------- writing ---------------- */
  const short = words < prompt.minWords;
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  const over = elapsed > prompt.minutes * 60;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-card px-4 py-3">
        <div className="flex items-center gap-2.5">
          <IconClock size={17} />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-dim">
              {d.exam.taskLabel} {prompt.task} · {prompt.minutes} {d.exam.minutes}
            </div>
            <div className={`font-display text-lg font-extrabold tabular-nums ${over ? "text-amber" : ""}`}>
              {mm}:{ss}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold uppercase tracking-wider text-dim">{d.exam.wordsLabel}</div>
          <div className={`font-display text-lg font-extrabold tabular-nums ${short ? "text-amber" : "text-brand"}`}>
            {words}
            <span className="text-[12px] text-dim"> / {prompt.minWords}</span>
          </div>
        </div>
      </div>

      <Card className="mt-4">
        <p className="whitespace-pre-line text-[14.5px] font-semibold leading-relaxed">{prompt.prompt}</p>
        {prompt.chart && (
          <div className="mt-4">
            <Chart spec={prompt.chart} />
          </div>
        )}
        <p className="mt-4 border-t border-line pt-3 text-[13px] leading-relaxed text-mute">
          {pickEL(prompt.guidance, lang)}
        </p>
      </Card>

      <div className="mt-4">
        <label className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.exam.writeHere}</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={16}
          spellCheck={false}
          className="mt-2 w-full resize-y rounded-2xl border border-line bg-coal px-4 py-3.5 text-[14.5px] leading-relaxed outline-none focus:border-brand"
        />
      </div>

      <div className="mt-2">
        <Bar value={Math.min(1, words / prompt.minWords)} h={4} tone={short ? "amber" : "brand"} />
      </div>

      <Btn size="lg" full className="mt-4" disabled={words < 20} onClick={check}>
        {d.exam.checkWork}
      </Btn>
    </div>
  );
}

function Criterion({ c, label, lang }: { c: CriterionScore; label: string; lang: string }) {
  const unscored = c.id === "pr";
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13.5px] font-semibold leading-snug">{label}</span>
        <span className="shrink-0 font-display text-[15px] font-extrabold tabular-nums">
          {unscored ? "—" : fmtBand(c.band)}
        </span>
      </div>
      {!unscored && (
        <div className="mt-1.5">
          <Bar value={c.band / 9} h={5} tone={c.band < 5.5 ? "amber" : "brand"} />
        </div>
      )}
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-dim">{pickEL(c.why, lang)}</p>
    </div>
  );
}

export default function IeltsWritingPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-lg px-4 py-20 text-center text-dim">…</div>}>
      <WritingInner />
    </Suspense>
  );
}
