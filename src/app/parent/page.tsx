"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { fmtHours, streakLength, useStore, weekSeconds } from "@/lib/store";
import { TOPICS, topicById } from "@/lib/content";
import { forecast, recommend } from "@/lib/engine";
import { Btn, Card, Reveal } from "@/components/ui";
import { IconCheck, IconParent, IconRefresh } from "@/components/Icons";

export default function ParentPage() {
  const { d, pick, lang } = useI18n();
  const { user } = useStore();
  const [copied, setCopied] = useState(false);
  const [nonce, setNonce] = useState(0);

  const lines = useMemo(() => {
    if (!user || !user.diagnosticDone) return null;
    const tpl = d.parent.tpl;
    const out: string[] = [];

    const streak = streakLength(user.streakDates);
    if (streak >= 3) out.push(tpl.streakGood.replace("{n}", String(streak)));
    else out.push(tpl.streakNone);

    const week = weekSeconds(user.secondsByDay);
    if (week > 0) out.push(tpl.hours.replace("{h}", fmtHours(week, d.common.hour, d.common.min)));

    const strong = TOPICS.filter((t) => (user.mastery[t.id] ?? 0) >= 0.65).map((t) => pick(t.title));
    if (strong.length > 0) out.push(tpl.improved.replace("{topics}", strong.join(", ")));

    const weakest = TOPICS.filter((t) => (user.attempts[t.id] ?? 0) > 0)
      .sort((a, b) => (user.mastery[a.id] ?? 0) - (user.mastery[b.id] ?? 0))[0];
    if (weakest && (user.mastery[weakest.id] ?? 0) < 0.6) {
      out.push(tpl.weak.replace("{topic}", pick(weakest.title)));
    }

    const score = forecast(user);
    const weekAgo = user.forecastHistory.find((p) => p.ts > Date.now() - 7 * 864e5);
    const delta = weekAgo ? score - weekAgo.score : 0;
    out.push(
      tpl.forecast.replace("{n}", String(score)).replace("{d}", delta >= 0 ? `+${delta}` : String(delta))
    );

    const plan = recommend(user)
      .map((r) => topicById(r.topic))
      .filter(Boolean)
      .map((t) => pick(t!.title));
    if (plan.length > 0) out.push(tpl.plan.replace("{topics}", plan.join(", ")));

    return out;
    // nonce lets the "refresh" button re-run the generator visibly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, d, pick, nonce]);

  const fullText = useMemo(() => {
    if (!lines || !user) return "";
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    return [`${d.parent.tpl.greeting} ${user.name}`, ...lines.map((l) => `• ${cap(l)}`)].join("\n");
  }, [lines, user, d]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // clipboard blocked — the text stays selectable on screen
    }
  };

  // Locale-formatted dates differ between the prerender and the browser,
  // so this is filled in after mount rather than during hydration.
  const [weekLabel, setWeekLabel] = useState("");
  useEffect(() => {
    setWeekLabel(new Date().toLocaleDateString(lang === "kk" ? "kk-KZ" : lang === "en" ? "en-US" : "ru-RU", {
      day: "numeric",
      month: "long",
    }));
  }, [lang]);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
      <Reveal>
        <h1 className="font-display flex items-center gap-3 text-[clamp(26px,5.4vw,38px)] font-extrabold tracking-[-0.02em]">
          <IconParent size={30} />
          {d.parent.title}
        </h1>
        <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-mute">{d.parent.sub}</p>
      </Reveal>

      <Reveal delay={80}>
        <Card className="mt-7">
          <div className="mb-4 flex items-center justify-between gap-4 border-b border-line pb-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{d.parent.weekOf}</div>
              <div className="font-display mt-1 text-[15px] font-bold">{weekLabel}</div>
            </div>
            <button
              onClick={() => setNonce((n) => n + 1)}
              className="press inline-flex items-center gap-1.5 rounded-xl border border-line2 px-3 py-2 text-[12px] font-bold text-mute hover:border-brand hover:text-brand"
            >
              <IconRefresh size={14} />
              {d.parent.generate}
            </button>
          </div>

          {!lines ? (
            <p className="py-6 text-center text-[14px] text-dim">{d.parent.tpl.noData}</p>
          ) : (
            <div key={nonce}>
              <p className="text-[15.5px] font-semibold">
                {d.parent.tpl.greeting} {user?.name}
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {lines.map((l, i) => (
                  <li
                    key={i}
                    className="slide-up flex gap-3 text-[14.5px] leading-relaxed text-mute"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    <span className="first-letter:uppercase">{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </Reveal>

      {lines && (
        <Reveal delay={140}>
          <Btn onClick={copy} variant={copied ? "outline" : "primary"} size="lg" full className="mt-4">
            {copied ? (
              <>
                <IconCheck size={17} />
                {d.parent.copied}
              </>
            ) : (
              d.parent.copy
            )}
          </Btn>
        </Reveal>
      )}
    </div>
  );
}
