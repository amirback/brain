"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { lessonByTopic, topicById } from "@/lib/content";
import { masteryBand } from "@/lib/engine";
import { Bar, Btn, Card, Reveal, Ring } from "@/components/ui";
import { IconArrow, IconBolt, IconBook, IconLink, IconSpark } from "@/components/Icons";

function LearnInner() {
  const { d, pick } = useI18n();
  const { user } = useStore();
  const params = useSearchParams();
  const tid = params.get("t") ?? "linear";

  const topic = topicById(tid);
  const lesson = lessonByTopic(tid);
  const custom = user?.customTopics.find((c) => c.id === tid);
  const materials = (user?.materials ?? []).filter((m) => m.topic === tid);

  const m = user?.mastery[tid] ?? 0;
  const attempts = user?.attempts[tid] ?? 0;
  const band = masteryBand(m, attempts);

  const title = topic ? pick(topic.title) : (custom?.name ?? tid);
  const blurb = topic ? pick(topic.blurb) : (custom?.desc ?? "");

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
      <Reveal>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-dim hover:text-brand transition-colors">
          <span className="rotate-180">
            <IconArrow size={15} />
          </span>
          {d.learn.backToMap}
        </Link>
      </Reveal>

      <Reveal delay={50}>
        <div className="mt-5 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h1 className="font-display text-[clamp(26px,5.4vw,40px)] font-extrabold leading-tight tracking-[-0.02em]">
              {title}
            </h1>
            {blurb && <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-mute">{blurb}</p>}
          </div>
          <div className="hidden shrink-0 sm:block">
            <Ring value={m} size={82} stroke={7}>
              <div className="text-center">
                <div className="font-display text-lg font-extrabold leading-none tabular-nums">
                  {attempts === 0 ? "—" : Math.round(m * 100)}
                </div>
                <div className="mt-0.5 text-[9px] uppercase tracking-wider text-dim">
                  {attempts === 0 ? d.dash.mapLegend.none : "%"}
                </div>
              </div>
            </Ring>
          </div>
        </div>
      </Reveal>

      <Reveal delay={90}>
        <div className="mt-5 sm:hidden">
          <Bar value={m} tone={band === "strong" ? "brand" : band === "mid" ? "amber" : "dim"} />
        </div>
      </Reveal>

      {lesson ? (
        <>
          <Reveal delay={110}>
            <Card className="mt-7">
              <div className="flex items-start gap-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/12 text-brand">
                  <IconSpark size={20} />
                </span>
                <p className="pt-1 text-[15.5px] leading-relaxed">{pick(lesson.intro)}</p>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-6 mb-3 flex items-center gap-3">
              <IconBook size={18} />
              <h2 className="font-display text-lg font-bold">{d.learn.theory}</h2>
              <span className="h-px flex-1 bg-line" />
            </div>
          </Reveal>

          <div className="flex flex-col gap-3">
            {lesson.sections.map((s, i) => (
              <Reveal key={i} delay={180 + i * 60}>
                <Card>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-[13px] font-extrabold text-brand tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-[16px] font-bold">{pick(s.heading)}</h3>
                  </div>
                  <p className="mt-2.5 pl-8 text-[14.5px] leading-relaxed text-mute">{pick(s.body)}</p>
                  {s.formula && (
                    <div className="mt-3 ml-8 overflow-x-auto rounded-2xl border border-line2 bg-ink px-4 py-3">
                      <code className="whitespace-nowrap font-mono text-[14px] text-brand">{s.formula}</code>
                    </div>
                  )}
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={360}>
            <div className="mt-7 mb-3 flex items-center gap-3">
              <IconBolt size={18} />
              <h2 className="font-display text-lg font-bold">{d.learn.example}</h2>
              <span className="h-px flex-1 bg-line" />
            </div>
            <Card className="border-brand/25">
              <p className="font-display text-[17px] font-bold">{pick(lesson.example.problem)}</p>
              <ol className="mt-4 flex flex-col gap-3">
                {lesson.example.steps.map((s, i) => (
                  <li key={i} className="flex gap-3.5">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-brand/12 text-[11px] font-extrabold text-brand tabular-nums">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-[14.5px] leading-relaxed text-mute">{pick(s)}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </Reveal>
        </>
      ) : (
        <Reveal delay={110}>
          <Card className="mt-7">
            <p className="text-[14.5px] leading-relaxed text-mute">{d.learn.customEmpty}</p>
          </Card>
        </Reveal>
      )}

      {materials.length > 0 && (
        <Reveal delay={400}>
          <div className="mt-7 mb-3 flex items-center gap-3">
            <IconLink size={18} />
            <h2 className="font-display text-lg font-bold">{d.learn.materials}</h2>
            <span className="h-px flex-1 bg-line" />
          </div>
          <div className="flex flex-col gap-2">
            {materials.map((mt) => (
              <a
                key={mt.id}
                href={mt.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-line bg-card p-3.5 press hover:border-brand/50"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-soot text-mute">
                  <IconLink size={17} />
                </span>
                <span className="min-w-0 flex-1 truncate text-[14.5px] font-semibold">{mt.title}</span>
                <IconArrow size={16} />
              </a>
            ))}
          </div>
        </Reveal>
      )}

      <Reveal delay={440}>
        <Btn href={`/practice?t=${tid}`} size="lg" full className="arrow-slide mt-8">
          {d.learn.practiceCta}
          <span className="arr">
            <IconArrow size={18} />
          </span>
        </Btn>
      </Reveal>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-20 text-center text-dim">…</div>}>
      <LearnInner />
    </Suspense>
  );
}
