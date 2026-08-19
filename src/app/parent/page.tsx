"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { fmtHours, lastNDays, streakLength, totalSeconds, useStore, weekSeconds } from "@/lib/store";
import { subjectById, topicById, topicsOf } from "@/lib/content";
import { clearHash, readHashPayload } from "@/lib/share";
import { formatForecast, readiness, recommend } from "@/lib/engine";
import { Bar, Btn, Card, MiniBars, Modal, Reveal } from "@/components/ui";
import { IconCheck, IconParent, IconRefresh, IconUser } from "@/components/Icons";

export default function ParentPage() {
  const { d, pick, lang } = useI18n();
  const { space, ready, role, viewedStudent, linkChild, adoptChild } = useStore();
  const router = useRouter();

  const [copied, setCopied] = useState(false);
  const [nonce, setNonce] = useState(0);
  const [linkOpen, setLinkOpen] = useState(false);

  // A share link from the child carries their real progress with it.
  useEffect(() => {
    if (!ready) return;
    const payload = readHashPayload();
    if (payload?.kind === "child") {
      clearHash();
      adoptChild(payload.student);
      return;
    }
    if (role !== "parent") router.replace("/start");
  }, [ready, role, router, adoptChild]);

  const child = role === "parent" ? viewedStudent : null;

  const lines = useMemo(() => {
    if (!child || !child.diagnosticDone) return null;
    const tpl = d.parent.tpl;
    const out: string[] = [];
    const subject = child.activeSubject;
    const topics = topicsOf(subject);

    const streak = streakLength(child.streakDates);
    out.push(streak >= 3 ? tpl.streakGood.replace("{n}", String(streak)) : tpl.streakNone);

    const week = weekSeconds(child.secondsByDay);
    if (week > 0) out.push(tpl.hours.replace("{h}", fmtHours(week, d.common.hour, d.common.min)));

    const strong = topics.filter((t) => (child.mastery[t.id] ?? 0) >= 0.65).map((t) => pick(t.title));
    if (strong.length > 0) out.push(tpl.improved.replace("{topics}", strong.join(", ")));

    const weakest = topics
      .filter((t) => (child.attempts[t.id] ?? 0) > 0)
      .sort((a, b) => (child.mastery[a.id] ?? 0) - (child.mastery[b.id] ?? 0))[0];
    if (weakest && (child.mastery[weakest.id] ?? 0) < 0.6) {
      out.push(tpl.weak.replace("{topic}", pick(weakest.title)));
    }

    const view = formatForecast(readiness(child, subject), child.goal);
    const weekAgo = child.forecastHistory.find((p) => p.ts > Date.now() - 7 * 864e5);
    const delta = weekAgo ? view.numeric - formatForecast(weekAgo.raw, child.goal).numeric : 0;
    out.push(
      tpl.forecast
        .replace("{n}", `${view.value} ${d.common.of} ${view.max}`)
        .replace("{d}", delta >= 0 ? `+${delta}` : String(delta))
    );

    const plan = recommend(child, subject)
      .map((r) => topicById(r.topic))
      .filter((t): t is NonNullable<typeof t> => Boolean(t))
      .map((t) => pick(t.title));
    if (plan.length > 0) out.push(tpl.plan.replace("{topics}", plan.join(", ")));

    return out;
    // nonce lets the refresh button re-run the generator visibly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [child, d, pick, nonce]);

  const fullText = useMemo(() => {
    if (!lines || !child) return "";
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    return [`${d.parent.tpl.greeting} ${child.name}`, ...lines.map((l) => `• ${cap(l)}`)].join("\n");
  }, [lines, child, d]);

  // Locale-formatted dates differ between the prerender and the browser,
  // so this is filled in after mount rather than during hydration.
  const [weekLabel, setWeekLabel] = useState("");
  useEffect(() => {
    setWeekLabel(
      new Date().toLocaleDateString(lang === "kk" ? "kk-KZ" : lang === "en" ? "en-US" : "ru-RU", {
        day: "numeric",
        month: "long",
      })
    );
  }, [lang]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // clipboard blocked — the text stays selectable on screen
    }
  };

  if (!ready || role !== "parent") return null;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
      <Reveal>
        <h1 className="font-display flex items-center gap-3 text-[clamp(26px,5.4vw,38px)] font-extrabold tracking-[-0.02em]">
          <IconParent size={30} />
          {d.parent.title}
        </h1>
        <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-mute">{d.parent.sub}</p>
      </Reveal>

      {!child ? (
        <Reveal delay={60}>
          <Card className="mt-7 py-10 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-3xl border border-line2 bg-soot">
              <IconUser size={26} />
            </div>
            <h2 className="font-display text-lg font-bold">{d.codes.noChild}</h2>
            <p className="mx-auto mt-2 max-w-xs text-[14px] leading-relaxed text-mute">{d.codes.noChildHint}</p>
            <Btn className="mt-5" onClick={() => setLinkOpen(true)}>
              {d.codes.linkCta}
            </Btn>
          </Card>
        </Reveal>
      ) : (
        <>
          <Reveal delay={50}>
            <Card className="mt-6">
              <div className="flex items-center gap-3.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand text-[16px] font-extrabold text-ink">
                  {child.name.slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-bold">{child.name}</div>
                  <div className="mt-0.5 text-[12.5px] text-dim">
                    {child.grade} {d.start.gradeSuffix} · {pick(subjectById(child.activeSubject)?.title ?? { ru: "", kk: "", en: "" })}
                  </div>
                </div>
                <Btn variant="outline" size="sm" onClick={() => setLinkOpen(true)}>
                  {d.codes.changeChild}
                </Btn>
              </div>
            </Card>
          </Reveal>

          {/* the child's actual numbers, not a description of them */}
          <Reveal delay={70}>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[
                { l: d.common.elo, v: String(child.elo) },
                { l: d.dash.streakTitle, v: String(streakLength(child.streakDates)) },
                { l: d.dash.hours, v: (totalSeconds(child.secondsByDay) / 3600).toFixed(1) + d.common.hour },
              ].map((x) => (
                <Card key={x.l} pad="p-4">
                  <div className="font-display text-xl font-extrabold tabular-nums">{x.v}</div>
                  <div className="mt-0.5 text-[10.5px] uppercase tracking-wider text-dim">{x.l}</div>
                </Card>
              ))}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <Card className="mt-3">
              <h2 className="font-display mb-4 text-lg font-bold">{d.dash.mapTitle}</h2>
              <div className="flex flex-col gap-3">
                {topicsOf(child.activeSubject).map((tp) => {
                  const m = child.mastery[tp.id] ?? 0;
                  const a = child.attempts[tp.id] ?? 0;
                  return (
                    <div key={tp.id}>
                      <div className="mb-1.5 flex items-baseline justify-between gap-3">
                        <span className="truncate text-[14px] font-semibold">{pick(tp.title)}</span>
                        <span className="shrink-0 text-[11.5px] font-bold tabular-nums text-dim">
                          {a === 0 ? "—" : `${Math.round(m * 100)}%`}
                        </span>
                      </div>
                      <Bar value={m} tone={m < 0.35 ? "dim" : m < 0.7 ? "amber" : "brand"} h={7} />
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 border-t border-line pt-4">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-dim">{d.dash.activity}</div>
                <MiniBars
                  values={lastNDays(child.secondsByDay, 14).map((x) => Math.round(x.seconds / 60))}
                  labels={lastNDays(child.secondsByDay, 14).map((x) => x.date.slice(8))}
                />
              </div>
              {child.mocks.some((m) => m.status === "done") && (
                <div className="mt-5 border-t border-line pt-4">
                  <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-dim">{d.mock.history}</div>
                  <div className="flex flex-wrap gap-2">
                    {child.mocks
                      .filter((m) => m.status === "done")
                      .slice(-4)
                      .map((m) => (
                        <span key={m.id} className="rounded-xl border border-line2 px-3 py-1.5 text-[12.5px] font-bold tabular-nums">
                          {m.score} / {m.size}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </Card>
          </Reveal>

          <Reveal delay={90}>
            <Card className="mt-3">
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
                    {d.parent.tpl.greeting} {child.name}
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
        </>
      )}

      <LinkChildModal
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        onLink={linkChild}
        knownCodes={Object.keys(space.students)}
      />
    </div>
  );
}

function LinkChildModal({
  open, onClose, onLink, knownCodes,
}: {
  open: boolean;
  onClose: () => void;
  onLink: (code: string) => boolean;
  knownCodes: string[];
}) {
  const { d } = useI18n();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [ok, setOk] = useState(false);

  const submit = () => {
    if (onLink(code)) {
      setOk(true);
      setError(false);
      window.setTimeout(() => {
        onClose();
        setOk(false);
        setCode("");
      }, 1000);
    } else {
      setError(true);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={d.codes.linkTitle}>
      {ok ? (
        <div className="slide-up flex items-center gap-3 rounded-2xl border border-brand/40 bg-brand/8 p-4">
          <IconCheck size={22} />
          <span className="text-[14.5px] font-bold text-brand">{d.codes.linkOk}</span>
        </div>
      ) : (
        <>
          <p className="mb-4 text-[13.5px] leading-relaxed text-mute">{d.codes.linkHint}</p>
          <input
            className="field text-center font-display text-lg font-bold uppercase tracking-[0.18em]"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(false);
            }}
            placeholder={d.codes.linkPh}
            maxLength={10}
          />
          {error && <p className="mt-2 text-[12.5px] font-semibold text-red-400">{d.codes.linkFail}</p>}
          {knownCodes.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {knownCodes.slice(0, 4).map((c) => (
                <button
                  key={c}
                  onClick={() => setCode(c)}
                  className="press rounded-lg border border-line2 px-2.5 py-1 text-[11px] font-bold text-dim hover:border-brand hover:text-brand"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
          <Btn full size="lg" className="mt-4" disabled={code.trim().length < 4} onClick={submit}>
            {d.common.continue}
          </Btn>
        </>
      )}
    </Modal>
  );
}
