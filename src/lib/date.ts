/** YYYY-MM-DD in the user's local timezone (not UTC). */
export function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse onboarding date + time as local wall-clock, returned as UTC ISO for storage. */
export function localDateTimeToIso(date: string, time: string): string {
  return new Date(`${date}T${time}`).toISOString();
}
