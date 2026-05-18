"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BREATHING_TOTAL_MS,
  getBreathingFrame,
  secondsLeftInPhase,
} from "@/lib/breathing";
import { btnPrimaryClass } from "@/lib/ui";

const RING_R = 46;
const RING_C = 2 * Math.PI * RING_R;

interface BreathingExerciseProps {
  message: string;
  onComplete: () => void;
  onClose: () => void;
}

export function BreathingExercise({
  message,
  onComplete,
  onClose,
}: BreathingExerciseProps) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const startRef = useRef(performance.now());
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onComplete();
  }, [onComplete]);

  const close = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onClose();
  }, [onClose]);

  useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      setElapsedMs(elapsed);
      if (elapsed >= BREATHING_TOTAL_MS) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [finish]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const frame = getBreathingFrame(elapsedMs);
  const remainingSec = Math.max(
    0,
    Math.ceil((BREATHING_TOTAL_MS - elapsedMs) / 1000)
  );
  const phaseSec = secondsLeftInPhase(frame);
  const ringOffset = RING_C * (1 - frame.phaseProgress);

  const phaseColor =
    frame.phase.name === "Inhale"
      ? "bg-sage-400"
      : frame.phase.name === "Hold"
        ? "bg-sage-500"
        : "bg-sage-600";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-sage-900/60 p-4 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="breathing-title"
    >
      <div className="relative w-full max-w-sm animate-scale-in rounded-3xl bg-white p-6 text-center shadow-xl sm:max-w-md sm:p-8 md:p-10">
        <button
          type="button"
          onClick={close}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-sage-50 hover:text-stone-600 sm:right-4 sm:top-4"
          aria-label="Close breathing exercise"
        >
          <span className="text-2xl leading-none" aria-hidden>
            ×
          </span>
        </button>

        <p
          id="breathing-title"
          className="text-sm font-medium text-sage-600 sm:text-base"
        >
          Breathe with me
        </p>

        <div className="relative mx-auto mt-6 h-36 w-36 sm:mt-8 sm:h-44 sm:w-44 md:h-48 md:w-48">
          <svg
            className="absolute inset-0 h-full w-full -rotate-90 text-sage-200"
            viewBox="0 0 100 100"
            aria-hidden
          >
            <circle
              cx="50"
              cy="50"
              r={RING_R}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <circle
              cx="50"
              cy="50"
              r={RING_R}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="text-sage-500 transition-[stroke-dashoffset] duration-75 ease-linear"
              strokeDasharray={RING_C}
              strokeDashoffset={ringOffset}
            />
          </svg>

          <div
            className={`absolute inset-4 flex items-center justify-center rounded-full ${phaseColor} text-white shadow-lg will-change-transform`}
            style={{ transform: `scale(${frame.scale})` }}
          >
            <div>
              <p className="text-xl font-semibold sm:text-2xl">
                {frame.phase.name}
              </p>
              <p className="mt-1 text-sm opacity-90">{phaseSec}s</p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-base font-medium text-sage-800 text-balance sm:mt-8 sm:text-lg">
          {message}
        </p>
        <p className="mt-3 text-sm text-stone-500 sm:mt-4">
          {remainingSec}s remaining
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sage-100 sm:mt-4">
          <div
            className="h-full bg-sage-500 transition-[width] duration-75 ease-linear"
            style={{ width: `${frame.totalProgress * 100}%` }}
          />
        </div>

        <button
          type="button"
          onClick={close}
          className={`${btnPrimaryClass} mt-5 w-full sm:mt-6`}
        >
          I&apos;m done
        </button>
      </div>
    </div>
  );
}
