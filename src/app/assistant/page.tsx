"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { topicById } from "@/lib/content";
import { CHAT_TURNS, advise, videoFor, type Advice } from "@/lib/advisor";
import type { L } from "@/lib/types";
import { Btn, Card, Reveal } from "@/components/ui";
import { IconArrow, IconBolt, IconCheck, IconHelp, IconSpark, IconTrend, IconLink } from "@/components/Icons";

interface Bubble {
  id: number;
  from: "me" | "ai";
  text: string;
  topic?: string;
}

export default function AssistantPage() {
  const { d, pick, lang } = useI18n();
  const { user, ready, role } = useStore();
  const router = useRouter();

  const [chat, setChat] = useState<Bubble[]>([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user || role !== "student") router.replace("/start");
  }, [ready, user, role, router]);

  const advice: Advice[] = useMemo(() => (user ? advise(user) : []), [user]);

  if (!ready || !user) return null;

  const ask = (i: number) => {
    const turn = CHAT_TURNS[i];
    const q = pick(turn.q);
    setChat((c) => [...c, { id: Date.now(), from: "me", text: q }]);
    setTyping(true);
    // A short pause so the answer reads as a reply rather than a page reload.
    window.setTimeout(() => {
      const answer = turn.a(user);
      setChat((c) => [
        ...c,
        { id: Date.now() + 1, from: "ai", text: (answer as L)[lang], topic: turn.topicOf?.(user) },
      ]);
      setTyping(false);
    }, 520);
  };

  const toneStyle = {
    praise: "border-brand/40 bg-brand/8",
    warn: "border-amber/40 bg-amber/8",
    plan: "border-line2 bg-coal",
    info: "border-line bg-coal",
  } as const;

  const toneIcon = { praise: IconCheck, warn: IconHelp, plan: IconTrend, info: IconBolt } as const;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
      <Reveal>
        <h1 className="font-display flex items-center gap-3 text-[clamp(26px,5.4vw,38px)] font-extrabold tracking-[-0.02em]">
          <IconSpark size={30} />
          {d.assistant.title}
        </h1>
        <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-mute">{d.assistant.sub}</p>
      </Reveal>

      {!user.diagnosticDone ? (
        <Reveal delay={60}>
          <Card className="mt-7 py-10 text-center">
            <p className="mx-auto max-w-xs text-[14.5px] leading-relaxed text-mute">{d.assistant.empty}</p>
            <Btn href="/diagnostic" className="mt-5">
              {d.dash.goDiag}
            </Btn>
          </Card>
        </Reveal>
      ) : (
        <>
          {/* what the mentor sees in the numbers */}
          <Reveal delay={60}>
            <h2 className="font-display mb-3 mt-8 text-lg font-bold">{d.assistant.adviceTitle}</h2>
            <div className="flex flex-col gap-2.5">
              {advice.map((a, i) => {
                const Icon = toneIcon[a.tone];
                const topic = a.topic ? topicById(a.topic) : null;
                const video = a.topic ? videoFor(a.topic, lang) : null;
                return (
                  <Card key={i} className={toneStyle[a.tone]}>
                    <div className="flex items-start gap-3.5">
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                          a.tone === "warn" ? "bg-amber/15 text-amber" : "bg-brand/12 text-brand"
                        }`}
                      >
                        <Icon size={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14.5px] leading-relaxed">{pick(a.text)}</p>
                        {(topic || video) && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {topic && (
                              <Link
                                href={`/learn?t=${topic.id}`}
                                className="press inline-flex items-center gap-1.5 rounded-xl border border-line2 px-3 py-1.5 text-[12px] font-bold text-mute hover:border-brand hover:text-brand"
                              >
                                {d.assistant.toTopic}
                                <IconArrow size={13} />
                              </Link>
                            )}
                            {video && (
                              <a
                                href={video}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="press inline-flex items-center gap-1.5 rounded-xl border border-line2 px-3 py-1.5 text-[12px] font-bold text-mute hover:border-brand hover:text-brand"
                                title={d.lesson.videoHint}
                              >
                                <IconLink size={13} />
                                {d.assistant.watch}
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Reveal>

          {/* chat */}
          <Reveal delay={120}>
            <h2 className="font-display mb-3 mt-8 text-lg font-bold">{d.assistant.ask}</h2>
            {chat.length > 0 && (
              <div className="mb-4 flex flex-col gap-2.5">
                {chat.map((b) => {
                  const topic = b.topic ? topicById(b.topic) : null;
                  const video = b.topic ? videoFor(b.topic, lang) : null;
                  return b.from === "me" ? (
                    <div key={b.id} className="slide-up flex justify-end">
                      <span className="max-w-[85%] rounded-2xl rounded-br-md bg-brand px-4 py-2.5 text-[14px] font-semibold text-ink">
                        {b.text}
                      </span>
                    </div>
                  ) : (
                    <div key={b.id} className="slide-up flex gap-2.5">
                      <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand/12 text-brand">
                        <IconSpark size={16} />
                      </span>
                      <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-line bg-card px-4 py-3">
                        <p className="text-[14px] leading-relaxed">{b.text}</p>
                        {(topic || video) && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {topic && (
                              <Link
                                href={`/learn?t=${topic.id}`}
                                className="press inline-flex items-center gap-1.5 rounded-xl border border-line2 px-3 py-1.5 text-[12px] font-bold text-mute hover:border-brand hover:text-brand"
                              >
                                {pick(topic.title)}
                                <IconArrow size={13} />
                              </Link>
                            )}
                            {video && (
                              <a
                                href={video}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="press inline-flex items-center gap-1.5 rounded-xl border border-line2 px-3 py-1.5 text-[12px] font-bold text-mute hover:border-brand hover:text-brand"
                              >
                                <IconLink size={13} />
                                {d.assistant.watch}
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {typing && (
                  <div className="flex items-center gap-2.5 text-[13px] text-dim">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand/12 text-brand">
                      <IconSpark size={16} />
                    </span>
                    <span className="pulse-dot">{d.assistant.thinking}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2">
              {CHAT_TURNS.map((turn, i) => (
                <button
                  key={i}
                  onClick={() => ask(i)}
                  disabled={typing}
                  className="press rounded-2xl border border-line bg-coal px-4 py-3 text-left text-[14px] font-semibold hover:border-brand hover:bg-brand/6 disabled:opacity-50"
                >
                  {pick(turn.q)}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 text-center text-[12px] leading-relaxed text-dim">{d.assistant.basis}</p>
          </Reveal>
        </>
      )}
    </div>
  );
}
