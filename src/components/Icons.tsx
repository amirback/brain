/**
 * Flat 2D icon set drawn for brain — no emoji anywhere in the product.
 * Two-tone by design: orange fill blocks + dark outline, so they read
 * as one family at any size. `size` drives everything; strokes stay 1.6.
 */

interface P {
  size?: number;
  className?: string;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true as const,
  focusable: "false" as const,
});

const S = { strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function IconTarget({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" {...S} />
      <circle cx="12" cy="12" r="5.2" stroke="currentColor" {...S} opacity="0.55" />
      <circle cx="12" cy="12" r="2" fill="#ff5c00" />
    </svg>
  );
}

export function IconMap({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" fill="#ff5c00" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" stroke="currentColor" {...S} />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" stroke="currentColor" {...S} />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" fill="#ff5c00" opacity="0.45" />
    </svg>
  );
}

export function IconChart({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 20h18" stroke="currentColor" {...S} />
      <rect x="5" y="12" width="3.6" height="5" rx="1.2" stroke="currentColor" {...S} />
      <rect x="10.2" y="8" width="3.6" height="9" rx="1.2" fill="#ff5c00" />
      <rect x="15.4" y="4.5" width="3.6" height="12.5" rx="1.2" stroke="currentColor" {...S} />
    </svg>
  );
}

export function IconTrend({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 16.5l5-5 3.5 3.5L20 6.5" stroke="#ff5c00" {...S} />
      <path d="M15 6.5h5v5" stroke="#ff5c00" {...S} />
      <path d="M3 20.5h18" stroke="currentColor" {...S} opacity="0.4" />
    </svg>
  );
}

export function IconFlame({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M12 3c.6 3.2-1.4 4.4-2.8 5.9C7.6 10.6 7 12 7 13.7 7 17.2 9.4 20 12 20s5-2.8 5-6.3c0-2.6-1.5-4-2.6-5.6-.4 1-1 1.7-1.8 2.2.4-2.6-.2-5-1.6-7.3z"
        fill="#ff5c00"
      />
      <path d="M12 20c-1.4 0-2.4-1.3-2.4-2.9 0-1.6 1.1-2.3 1.7-3.4.7 1 2.6 1.8 2.6 3.4 0 1.6-.5 2.9-1.9 2.9z" fill="#ffb800" />
    </svg>
  );
}

export function IconClock({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" {...S} />
      <path d="M12 7.5V12l3 2" stroke="#ff5c00" {...S} />
    </svg>
  );
}

export function IconTrophy({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M7 4h10v4.5a5 5 0 01-10 0V4z" fill="#ff5c00" />
      <path d="M7 5.5H4.8v1.2A3.2 3.2 0 007.4 9.8M17 5.5h2.2v1.2a3.2 3.2 0 01-2.6 3.1" stroke="currentColor" {...S} />
      <path d="M12 13.5V17M8.5 20h7M9.5 17h5l.7 3h-6.4l.7-3z" stroke="currentColor" {...S} />
    </svg>
  );
}

export function IconBolt({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M13.5 2.5L5 13.2h5.2L9.8 21.5 18.5 10.6h-5.3l.3-8.1z" fill="#ff5c00" />
    </svg>
  );
}

export function IconBook({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 5.2C4 4.3 4.8 3.6 5.7 3.7L11 4.4v15.9l-5.4-.7A1.7 1.7 0 014 17.9V5.2z" fill="#ff5c00" opacity="0.9" />
      <path d="M20 5.2c0-.9-.8-1.6-1.7-1.5L13 4.4v15.9l5.4-.7c.9-.1 1.6-.9 1.6-1.7V5.2z" stroke="currentColor" {...S} />
    </svg>
  );
}

export function IconTeacher({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3" y="4" width="18" height="12" rx="2.2" stroke="currentColor" {...S} />
      <path d="M6.5 8.5h6M6.5 11.5h4" stroke="#ff5c00" {...S} />
      <path d="M9 20l3-4 3 4" stroke="currentColor" {...S} />
    </svg>
  );
}

export function IconParent({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="8.5" cy="7" r="3" fill="#ff5c00" />
      <circle cx="16.5" cy="9.5" r="2.2" stroke="currentColor" {...S} />
      <path d="M3.5 19.5c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" {...S} />
      <path d="M14.8 19.5c0-2 1.1-3.6 3-3.6s2.7 1.6 2.7 3.6" stroke="currentColor" {...S} opacity="0.6" />
    </svg>
  );
}

export function IconCheck({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="9" fill="#ff5c00" />
      <path d="M8 12.3l2.7 2.7L16 9.5" stroke="#14161a" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCross({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" {...S} />
      <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconArrow({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4.5 12h14M13 6.5l5.5 5.5L13 17.5" stroke="currentColor" {...S} />
    </svg>
  );
}

export function IconGlobe({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" {...S} />
      <path d="M3.5 12h17M12 3.5c2.2 2.3 3.3 5.2 3.3 8.5S14.2 18.2 12 20.5c-2.2-2.3-3.3-5.2-3.3-8.5S9.8 5.8 12 3.5z" stroke="currentColor" {...S} opacity="0.65" />
    </svg>
  );
}

export function IconSpark({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 2.8l1.9 5.6 5.6 1.9-5.6 1.9L12 17.8l-1.9-5.6-5.6-1.9 5.6-1.9L12 2.8z" fill="#ff5c00" />
      <path d="M18.6 15.4l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" fill="#ffb800" />
    </svg>
  );
}

export function IconLock({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="4.5" y="10" width="15" height="10" rx="2.4" stroke="currentColor" {...S} />
      <path d="M8 10V7.6a4 4 0 018 0V10" stroke="currentColor" {...S} />
      <circle cx="12" cy="15" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function IconRefresh({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M20 12a8 8 0 11-2.6-5.9" stroke="currentColor" {...S} />
      <path d="M20 4v4.5h-4.5" stroke="#ff5c00" {...S} />
    </svg>
  );
}

export function IconMenu({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" {...S} />
    </svg>
  );
}

export function IconClose({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" {...S} />
    </svg>
  );
}

export function IconPlus({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" {...S} />
    </svg>
  );
}

export function IconHelp({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" {...S} />
      <path d="M9.5 9.3a2.6 2.6 0 015 .9c0 1.7-2.5 2.1-2.5 3.8" stroke="#ff5c00" {...S} />
      <circle cx="12" cy="17" r="1.1" fill="#ff5c00" />
    </svg>
  );
}

export function IconUser({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="8" r="3.6" stroke="currentColor" {...S} />
      <path d="M4.8 20c0-3.6 3.2-6 7.2-6s7.2 2.4 7.2 6" stroke="currentColor" {...S} />
    </svg>
  );
}

export function IconLink({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M10.5 13.5a4 4 0 005.7 0l2.8-2.8a4 4 0 10-5.7-5.7L11.9 6.4" stroke="currentColor" {...S} />
      <path d="M13.5 10.5a4 4 0 00-5.7 0L5 13.3a4 4 0 105.7 5.7l1.4-1.4" stroke="#ff5c00" {...S} />
    </svg>
  );
}

export function IconGrid({ size = 24, className }: P) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.4" stroke="currentColor" {...S} />
      <path d="M3.5 9.2h17M3.5 14.8h17M9.2 3.5v17" stroke="currentColor" {...S} opacity="0.55" />
      <rect x="14.8" y="9.2" width="5.7" height="5.6" fill="#ff5c00" opacity="0.85" />
    </svg>
  );
}

/** The wordmark: br<AI>n with the AI highlighted. */
export function Wordmark({ className = "", size = 26 }: { className?: string; size?: number }) {
  return (
    <span
      className={`font-display font-extrabold tracking-tight leading-none ${className}`}
      style={{ fontSize: size }}
    >
      br<span className="text-brand">AI</span>n
    </span>
  );
}

/** Animated logo glyph — a bracketed node that pulses on hover. */
export function LogoMark({ size = 34, className = "" }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
      <rect x="1.2" y="1.2" width="33.6" height="33.6" rx="10" stroke="#3d434f" strokeWidth="1.6" />
      <path d="M11 10.5H9.5A2.5 2.5 0 007 13v3.2c0 1-.8 1.8-1.8 1.8 1 0 1.8.8 1.8 1.8V23a2.5 2.5 0 002.5 2.5H11" stroke="#ff5c00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M25 10.5h1.5A2.5 2.5 0 0129 13v3.2c0 1 .8 1.8 1.8 1.8-1 0-1.8.8-1.8 1.8V23a2.5 2.5 0 01-2.5 2.5H25" stroke="#ff5c00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18" cy="18" r="3.4" fill="#ff5c00" />
      <circle cx="18" cy="18" r="6.6" stroke="#ff5c00" strokeWidth="1.4" opacity="0.35" />
    </svg>
  );
}
