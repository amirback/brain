"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";
import { Btn, Card, Reveal } from "@/components/ui";
import { IconArrow, IconParent, IconSpark, IconTeacher, IconUser } from "@/components/Icons";

/**
 * One-click demo: loads a populated space — a student with three weeks of
 * history, eight classmates in one class, a teacher and a linked parent —
 * then drops the visitor into whichever role they picked.
 */
export default function DemoPage() {
  const { d } = useI18n();
  const { seedDemo, setRole, ready } = useStore();
  const router = useRouter();
  const [going, setGoing] = useState<Role | null>(null);

  const enter = (role: Role) => {
    setGoing(role);
    seedDemo();
    setRole(role);
    const dest = role === "teacher" ? "/teacher" : role === "parent" ? "/parent" : "/dashboard";
    window.setTimeout(() => router.push(dest), 380);
  };

  if (!ready) return null;

  const cards: { role: Role; Icon: typeof IconUser; t: string; sub: string }[] = [
    { role: "student", Icon: IconUser, t: d.roles.student.t, sub: d.dash.yourPlan },
    { role: "teacher", Icon: IconTeacher, t: d.roles.teacher.t, sub: d.teacher.heat },
    { role: "parent", Icon: IconParent, t: d.roles.parent.t, sub: d.parent.sub },
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="glow-orb -top-28 left-1/2 h-[380px] w-[380px] -translate-x-1/2 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-lg px-4 py-16 text-center">
        <Reveal>
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-3xl border border-line2 bg-card">
            <IconSpark size={30} />
          </div>
          <h1 className="font-display text-[clamp(28px,6vw,40px)] font-extrabold tracking-[-0.02em]">{d.common.demo}</h1>
          <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-mute">{d.roles.pickSub}</p>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8 flex flex-col gap-2.5 text-left">
            {cards.map((c) => (
              <button key={c.role} onClick={() => enter(c.role)} disabled={going !== null} className="press">
                <Card hover className={`flex items-center gap-4 ${going === c.role ? "border-brand" : ""}`}>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-line2 bg-haze">
                    <c.Icon size={21} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-bold">{c.t}</span>
                    <span className="block truncate text-[12.5px] leading-snug text-dim">{c.sub}</span>
                  </span>
                  <IconArrow size={18} />
                </Card>
              </button>
            ))}
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
