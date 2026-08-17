"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { Btn, Card, Reveal } from "@/components/ui";
import { IconArrow, IconSpark, IconTeacher, IconUser } from "@/components/Icons";

/**
 * One-click demo: loads a lived-in profile (9 days of history, real
 * mastery spread) so a reviewer lands on a dashboard that already has
 * something to show instead of an empty state.
 */
export default function DemoPage() {
  const { d } = useI18n();
  const { seedDemo, ready } = useStore();
  const router = useRouter();
  const [going, setGoing] = useState(false);

  useEffect(() => {
    if (!going) return;
    seedDemo();
    const t = window.setTimeout(() => router.push("/dashboard"), 420);
    return () => window.clearTimeout(t);
  }, [going, seedDemo, router]);

  if (!ready) return null;

  return (
    <div className="relative overflow-hidden">
      <div className="glow-orb -top-28 left-1/2 h-[380px] w-[380px] -translate-x-1/2 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-lg px-4 py-16 text-center">
        <Reveal>
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-3xl border border-line2 bg-card">
            <IconSpark size={30} />
          </div>
          <h1 className="font-display text-[clamp(28px,6vw,40px)] font-extrabold tracking-[-0.02em]">
            {d.common.demo}
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-mute">
            {d.landing.ctaSub}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8 flex flex-col gap-2.5 text-left">
            <button onClick={() => setGoing(true)} disabled={going} className="press">
              <Card hover className="flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand/12 text-brand">
                  <IconUser size={21} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold">{d.nav.dashboard}</span>
                  <span className="block text-[12.5px] leading-snug text-dim">{d.dash.yourPlan}</span>
                </span>
                <IconArrow size={18} />
              </Card>
            </button>

            <Btn href="/teacher" variant="ghost" className="!h-auto !p-0">
              <Card hover className="flex w-full items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-line2 bg-soot">
                  <IconTeacher size={21} />
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block text-[15px] font-bold">{d.teacher.title}</span>
                  <span className="block text-[12.5px] leading-snug text-dim">{d.teacher.sub}</span>
                </span>
                <IconArrow size={18} />
              </Card>
            </Btn>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <p className="mt-6 text-[12.5px] leading-relaxed text-dim">{d.profile.dataNote}</p>
          <Btn href="/start" variant="outline" size="sm" className="mt-4">
            {d.nav.start}
          </Btn>
        </Reveal>
      </div>
    </div>
  );
}
