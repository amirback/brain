"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { streakLength, totalSeconds, useStore } from "@/lib/store";
import { TOPICS, topicById } from "@/lib/content";
import { CLASSMATES } from "@/lib/mock";
import { Btn, Card, Modal, Reveal, Bar } from "@/components/ui";
import {
  IconBolt, IconCheck, IconClock, IconFlame, IconGrid, IconHelp,
  IconLink, IconPlus, IconTeacher, IconUser,
} from "@/components/Icons";

export default function TeacherPage() {
  const { d, pick } = useI18n();
  const { user, addTask, addMaterial, addCustomTopic, helpRequests } = useStore();

  const [taskOpen, setTaskOpen] = useState(false);
  const [topicOpen, setTopicOpen] = useState(false);
  const [matOpen, setMatOpen] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const allTopics = useMemo(
    () => [
      ...TOPICS.map((t) => ({ id: t.id, name: pick(t.title) })),
      ...(user?.customTopics ?? []).map((c) => ({ id: c.id, name: c.name })),
    ],
    [user, pick]
  );

  // the signed-in student joins the class list, so the panel shows live data
  const roster = useMemo(() => {
    const list = CLASSMATES.map((c) => ({
      id: c.id,
      name: c.name,
      elo: c.elo,
      hours: c.hours,
      streak: c.streak,
      lastActiveDays: c.lastActiveDays,
      mastery: c.mastery,
      stuck: c.stuck,
      me: false,
    }));
    if (user?.diagnosticDone) {
      list.push({
        id: "me",
        name: user.name,
        elo: user.elo,
        hours: totalSeconds(user.secondsByDay) / 3600,
        streak: streakLength(user.streakDates),
        lastActiveDays: 0,
        mastery: user.mastery,
        stuck: undefined,
        me: true,
      });
    }
    return list.sort((a, b) => b.elo - a.elo);
  }, [user]);

  const stats = useMemo(() => {
    const avg = Math.round(roster.reduce((s, r) => s + r.elo, 0) / roster.length);
    const activeToday = roster.filter((r) => r.lastActiveDays === 0).length;
    const weakest = TOPICS.map((t) => ({
      t,
      avg: roster.reduce((s, r) => s + (r.mastery[t.id] ?? 0), 0) / roster.length,
    })).sort((a, b) => a.avg - b.avg);
    return { avg, activeToday, weakest };
  }, [roster]);

  const notify = (msg: string) => {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 3400);
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
            <p className="mt-2 text-[14px] text-mute">{d.teacher.sub}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Btn size="sm" onClick={() => setTaskOpen(true)}>
              <IconPlus size={15} />
              {d.teacher.give}
            </Btn>
            <Btn size="sm" variant="outline" onClick={() => setTopicOpen(true)}>
              <IconGrid size={15} />
              {d.teacher.addTopicTitle}
            </Btn>
            <Btn size="sm" variant="outline" onClick={() => setMatOpen(true)}>
              <IconLink size={15} />
              {d.teacher.addMatTitle}
            </Btn>
          </div>
        </div>
      </Reveal>

      {flash && (
        <div className="slide-up mt-5 flex items-center gap-3 rounded-2xl border border-brand/40 bg-brand/8 p-4">
          <IconCheck size={20} />
          <span className="text-[14px] font-semibold text-brand">{flash}</span>
        </div>
      )}

      {/* stats */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: d.teacher.students, v: roster.length, Icon: IconUser },
          { l: d.teacher.avgElo, v: stats.avg, Icon: IconBolt },
          { l: d.teacher.activeToday, v: stats.activeToday, Icon: IconFlame },
          { l: d.teacher.requests, v: helpRequests.length, Icon: IconHelp },
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

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.5fr_1fr]">
        {/* roster */}
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
                  {roster.map((r) => {
                    const avgM =
                      TOPICS.reduce((s, t) => s + (r.mastery[t.id] ?? 0), 0) / TOPICS.length;
                    const stuckTopic = r.stuck ? topicById(r.stuck) : null;
                    return (
                      <tr key={r.id} className={`border-b border-line last:border-0 ${r.me ? "bg-brand/6" : ""}`}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-[12px] font-extrabold ${
                                r.me ? "bg-brand text-ink" : "bg-soot text-mute"
                              }`}
                            >
                              {r.name.slice(0, 1)}
                            </span>
                            <div className="min-w-0">
                              <div className="truncate text-[14px] font-bold">{r.name}</div>
                              <div className="text-[11px] text-dim tabular-nums">
                                {r.lastActiveDays === 0
                                  ? d.common.today
                                  : `${r.lastActiveDays} ${d.teacher.daysAgo}`}
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
                        <td className="px-3 py-3.5 text-[13px] tabular-nums text-mute">{r.hours.toFixed(1)}</td>
                        <td className="px-5 py-3.5">
                          {stuckTopic ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber/40 bg-amber/10 px-2.5 py-1 text-[11px] font-bold text-amber">
                              {d.teacher.stuckOn} {pick(stuckTopic.title).split(" ")[0]}
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
          {/* weak topics */}
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

          {/* help requests */}
          <Reveal delay={160}>
            <Card>
              <h2 className="font-display mb-3.5 flex items-center gap-2 text-lg font-bold">
                <IconHelp size={18} />
                {d.teacher.requests}
              </h2>
              {helpRequests.length === 0 ? (
                <p className="text-[13.5px] leading-relaxed text-dim">{d.teacher.requestsEmpty}</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {helpRequests.map((r) => {
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

      {/* class heatmap */}
      <Reveal delay={200}>
        <Card className="mt-3">
          <div className="mb-1 flex items-center justify-between gap-4">
            <h2 className="font-display text-lg font-bold">{d.teacher.heat}</h2>
          </div>
          <p className="mb-4 text-[12.5px] text-dim">{d.teacher.heatHint}</p>
          <div className="overflow-x-auto">
            <div className="min-w-[420px]">
              <div className="mb-2 grid grid-cols-[110px_repeat(3,1fr)] gap-1.5">
                <span />
                {TOPICS.map((t) => (
                  <span key={t.id} className="truncate text-center text-[11px] font-semibold text-dim">
                    {pick(t.title).split(" ")[0]}
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-1.5">
                {roster.map((r) => (
                  <div key={r.id} className="grid grid-cols-[110px_repeat(3,1fr)] items-center gap-1.5">
                    <span className={`truncate text-[12.5px] font-semibold ${r.me ? "text-brand" : "text-mute"}`}>
                      {r.name}
                    </span>
                    {TOPICS.map((t) => {
                      const m = r.mastery[t.id] ?? 0;
                      return (
                        <span
                          key={t.id}
                          className="h-8 rounded-lg transition-transform hover:scale-[1.04]"
                          style={{
                            background:
                              m >= 0.7
                                ? "#ff5c00"
                                : m >= 0.45
                                  ? "rgba(255,92,0,.55)"
                                  : m >= 0.25
                                    ? "rgba(255,92,0,.28)"
                                    : "#242424",
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

      {/* ---------- modals ---------- */}
      <TaskModal
        open={taskOpen}
        onClose={() => setTaskOpen(false)}
        topics={allTopics}
        onSave={(t) => {
          addTask(t);
          setTaskOpen(false);
          notify(d.teacher.giveDone);
        }}
      />
      <TopicModal
        open={topicOpen}
        onClose={() => setTopicOpen(false)}
        onSave={(c) => {
          addCustomTopic(c);
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
