import { getElapsedDays } from "./calculations";
import { toLocalDateString } from "./date";

export interface DailyCravingCount {
  date: string;
  count: number;
}

export function getCravingsPerDay(timestamps: string[]): DailyCravingCount[] {
  const counts = new Map<string, number>();

  for (const ts of timestamps) {
    const date = toLocalDateString(new Date(ts));
    counts.set(date, (counts.get(date) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Whole days smoke-free (same as the "days" on the dashboard counter). */
export function getSmokeFreeStreakDays(
  quitDate: Date,
  now: Date = new Date()
): number {
  return getElapsedDays(quitDate, now);
}

export function getLast7DaysCravings(
  timestamps: string[],
  now: Date = new Date()
): DailyCravingCount[] {
  const result: DailyCravingCount[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const date = toLocalDateString(d);
    const count = timestamps.filter(
      (ts) => toLocalDateString(new Date(ts)) === date
    ).length;
    result.push({ date, count });
  }

  return result;
}

export function formatChartDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const local = new Date(y, m - 1, d);
  return local.toLocaleDateString("en-US", { weekday: "short" });
}
