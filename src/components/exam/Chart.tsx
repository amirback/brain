"use client";

import type { ChartSpec } from "@/lib/exam/types";

/**
 * IELTS Task 1 visuals, drawn as inline SVG.
 *
 * Shipping images would have meant a student on a slow connection describing a
 * chart they cannot see, and a screen reader describing nothing at all. Drawing
 * from the same numbers the grader checks against keeps the data and the picture
 * from drifting apart, and the figure table underneath means the task is still
 * answerable if the SVG fails to render.
 */

const SERIES_COLORS = ["var(--color-brand)", "var(--color-amber)", "var(--color-mute)", "var(--color-line2)"];

export function Chart({ spec }: { spec: ChartSpec }) {
  return (
    <figure className="rounded-2xl border border-line bg-coal p-4">
      <figcaption className="text-[12px] font-bold uppercase tracking-wider text-dim">{spec.caption}</figcaption>
      <div className="mt-3 overflow-x-auto">
        {spec.kind === "line" && <LineChart spec={spec} />}
        {spec.kind === "bar" && <BarChart spec={spec} />}
        {spec.kind === "pie" && <PieChart spec={spec} />}
        {spec.kind === "table" && <TableChart spec={spec} />}
        {spec.kind === "process" && <ProcessChart spec={spec} />}
      </div>
      {spec.kind !== "process" && spec.kind !== "table" && <Legend spec={spec} />}
      {spec.kind !== "process" && <DataTable spec={spec} />}
    </figure>
  );
}

function Legend({ spec }: { spec: ChartSpec }) {
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
      {spec.series.map((s, i) => (
        <span key={s.name} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-mute">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: SERIES_COLORS[i % SERIES_COLORS.length] }} />
          {s.name}
        </span>
      ))}
    </div>
  );
}

