"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { IELTS_LISTENING_FULL, IELTS_READING_FULL, IELTS_READING_POOL, IELTS_LISTENING_POOL } from "@/lib/exam/ielts-sets";
import { IELTS_WRITING } from "@/lib/exam/content/ielts-writing";
import { IELTS_SPEAKING } from "@/lib/exam/content/ielts-speaking";
import { gradeSpeaking, gradeWriting } from "@/lib/exam/grader";
import { breakdown, fmtBand, gradeItems, ieltsBand, overallBand } from "@/lib/exam/scoring";
import { pickEL, verdict } from "@/lib/exam/coach";
import type { Attempt, ItemResult, WrittenResponse } from "@/lib/exam/types";
import { Runner, type RunnerDone } from "@/components/exam/Runner";
import { runnerLabels } from "@/components/exam/labels";
import { AudioScript } from "@/components/exam/AudioScript";
import { Chart } from "@/components/exam/Chart";
import { Review, SkillTable } from "@/components/exam/Review";
import { Bar, Btn, Card, Confetti, Reveal } from "@/components/ui";
import { IconArrow, IconChart, IconClock, IconTarget } from "@/components/Icons";

/**
 * Full IELTS Academic simulation.
 *
 * The four skills run back to back in exam order, and the overall band is their
 * average with the official rounding. A student may skip a component — sitting two
 * essays and a speaking part in one go is a real ask — and the report then averages
 * only what was actually done and says so, rather than quietly scoring a zero.
 */

type Stage = "intro" | "listening" | "reading" | "writing1" | "writing2" | "speaking" | "report";

const STAGES: Stage[] = ["listening", "reading", "writing1", "writing2", "speaking"];

/** One prompt of each kind, fixed so a mock is comparable between attempts. */
const MOCK_TASK1 = IELTS_WRITING.find((p) => p.id === "w1-energy")!;
const MOCK_TASK2 = IELTS_WRITING.find((p) => p.id === "w2-exam-pressure")!;
const MOCK_SPEAKING = IELTS_SPEAKING.find((p) => p.id === "sp2-teacher")!;

