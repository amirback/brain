/** Pure derivations over a student's activity log — no React, no storage. */

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function streakLength(dates: string[]): number {
  if (dates.length === 0) return 0;
  const set = new Set(dates);
  let len = 0;
  const d = new Date();
  // The streak counts up to today, or up to yesterday if today is still empty.
  if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
  while (set.has(d.toISOString().slice(0, 10))) {
    len += 1;
    d.setDate(d.getDate() - 1);
  }
  return len;
}

export function totalSeconds(byDay: Record<string, number>): number {
  return Object.values(byDay).reduce((a, b) => a + b, 0);
}

export function weekSeconds(byDay: Record<string, number>): number {
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    sum += byDay[d.toISOString().slice(0, 10)] ?? 0;
  }
  return sum;
}

export function lastNDays(byDay: Record<string, number>, n: number): { date: string; seconds: number }[] {
  const out: { date: string; seconds: number }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({ date: key, seconds: byDay[key] ?? 0 });
  }
  return out;
}

export function fmtHours(seconds: number, hourLabel: string, minLabel: string): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h === 0 ? `${m}${minLabel}` : `${h}${hourLabel} ${m}${minLabel}`;
}
