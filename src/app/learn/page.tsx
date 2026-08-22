"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { lessonByTopic, resourcesOf, summaryOf, topicById } from "@/lib/content";
import type { WorkedExample } from "@/lib/types";
import { masteryBand } from "@/lib/engine";
import { videoFor } from "@/lib/advisor";
import { Bar, Btn, Card, Reveal, Ring } from "@/components/ui";
import { IconArrow, IconBolt, IconBook, IconCheck, IconCross, IconLink, IconSpark } from "@/components/Icons";

function LearnInner() {
  const { d, pick, lang } = useI18n();
  const { user, saveLessonProgress } = useStore();
  const params = useSearchParams();
  const tid = params.get("t") ?? "linear";

  const topic = topicById(tid);
  const lesson = lessonByTopic(tid);
  const summary = summaryOf(tid);
  const custom = user?.customTopics.find((c) => c.id === tid);
  const materials = (user?.materials ?? []).filter((m) => m.topic === tid);
  const video = videoFor(tid, lang);

  const sections = lesson?.sections ?? [];
  // A lesson without a deep layer still has its single legacy example, which is
  // lifted into the same shape so the reader only has one thing to render.
  const worked: WorkedExample[] = lesson
    ? (lesson.worked ?? [{
        title: { ru: "Разбор", kk: "Талдау", en: "Worked problem" },
        problem: lesson.example.problem,
        steps: lesson.example.steps.map((s) => ({ text: s })),
        answer: { ru: "", kk: "", en: "" },
        takeaway: { ru: "", kk: "", en: "" },
      }])
    : [];
  const pitfalls = lesson?.pitfalls ?? [];
  const hasPitfalls = pitfalls.length > 0;
  // Steps: intro, one per section, one per worked problem, pitfalls, summary.
  const totalSteps = 1 + sections.length + worked.length + (hasPitfalls ? 1 : 0) + 1;

  const [step, setStep] = useState(0);
  const [restored, setRestored] = useState(false);

  // Pick up where the student stopped reading last time.
  useEffect(() => {
    if (restored || !user) return;
    const saved = user.lessonProgress[tid] ?? 0;
    // Клиентские данные (localStorage, язык браузера, скролл) во время SSR
   // прочитать нельзя — только после монтирования. Это требуемый паттерн,
   // а не каскад рендеров.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved > 0 && saved < totalSteps) setStep(saved);
    setRestored(true);
  }, [user, tid, totalSteps, restored]);

  useEffect(() => {
    if (!restored) return;
    saveLessonProgress(tid, step);
    // `user` is deliberately out of the deps: this effect writes to it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, tid, restored]);

  const m = user?.mastery[tid] ?? 0;
  const attempts = user?.attempts[tid] ?? 0;
  const band = masteryBand(m, attempts);
  const title = topic ? pick(topic.title) : (custom?.name ?? tid);
  const blurb = topic ? pick(topic.blurb) : (custom?.desc ?? "");
  // A worked problem takes longer to read than a theory section, and a pitfalls
  // page longer still, because the student is comparing two versions line by line.
  const readMinutes = Math.max(
    2,
    Math.round((sections.length * 70 + worked.length * 90 + pitfalls.length * 35 + summary.length * 12) / 60)
  );

  const atIntro = step === 0;
  const atSummary = step === totalSteps - 1;
  const sectionIndex = step - 1;
  const workedIndex = step - 1 - sections.length;
  const atPitfalls = hasPitfalls && step === 1 + sections.length + worked.length;
  const atWorked = !atIntro && !atSummary && !atPitfalls && workedIndex >= 0;
  const atSection = !atIntro && !atSummary && !atPitfalls && !atWorked;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
      <Reveal>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-dim transition-colors hover:text-brand">
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
            {lesson && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-dim">
                <span className="rounded-full border border-line2 px-2.5 py-1 font-semibold tabular-nums">
                  {readMinutes} {d.lesson.minutes}
                </span>
                <span className="rounded-full border border-line2 px-2.5 py-1 font-semibold tabular-nums">
                  {totalSteps} {d.lesson.section.toLowerCase()}
                </span>
                {worked.length > 1 && (
                  <span className="rounded-full border border-brand/40 bg-brand/8 px-2.5 py-1 font-semibold tabular-nums text-brand">
                    {worked.length} {d.lesson.worked.toLowerCase()}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="hidden shrink-0 flex-col items-center gap-1.5 sm:flex">
            <Ring value={m} size={82} stroke={7}>
              <div className="font-display text-xl font-extrabold leading-none tabular-nums">
                {attempts === 0 ? "—" : `${Math.round(m * 100)}%`}
              </div>
            </Ring>
            {/* The label sits under the ring: "NOT STARTED" is far wider than an
                82px circle and used to run out over both edges of it. */}
            {attempts === 0 && (
              <div className="text-[9px] font-semibold uppercase tracking-wider text-dim whitespace-nowrap">
                {d.dash.mapLegend.none}
              </div>
            )}
          </div>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-5 sm:hidden">
          <Bar value={m} tone={band === "strong" ? "brand" : band === "mid" ? "amber" : "dim"} />
        </div>
      </Reveal>

      {lesson ? (
        <>
          {/* reading progress */}
          <Reveal delay={100}>
            <div className="mt-7 mb-4">
              <div className="mb-2 flex items-center justify-between text-[12px] font-semibold text-dim">
                <span>
                  {d.lesson.section} {Math.min(step + 1, totalSteps)} / {totalSteps}
                </span>
                <span className="tabular-nums">{Math.round(((step + 1) / totalSteps) * 100)}%</span>
              </div>
              <Bar value={(step + 1) / totalSteps} h={5} />
            </div>
          </Reveal>

          <div key={step} className="slide-up">
            {atIntro && (
              <Card>
                <div className="flex items-start gap-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/12 text-brand">
                    <IconSpark size={20} />
                  </span>
                  <p className="pt-1 text-[15.5px] leading-relaxed">{pick(lesson.intro)}</p>
                </div>

                {lesson.objectives && lesson.objectives.length > 0 && (
                  <div className="mt-5 rounded-2xl border border-line2 bg-mist p-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-dim">
                      {d.lesson.objectives}
                    </div>
                    <ul className="mt-2.5 flex flex-col gap-2">
                      {lesson.objectives.map((o, i) => (
                        <li key={i} className="flex gap-2.5">
                          <span className="mt-0.5 shrink-0 text-brand"><IconCheck size={15} /></span>
                          <span className="text-[14px] leading-relaxed text-mute">{pick(o)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {video && (
                  <a
                    href={video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="press mt-4 flex items-center gap-3 rounded-2xl border border-line bg-mist p-3.5 hover:border-brand/50"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-haze text-mute">
                      <IconLink size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-bold">{d.lesson.video}</span>
                      <span className="block text-[12px] leading-snug text-dim line-clamp-2">{d.lesson.videoHint}</span>
                    </span>
                    <IconArrow size={16} />
                  </a>
                )}
              </Card>
            )}

            {atSection && sections[sectionIndex] && (
              <Card>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-[13px] font-extrabold tabular-nums text-brand">
                    {String(sectionIndex + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-[18px] font-bold">{pick(sections[sectionIndex].heading)}</h2>
                </div>
                <p className="mt-3 pl-8 text-[15.5px] leading-relaxed text-mute">{pick(sections[sectionIndex].body)}</p>
                {sections[sectionIndex].formula && (
                  <div className="ml-8 mt-4 overflow-x-auto rounded-2xl border border-line2 bg-ink px-4 py-3">
                    <code className="whitespace-nowrap font-mono text-[14px] text-brand">
                      {sections[sectionIndex].formula}
                    </code>
                  </div>
                )}
                {sections[sectionIndex].example && (
                  <div className="ml-8 mt-3 overflow-x-auto rounded-2xl border border-brand/25 bg-brand/6 px-4 py-3">
                    <code className="whitespace-pre-wrap font-mono text-[13.5px] leading-relaxed">
                      {pick(sections[sectionIndex].example!)}
                    </code>
                  </div>
                )}
                {sections[sectionIndex].note && (
                  <p className="ml-8 mt-3 border-l-2 border-amber/50 pl-3 text-[13.5px] leading-relaxed text-mute">
                    {pick(sections[sectionIndex].note!)}
                  </p>
                )}
              </Card>
            )}

            {atWorked && worked[workedIndex] && (
              <Card className="border-brand/25">
                <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-brand">
                  <IconBolt size={15} />
                  {d.lesson.worked} {worked.length > 1 ? `${workedIndex + 1} / ${worked.length}` : ""}
                </div>
                {pick(worked[workedIndex].title) && (
                  <h2 className="font-display mb-2 text-[16px] font-bold">{pick(worked[workedIndex].title)}</h2>
                )}
                <div className="overflow-x-auto rounded-2xl border border-line2 bg-ink px-4 py-3">
                  <code className="whitespace-pre-wrap font-mono text-[14.5px] leading-relaxed">
                    {pick(worked[workedIndex].problem)}
                  </code>
                </div>

                <ol className="mt-4 flex flex-col gap-3.5">
                  {worked[workedIndex].steps.map((s, i) => (
                    <li key={i} className="flex gap-3.5">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-brand/12 text-[11px] font-extrabold tabular-nums text-brand">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="pt-0.5 text-[14.5px] leading-relaxed text-mute">{pick(s.text)}</p>
                        {s.formula && (
                          <div className="mt-2 overflow-x-auto rounded-xl border border-line2 bg-ink px-3 py-2">
                            <code className="whitespace-nowrap font-mono text-[13.5px] text-brand">{s.formula}</code>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>

                {pick(worked[workedIndex].answer) && (
                  <div className="mt-4 flex flex-wrap items-baseline gap-2 border-t border-line pt-3.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-dim">
                      {d.lesson.answerLabel}
                    </span>
                    <code className="font-mono text-[14.5px] font-bold text-brand">
                      {pick(worked[workedIndex].answer)}
                    </code>
                  </div>
                )}
                {pick(worked[workedIndex].takeaway) && (
                  <div className="mt-3 rounded-2xl bg-mist px-4 py-3">
                    <div className="text-[10.5px] font-bold uppercase tracking-wider text-dim">
                      {d.lesson.takeaway}
                    </div>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-mute">
                      {pick(worked[workedIndex].takeaway)}
                    </p>
                  </div>
                )}
              </Card>
            )}

            {atPitfalls && (
              <Card className="border-amber/35">
                <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber">
                  <IconCross size={15} />
                  {d.lesson.pitfalls}
                </div>
                <p className="mb-4 text-[12.5px] text-dim">{d.lesson.pitfallsSub}</p>
                <div className="flex flex-col gap-4">
                  {pitfalls.map((p, i) => (
                    <div key={i} className="rounded-2xl border border-line bg-mist p-3.5">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <div className="text-[10.5px] font-bold uppercase tracking-wider text-amber">
                            {d.lesson.pitfallWrong}
                          </div>
                          <code className="mt-1 block whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-mute line-through decoration-amber/60">
                            {pick(p.wrong)}
                          </code>
                        </div>
                        <div className="sm:border-l sm:border-line sm:pl-3">
                          <div className="text-[10.5px] font-bold uppercase tracking-wider text-brand">
                            {d.lesson.pitfallRight}
                          </div>
                          <code className="mt-1 block whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-ink">
                            {pick(p.right)}
                          </code>
                        </div>
                      </div>
                      <p className="mt-3 border-t border-line pt-2.5 text-[13.5px] leading-relaxed text-mute">
                        {pick(p.why)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {atSummary && (
              <Card className="border-brand/30">
                <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-brand">
                  <IconBook size={15} />
                  {d.lesson.reading}
                </div>
                <p className="mb-4 text-[12.5px] text-dim">{d.lesson.readingSub}</p>
                <ul className="flex flex-col gap-2.5">
                  {summary.map((s, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      <span className="text-[14.5px] leading-relaxed">{pick(s)}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          {/* reader controls */}
          <div className="mt-4 flex items-center gap-2">
            <Btn variant="outline" size="lg" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
              {d.lesson.prev}
            </Btn>
            {atSummary ? (
              <Btn href={`/practice?t=${tid}`} size="lg" full className="arrow-slide">
                {d.learn.practiceCta}
                <span className="arr">
                  <IconArrow size={18} />
                </span>
              </Btn>
            ) : (
              <Btn size="lg" full className="arrow-slide" onClick={() => setStep((s) => Math.min(totalSteps - 1, s + 1))}>
                {step === totalSteps - 2 ? d.lesson.toSummary : d.lesson.next}
                <span className="arr">
                  <IconArrow size={18} />
                </span>
              </Btn>
            )}
          </div>

          {atSummary && (
            <div className="mt-3 flex items-center justify-center gap-2 text-[12.5px] font-semibold text-brand">
              <IconCheck size={15} />
              {d.lesson.finished}
            </div>
          )}
        </>
      ) : (
        <Reveal delay={110}>
          <Card className="mt-7">
            <p className="text-[14.5px] leading-relaxed text-mute">{d.learn.customEmpty}</p>
          </Card>
        </Reveal>
      )}

      {/* vetted outside material for this subject */}
      {topic && resourcesOf(topic.subject).length > 0 && (
        <Reveal delay={180}>
          <div className="mb-3 mt-8 flex items-center gap-3">
            <IconBook size={18} />
            <h2 className="font-display text-lg font-bold">{d.lesson.resources}</h2>
            <span className="h-px flex-1 bg-line" />
          </div>
          <div className="flex flex-col gap-2">
            {resourcesOf(topic.subject).map((r) => (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="press flex items-center gap-3 rounded-2xl border border-line bg-card p-3.5 hover:border-brand/50"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-haze text-mute">
                  <IconLink size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14.5px] font-semibold">{r.title}</span>
                  <span className="block text-[12px] leading-snug text-dim line-clamp-2">{pick(r.note)}</span>
                </span>
                <IconArrow size={16} />
              </a>
            ))}
          </div>
        </Reveal>
      )}

      {materials.length > 0 && (
        <Reveal delay={200}>
          <div className="mb-3 mt-8 flex items-center gap-3">
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
                className="press flex items-center gap-3 rounded-2xl border border-line bg-card p-3.5 hover:border-brand/50"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-haze text-mute">
                  <IconLink size={17} />
                </span>
                <span className="min-w-0 flex-1 truncate text-[14.5px] font-semibold">{mt.title}</span>
                <IconArrow size={16} />
              </a>
            ))}
          </div>
        </Reveal>
      )}
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
