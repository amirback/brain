"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { streakLength, totalSeconds, useStore } from "@/lib/store";
import { subjectById, topicById, topicsOf } from "@/lib/content";
import type { StudentState, SubjectId } from "@/lib/types";
import { fmtBand } from "@/lib/exam/scoring";
import { Bar, Btn, Card, Modal, Reveal } from "@/components/ui";
import { classInviteLink } from "@/lib/share";
import {
  IconBolt, IconCheck, IconClock, IconFlame, IconGrid, IconHelp,
  IconLink, IconPlus, IconRefresh, IconTeacher, IconUser,
} from "@/components/Icons";

export default function TeacherPage() {
  const { d, pick } = useI18n();
  const { space, ready, role, addTask, addMaterial, addCustomTopic, refreshRoster } = useStore();
  const router = useRouter();

  const [taskOpen, setTaskOpen] = useState(false);
  const [topicOpen, setTopicOpen] = useState(false);
  const [matOpen, setMatOpen] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (role !== "teacher" || !space.teacher) router.replace("/start");
  }, [ready, role, space.teacher, router]);

  // Students who joined from their own phones arrive through the shared store.
  useEffect(() => {
    if (!ready || role !== "teacher") return;
    void refreshRoster();
    // Runs on entry; the button below repeats it on demand.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, role]);

  const teacher = space.teacher;
  // Derived from the live space so newly synced students appear immediately.
  const roster = useMemo(
    () => (teacher ? Object.values(space.students).filter((st) => st.classCode === teacher.code) : []),
    [space, teacher]
  );
  const subject: SubjectId = teacher?.subject ?? "math";
  const topics = topicsOf(subject);

  const allTopics = useMemo(
    () => [
      ...topics.map((t) => ({ id: t.id, name: pick(t.title) })),
      ...(roster[0]?.customTopics ?? []).map((c) => ({ id: c.id, name: c.name })),
    ],
    [topics, roster, pick]
  );

  const stats = useMemo(() => {
    if (roster.length === 0) return { avg: 0, activeToday: 0, weakest: [] as { t: (typeof topics)[number]; avg: number }[] };
    const avg = Math.round(roster.reduce((s, r) => s + r.elo, 0) / roster.length);
    const today = new Date().toISOString().slice(0, 10);
    const activeToday = roster.filter((r) => r.streakDates.includes(today)).length;
    const weakest = topics
      .map((t) => ({ t, avg: roster.reduce((s, r) => s + (r.mastery[t.id] ?? 0), 0) / roster.length }))
      .sort((a, b) => a.avg - b.avg);
    return { avg, activeToday, weakest };
  }, [roster, topics]);

  /**
   * The newest exam attempt per student, so the teacher sees an SAT composite or an
   * IELTS band next to the name rather than having to open each profile.
   */
  const examRows = useMemo(
    () =>
      roster
        .map((st) => {
          const latest = (st.examAttempts ?? [])[0];
          if (!latest) return null;
          const score = latest.sat
            ? `${latest.sat.composite}`
            : latest.ielts?.overall !== undefined
              ? fmtBand(latest.ielts.overall)
              : `${latest.results.filter((r) => r.correct).length}/${latest.results.length}`;
          return { key: st.code, name: st.name, title: latest.title, score, ts: latest.finishedAt };
        })
        .filter((r): r is NonNullable<typeof r> => r !== null)
        .sort((a, b) => b.ts - a.ts)
        .slice(0, 6),
    [roster]
  );

  const requests = space.helpRequests.filter((r) => r.classCode === teacher?.code);

  if (!ready || !teacher) return null;

  const notify = (msg: string) => {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 3400);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(teacher.code);
      setCodeCopied(true);
      window.setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      // clipboard blocked — the code stays visible and selectable
    }
  };

  // Last seen: the most recent day with either a streak mark or tracked time.
  const daysAgo = (st: StudentState): number | null => {
    const days = [...st.streakDates, ...Object.keys(st.secondsByDay)].sort();
    const last = days.pop();
    if (!last) return null;
    return Math.round((Date.now() - new Date(last).getTime()) / 864e5);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display flex items-center gap-3 text-[clamp(26px,5.2vw,38px)] font-extrabold tracking-[-0.02em]">
              <IconTeacher size={30} />
              {d.teacher.title}
            </h1>
            <p className="mt-2 text-[14px] text-mute">
              {teacher.name} · {teacher.className}
              {teacher.school ? ` · ${teacher.school}` : ""} · {pick(subjectById(subject)?.title ?? { ru: "", kk: "", en: "" })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Btn size="sm" onClick={() => setTaskOpen(true)} disabled={roster.length === 0}>
              <IconPlus size={15} />
              {d.teacher.give}
            </Btn>
            <Btn size="sm" variant="outline" onClick={() => setTopicOpen(true)} disabled={roster.length === 0}>
              <IconGrid size={15} />
              {d.teacher.addTopicTitle}
            </Btn>
            <Btn size="sm" variant="outline" onClick={() => setMatOpen(true)} disabled={roster.length === 0}>
              <IconLink size={15} />
              {d.teacher.addMatTitle}
            </Btn>
            <Btn
              size="sm"
              variant="outline"
              disabled={syncing}
              onClick={async () => {
                setSyncing(true);
                const added = await refreshRoster();
                setSyncing(false);
                notify(added > 0 ? `${d.teacher.synced}: +${added}` : d.teacher.syncedNone);
              }}
            >
              <IconRefresh size={15} />
              {syncing ? d.common.loading : d.teacher.sync}
            </Btn>
          </div>
        </div>
      </Reveal>

      {/* class code — the mechanism that links students to this teacher */}
      <Reveal delay={40}>
        <Card className="mt-6 border-brand/35 bg-brand/6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-brand">{d.codes.classCode}</div>
              <div className="font-display mt-1 text-3xl font-extrabold tracking-[0.12em]">{teacher.code}</div>
              <p className="mt-2 text-[13px] leading-relaxed text-mute">{d.codes.classCodeHint}</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-brand">{d.codes.linkHintTeacher}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Btn size="sm" variant={codeCopied ? "outline" : "primary"} onClick={copyCode}>
                {codeCopied ? (
                  <>
                    <IconCheck size={15} />
                    {d.codes.copied}
                  </>
                ) : (
                  d.codes.copy
                )}
              </Btn>
              <Btn
                size="sm"
                variant="outline"
                onClick={async () => {
                  const cls = space.classes[teacher.code];
                  if (!cls) return;
                  try {
                    await navigator.clipboard.writeText(classInviteLink(cls));
                    setLinkCopied(true);
                    window.setTimeout(() => setLinkCopied(false), 2200);
                  } catch {
                    // clipboard blocked — the code above still works
                  }
                }}
              >
                {linkCopied ? (
                  <>
                    <IconCheck size={15} />
                    {d.codes.copied}
                  </>
                ) : (
                  d.codes.copyLink
                )}
              </Btn>
            </div>
          </div>
        </Card>
      </Reveal>

      {flash && (
        <div className="slide-up mt-4 flex items-center gap-3 rounded-2xl border border-brand/40 bg-brand/8 p-4">
          <IconCheck size={20} />
          <span className="text-[14px] font-semibold text-brand">{flash}</span>
        </div>
      )}

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: d.teacher.students, v: roster.length, Icon: IconUser },
          { l: d.teacher.avgElo, v: stats.avg || "—", Icon: IconBolt },
          { l: d.teacher.activeToday, v: stats.activeToday, Icon: IconFlame },
          { l: d.teacher.requests, v: requests.length, Icon: IconHelp },
        ].map((s, i) => (
          <Reveal key={s.l} delay={i * 50}>
            <Card>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-dim">{s.l}</span>
                <s.Icon size={16} />
              </div>
              <div className="font-display mt-1.5 text-3xl font-extrabold tabular-nums">{s.v}</div>
            </Card>
          </Reveal>
        ))}
      </div>

      {roster.length === 0 ? (
        <Reveal delay={80}>
          <Card className="mt-3 py-12 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-3xl border border-line2 bg-haze">
              <IconUser size={26} />
            </div>
            <p className="mx-auto max-w-sm text-[14.5px] leading-relaxed text-mute">{d.teacherSetup.rosterEmpty}</p>
          </Card>
        </Reveal>
      ) : (
        <>
          <div className="mt-3 grid gap-3 lg:grid-cols-[1.5fr_1fr]">
            <Reveal delay={80}>
              <Card pad="p-0" className="overflow-hidden">
                <div className="border-b border-line px-5 py-4">
                  <h2 className="font-display text-lg font-bold">{d.teacher.students}</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left">
                    <thead>
                      <tr className="border-b border-line text-[11px] uppercase tracking-wider text-dim">
                        <th className="px-5 py-3 font-bold">{d.teacher.colName}</th>
                        <th className="px-3 py-3 font-bold">{d.teacher.colElo}</th>
                        <th className="px-3 py-3 font-bold">{d.teacher.colProgress}</th>
                        <th className="px-3 py-3 font-bold">{d.teacher.colHours}</th>
                        <th className="px-5 py-3 font-bold">{d.teacher.colStatus}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...roster].sort((a, b) => b.elo - a.elo).map((r) => {
                        const avgM = topics.reduce((s, t) => s + (r.mastery[t.id] ?? 0), 0) / Math.max(1, topics.length);
                        const stuck = topics.find((t) => (r.attempts[t.id] ?? 0) > 3 && (r.mastery[t.id] ?? 0) < 0.35);
                        const ago = daysAgo(r);
                        return (
                          <tr key={r.code} className="border-b border-line last:border-0">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-haze text-[12px] font-extrabold text-mute">
                                  {r.name.slice(0, 1)}
                                </span>
                                <div className="min-w-0">
                                  <div className="truncate text-[14px] font-bold">{r.name}</div>
                                  <div className="text-[11px] text-dim tabular-nums">
                                    {ago === null ? "—" : ago === 0 ? d.common.today : `${ago} ${d.teacher.daysAgo}`}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3.5 text-[14px] font-bold tabular-nums">{r.elo}</td>
                            <td className="px-3 py-3.5">
                              <div className="w-24">
                                <Bar value={avgM} h={6} tone={avgM < 0.4 ? "dim" : avgM < 0.7 ? "amber" : "brand"} />
                                <div className="mt-1 text-[11px] text-dim tabular-nums">{Math.round(avgM * 100)}%</div>
                              </div>
                            </td>
                            <td className="px-3 py-3.5 text-[13px] tabular-nums text-mute">
                              {(totalSeconds(r.secondsByDay) / 3600).toFixed(1)}
                            </td>
                            <td className="px-5 py-3.5">
                              {stuck ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber/40 bg-amber/10 px-2.5 py-1 text-[11px] font-bold text-amber">
                                  {d.teacher.stuckOn} {pick(stuck.title).split(" ")[0]}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-line2 px-2.5 py-1 text-[11px] font-semibold text-dim">
                                  {d.teacher.ok}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </Reveal>

            <div className="flex flex-col gap-3">
              <Reveal delay={110}>
                <Card>
                  <h2 className="font-display mb-4 text-lg font-bold">{d.exam.teacherExams}</h2>
                  {examRows.length === 0 ? (
                    <p className="text-[13.5px] leading-relaxed text-mute">{d.exam.teacherExamsEmpty}</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {examRows.map((row) => (
                        <div key={row.key} className="flex items-baseline justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-[13.5px] font-semibold">{row.name}</div>
                            <div className="truncate text-[11.5px] text-dim">{row.title}</div>
                          </div>
                          <span className="font-display shrink-0 text-[15px] font-extrabold tabular-nums text-brand">
                            {row.score}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </Reveal>

              <Reveal delay={120}>
                <Card>
                  <h2 className="font-display mb-4 text-lg font-bold">{d.teacher.weakTopics}</h2>
                  <div className="flex flex-col gap-3.5">
                    {stats.weakest.map((w) => (
                      <div key={w.t.id}>
                        <div className="mb-1.5 flex items-baseline justify-between gap-3">
                          <span className="truncate text-[13.5px] font-semibold">{pick(w.t.title)}</span>
                          <span className="text-[12px] font-bold tabular-nums text-mute">{Math.round(w.avg * 100)}%</span>
                        </div>
                        <Bar value={w.avg} tone={w.avg < 0.4 ? "dim" : w.avg < 0.7 ? "amber" : "brand"} h={7} />
                      </div>
                    ))}
                  </div>
                </Card>
              </Reveal>

              <Reveal delay={160}>
                <Card>
                  <h2 className="font-display mb-3.5 flex items-center gap-2 text-lg font-bold">
                    <IconHelp size={18} />
                    {d.teacher.requests}
                  </h2>
                  {requests.length === 0 ? (
                    <p className="text-[13.5px] leading-relaxed text-dim">{d.teacher.requestsEmpty}</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {requests.map((r) => {
                        const t = topicById(r.topic);
                        return (
                          <div key={r.id} className="flex items-center gap-3 rounded-2xl border border-amber/30 bg-amber/6 p-3">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-amber/15 text-[12px] font-extrabold text-amber">
                              {r.student.slice(0, 1)}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-[13.5px] font-bold">{r.student}</div>
                              <div className="text-[11.5px] text-dim">{t ? pick(t.title) : r.topic}</div>
                            </div>
                            <IconClock size={15} />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </Reveal>
            </div>
          </div>

          <Reveal delay={200}>
            <Card className="mt-3">
              <h2 className="font-display text-lg font-bold">{d.teacher.heat}</h2>
              <p className="mb-4 mt-1 text-[12.5px] text-dim">{d.teacher.heatHint}</p>
              <div className="overflow-x-auto">
                <div className="min-w-[420px]">
                  <div
                    className="mb-2 grid gap-1.5"
                    style={{ gridTemplateColumns: `110px repeat(${topics.length}, 1fr)` }}
                  >
                    <span />
                    {topics.map((t) => (
                      <span key={t.id} className="truncate text-center text-[11px] font-semibold text-dim">
                        {pick(t.title).split(" ")[0]}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {[...roster].sort((a, b) => b.elo - a.elo).map((r) => (
                      <div
                        key={r.code}
                        className="grid items-center gap-1.5"
                        style={{ gridTemplateColumns: `110px repeat(${topics.length}, 1fr)` }}
                      >
                        <span className="truncate text-[12.5px] font-semibold text-mute">{r.name}</span>
                        {topics.map((t) => {
                          const m = r.mastery[t.id] ?? 0;
                          return (
                            <span
                              key={t.id}
                              className="h-8 rounded-lg transition-transform hover:scale-[1.04]"
                              style={{
                                background:
                                  m >= 0.7 ? "#ff6b1f" : m >= 0.45 ? "rgba(255,107,31,.55)" : m >= 0.25 ? "rgba(255,107,31,.26)" : "#ebe5d7",
                              }}
                              title={`${r.name} · ${pick(t.title)} · ${Math.round(m * 100)}%`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>
        </>
      )}

      <TaskModal
        open={taskOpen}
        onClose={() => setTaskOpen(false)}
        topics={allTopics}
        onSave={(t) => {
          addTask({ ...t, subject, from: teacher.name });
          setTaskOpen(false);
          notify(d.teacher.giveDone);
        }}
      />
      <TopicModal
        open={topicOpen}
        onClose={() => setTopicOpen(false)}
        onSave={(c) => {
          addCustomTopic({ ...c, subject });
          setTopicOpen(false);
          notify(d.teacher.addTopicDone);
        }}
      />
      <MaterialModal
        open={matOpen}
        onClose={() => setMatOpen(false)}
        topics={allTopics}
        onSave={(m) => {
          addMaterial(m);
          setMatOpen(false);
          notify(d.teacher.addMatDone);
        }}
      />
    </div>
  );
}

/* ---------------- modals ---------------- */

function TaskModal({
  open, onClose, topics, onSave,
}: {
  open: boolean;
  onClose: () => void;
  topics: { id: string; name: string }[];
  onSave: (t: { title: string; topic: string; due: string; note?: string }) => void;
}) {
  const { d } = useI18n();
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState(topics[0]?.id ?? "linear");
  const [due, setDue] = useState(() => new Date(Date.now() + 5 * 864e5).toISOString().slice(0, 10));
  const [note, setNote] = useState("");

  return (
    <Modal open={open} onClose={onClose} title={d.teacher.giveTitle}>
      <div className="flex flex-col gap-4">
        <label className="block">
          <span className="mb-2 block text-[13px] font-semibold text-mute">{d.teacher.giveName}</span>
          <input className="field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={d.teacher.giveNamePh} />
        </label>
        <label className="block">
          <span className="mb-2 block text-[13px] font-semibold text-mute">{d.teacher.giveTopic}</span>
          <select className="field" value={topic} onChange={(e) => setTopic(e.target.value)}>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-[13px] font-semibold text-mute">{d.teacher.giveDue}</span>
          <input type="date" className="field" value={due} onChange={(e) => setDue(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-2 block text-[13px] font-semibold text-mute">{d.teacher.giveNote}</span>
          <input className="field" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        <Btn full size="lg" disabled={!title.trim()} onClick={() => onSave({ title: title.trim(), topic, due, note })}>
          {d.common.save}
        </Btn>
      </div>
    </Modal>
  );
}

function TopicModal({
  open, onClose, onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (c: { name: string; desc: string }) => void;
}) {
  const { d } = useI18n();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <Modal open={open} onClose={onClose} title={d.teacher.addTopicTitle}>
      <div className="flex flex-col gap-4">
        <label className="block">
          <span className="mb-2 block text-[13px] font-semibold text-mute">{d.teacher.addTopicName}</span>
          <input className="field" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-2 block text-[13px] font-semibold text-mute">{d.teacher.addTopicDesc}</span>
          <input className="field" value={desc} onChange={(e) => setDesc(e.target.value)} />
        </label>
        <Btn full size="lg" disabled={!name.trim()} onClick={() => onSave({ name: name.trim(), desc: desc.trim() })}>
          {d.common.add}
        </Btn>
      </div>
    </Modal>
  );
}

function MaterialModal({
  open, onClose, topics, onSave,
}: {
  open: boolean;
  onClose: () => void;
  topics: { id: string; name: string }[];
  onSave: (m: { title: string; url: string; topic: string }) => void;
}) {
  const { d } = useI18n();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [topic, setTopic] = useState(topics[0]?.id ?? "linear");

  return (
    <Modal open={open} onClose={onClose} title={d.teacher.addMatTitle}>
      <div className="flex flex-col gap-4">
        <label className="block">
          <span className="mb-2 block text-[13px] font-semibold text-mute">{d.teacher.addMatName}</span>
          <input className="field" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-2 block text-[13px] font-semibold text-mute">{d.teacher.addMatUrl}</span>
          <input className="field" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" inputMode="url" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[13px] font-semibold text-mute">{d.teacher.giveTopic}</span>
          <select className="field" value={topic} onChange={(e) => setTopic(e.target.value)}>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <Btn full size="lg" disabled={!title.trim() || !url.trim()} onClick={() => onSave({ title: title.trim(), url: url.trim(), topic })}>
          {d.common.add}
        </Btn>
      </div>
    </Modal>
  );
}
