"use client";

import type { UsagePreset } from "@/lib/usage-pickers";
import {
  clampValue,
  formatPickerNumber,
  presetSelectValue,
  roundToStep,
} from "@/lib/usage-pickers";
import { inputClass, selectClass } from "@/lib/ui";

interface ValuePickerProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  presets: readonly UsagePreset[];
  min: number;
  max: number;
  step: number;
  unit?: string;
  required?: boolean;
  hint?: string;
  pickerHint?: string;
  optional?: boolean;
}

export function ValuePicker({
  id,
  label,
  value,
  onChange,
  presets,
  min,
  max,
  step,
  unit,
  required,
  hint,
  pickerHint = "Pick a common amount, tap − / +, or type an exact value",
  optional = false,
}: ValuePickerProps) {
  const parsed = parseFloat(value);
  const hasValue = value.trim() !== "" && Number.isFinite(parsed);
  const num = hasValue ? parsed : min;

  function setNumber(next: number) {
    const clamped = clampValue(next, min, max);
    onChange(formatPickerNumber(clamped, step));
  }

  function adjust(delta: number) {
    if (!hasValue && optional) {
      setNumber(min);
      return;
    }
    setNumber(roundToStep(num + delta, step));
  }

  const selectValue = presetSelectValue(value, presets);
  const displayUnit = unit ? ` ${unit}` : "";
  const hasEmptyPreset = presets.some((p) => p.value === "");

  return (
    <div className="space-y-2" role="group" aria-labelledby={`${id}-label`}>
      <span id={`${id}-label`} className="text-sm font-medium text-sage-700">
        {label}
      </span>
      {hint && (
        <span className="block text-xs text-stone-500 sm:text-sm">{hint}</span>
      )}
      <p className="text-xs text-stone-500">{pickerHint}</p>

      <label className="block min-w-0 space-y-1">
        <span className="sr-only">{label} — quick pick</span>
        <select
          id={`${id}-preset`}
          value={selectValue}
          onChange={(e) => {
            const next = e.target.value;
            if (next !== "__custom__") onChange(next);
          }}
          className={selectClass}
          aria-label={`${label} — quick pick`}
        >
          {presets.map((p) => (
            <option
              key={p.value === "" ? "empty" : p.value}
              value={p.value === "" ? "" : p.value}
            >
              {p.label}
            </option>
          ))}
          {!hasEmptyPreset && (
            <option value="__custom__">Custom amount…</option>
          )}
        </select>
      </label>

      <div className="flex items-stretch gap-2">
        <button
          type="button"
          onClick={() => adjust(-step)}
          disabled={hasValue && num <= min}
          className="flex min-h-[3rem] min-w-[3rem] shrink-0 items-center justify-center rounded-xl border-2 border-sage-200 bg-white text-xl font-medium text-sage-700 transition-colors hover:border-sage-400 hover:bg-sage-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <div
          className="flex min-h-[3rem] flex-1 flex-col items-center justify-center rounded-xl border-2 border-sage-200 bg-sage-50/80 px-2"
          aria-live="polite"
          aria-atomic={true}
        >
          <span className="text-lg font-semibold tabular-nums text-sage-800">
            {hasValue ? `${formatPickerNumber(num, step)}${displayUnit}` : "—"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => adjust(step)}
          disabled={hasValue && num >= max}
          className="flex min-h-[3rem] min-w-[3rem] shrink-0 items-center justify-center rounded-xl border-2 border-sage-200 bg-white text-xl font-medium text-sage-700 transition-colors hover:border-sage-400 hover:bg-sage-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>

      <label className="block min-w-0 space-y-1">
        <span className="text-xs font-medium text-stone-600">Exact value</span>
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          step={step}
          inputMode={step >= 1 ? "numeric" : "decimal"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={inputClass}
          placeholder={optional ? "Leave blank if unknown" : undefined}
          aria-label={`${label} — exact value`}
        />
      </label>
    </div>
  );
}
