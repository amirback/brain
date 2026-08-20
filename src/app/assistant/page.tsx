"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { topicById } from "@/lib/content";
import { CHAT_TURNS, advise, answerQuestion, videoFor, type Advice } from "@/lib/advisor";
import { askMentor, MentorUnavailable } from "@/lib/mentor-client";
import { buildProfile, topicHint, type MentorTurn } from "@/lib/mentor-prompt";
import { Btn, Card, Reveal } from "@/components/ui";
import { IconArrow, IconBolt, IconCheck, IconHelp, IconSpark, IconTrend, IconLink } from "@/components/Icons";

interface Bubble {
  id: number;
  from: "me" | "ai";
  text: string;
  topic?: string;
  bullets?: string[];
}

export default function AssistantPage() {
  const { d, pick, lang } = useI18n();
  const { user, ready, role } = useStore();
  const router = useRouter();

  const [chat, setChat] = useState<Bubble[]>([]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const feedRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  useEffect(() => {
    if (!ready) return;
    if (!user || role !== "student") router.replace("/start");
  }, [ready, user, role, router]);

  const advice: Advice[] = useMemo(() => (user ? advise(user) : []), [user]);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
  }, [chat, typing]);

  if (!ready || !user) return null;

  /** The rule-based mentor, used when no model backend is reachable. */
  const answerOffline = (q: string, bubbleId: number) => {
    const reply = answerQuestion(q, user, lang);
    setChat((c) =>
      c.map((b) =>
        b.id === bubbleId
          ? { ...b, text: reply.text, topic: reply.topic, bullets: reply.bullets }
          : b
      )
    );
  };

  /**
   * Anything the student types goes to the model when one is configured, and
   * to the rule-based mentor when it is not. The fallback is silent on
   * purpose: a student asking why they are stuck does not need to hear about
   * our deployment topology.
   */
  const send = async (text: string) => {
    const q = text.trim();
    if (!q || typing) return;

    // A counter rather than a timestamp: ids only need to be unique within the
    // conversation, and two bubbles created in the same tick must not collide.
    const askId = (nextId.current += 1);
    const replyId = (nextId.current += 1);
    const history: MentorTurn[] = chat.map((b) => ({
      role: b.from === "me" ? "user" : "assistant",
      content: b.text,
    }));

    setChat((c) => [
      ...c,
      { id: askId, from: "me", text: q },
      { id: replyId, from: "ai", text: "" },
    ]);
    setDraft("");
    setTyping(true);

    try {
      await askMentor({
        message: q,
        history,
        profile: buildProfile(user, lang),
        onChunk: (chunk) => {
          // First chunk replaces the typing indicator with real text.
          setTyping(false);
          setChat((c) => c.map((b) => (b.id === replyId ? { ...b, text: b.text + chunk } : b)));
        },
      });
      // Deep-link the student's weakest topic under the answer, as before.
      const hint = topicHint(user, lang);
      if (hint) setChat((c) => c.map((b) => (b.id === replyId ? { ...b, topic: hint } : b)));
    } catch (error) {
      if (error instanceof MentorUnavailable) answerOffline(q, replyId);
      else {
        console.error(error);
        answerOffline(q, replyId);
      }
    } finally {
      setTyping(false);
    }
  };

  const ask = (i: number) => void send(pick(CHAT_TURNS[i].q));

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
            <h2 className="font-display mb-3 mt-8 text-lg font-bold">{d.assistant.title}</h2>
            {chat.length > 0 && (
              <div ref={feedRef} className="mb-4 flex max-h-[460px] flex-col gap-2.5 overflow-y-auto pr-1">
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
                        {b.bullets && b.bullets.length > 0 && (
                          <ul className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
                            {b.bullets.map((x, i) => (
                              <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-mute">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                                <span>{x}</span>
                              </li>
                            ))}
                          </ul>
                        )}
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

            {/* composer: the student can type anything */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(draft);
              }}
              className="flex items-center gap-2"
            >
              <input
                className="field flex-1"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={d.assistant.placeholder}
                maxLength={1000}
                aria-label={d.assistant.placeholder}
              />
              <Btn type="submit" size="lg" disabled={!draft.trim() || typing} className="shrink-0 !px-4">
                <IconArrow size={18} />
              </Btn>
            </form>

            <div className="mt-3 flex flex-wrap gap-2">
              {CHAT_TURNS.map((turn, i) => (
                <button
                  key={i}
                  onClick={() => ask(i)}
                  disabled={typing}
                  className="press rounded-xl border border-line bg-coal px-3 py-2 text-left text-[12.5px] font-semibold text-mute hover:border-brand hover:text-brand disabled:opacity-50"
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