/** The numbers in text form — the version a student actually quotes from. */
function DataTable({ spec }: { spec: ChartSpec }) {
  const isPie = spec.kind === "pie";
  const cols = isPie ? spec.series.map((s) => s.name) : spec.labels;
  const rows = isPie ? spec.labels : spec.series.map((s) => s.name);

  return (
    <div className="mt-3 overflow-x-auto border-t border-line pt-3">
      <table className="w-full text-[12px] tabular-nums">
        <thead>
          <tr className="text-dim">
            <th className="pb-1.5 text-left font-bold uppercase tracking-wider">{spec.unit}</th>
            {cols.map((c) => (
              <th key={c} className="pb-1.5 pl-3 text-right font-bold">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={r} className="border-t border-line/60">
              <td className="py-1.5 pr-2 font-semibold">{r}</td>
              {cols.map((c, ci) => (
                <td key={c} className="py-1.5 pl-3 text-right text-mute">
                  {isPie ? spec.series[ci].values[ri] : spec.series[ri].values[ci]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const W = 480;
const H = 220;
const PAD = { l: 34, r: 10, t: 10, b: 26 };

function scaleY(v: number, max: number): number {
  return H - PAD.b - ((H - PAD.t - PAD.b) * v) / max;
}

function LineChart({ spec }: { spec: ChartSpec }) {
  const max = Math.ceil(Math.max(...spec.series.flatMap((s) => s.values)) / 10) * 10 || 10;
  const stepX = (W - PAD.l - PAD.r) / Math.max(1, spec.labels.length - 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[420px]" role="img" aria-label={spec.caption}>
      <Axes max={max} labels={spec.labels} stepX={stepX} />
      {spec.series.map((s, i) => (
        <g key={s.name}>
          <polyline
            fill="none"
            stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
            strokeWidth={2.5}
            strokeLinejoin="round"
            points={s.values.map((v, j) => `${PAD.l + j * stepX},${scaleY(v, max)}`).join(" ")}
          />
          {s.values.map((v, j) => (
            <circle
              key={j}
              cx={PAD.l + j * stepX}
              cy={scaleY(v, max)}
              r={3}
              fill="var(--color-ink)"
              stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
              strokeWidth={2}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

function BarChart({ spec }: { spec: ChartSpec }) {
  const max = Math.ceil(Math.max(...spec.series.flatMap((s) => s.values)) / 10) * 10 || 10;
  const groups = spec.labels.length;
  const groupW = (W - PAD.l - PAD.r) / groups;
  const barW = Math.min(18, (groupW - 10) / spec.series.length);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[420px]" role="img" aria-label={spec.caption}>
      <Axes max={max} labels={spec.labels} stepX={groupW} centered />
      {spec.labels.map((_, gi) =>
        spec.series.map((s, si) => {
          const x = PAD.l + gi * groupW + groupW / 2 - (spec.series.length * barW) / 2 + si * barW;
          const y = scaleY(s.values[gi], max);
          return (
            <rect
              key={`${gi}-${si}`}
              x={x}
              y={y}
              width={barW - 2}
              height={H - PAD.b - y}
              rx={2}
              fill={SERIES_COLORS[si % SERIES_COLORS.length]}
            />
          );
        })
      )}
    </svg>
  );
}

function Axes({
  max, labels, stepX, centered,
}: {
  max: number; labels: string[]; stepX: number; centered?: boolean;
}) {
  const ticks = [0, max / 4, max / 2, (max * 3) / 4, max];
  return (
    <g>
      {ticks.map((t) => (
        <g key={t}>
          <line
            x1={PAD.l} x2={W - PAD.r}
            y1={scaleY(t, max)} y2={scaleY(t, max)}
            stroke="var(--color-line)" strokeWidth={1}
          />
          <text
            x={PAD.l - 6} y={scaleY(t, max) + 3.5}
            textAnchor="end" fontSize={9.5} fill="var(--color-dim)"
          >
            {Math.round(t)}
          </text>
        </g>
      ))}
      {labels.map((l, i) => (
        <text
          key={l}
          x={PAD.l + (centered ? i * stepX + stepX / 2 : i * stepX)}
          y={H - PAD.b + 14}
          textAnchor="middle" fontSize={10} fill="var(--color-dim)"
        >
          {l}
        </text>
      ))}
    </g>
  );
}

function PieChart({ spec }: { spec: ChartSpec }) {
  const R = 62;
  const gap = 24;
  const size = R * 2;
  const width = spec.series.length * size + (spec.series.length - 1) * gap;

  return (
    <svg
      viewBox={`0 0 ${width} ${size + 26}`}
      className="h-auto w-full max-w-md"
      role="img"
      aria-label={spec.caption}
    >
      {spec.series.map((s, si) => {
        const cx = si * (size + gap) + R;
        const cy = R;
        const total = s.values.reduce((a, b) => a + b, 0) || 1;
        let angle = -Math.PI / 2;
        return (
          <g key={s.name}>
            {s.values.map((v, vi) => {
              const slice = (v / total) * Math.PI * 2;
              const x1 = cx + R * Math.cos(angle);
              const y1 = cy + R * Math.sin(angle);
              angle += slice;
              const x2 = cx + R * Math.cos(angle);
              const y2 = cy + R * Math.sin(angle);
              const large = slice > Math.PI ? 1 : 0;
              return (
                <path
                  key={vi}
                  d={`M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`}
                  fill={SERIES_COLORS[vi % SERIES_COLORS.length]}
                  stroke="var(--color-ink)"
                  strokeWidth={1.5}
                />
              );
            })}
            <text x={cx} y={size + 16} textAnchor="middle" fontSize={11} fill="var(--color-mute)" fontWeight={700}>
              {s.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Pies label the categories, not the series, so the legend is swapped. */
function TableChart({ spec }: { spec: ChartSpec }) {
  void spec;
  return null;
}

function ProcessChart({ spec }: { spec: ChartSpec }) {
  const stages = spec.stages ?? [];
  return (
    <ol className="flex flex-col gap-2">
      {stages.map((s, i) => (
        <li key={i} className="flex items-start gap-3 rounded-xl border border-line bg-card px-3 py-2.5">
          <span className="font-display mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-brand/15 text-[11px] font-extrabold text-brand">
            {i + 1}
          </span>
          <span className="text-[13.5px] leading-snug text-mute">{s}</span>
        </li>
      ))}
    </ol>
  );
}
