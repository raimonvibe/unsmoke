"use client";

import { pickerInputClass, selectClass } from "@/lib/ui";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function parseTime(value: string): { hour: number; minute: number } {
  const [h, m] = value.split(":");
  const hour = Math.min(23, Math.max(0, parseInt(h ?? "0", 10) || 0));
  const minute = Math.min(59, Math.max(0, parseInt(m ?? "0", 10) || 0));
  return { hour, minute };
}

function formatHourLabel(hour: number): string {
  const d = new Date(2000, 0, 1, hour, 0);
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: undefined,
    hour12: true,
  });
}

interface QuitDateTimeFieldsProps {
  quitDate: string;
  quitTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export function QuitDateTimeFields({
  quitDate,
  quitTime,
  onDateChange,
  onTimeChange,
}: QuitDateTimeFieldsProps) {
  const { hour, minute } = parseTime(quitTime);

  function setHour(nextHour: number) {
    onTimeChange(`${pad2(nextHour)}:${pad2(minute)}`);
  }

  function setMinute(nextMinute: number) {
    onTimeChange(`${pad2(hour)}:${pad2(nextMinute)}`);
  }

  return (
    <div className="space-y-4">
      <label className="block min-w-0 space-y-2">
        <span className="text-sm font-medium text-sage-700">Date</span>
        <input
          id="quit-date"
          type="date"
          value={quitDate}
          onChange={(e) => onDateChange(e.target.value)}
          required
          className={pickerInputClass}
          autoComplete="off"
        />
        <span className="text-xs text-stone-500">
          Tap to open your device&apos;s calendar
        </span>
      </label>

      <div
        role="group"
        aria-labelledby="quit-time-label"
        className="space-y-2"
      >
        <p id="quit-time-label" className="text-sm font-medium text-sage-700">
          Time
        </p>
        <p className="text-xs text-stone-500">
          Choose hour and minute, or use the clock picker below
        </p>

        <div className="grid grid-cols-2 gap-2">
          <label className="block min-w-0 space-y-1">
            <span className="text-xs font-medium text-stone-600">Hour</span>
            <select
              id="quit-hour"
              value={pad2(hour)}
              onChange={(e) => setHour(parseInt(e.target.value, 10))}
              required
              className={selectClass}
              aria-label="Quit time — hour"
            >
              {HOURS.map((h) => (
                <option key={h} value={pad2(h)}>
                  {formatHourLabel(h)}
                </option>
              ))}
            </select>
          </label>
          <label className="block min-w-0 space-y-1">
            <span className="text-xs font-medium text-stone-600">Minute</span>
            <select
              id="quit-minute"
              value={pad2(minute)}
              onChange={(e) => setMinute(parseInt(e.target.value, 10))}
              required
              className={selectClass}
              aria-label="Quit time — minute"
            >
              {MINUTES.map((m) => (
                <option key={m} value={pad2(m)}>
                  {pad2(m)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block min-w-0 space-y-2 pt-1">
          <span className="text-xs font-medium text-stone-600">
            Or pick a time
          </span>
          <input
            id="quit-time"
            type="time"
            value={quitTime}
            onChange={(e) => onTimeChange(e.target.value)}
            required
            step={60}
            className={pickerInputClass}
            aria-label="Quit time — clock picker"
          />
        </label>
      </div>
    </div>
  );
}
