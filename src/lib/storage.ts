import { normalizeQuitData } from "./normalize-quit-data";
import type { QuitData } from "./types";

export const STORAGE_KEYS = {
  quitData: "quitData",
  cravingLog: "cravingLog",
} as const;

export function getQuitData(): QuitData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.quitData);
    if (!raw) return null;
    return normalizeQuitData(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveQuitData(data: QuitData): void {
  localStorage.setItem(STORAGE_KEYS.quitData, JSON.stringify(data));
}

export function getCravingLog(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.cravingLog);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function logCraving(): string[] {
  const log = getCravingLog();
  log.push(new Date().toISOString());
  localStorage.setItem(STORAGE_KEYS.cravingLog, JSON.stringify(log));
  return log;
}

export function clearQuitData(): void {
  localStorage.removeItem(STORAGE_KEYS.quitData);
}

export function clearAllData(): void {
  clearQuitData();
  localStorage.removeItem(STORAGE_KEYS.cravingLog);
}
