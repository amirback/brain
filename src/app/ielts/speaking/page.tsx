"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { IELTS_SPEAKING, speakingById } from "@/lib/exam/content/ielts-speaking";
import { gradeSpeaking, type SpeakingGrade } from "@/lib/exam/grader";
import { fmtBand } from "@/lib/exam/scoring";
import { pickEL } from "@/lib/exam/coach";
import type { Attempt, CriterionScore } from "@/lib/exam/types";
import { Bar, Btn, Card, Reveal, SectionLabel } from "@/components/ui";
import { IconArrow, IconCheck, IconClock, IconCross, IconSpark } from "@/components/Icons";

/**
 * IELTS Speaking.
 *
 * The browser's speech recognition produces the transcript; everything downstream —
 * fluency from words-per-minute, lexical range, grammatical range — is graded from
 * that transcript. Pronunciation is left explicitly unscored rather than guessed at,
 * because nothing here listens to the audio itself.
 */

interface RecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

function createRecognition(): RecognitionLike | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => RecognitionLike;
    webkitSpeechRecognition?: new () => RecognitionLike;
  };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const r = new Ctor();
  r.lang = "en-GB";
  r.continuous = true;
  r.interimResults = true;
  return r;
}

function SpeakingInner() {
  const { d, lang } = useI18n();
  const { user, ready, role, saveAttempt } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const promptId = params.get("p");

  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [prep, setPrep] = useState(0);
  const [grade, setGrade] = useState<SpeakingGrade | null>(null);
  const [supported, setSupported] = useState(true);
  const [typing, setTyping] = useState(false);
  const recognition = useRef<RecognitionLike | null>(null);
  const finalText = useRef("");

  useEffect(() => {
    if (!ready) return;
    if (!user || role !== "student") router.replace("/start");
  }, [ready, user, role, router]);

  useEffect(() => {
    // Same reason as the synthesis check: the page is prerendered, so the browser
    // capability can only be read once hydration has happened.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(createRecognition() !== null);
  }, []);

  const prompt = useMemo(() => (promptId ? speakingById(promptId) : undefined), [promptId]);

  /* Part 2 gives one minute of preparation before the clock starts. */
  useEffect(() => {
    if (prep <= 0) return;
    const iv = window.setInterval(() => setPrep((v) => Math.max(0, v - 1)), 1000);
    return () => window.clearInterval(iv);
  }, [prep]);

  useEffect(() => {
    if (!recording) return;
    const iv = window.setInterval(() => setSeconds((v) => v + 1), 1000);
    return () => window.clearInterval(iv);
  }, [recording]);

  const start = useCallback(() => {
    const r = createRecognition();
    if (!r) {
      setSupported(false);
      setTyping(true);
      return;
    }
    finalText.current = text ? `${text} ` : "";
    r.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        const chunk = res[0].transcript;
        if (res.isFinal) finalText.current += `${chunk} `;
        else interim += chunk;
      }
      setText(`${finalText.current}${interim}`.replace(/\s+/g, " ").trimStart());
    };
    r.onerror = () => setRecording(false);
    r.onend = () => setRecording(false);
    recognition.current = r;
    r.start();
    setRecording(true);
  }, [text]);

  const stop = useCallback(() => {
    recognition.current?.stop();
    setRecording(false);
  }, []);

  const check = useCallback(() => {
    if (!prompt) return;
    const g = gradeSpeaking(text, prompt, seconds);
    setGrade(g);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const attempt: Attempt = {
      id: `a${Date.now()}`,
      kind: "ielts-speaking",
      setId: prompt.id,
      title: `IELTS Speaking Part ${prompt.part}`,
      startedAt: Date.now() - seconds * 1000,
      finishedAt: Date.now(),
      results: [],
      ielts: { speaking: g.band, bySkill: [] },
      written: [{
        promptId: prompt.id,
        task: `Part ${prompt.part}`,
        text,
        seconds,
        band: g.band,
        criteria: g.criteria,
        notes: g.notes,
      }],
    };
    saveAttempt(attempt);
  }, [prompt, text, seconds, saveAttempt]);

  const again = useCallback(() => {
    setGrade(null);
    setText("");
    setSeconds(0);
    finalText.current = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!ready || !user) return null;

  /* ---------------- picker ---------------- */
  if (!prompt) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <h1 className="font-display text-[clamp(26px,5.5vw,36px)] font-extrabold tracking-[-0.02em]">
          {d.exam.speakingTitle}
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-mute">{d.exam.prNote}</p>

        {([1, 2, 3] as const).map((part) => (
          <div key={part}>
            <SectionLabel>{d.exam.partLabel} {part}</SectionLabel>
            <div className="mt-3 flex flex-col gap-3">
              {IELTS_SPEAKING.filter((p) => p.part === part).map((p) => (
                <Card key={p.id}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-[16px] font-extrabold">{p.topic}</h3>
                    <span className="shrink-0 text-[11px] font-bold tabular-nums text-dim">
                      {Math.round(p.target / 60)}–{Math.ceil(p.target / 60) + 1} {d.exam.minutes}
                    </span>
                  </div>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-mute">
                    {p.part === 2 ? p.questions[0] : `${p.questions.length} questions`}
                  </p>
                  <Btn href={`/ielts/speaking?p=${p.id}`} variant="outline" full className="mt-3.5">
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
    const fixes = grade.notes.filter((n) => n.kind === "fix");
    const tips = grade.notes.filter((n) => n.kind === "tip");
    const goods = grade.notes.filter((n) => n.kind === "good");

    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Reveal>
          <Card>
            <div className="text-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.exam.bandScore}</div>
              <div className="font-display mt-1 text-6xl font-extrabold tabular-nums">{fmtBand(grade.band)}</div>
              <div className="mt-2 text-[12.5px] tabular-nums text-dim">
                {grade.metrics.wordCount} {d.exam.wordsLabel}
                {grade.wpm !== null && ` · ${grade.wpm} wpm`}
                {seconds > 0 && ` · ${seconds}s`}
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
                    <p className="text-[13.5px] leading-relaxed text-mute">{pickEL(n.message, lang)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {tips.length > 0 && (
          <Reveal delay={140}>
            <h2 className="font-display mt-7 text-[19px] font-extrabold">{d.exam.upgrades}</h2>
            <div className="mt-3 flex flex-col gap-2">
              {tips.map((n, i) => (
                <div key={i} className="rounded-2xl border border-line bg-card px-4 py-3">
                  <div className="flex gap-2.5">
                    <IconSpark size={15} />
                    <div className="min-w-0">
                      {n.quote && <div className="text-[12.5px] text-dim line-through">{n.quote}</div>}
                      <p className="text-[13.5px] leading-relaxed text-mute">{pickEL(n.message, lang)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {goods.map((n, i) => (
          <Reveal key={i} delay={170}>
            <Card className="mt-4 border-brand/30">
              <div className="flex gap-2.5">
                <IconCheck size={15} />
                <p className="text-[13.5px] leading-relaxed text-mute">{pickEL(n.message, lang)}</p>
              </div>
            </Card>
          </Reveal>
        ))}

        <Reveal delay={200}>
          <Card className="mt-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.exam.yourText}</div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-mute">{text}</p>
          </Card>
        </Reveal>

        <div className="mt-6 flex flex-col gap-2">
          <Btn size="lg" full className="arrow-slide" onClick={again}>
            {d.exam.rewrite}
            <span className="arr"><IconArrow size={18} /></span>
          </Btn>
          <Btn href="/ielts" variant="outline" size="lg" full>{d.exam.ieltsTitle}</Btn>
        </div>
      </div>
    );
  }

  /* ---------------- answering ---------------- */
  const words = (text.match(/[A-Za-z']+/g) ?? []).length;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-card px-4 py-3">
        <div className="flex items-center gap-2.5">
          <IconClock size={17} />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-dim">
              {d.exam.partLabel} {prompt.part} · {prompt.topic}
            </div>
            <div className={`font-display text-lg font-extrabold tabular-nums ${recording ? "text-brand" : ""}`}>
              {mm}:{ss}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold uppercase tracking-wider text-dim">{d.exam.wordsLabel}</div>
          <div className="font-display text-lg font-extrabold tabular-nums">{words}</div>
        </div>
      </div>

      <Card className="mt-4">
        {prompt.part === 2 ? (
          <>
            <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.exam.cueCard}</div>
            <p className="mt-2 text-[15.5px] font-bold leading-snug">{prompt.questions[0]}</p>
            <p className="mt-3 text-[13.5px] text-mute">You should say:</p>
            <ul className="mt-1.5 flex flex-col gap-1">
              {prompt.bullets?.map((b, i) => (
                <li key={i} className="text-[14px] leading-relaxed text-mute">· {b}</li>
              ))}
            </ul>
            {prep > 0 ? (
              <div className="mt-4 rounded-xl border border-brand/40 bg-brand/8 px-3 py-2.5 text-center">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-dim">{d.exam.prepTime}</div>
                <div className="font-display mt-0.5 text-2xl font-extrabold tabular-nums text-brand">{prep}</div>
              </div>
            ) : (
              <Btn variant="outline" full className="mt-4" onClick={() => setPrep(60)}>
                {d.exam.prepTime} — 60s
              </Btn>
            )}
          </>
        ) : (
          <>
            <div className="text-[11px] font-bold uppercase tracking-wider text-dim">
              {d.exam.partLabel} {prompt.part}
            </div>
            <ul className="mt-2.5 flex flex-col gap-2.5">
              {prompt.questions.map((q, i) => (
                <li key={i} className="flex gap-2.5 text-[14.5px] leading-snug">
                  <span className="font-display font-extrabold text-brand">{i + 1}</span>
                  {q}
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      {!supported && (
        <Card className="mt-4 border-amber/40">
          <p className="text-[13.5px] leading-relaxed text-mute">{d.exam.noSpeech}</p>
        </Card>
      )}

      <div className="mt-4 flex gap-2">
        {supported && !typing && (
          <Btn
            size="lg"
            full
            variant={recording ? "outline" : "primary"}
            onClick={recording ? stop : start}
          >
            {recording ? `${d.exam.recordStop} · ${d.exam.recording}` : d.exam.recordStart}
          </Btn>
        )}
        {supported && !recording && (
          <Btn size="lg" variant="ghost" onClick={() => setTyping((t) => !t)}>
            {d.exam.typeInstead}
          </Btn>
        )}
      </div>

      {(typing || !supported || text) && (
        <div className="mt-4">
          <label className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.exam.yourText}</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            spellCheck={false}
            className="mt-2 w-full resize-y rounded-2xl border border-line bg-mist px-4 py-3.5 text-[14.5px] leading-relaxed outline-none focus:border-brand"
          />
        </div>
      )}

      <div className="mt-3">
        <Bar value={Math.min(1, words / (prompt.target / 2))} h={4} tone={words < prompt.target / 3 ? "amber" : "brand"} />
      </div>

      <Btn size="lg" full className="mt-4" disabled={words < 10 || recording} onClick={check}>
        {d.exam.checkWork}
      </Btn>

      <Card className="mt-6">
        <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.exam.upgrades}</div>
        <div className="mt-3 flex flex-col gap-2.5">
          {prompt.upgrades.map((u, i) => (
            <div key={i} className="text-[13px] leading-relaxed">
              <span className="text-dim line-through">{u.plain}</span>
              <span className="mx-1.5 text-brand">→</span>
              <span className="text-mute">{u.better}</span>
            </div>
          ))}
        </div>
      </Card>
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

export default function IeltsSpeakingPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-lg px-4 py-20 text-center text-dim">…</div>}>
      <SpeakingInner />
    </Suspense>
  );
}
