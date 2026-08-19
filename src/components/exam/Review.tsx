"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { ExamItem, ItemResult, SkillBreakdown } from "@/lib/exam/types";
import { analyseMistake, correctLabel, medianSeconds, pickEL, similarItems } from "@/lib/exam/coach";
import { Bar, Card } from "@/components/ui";
import { IconCheck, IconCross, IconSpark } from "@/components/Icons";

/**
 * The screen the whole trainer exists for: every question, what the student put,
 * what was right, why, and what the wrong option was designed to catch. Filtering
 * defaults to mistakes because that is what anyone actually reviews.
 */

export function SkillTable({ rows, title }: { rows: SkillBreakdown[]; title: string }) {
  if (rows.length === 0) return null;
  return (
    <Card className="mt-4">
      <div className="text-[11px] font-bold uppercase tracking-wider text-dim">{title}</div>
      <div className="mt-4 flex flex-col gap-3.5">
        {rows.map((r) => {
          const share = r.correct / r.total;
          return (
            <div key={r.skill}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[13.5px] font-semibold leading-snug">{r.skill}</span>
                <span className="shrink-0 text-[12.5px] font-bold tabular-nums text-mute">
                  {r.correct}/{r.total}
                </span>
              </div>
              <div className="mt-1.5">
                <Bar value={share} h={5} tone={share < 0.5 ? "amber" : "brand"} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function Review({
  items, results, pool,
}: {
  items: ExamItem[];
  results: ItemResult[];
  pool: ExamItem[];
}) {
  const { lang, d } = useI18n();
  const [filter, setFilter] = useState<"wrong" | "all">("wrong");
  const [open, setOpen] = useState<string | null>(null);

  const byId = useMemo(() => new Map(results.map((r) => [r.id, r])), [results]);
  const median = useMemo(() => medianSeconds(results), [results]);

  const shown = useMemo(
    () => items.filter((it) => (filter === "all" ? true : !byId.get(it.id)?.correct)),
    [items, filter, byId]
  );

  const wrongCount = items.filter((it) => !byId.get(it.id)?.correct).length;

  return (
    <div>
      <div className="flex gap-2">
        <FilterBtn active={filter === "wrong"} onClick={() => setFilter("wrong")}>
          {d.exam.onlyMistakes} ({wrongCount})
        </FilterBtn>
        <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>
          {d.exam.allQuestions} ({items.length})
        </FilterBtn>
      </div>

      {shown.length === 0 && (
        <p className="mt-6 text-center text-[14px] text-mute">{d.exam.noMistakes}</p>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {shown.map((it) => {
          const r = byId.get(it.id);
          if (!r) return null;
          const isOpen = open === it.id;
          const analysis = analyseMistake(it, r, median);
          const index = items.indexOf(it) + 1;

          return (
            <div key={it.id} className="overflow-hidden rounded-2xl border border-line bg-card">
              <button
                onClick={() => setOpen(isOpen ? null : it.id)}
                className="flex w-full items-start gap-3 px-4 py-3.5 text-left"
              >
                <span
                  className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                    r.correct ? "bg-brand/15 text-brand" : "bg-amber/15 text-amber"
                  }`}
                >
                  {r.correct ? <IconCheck size={15} /> : <IconCross size={15} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-[12px] font-bold tabular-nums text-dim">#{index}</span>
                    <span className="text-[12px] font-semibold text-dim">{it.skill}</span>
                  </span>
                  <span className="mt-1 block truncate text-[14px] font-semibold">{it.stem}</span>
                </span>
                <span className="mt-1 shrink-0 text-[11px] font-bold tabular-nums text-dim">
                  {Math.round(r.seconds)}s
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-line px-4 py-4">
                  {it.context && (
                    <p className="mb-4 whitespace-pre-line border-l-2 border-line2 pl-3 text-[13.5px] leading-relaxed text-mute">
                      {it.context}
                    </p>
                  )}
                  <p className="whitespace-pre-line text-[14.5px] font-semibold leading-snug">{it.stem}</p>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <div className={`rounded-xl border px-3 py-2.5 ${r.correct ? "border-line bg-coal" : "border-amber/40 bg-amber/8"}`}>
                      <div className="text-[10.5px] font-bold uppercase tracking-wider text-dim">{d.exam.yourAnswer}</div>
                      <div className="mt-1 text-[13.5px] font-semibold">
                        {analysis.givenLabel ?? d.exam.skipped}
                      </div>
                    </div>
                    <div className="rounded-xl border border-brand/40 bg-brand/8 px-3 py-2.5">
                      <div className="text-[10.5px] font-bold uppercase tracking-wider text-dim">{d.exam.correctAnswer}</div>
                      <div className="mt-1 text-[13.5px] font-semibold text-brand">{correctLabel(it)}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3">
                    {analysis.blocks.map((b, i) => (
                      <div key={i} className="flex gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                        <p className="text-[13.5px] leading-relaxed text-mute">
                          <span className="font-bold text-fg">{d.exam.blockLabel[b.kind]}: </span>
                          {pickEL(b.text, lang)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {!r.correct && (
                    <SimilarStrip item={it} pool={pool} label={d.exam.similar} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SimilarStrip({ item, pool, label }: { item: ExamItem; pool: ExamItem[]; label: string }) {
  const similar = similarItems(item, pool, 3);
  if (similar.length === 0) return null;
  return (
    <div className="mt-4 rounded-xl border border-line2 bg-coal px-3 py-3">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-dim">
        <IconSpark size={13} />
        {label}
      </div>
      <ul className="mt-2 flex flex-col gap-1.5">
        {similar.map((s) => (
          <li key={s.id} className="truncate text-[13px] text-mute">
            · {s.stem}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FilterBtn({
  active, onClick, children,
}: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`press rounded-xl border px-3.5 py-2 text-[12.5px] font-bold transition-colors ${
        active ? "border-brand bg-brand/12 text-brand" : "border-line2 text-mute hover:border-line2"
      }`}
    >
      {children}
    </button>
  );
}
