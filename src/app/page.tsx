"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { Btn, Card, CountUp, Reveal, SectionLabel, Sparkline } from "@/components/ui";
import {
  IconArrow, IconBolt, IconBook, IconClock, IconFlame,
  IconMap, IconParent, IconRefresh, IconTeacher, IconTrend, IconTrophy,
} from "@/components/Icons";


const LADDER = [
  { name: "Айым", elo: 1512 },
  { name: "Данияр", elo: 1288 },
  { name: "Томирис", elo: 1174 },
  { name: "Алишер", elo: 1051 },
];

export default function Landing() {
  const { d } = useI18n();
  const { user } = useStore();

  const featIcons = [IconMap, IconTrend, IconRefresh, IconTrophy, IconFlame, IconTeacher];

  return (
    <>
      {/* ---------------- hero ---------------- */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 dotgrid opacity-60" aria-hidden="true" />
        <div className="glow-orb -top-24 -left-20 h-[420px] w-[420px]" aria-hidden="true" />
        <div className="glow-orb top-40 -right-32 h-[380px] w-[380px] opacity-70" aria-hidden="true" />
        <div
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bone"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-14 pb-20 sm:pt-20 sm:pb-28">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-8 items-center">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-line2 bg-mist/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-mute backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand pulse-dot" />
                  {d.landing.badge}
                </span>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="font-display mt-6 text-[clamp(38px,7.2vw,68px)] font-extrabold leading-[0.98] tracking-[-0.03em]">
                  {d.landing.h1a}
                  <br />
                  <span className="text-brand">{d.landing.h1b}</span>
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-mute">{d.landing.sub}</p>
              </Reveal>

              <Reveal delay={240}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Btn href={user ? "/dashboard" : "/start"} size="lg" className="arrow-slide">
                    {user ? d.nav.dashboard : d.landing.ctaPrimary}
                    <span className="arr">
                      <IconArrow size={18} />
                    </span>
                  </Btn>
                  <Btn href="/demo" variant="outline" size="lg">
                    {d.landing.ctaSecondary}
                  </Btn>
                </div>
              </Reveal>

              <Reveal delay={320}>
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
                  {[
                    { v: "6", l: d.landing.statSubjects },
                    { v: "3", l: d.landing.statLangs },
                    { v: "0 ₸", l: d.landing.statPrice },
                  ].map((x) => (
                    <div key={x.l} className="text-xs leading-snug text-dim">
                      <span className="font-display block text-lg font-extrabold text-ink tabular-nums">{x.v}</span>
                      {x.l}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* floating demo stack */}
            <div className="relative h-[420px] sm:h-[460px] select-none" aria-hidden="true">
              <div className="float-a absolute left-0 top-4 w-[240px] sm:w-[262px] rounded-3xl border border-line bg-card p-4 shadow-[0_28px_60px_-20px_rgba(64,48,24,0.22)]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-dim">
                    {d.landing.demoCard.forecast}
                  </span>
                  <IconTrend size={16} />
                </div>
                <div className="font-display mt-2 text-4xl font-extrabold tabular-nums">
                  <CountUp to={31} />
                  <span className="text-lg text-dim"> / 50</span>
                </div>
                <div className="mt-1 text-[12px] font-semibold text-brand">{d.landing.demoCard.forecastDelta}</div>
                <div className="mt-3">
                  <Sparkline points={[18, 20, 22, 25, 27, 29, 31]} h={52} />
                </div>
              </div>

              <div className="float-b absolute right-0 top-28 w-[210px] sm:w-[230px] rounded-3xl border border-line bg-card p-4 shadow-[0_28px_60px_-20px_rgba(64,48,24,0.22)]">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-dim">
                  <IconMap size={15} />
                  {d.landing.demoCard.mapTitle}
                </div>
                <div className="mt-3 grid grid-cols-4 gap-1.5">
                  {[1, 1, 0.6, 0.25, 1, 0.6, 0.25, 0, 0.6, 1, 0, 0.25].map((v, i) => (
                    <span
                      key={i}
                      className="aspect-square rounded-[5px]"
                      style={{
                        background:
                          v === 1 ? "#ff6b1f" : v === 0.6 ? "rgba(255,107,31,.55)" : v === 0.25 ? "rgba(255,107,31,.2)" : "#ebe5d7",
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="float-c absolute bottom-6 left-6 sm:left-10 w-[214px] rounded-3xl border border-line bg-card p-4 shadow-[0_28px_60px_-20px_rgba(64,48,24,0.22)]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-dim">
                    {d.landing.demoCard.eloTitle}
                  </span>
                  <IconBolt size={15} />
                </div>
                <div className="font-display mt-1.5 flex items-end gap-2 text-3xl font-extrabold tabular-nums">
                  <CountUp to={1147} />
                  <span className="mb-1 text-[12px] font-semibold text-brand">{d.landing.demoCard.eloDelta}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-line2 px-2 py-0.5 text-[10px] font-bold text-mute">
                    <IconFlame size={11} /> 9
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-line2 px-2 py-0.5 text-[10px] font-bold text-mute">
                    <IconClock size={11} /> 47.5{d.common.hour}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- marquee ---------------- */}
      <section className="border-y border-line bg-mist/50 py-3.5">
        <div className="marquee">
          {[0, 1].map((k) => (
            <div key={k} className="marquee-track" aria-hidden={k === 1}>
              {d.landing.marquee.map((m, i) => (
                <span key={`${k}-${i}`} className="flex items-center gap-6 px-6">
                  <span className="font-display text-sm font-bold uppercase tracking-[0.15em] text-mute whitespace-nowrap">
                    {m}
                  </span>
                  <span className="h-1 w-1 shrink-0 rounded-full bg-brand" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- steps ---------------- */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28">
        <Reveal>
          <SectionLabel>{d.landing.stepsTitle}</SectionLabel>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {d.landing.steps.map((s, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="step-card group h-full rounded-3xl border border-line bg-card p-6 card-hover">
                <div className="flex items-start gap-5">
                  <span className="step-num shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold leading-snug">{s.t}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-mute">{s.d}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- a day inside the product ----------------
          The site explained what Brain does but never what the student
          actually does. This section walks one loop end to end, with the
          generated plan shown next to it so the promise is concrete. */}
      <section className="relative overflow-hidden border-y border-line bg-mist/40">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28">
          <Reveal>
            <h2 className="font-display max-w-2xl text-[clamp(28px,5vw,46px)] font-extrabold leading-[1.08] tracking-[-0.02em]">
              {d.landing.dayTitle}
              <br />
              <span className="text-brand">{d.landing.dayTitle2}</span>
            </h2>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-mute">{d.landing.dayBody}</p>
          </Reveal>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start">
            {/* the loop */}
            <ol className="relative flex flex-col gap-3">
              {d.landing.cycle.map((c, i) => (
                <Reveal key={i} delay={i * 70}>
                  <li className="relative flex gap-4 rounded-3xl border border-line bg-card p-5">
                    <span className="font-display grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/12 text-[13px] font-extrabold tabular-nums text-brand">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-[16px] font-extrabold leading-snug">{c.t}</h3>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-mute">{c.d}</p>
                    </div>
                    {i === d.landing.cycle.length - 1 && (
                      <span className="absolute -bottom-2 right-6 text-[11px] font-bold uppercase tracking-wider text-brand">
                        ↺
                      </span>
                    )}
                  </li>
                </Reveal>
              ))}
            </ol>

            {/* the plan it produces */}
            <Reveal delay={140}>
              <div className="rounded-3xl border border-brand/35 bg-card p-6 lg:sticky lg:top-24">
                <div className="text-[11px] font-bold uppercase tracking-wider text-dim">
                  {d.landing.dayPlanSub}
                </div>
                <h3 className="font-display mt-1.5 text-[19px] font-extrabold">{d.landing.dayPlanTitle}</h3>
                <div className="mt-5 flex flex-col gap-2">
                  {d.landing.dayPlanRows.map((r, i) => {
                    const last = i === d.landing.dayPlanRows.length - 1;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 ${
                          last ? "border-brand/45 bg-brand/8" : "border-line bg-mist"
                        }`}
                      >
                        <span
                          className={`w-[52px] shrink-0 text-[11px] font-bold uppercase tracking-wider ${
                            last ? "text-brand" : "text-dim"
                          }`}
                        >
                          {r.d}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[14px] font-semibold">{r.t}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- features ---------------- */}
      <section className="relative overflow-hidden border-y border-line bg-mist/40">
        <div className="glow-orb -right-40 top-0 h-[360px] w-[360px] opacity-50" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28">
          <Reveal>
            <h2 className="font-display max-w-2xl text-[clamp(28px,4.6vw,46px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
              <span className="text-outline">{d.landing.featTitle}</span>
              <br />
              {d.landing.featTitle2}
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {d.landing.features.map((f, i) => {
              const Icon = featIcons[i];
              return (
                <Reveal key={i} delay={(i % 3) * 80}>
                  <Card hover className="h-full">
                    <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl border border-line2 bg-haze text-ink">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-display text-[17px] font-bold">{f.t}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-mute">{f.d}</p>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- editorial (inverted, dark) ---------------- */}
      <section className="sec-dark relative overflow-hidden">
        <div className="absolute inset-0 dotgrid-light opacity-70" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <h2 className="font-display text-[clamp(30px,5vw,52px)] font-extrabold leading-[1.02] tracking-[-0.025em]">
                {d.landing.editTitle}
                <br />
                <span className="text-brand">{d.landing.editTitle2}</span>
              </h2>
              <p className="mt-6 max-w-md text-[16.5px] leading-relaxed text-[#b9b2a4]">{d.landing.editBody}</p>
            </Reveal>

            <Reveal delay={120}>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-[#312d25] bg-[#312d25]">
                {d.landing.editStats.map((s, i) => (
                  <div key={i} className="bg-[#1c1a14] p-6 sm:p-7">
                    <div className="font-display text-[clamp(26px,4vw,38px)] font-extrabold leading-none tracking-tight text-paper">
                      {s.v}
                    </div>
                    <div className="mt-2 text-[13px] leading-snug text-[#a49d90]">{s.l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- gamification ---------------- */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <Reveal>
              <SectionLabel>{d.common.elo}</SectionLabel>
              <h2 className="font-display text-[clamp(28px,4.8vw,46px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
                {d.landing.gamTitle}
                <br />
                <span className="text-brand">{d.landing.gamTitle2}</span>
              </h2>
              <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-mute">{d.landing.gamBody}</p>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { icon: IconBolt, v: "1147", l: d.common.elo },
                  { icon: IconFlame, v: "9", l: d.common.streak },
                  { icon: IconClock, v: "47.5" + d.common.hour, l: d.dash.hours },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3">
                    <s.icon size={20} />
                    <div>
                      <div className="font-display text-lg font-bold leading-none tabular-nums">{s.v}</div>
                      <div className="mt-1 text-[11px] uppercase tracking-wider text-dim">{s.l}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={100}>
            <Card pad="p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-dim">
                  {d.landing.gamLadder}
                </span>
                <IconTrophy size={18} />
              </div>
              <div className="flex flex-col gap-1.5">
                {LADDER.map((c, i) => (
                  <div
                    key={c.name}
                    className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 ${
                      i === 0 ? "border-brand/40 bg-brand/8" : "border-line bg-haze/40"
                    }`}
                  >
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[12px] font-extrabold tabular-nums ${
                        i === 0 ? "bg-brand text-paper" : "bg-line text-mute"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="flex-1 truncate text-sm font-semibold">{c.name}</span>
                    <span className="text-sm font-bold tabular-nums text-mute">{c.elo}</span>
                  </div>
                ))}
                <div className="mt-1 flex items-center gap-3 rounded-2xl border border-dashed border-line2 px-3 py-2.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-haze text-[12px] font-extrabold text-dim">
                    5
                  </span>
                  <span className="flex-1 text-sm font-semibold text-dim">{d.lead.you}</span>
                  <span className="text-sm font-bold tabular-nums text-dim">—</span>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* ---------------- roles ---------------- */}
      <section className="border-y border-line bg-mist/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-24">
          <Reveal>
            <SectionLabel>{d.landing.rolesTitle}</SectionLabel>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { r: d.landing.roleTeacher, href: "/teacher", Icon: IconTeacher },
              { r: d.landing.roleParent, href: "/parent", Icon: IconParent },
            ].map(({ r, href, Icon }, i) => (
              <Reveal key={href} delay={i * 100}>
                <Link href={href} className="group block h-full">
                  <Card hover className="flex h-full flex-col">
                    <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-line2 bg-haze">
                      <Icon size={24} />
                    </div>
                    <h3 className="font-display text-xl font-bold">{r.t}</h3>
                    <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-mute">{r.d}</p>
                    <span className="arrow-slide mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand">
                      {r.cta}
                      <span className="arr">
                        <IconArrow size={16} />
                      </span>
                    </span>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- final cta ---------------- */}
      <section className="relative overflow-hidden">
        <div className="glow-orb left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 opacity-70" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 py-24 text-center sm:py-32">
          <Reveal>
            <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-line2 bg-card">
              <IconBook size={26} />
            </div>
            <h2 className="font-display text-[clamp(28px,5.4vw,50px)] font-extrabold leading-[1.04] tracking-[-0.025em]">
              {d.landing.ctaTitle}
            </h2>
            <p className="mx-auto mt-5 max-w-md text-[16px] leading-relaxed text-mute">{d.landing.ctaSub}</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Btn href={user ? "/dashboard" : "/start"} size="lg" className="arrow-slide">
                {user ? d.nav.dashboard : d.landing.ctaPrimary}
                <span className="arr">
                  <IconArrow size={18} />
                </span>
              </Btn>
              <Btn href="/demo" variant="outline" size="lg">
                {d.landing.ctaSecondary}
              </Btn>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
