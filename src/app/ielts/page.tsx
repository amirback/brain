"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { IELTS_SETS } from "@/lib/exam/ielts-sets";
import { IELTS_WRITING } from "@/lib/exam/content/ielts-writing";
import { IELTS_SPEAKING } from "@/lib/exam/content/ielts-speaking";
import { fmtBand, overallBand } from "@/lib/exam/scoring";
import { pickEL } from "@/lib/exam/coach";
import { Btn, Card, Reveal, SectionLabel } from "@/components/ui";
import { IconBook, IconChart, IconClock, IconGlobe, IconSpark } from "@/components/Icons";

/**
 * IELTS hub.
 *
 * The four skills are shown as one board with the student's best band on each, so
 * the overall estimate — which is the average of the four — visibly depends on the
 * skill they have been avoiding.
 */
export default function IeltsHub() {
  const { d, lang } = useI18n();
  const { user, ready, role } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!user || role !== "student") router.replace("/start");
  }, [ready, user, role, router]);

  const attempts = useMemo(() => user?.examAttempts ?? [], [user]);

  /** Best band achieved per skill, which is what the overall estimate averages. */
  const bands = useMemo(() => {
    const best = (kind: string, read: (a: (typeof attempts)[number]) => number | undefined) => {
      const values = attempts.filter((a) => a.kind === kind).map(read).filter((v): v is number => typeof v === "number");
      return values.length > 0 ? Math.max(...values) : undefined;
    };
    return {
      listening: best("ielts-listening", (a) => a.ielts?.listening?.band),
      reading: best("ielts-reading", (a) => a.ielts?.reading?.band),
      writing: best("ielts-writing", (a) => a.ielts?.writing),
      speaking: best("ielts-speaking", (a) => a.ielts?.speaking),
    };
  }, [attempts]);

  const overall = overallBand([bands.listening, bands.reading, bands.writing, bands.speaking]);

  if (!ready || !user) return null;

  const skills = [
    { key: "listening" as const, title: d.exam.listeningTitle, href: "/ielts/practice?set=ielts-listening-full", icon: <IconGlobe size={20} />, count: 20 },
    { key: "reading" as const, title: d.exam.readingTitle, href: "/ielts/practice?set=ielts-reading-full", icon: <IconBook size={20} />, count: 40 },
    { key: "writing" as const, title: d.exam.writingTitle, href: "/ielts/writing", icon: <IconChart size={20} />, count: IELTS_WRITING.length },
    { key: "speaking" as const, title: d.exam.speakingTitle, href: "/ielts/speaking", icon: <IconSpark size={20} />, count: IELTS_SPEAKING.length },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <Reveal>
        <h1 className="font-display text-[clamp(28px,6vw,40px)] font-extrabold tracking-[-0.02em]">
          {d.exam.ieltsTitle}
        </h1>
        <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-mute">{d.exam.ieltsBlurb}</p>
      </Reveal>

      {overall !== undefined && (
        <Reveal delay={60}>
          <Card className="mt-6 border-brand/35">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.exam.overallBand}</div>
                <div className="font-display mt-1 text-4xl font-extrabold tabular-nums">{fmtBand(overall)}</div>
              </div>
              <div className="grid grid-cols-4 gap-3 text-center">
                {skills.map((s) => (
                  <div key={s.key}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-dim">{s.key.slice(0, 1).toUpperCase()}</div>
                    <div className="font-display mt-0.5 text-[15px] font-extrabold tabular-nums">
                      {bands[s.key] !== undefined ? fmtBand(bands[s.key]!) : "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Reveal>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {skills.map((s, i) => (
          <Reveal key={s.key} delay={80 + i * 45}>
            <Card>
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand/12 text-brand">
                  {s.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-[16px] font-extrabold">{s.title}</h2>
                  <div className="mt-1 text-[12px] font-semibold tabular-nums text-dim">
                    {s.count} {s.key === "writing" || s.key === "speaking" ? "prompts" : d.exam.questions}
                  </div>
                </div>
                {bands[s.key] !== undefined && (
                  <span className="font-display shrink-0 text-[17px] font-extrabold tabular-nums text-brand">
                    {fmtBand(bands[s.key]!)}
                  </span>
                )}
              </div>
              <Btn href={s.href} variant="outline" full className="mt-4">
                {bands[s.key] !== undefined ? d.exam.retake : d.exam.start}
              </Btn>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delay={280}>
        <SectionLabel>{d.exam.practiceSets}</SectionLabel>
      </Reveal>

      <div className="mt-3 flex flex-col gap-3">
        {IELTS_SETS.map((s, i) => (
          <Reveal key={s.id} delay={300 + i * 40}>
            <Card>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-soot px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-dim">
                  {s.section}
                </span>
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-dim">
                  {d.exam.level[s.difficulty]}
                </span>
              </div>
              <h3 className="font-display mt-2 text-[16.5px] font-extrabold">{s.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-mute">{pickEL(s.subtitle, lang)}</p>
              <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-3.5 text-[12.5px] font-semibold text-dim">
                <span className="inline-flex items-center gap-1.5">
                  <IconChart size={14} /> {s.items.length} {d.exam.questions}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <IconClock size={14} /> {s.minutes} {d.exam.minutes}
                </span>
              </div>
              <Btn href={`/ielts/practice?set=${s.id}`} variant="outline" full className="mt-3.5">
                {d.exam.start}
              </Btn>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