export default function IeltsMockPage() {
  const { d, lang } = useI18n();
  const { user, ready, role, saveAttempt } = useStore();
  const router = useRouter();

  const [stage, setStage] = useState<Stage>("intro");
  const [listening, setListening] = useState<ItemResult[] | null>(null);
  const [reading, setReading] = useState<ItemResult[] | null>(null);
  const [written, setWritten] = useState<WrittenResponse[]>([]);
  const [speakingBand, setSpeakingBand] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [fire, setFire] = useState(0);
  const startedAt = useRef(0);

  useEffect(() => {
    if (!ready) return;
    if (!user || role !== "student") router.replace("/start");
  }, [ready, user, role, router]);

  const advance = useCallback(() => {
    setDraft("");
    setStage((s) => {
      const i = STAGES.indexOf(s);
      return i < 0 || i === STAGES.length - 1 ? "report" : STAGES[i + 1];
    });
  }, []);

  const begin = useCallback(() => {
    startedAt.current = Date.now();
    setListening(null);
    setReading(null);
    setWritten([]);
    setSpeakingBand(null);
    setDraft("");
    setStage("listening");
  }, []);

  const finishListening = useCallback((r: RunnerDone) => {
    setListening(gradeItems(IELTS_LISTENING_FULL.items, r.answers, r.seconds));
    advance();
  }, [advance]);

  const finishReading = useCallback((r: RunnerDone) => {
    setReading(gradeItems(IELTS_READING_FULL.items, r.answers, r.seconds));
    advance();
  }, [advance]);

  const finishWriting = useCallback((task: 1 | 2) => {
    const prompt = task === 1 ? MOCK_TASK1 : MOCK_TASK2;
    const g = gradeWriting(draft, prompt);
    setWritten((w) => [...w, {
      promptId: prompt.id, task: `Task ${task}`, text: draft, seconds: 0,
      band: g.band, criteria: g.criteria, notes: g.notes,
    }]);
    advance();
  }, [draft, advance]);

  const finishSpeaking = useCallback(() => {
    const g = gradeSpeaking(draft, MOCK_SPEAKING, 0);
    setSpeakingBand(g.band);
    setWritten((w) => [...w, {
      promptId: MOCK_SPEAKING.id, task: `Part ${MOCK_SPEAKING.part}`, text: draft, seconds: 0,
      band: g.band, criteria: g.criteria, notes: g.notes,
    }]);
    setStage("report");
    setFire((f) => f + 1);
  }, [draft]);

  /* ---------- report ---------- */
  const report = useMemo(() => {
    if (stage !== "report") return null;
    const lBand = listening
      ? ieltsBand(listening.filter((r) => r.correct).length, listening.length, "listening")
      : undefined;
    const rBand = reading
      ? ieltsBand(reading.filter((r) => r.correct).length, reading.length, "reading")
      : undefined;
    const wBands = written.filter((w) => w.task.startsWith("Task")).map((w) => w.band);
    // IELTS weights Task 2 double; with both present that is the (t1 + 2·t2)/3 rule.
    const wBand = wBands.length === 2
      ? Math.round(((wBands[0] + 2 * wBands[1]) / 3) * 2) / 2
      : wBands[0];
    const rows = breakdown([...(listening ?? []), ...(reading ?? [])]);
    return {
      listening: lBand, reading: rBand, writing: wBand, speaking: speakingBand ?? undefined,
      overall: overallBand([lBand, rBand, wBand, speakingBand ?? undefined]),
      rows,
    };
  }, [stage, listening, reading, written, speakingBand]);

  const savedRef = useRef(false);
  useEffect(() => {
    if (stage !== "report" || !report || savedRef.current) return;
    savedRef.current = true;
    const attempt: Attempt = {
      id: `a${Date.now()}`,
      kind: "ielts-mock",
      setId: "ielts-full",
      title: "IELTS Academic — full test",
      startedAt: startedAt.current,
      finishedAt: Date.now(),
      results: [...(listening ?? []), ...(reading ?? [])],
      ielts: {
        listening: listening
          ? { raw: listening.filter((r) => r.correct).length, total: listening.length, band: report.listening! }
          : undefined,
        reading: reading
          ? { raw: reading.filter((r) => r.correct).length, total: reading.length, band: report.reading! }
          : undefined,
        writing: report.writing,
        speaking: report.speaking,
        overall: report.overall,
        bySkill: report.rows,
      },
      written,
    };
    saveAttempt(attempt);
  }, [stage, report, listening, reading, written, saveAttempt]);

  if (!ready || !user) return null;

  const stageIndex = STAGES.indexOf(stage);
  const audioLabels = {
    play: d.exam.playAudio, replay: d.exam.replay, stop: d.exam.stopAudio,
    speaking: d.exam.speaking, note: d.exam.audioNote,
  };

  /* ---------------- intro ---------------- */
  if (stage === "intro") {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <Reveal>
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-3xl border border-line2 bg-card">
            <IconTarget size={30} />
          </div>
          <h1 className="font-display text-center text-[clamp(24px,5.5vw,34px)] font-extrabold tracking-[-0.02em]">
            {d.exam.ieltsTitle} — {d.exam.fullTest}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-center text-[14.5px] leading-relaxed text-mute">
            {d.exam.ieltsMockIntro}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <Card className="mt-7">
            <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.exam.mockStages}</div>
            <div className="mt-3 flex flex-col gap-2">
              {[
                { t: d.exam.listeningTitle, n: `${IELTS_LISTENING_FULL.items.length} · ${IELTS_LISTENING_FULL.minutes} ${d.exam.minutes}` },
                { t: d.exam.readingTitle, n: `${IELTS_READING_FULL.items.length} · ${IELTS_READING_FULL.minutes} ${d.exam.minutes}` },
                { t: d.exam.writingBoth, n: `60 ${d.exam.minutes}` },
                { t: `${d.exam.speakingTitle} · ${d.exam.partLabel} 2`, n: `3 ${d.exam.minutes}` },
              ].map((row) => (
                <div key={row.t} className="flex items-center justify-between text-[13px]">
                  <span className="font-semibold">{row.t}</span>
                  <span className="tabular-nums text-dim">{row.n}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 border-t border-line pt-3.5 text-[13px] leading-relaxed text-mute">
              {d.exam.partialNote}
            </p>
          </Card>
        </Reveal>

        <Reveal delay={140}>
          <Btn size="lg" full className="arrow-slide mt-5" onClick={begin}>
            {d.exam.start}
            <span className="arr"><IconArrow size={18} /></span>
          </Btn>
        </Reveal>
      </div>
    );
  }

  /* ---------------- report ---------------- */
  if (stage === "report" && report) {
    const allItems = [...IELTS_LISTENING_FULL.items, ...IELTS_READING_FULL.items];
    const allResults = [...(listening ?? []), ...(reading ?? [])];
    const share = allResults.length > 0
      ? allResults.filter((r) => r.correct).length / allResults.length
      : 0.5;
    const v = verdict(report.rows, share);

    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="relative"><Confetti fire={fire} /></div>

        <Reveal>
          <Card>
            <div className="text-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.exam.overallBand}</div>
              <div className="font-display mt-1 text-6xl font-extrabold tabular-nums">
                {report.overall !== undefined ? fmtBand(report.overall) : "—"}
              </div>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-2 border-t border-line pt-5 text-center">
              {[
                { k: d.exam.listeningTitle, v: report.listening },
                { k: d.exam.readingTitle, v: report.reading },
                { k: d.exam.writingTitle, v: report.writing },
                { k: d.exam.speakingTitle, v: report.speaking },
              ].map((row, i) => (
                <div key={row.k} className={i > 0 ? "border-l border-line" : ""}>
                  <div className="truncate text-[10px] font-bold uppercase tracking-wider text-dim">
                    {row.k.replace("IELTS ", "")}
                  </div>
                  <div className="font-display mt-1 text-xl font-extrabold tabular-nums">
                    {row.v !== undefined ? fmtBand(row.v) : "—"}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 border-t border-line pt-3.5 text-[12.5px] leading-relaxed text-dim">
              {d.exam.partialNote}
            </p>
          </Card>
        </Reveal>

        <Reveal delay={80}>
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

        {written.length > 0 && (
          <Reveal delay={120}>
            <h2 className="font-display mt-8 text-[19px] font-extrabold">{d.exam.criteriaTitle}</h2>
            <div className="mt-3 flex flex-col gap-3">
              {written.map((w) => (
                <Card key={w.promptId}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-display text-[15px] font-extrabold">{w.task}</span>
                    <span className="font-display text-[17px] font-extrabold tabular-nums text-brand">
                      {fmtBand(w.band)}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-col gap-3">
                    {w.criteria.filter((c) => c.id !== "pr").map((c) => (
                      <div key={c.id}>
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-[12.5px] font-semibold">{d.exam.criteria[c.id]}</span>
                          <span className="text-[12.5px] font-bold tabular-nums">{fmtBand(c.band)}</span>
                        </div>
                        <div className="mt-1"><Bar value={c.band / 9} h={4} tone={c.band < 5.5 ? "amber" : "brand"} /></div>
                      </div>
                    ))}
                  </div>
                  {w.notes.filter((n) => n.kind === "fix").slice(0, 3).map((n, i) => (
                    <p key={i} className="mt-2.5 text-[12.5px] leading-relaxed text-mute">
                      · {pickEL(n.message, lang)}
                    </p>
                  ))}
                </Card>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal delay={160}>
          <SkillTable rows={report.rows} title={d.exam.bySkill} />
        </Reveal>

        {allResults.length > 0 && (
          <Reveal delay={200}>
            <h2 className="font-display mt-8 text-[19px] font-extrabold">{d.exam.toFix}</h2>
            <p className="mt-1.5 text-[13.5px] text-mute">{d.exam.fixBlurb}</p>
            <div className="mt-4">
              <Review
                items={allItems.filter((it) => allResults.some((r) => r.id === it.id))}
                results={allResults}
                pool={[...IELTS_LISTENING_POOL, ...IELTS_READING_POOL]}
              />
            </div>
          </Reveal>
        )}

        <div className="mt-8 flex flex-col gap-2">
          <Btn href="/ielts" variant="outline" size="lg" full>{d.exam.ieltsTitle}</Btn>
          <Btn href="/dashboard" variant="ghost" size="lg" full>{d.practice.toDash}</Btn>
        </div>
      </div>
    );
  }

  /* ---------------- listening and reading ---------------- */
  if (stage === "listening" || stage === "reading") {
    const set = stage === "listening" ? IELTS_LISTENING_FULL : IELTS_READING_FULL;
    return (
      <div>
        <StageBar index={stageIndex} label={`${d.exam.stageOf} ${stageIndex + 1} / ${STAGES.length}`} title={set.title} />
        <Runner
          key={set.id}
          items={set.items}
          passages={set.passages}
          minutes={set.minutes}
          title={set.title}
          labels={runnerLabels(d)}
          header={set.scripts ? <AudioScript scripts={set.scripts} labels={audioLabels} autoPlay /> : undefined}
          onDone={stage === "listening" ? finishListening : finishReading}
        />
      </div>
    );
  }

  /* ---------------- writing and speaking ---------------- */
  const isWriting = stage === "writing1" || stage === "writing2";
  const prompt = stage === "writing1" ? MOCK_TASK1 : MOCK_TASK2;
  const words = (draft.match(/[A-Za-z']+/g) ?? []).length;
  const minWords = isWriting ? prompt.minWords : 120;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <StageBar
        index={stageIndex}
        label={`${d.exam.stageOf} ${stageIndex + 1} / ${STAGES.length}`}
        title={isWriting ? `${d.exam.writingTitle} · ${prompt.kind}` : `${d.exam.speakingTitle} · ${d.exam.partLabel} 2`}
      />

      <Card className="mt-4">
        {isWriting ? (
          <>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-dim">
              <IconClock size={13} /> {prompt.minutes} {d.exam.minutes} · {prompt.minWords} {d.exam.wordsLabel} {d.exam.minWords}
            </div>
            <p className="mt-2.5 whitespace-pre-line text-[14.5px] font-semibold leading-relaxed">{prompt.prompt}</p>
            {prompt.chart && <div className="mt-4"><Chart spec={prompt.chart} /></div>}
            <p className="mt-4 border-t border-line pt-3 text-[13px] leading-relaxed text-mute">
              {pickEL(prompt.guidance, lang)}
            </p>
          </>
        ) : (
          <>
            <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.exam.cueCard}</div>
            <p className="mt-2 text-[15.5px] font-bold leading-snug">{MOCK_SPEAKING.questions[0]}</p>
            <ul className="mt-2.5 flex flex-col gap-1">
              {MOCK_SPEAKING.bullets?.map((b, i) => (
                <li key={i} className="text-[14px] leading-relaxed text-mute">· {b}</li>
              ))}
            </ul>
          </>
        )}
      </Card>

      <div className="mt-4">
        <label className="text-[11px] font-bold uppercase tracking-wider text-dim">
          {isWriting ? d.exam.writeHere : d.exam.yourText}
        </label>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={isWriting ? 15 : 9}
          spellCheck={false}
          className="mt-2 w-full resize-y rounded-2xl border border-line bg-mist px-4 py-3.5 text-[14.5px] leading-relaxed outline-none focus:border-brand"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex-1"><Bar value={Math.min(1, words / minWords)} h={4} tone={words < minWords ? "amber" : "brand"} /></div>
          <span className="shrink-0 text-[12px] font-bold tabular-nums text-dim">
            {words} / {minWords}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Btn
          size="lg"
          full
          disabled={words < 20}
          onClick={isWriting ? () => finishWriting(stage === "writing1" ? 1 : 2) : finishSpeaking}
        >
          {d.exam.continueTest}
        </Btn>
        <Btn variant="ghost" size="lg" full onClick={stage === "speaking" ? () => setStage("report") : advance}>
          {d.exam.skipStage}
        </Btn>
      </div>
    </div>
  );
}

function StageBar({ index, label, title }: { index: number; label: string; title: string }) {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-5">
      <div className="flex items-center justify-between text-[11.5px] font-bold uppercase tracking-wider text-dim">
        <span>{label}</span>
        <span className="truncate pl-3 text-right">{title}</span>
      </div>
      <div className="mt-2">
        <Bar value={(index + 1) / STAGES.length} h={3} />
      </div>
    </div>
  );
}
