"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import type { Goal } from "@/lib/types";
import { Btn, Card, Modal, Reveal } from "@/components/ui";
import { IconArrow, IconBolt, IconBook, IconCheck, IconHelp, IconSpark, IconTarget, IconTrophy } from "@/components/Icons";
import { LangSwitch } from "@/components/Header";

const GOAL_ICON: Record<Goal, typeof IconTarget> = {
  ent: IconTarget,
  olymp: IconTrophy,
  school: IconBook,
};

export default function StartPage() {
  const { d } = useI18n();
  const { createUser } = useStore();
  const router = useRouter();

  const [name, setName] = useState("");
  const [grade, setGrade] = useState(9);
  const [goal, setGoal] = useState<Goal>("ent");
  const [examDate, setExamDate] = useState("");
  const [advisor, setAdvisor] = useState(false);

  const submit = () => {
    createUser(name.trim() || "—", grade, goal, examDate || null);
    router.push("/diagnostic");
  };

  return (
    <div className="relative overflow-hidden">
      <div className="glow-orb -top-32 left-1/2 h-[380px] w-[380px] -translate-x-1/2 opacity-60" aria-hidden="true" />

      <div className="relative mx-auto max-w-lg px-4 py-12 sm:py-16">
        <Reveal>
          <div className="mb-8 flex items-center justify-between">
            <h1 className="font-display text-[clamp(28px,6vw,38px)] font-extrabold tracking-[-0.02em]">
              {d.start.title}
            </h1>
            <LangSwitch />
          </div>
        </Reveal>

        <Reveal delay={60}>
          <Card pad="p-5 sm:p-6">
            <label className="block">
              <span className="mb-2 block text-[13px] font-semibold text-mute">{d.start.nameLabel}</span>
              <input
                className="field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={d.start.namePh}
                autoComplete="given-name"
                maxLength={24}
              />
            </label>

            <div className="mt-5">
              <span className="mb-2 block text-[13px] font-semibold text-mute">{d.start.gradeLabel}</span>
              <div className="grid grid-cols-6 gap-1.5">
                {[7, 8, 9, 10, 11, 12].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    className={`press h-11 rounded-xl border text-sm font-bold tabular-nums transition-colors ${
                      grade === g
                        ? "border-brand bg-brand text-ink"
                        : "border-line bg-coal text-mute hover:border-line2 hover:text-paper"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-[13px] font-semibold text-mute">{d.start.goalLabel}</span>
                <button
                  onClick={() => setAdvisor(true)}
                  className="press inline-flex items-center gap-1.5 text-[12px] font-bold text-brand hover:text-brand-hi"
                >
                  <IconHelp size={14} />
                  {d.start.unsure}
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {(["ent", "olymp", "school"] as Goal[]).map((g) => {
                  const Icon = GOAL_ICON[g];
                  const active = goal === g;
                  return (
                    <button
                      key={g}
                      onClick={() => setGoal(g)}
                      className={`press flex items-center gap-3.5 rounded-2xl border p-3.5 text-left transition-colors ${
                        active ? "border-brand bg-brand/8" : "border-line bg-coal hover:border-line2"
                      }`}
                    >
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${
                          active ? "border-brand/40 bg-brand/12 text-brand" : "border-line2 bg-soot text-mute"
                        }`}
                      >
                        <Icon size={20} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-bold">{d.start.goals[g].t}</span>
                        <span className="block text-[12.5px] leading-snug text-dim">{d.start.goals[g].d}</span>
                      </span>
                      {active && <IconCheck size={20} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {goal === "ent" && (
              <label className="mt-5 block slide-up">
                <span className="mb-2 block text-[13px] font-semibold text-mute">{d.start.examDateLabel}</span>
                <input type="date" className="field" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
              </label>
            )}

            <div className="mt-5 grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-line bg-coal px-3.5 py-3">
                <div className="text-[11px] uppercase tracking-wider text-dim">{d.start.subjectLabel}</div>
                <div className="mt-1 flex items-center gap-2 text-sm font-bold">
                  <IconBolt size={15} />
                  {d.start.subjectMath}
                </div>
              </div>
              <div className="rounded-2xl border border-dashed border-line px-3.5 py-3 opacity-55">
                <div className="text-[11px] uppercase tracking-wider text-dim">{d.start.subjectLabel}</div>
                <div className="mt-1 text-sm font-bold text-dim">{d.start.subjectSoon}</div>
              </div>
            </div>

            <Btn onClick={submit} size="lg" full className="arrow-slide mt-6">
              {d.start.startDiag}
              <span className="arr">
                <IconArrow size={18} />
              </span>
            </Btn>

            <p className="mt-4 text-center text-[12px] leading-snug text-dim">{d.profile.dataNote}</p>
          </Card>
        </Reveal>
      </div>

      <Advisor
        open={advisor}
        onClose={() => setAdvisor(false)}
        onPick={(g) => {
          setGoal(g);
          setAdvisor(false);
        }}
      />
    </div>
  );
}

/* ---------------- advisor dialogue ---------------- */

function Advisor({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (g: Goal) => void }) {
  const { d } = useI18n();
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState<number[]>([]);

  const reset = () => {
    setStep(0);
    setAns([]);
  };

  const answer = (i: number) => {
    const next = [...ans, i];
    setAns(next);
    setStep(step + 1);
  };

  // Simple rule engine: exam intent dominates, then taste, then grade.
  const decide = (): Goal => {
    const [gradeBand, exam, taste] = ans;
    if (taste === 1) return "olymp";
    if (exam === 0) return "ent";
    if (taste === 0 && gradeBand >= 1) return "ent";
    return "school";
  };

  const questions = [
    { q: d.consult.q1, a: d.consult.q1a },
    { q: d.consult.q2, a: d.consult.q2a },
    { q: d.consult.q3, a: d.consult.q3a },
  ];

  const rec = step >= 3 ? decide() : null;

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        setTimeout(reset, 250);
      }}
      title={d.consult.title}
    >
      <div className="mb-4 flex items-start gap-3 rounded-2xl border border-line bg-coal p-3.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/12 text-brand">
          <IconSpark size={19} />
        </span>
        <p className="pt-0.5 text-[13.5px] leading-relaxed text-mute">{d.consult.intro}</p>
      </div>

      {rec === null ? (
        <div key={step} className="slide-up">
          <div className="mb-1 flex gap-1">
            {questions.map((_, i) => (
              <span key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-brand" : "bg-line"}`} />
            ))}
          </div>
          <p className="mb-3 mt-4 text-[15px] font-bold">{questions[step].q}</p>
          <div className="flex flex-col gap-2">
            {questions[step].a.map((a, i) => (
              <button
                key={i}
                onClick={() => answer(i)}
                className="press rounded-2xl border border-line bg-coal px-4 py-3 text-left text-[14px] font-semibold hover:border-brand hover:bg-brand/6"
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="slide-up">
          <div className="rounded-2xl border border-brand/40 bg-brand/8 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-brand">{d.consult.recPrefix}</div>
            <div className="font-display mt-1.5 text-xl font-extrabold">{d.start.goals[rec].t}</div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-mute">{d.consult.recWhy[rec]}</p>
          </div>
          <div className="mt-4 flex gap-2">
            <Btn onClick={() => onPick(rec)} full>
              {d.consult.accept}
            </Btn>
            <Btn
              variant="outline"
              onClick={() => {
                onClose();
                setTimeout(reset, 250);
              }}
            >
              {d.consult.other}
            </Btn>
          </div>
        </div>
      )}
    </Modal>
  );
}
