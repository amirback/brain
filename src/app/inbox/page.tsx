"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { buildMessages } from "@/lib/advisor";
import { Btn, Card, Reveal } from "@/components/ui";
import { IconArrow, IconBolt, IconCheck, IconClock, IconFlame, IconSpark } from "@/components/Icons";

const KIND_ICON = {
  motivation: IconFlame,
  deadline: IconClock,
  result: IconCheck,
  advice: IconBolt,
} as const;

export default function InboxPage() {
  const { d, lang } = useI18n();
  const { user, ready, role, syncInbox, markInboxRead } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!user || role !== "student") router.replace("/start");
  }, [ready, user, role, router]);

  // New messages are generated from state on arrival, then stored once.
  useEffect(() => {
    if (!user) return;
    syncInbox(buildMessages(user, lang));
    // Runs on entry only: syncInbox writes to `user`, so watching it would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  if (!ready || !user) return null;

  const unread = user.inbox.filter((m) => !m.read).length;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display flex items-center gap-3 text-[clamp(26px,5.4vw,38px)] font-extrabold tracking-[-0.02em]">
              <IconSpark size={30} />
              {d.inbox.title}
            </h1>
            <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-mute">{d.inbox.sub}</p>
          </div>
          {unread > 0 && (
            <Btn size="sm" variant="outline" onClick={() => markInboxRead()}>
              {d.inbox.markRead}
            </Btn>
          )}
        </div>
      </Reveal>

      {user.inbox.length === 0 ? (
        <Reveal delay={60}>
          <Card className="mt-7 py-10 text-center">
            <p className="mx-auto max-w-xs text-[14.5px] leading-relaxed text-mute">{d.inbox.empty}</p>
          </Card>
        </Reveal>
      ) : (
        <div className="mt-7 flex flex-col gap-2.5">
          {user.inbox.map((m, i) => {
            const Icon = KIND_ICON[m.kind];
            return (
              <Reveal key={m.id} delay={Math.min(240, i * 60)}>
                <Card className={m.read ? "opacity-70" : "border-brand/35"}>
                  <div className="flex items-start gap-3.5">
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                        m.read ? "bg-haze text-mute" : "bg-brand/12 text-brand"
                      }`}
                    >
                      <Icon size={19} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-[15px] font-bold">{m.title}</h3>
                        {!m.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />}
                      </div>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-mute">{m.body}</p>
                      {m.action && (
                        <Link
                          href={m.action.href}
                          onClick={() => markInboxRead(m.id)}
                          className="arrow-slide mt-3 inline-flex items-center gap-2 text-[13px] font-bold text-brand"
                        >
                          {m.action.label}
                          <span className="arr">
                            <IconArrow size={14} />
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
