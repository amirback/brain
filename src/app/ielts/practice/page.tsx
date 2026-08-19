"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { ieltsSetById, IELTS_LISTENING_POOL, IELTS_READING_POOL } from "@/lib/exam/ielts-sets";
import { breakdown, fmtBand, gradeItems, ieltsBand } from "@/lib/exam/scoring";
import { pickEL, verdict } from "@/lib/exam/coach";
import type { Attempt, ItemResult } from "@/lib/exam/types";
import { Runner, type RunnerDone } from "@/components/exam/Runner";
import { runnerLabels } from "@/components/exam/labels";
import { AudioScript } from "@/components/exam/AudioScript";
import { Review, SkillTable } from "@/components/exam/Review";
import { Btn, Card, Confetti, Reveal } from "@/components/ui";
import { IconArrow, IconChart, IconClock } from "@/components/Icons";

/** One IELTS Reading or Listening set: brief, timed run, band, then the review. */
function IeltsPracticeInner() {
  const { d, lang } = useI18n();
  const { user, ready, role, recordAnswer, saveAttempt } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const setId = params.get("set");

  const [phase, setPhase] = useState<"intro" | "run" | "done">("intro");
  const [results, setResults] = useState<ItemResult[] | null>(null);
  const [fire, setFire] = useState(0);

  useEffect(() => {
    if (!ready) return;
    if (!user || role !== "student") router.replace("/start");
  }, [ready, user, role, router]);

  const set = useMemo(() => (setId ? ieltsSetById(setId) : undefined), [setId]);
  const isListening = set?.section === "listening";
  const pool = isListening ? IELTS_LISTENING_POOL : IELTS_READING_POOL;

  const finish = useCallback((r: RunnerDone) => {
    if (!set) return;
    const graded = gradeItems(set.items, r.answers, r.seconds);
    setResults(graded);
    setFire((f) => f + 1);
    setPhase("done");

    for (const item of set.items) {
      const res = graded.find((g) => g.id === item.id);
      if (!res) continue;
      recordAnswer({
        qid: item.id,
        topic: item.topic,
        subject: "ielts",
        correct: res.correct,
        difficulty: item.difficulty === "hard" ? 1300 : item.difficulty === "medium" ? 1050 : 850,
        mode: "practice",
      });
    }

    const raw = graded.filter((g) => g.correct).length;
    const band = ieltsBand(raw, graded.length, isListening ? "listening" : "reading");
    const attempt: Attempt = {
      id: `a${Date.now()}`,
      kind: isListening ? "ielts-listening" : "ielts-reading",
      setId: set.id,
      title: set.title,
      startedAt: Date.now(),
      finishedAt: Date.now(),
      results: graded,
      ielts: {
        [isListening ? "listening" : "reading"]: { raw, total: graded.length, band },
        overall: band,
        bySkill: breakdown(graded),
      },
    };
    saveAttempt(attempt);
  }, [set, isListening, recordAnswer, saveAttempt]);

  if (!ready || !user) return null;

  if (!set) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-[15px] text-mute">{d.exam.noAttempts}</p>
        <Btn href="/ielts" className="mt-5">{d.exam.ieltsTitle}</Btn>
      </div>
    );
  }

  const audioLabels = {
    play: d.exam.playAudio,
    replay: d.exam.replay,
    stop: d.exam.stopAudio,
    speaking: d.exam.speaking,
    note: d.exam.audioNote,
  };

  /* ---------------- intro ---------------- */
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <Reveal>
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-3xl border border-line2 bg-card">
            <IconClock size={30} />
          </div>
          <h1 className="font-display text-center text-[clamp(23px,5.2vw,32px)] font-extrabold tracking-[-0.02em]">
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
            {isListening && (
              <p className="mt-5 border-t border-line pt-4 text-[13px] leading-relaxed text-mute">
                {d.exam.audioNote}
              </p>
            )}
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
        header={
          isListening && set.scripts ? (
            <AudioScript scripts={set.scripts} labels={audioLabels} autoPlay />
          ) : undefined
        }
        onDone={finish}
      />
    );
  }

  /* ---------------- results ---------------- */
  if (!results) return null;
  const raw = results.filter((r) => r.correct).length;
  const band = ieltsBand(raw, results.length, isListening ? "listening" : "reading");
  const rows = breakdown(results);
  const v = verdict(rows, raw / results.length);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="relative"><Confetti fire={fire} /></div>

      <Reveal>
        <Card>
          <div className="text-center">
            <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.exam.bandScore}</div>
            <div className="font-display mt-1 text-6xl font-extrabold tabular-nums">{fmtBand(band)}</div>
            <div className="mt-2 text-[13px] font-semibold tabular-nums text-mute">
              {raw} / {results.length}
            </div>
          </div>
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

      <Reveal delay={120}>
        <SkillTable rows={rows} title={d.exam.bySkill} />
      </Reveal>

      {isListening && set.scripts && (
        <Reveal delay={150}>
          <h2 className="font-display mt-8 text-[19px] font-extrabold">{d.exam.listeningTitle}</h2>
          <div className="mt-3 flex flex-col gap-3">
            {set.scripts.map((s) => (
              <Card key={s.id}>
                <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{s.title}</div>
                <div className="mt-2.5 flex flex-col gap-2">
                  {s.turns.map((t, i) => (
                    <p key={i} className="text-[13.5px] leading-relaxed">
                      <span className="font-bold text-brand">{t.speaker}: </span>
                      <span className="text-mute">{t.text}</span>
                    </p>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Reveal>
      )}

      <Reveal delay={180}>
        <h2 className="font-display mt-8 text-[19px] font-extrabold">{d.exam.toFix}</h2>
        <p className="mt-1.5 text-[13.5px] text-mute">{d.exam.fixBlurb}</p>
        <div className="mt-4">
          <Review items={set.items} results={results} pool={pool} />
        </div>
      </Reveal>

      <div className="mt-8 flex flex-col gap-2">
        <Btn href="/ielts" variant="outline" size="lg" full>{d.exam.ieltsTitle}</Btn>
        <Btn href="/dashboard" variant="ghost" size="lg" full>{d.practice.toDash}</Btn>
      </div>
    </div>
  );
}

export default function IeltsPracticePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-lg px-4 py-20 text-center text-dim">…</div>}>
      <IeltsPracticeInner />
    </Suspense>
  );
}
