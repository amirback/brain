"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ---------------- reveal on scroll ---------------- */

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => el.classList.add("rv-in");

    // Anything already on screen (or above it) reveals right away — waiting on
    // the observer there is what leaves sections blank on fast loads.
    const inView = () => el.getBoundingClientRect().top < window.innerHeight * 0.92;
    if (inView() || !("IntersectionObserver" in window)) {
      show();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show();
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -32px 0px" }
    );
    io.observe(el);

    // Last resort: a scroll listener catches anything the observer misses.
    const onScroll = () => {
      if (inView()) {
        show();
        io.disconnect();
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  const Comp = Tag as React.ElementType;
  return (
    <Comp
      ref={ref as never}
      className={`rv ${className}`}
      style={{ ["--rv-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Comp>
  );
}

/* ---------------- buttons ---------------- */

type BtnProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "brand" | "ghost" | "outline" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  full?: boolean;
};

/**
 * The main action carries the brand violet. On a near-white page the violet is
 * the only saturated thing on screen, so it reads as the action without
 * needing weight; `dark` stays for the rare place that needs more contrast
 * than the violet gives — a confirm over a busy surface.
 */
const V = {
  primary: "bg-brand text-paper hover:bg-brand-hi border border-brand shine halo",
  brand: "bg-brand text-paper hover:bg-brand-hi border border-brand shine halo",
  ghost: "bg-transparent text-ink hover:bg-brand/8 border border-transparent",
  outline: "bg-transparent text-ink hover:border-brand hover:text-brand border border-line2",
  dark: "bg-ink text-paper hover:bg-[#262445] border border-ink shine",
};

const SZ = {
  sm: "h-9 px-3.5 text-[13px] rounded-xl gap-1.5",
  md: "h-11 px-5 text-sm rounded-2xl gap-2",
  lg: "h-13 px-6 text-[15px] rounded-2xl gap-2.5",
};

export function Btn({
  children, href, onClick, variant = "primary", size = "md",
  className = "", disabled, type = "button", full,
}: BtnProps) {
  const cls = `press inline-flex items-center justify-center font-semibold ${V[variant]} ${SZ[size]} ${
    full ? "w-full" : ""
  } ${disabled ? "opacity-40 pointer-events-none" : ""} ${className}`;
  if (href && !disabled) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

/* ---------------- surfaces ---------------- */

export function Card({
  children, className = "", hover = false, pad = "p-5",
}: {
  children: React.ReactNode; className?: string; hover?: boolean; pad?: string;
}) {
  return (
    <div className={`bg-card border border-line rounded-3xl ${pad} ${hover ? "card-hover" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function Chip({
  children, tone = "line", className = "",
}: {
  children: React.ReactNode; tone?: "line" | "brand" | "amber" | "dim"; className?: string;
}) {
  const tones = {
    line: "border-line2 text-mute",
    brand: "border-brand/45 text-brand bg-brand/10",
    amber: "border-amber/40 text-amber bg-amber/10",
    dim: "border-line text-dim",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="h-px w-8 bg-brand" />
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand">{children}</span>
    </div>
  );
}

/* ---------------- progress bits ---------------- */

export function Bar({ value, tone = "brand", h = 8 }: { value: number; tone?: "brand" | "amber" | "dim"; h?: number }) {
  const colors = { brand: "bg-brand", amber: "bg-amber", dim: "bg-line2" };
  return (
    <div className="w-full rounded-full bg-haze overflow-hidden" style={{ height: h }}>
      <div
        className={`h-full rounded-full ${colors[tone]} transition-[width] duration-700`}
        style={{ width: `${Math.min(100, Math.max(0, value * 100))}%`, transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
      />
    </div>
  );
}

export function Ring({
  value, size = 92, stroke = 8, children,
}: {
  value: number; size?: number; stroke?: number; children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(1, Math.max(0, value)));
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#e9e7f5" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke="#5b4ee6" strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/* counts up when it enters the viewport */
export function CountUp({
  to, dur = 900, decimals = 0, suffix = "", prefix = "",
}: {
  to: number; dur?: number; decimals?: number; suffix?: string; prefix?: string;
}) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting || done.current) return;
      done.current = true;
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        setV(to * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, dur]);
  return (
    <span ref={ref}>
      {prefix}
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ---------------- charts (hand-rolled SVG, no libs) ---------------- */

export function Sparkline({
  points, w = 240, h = 64, showDots = true, label,
}: {
  points: number[]; w?: number; h?: number; showDots?: boolean; label?: string;
}) {
  if (points.length < 2) {
    return <div className="text-dim text-xs h-16 grid place-items-center">—</div>;
  }
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const pad = 6;
  const xs = (i: number) => pad + (i * (w - pad * 2)) / (points.length - 1);
  const ys = (v: number) => h - pad - ((v - min) / span) * (h - pad * 2);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${xs(i).toFixed(1)} ${ys(p).toFixed(1)}`).join(" ");
  const area = `${d} L${xs(points.length - 1).toFixed(1)} ${h} L${xs(0).toFixed(1)} ${h} Z`;
  const last = points[points.length - 1];
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label={label ?? "trend"}>
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5b4ee6" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#5b4ee6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-fill)" />
      <path d={d} stroke="#5b4ee6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
        className="draw-line" style={{ ["--dash" as string]: "600", strokeDasharray: 600 }} />
      {showDots && (
        <circle cx={xs(points.length - 1)} cy={ys(last)} r="3.6" fill="#5b4ee6" stroke="#ffffff" strokeWidth="2" />
      )}
    </svg>
  );
}

export function MiniBars({
  values, labels, h = 76,
}: {
  values: number[]; labels?: string[]; h?: number;
}) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-stretch gap-1.5" style={{ height: h }}>
      {values.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
          <div className="w-full flex-1 flex items-end">
            <div
              className="w-full rounded-t-[4px] bar-grow transition-colors"
              style={{
                height: `${Math.max(3, (v / max) * 100)}%`,
                background: v > 0 ? "#5b4ee6" : "#e8e6f7",
                animationDelay: `${i * 60}ms`,
              }}
              title={labels?.[i]}
            />
          </div>
          {labels && <span className="text-[9px] text-dim tabular-nums">{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}

/* ---------------- misc ---------------- */

export function Modal({
  open, onClose, title, children, wide = false,
}: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-end sm:place-items-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-ink/45 backdrop-blur-[3px]" onClick={onClose} />
      <div
        className={`relative w-full ${wide ? "sm:max-w-2xl" : "sm:max-w-md"} bg-card border border-line rounded-t-3xl sm:rounded-3xl p-5 slide-up max-h-[92vh] overflow-y-auto`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="font-display text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-mute hover:text-ink press p-1 -m-1" aria-label="close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Confetti({ fire }: { fire: number }) {
  const [bits, setBits] = useState<{ id: number; cx: string; cy: string; cr: string; c: string }[]>([]);
  useEffect(() => {
    if (fire === 0) return;
    const colors = ["#5b4ee6", "#8f83f0", "#ab9ff2", "#7263f2"];
    const next = Array.from({ length: 18 }, (_, i) => ({
      id: fire * 100 + i,
      cx: `${(Math.random() - 0.5) * 260}px`,
      cy: `${-40 - Math.random() * 160}px`,
      cr: `${(Math.random() - 0.5) * 540}deg`,
      c: colors[i % colors.length],
    }));
    setBits(next);
    const t = setTimeout(() => setBits([]), 1100);
    return () => clearTimeout(t);
  }, [fire]);
  if (bits.length === 0) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {bits.map((b) => (
        <span
          key={b.id}
          className="confetti-bit"
          style={{ background: b.c, ["--cx" as string]: b.cx, ["--cy" as string]: b.cy, ["--cr" as string]: b.cr }}
        />
      ))}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-haze ${className}`} />;
}
