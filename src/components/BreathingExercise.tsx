"use client";

import { useEffect, useState } from "react";

const PHASES = [
  { name: "Inhale", duration: 4, color: "bg-sage-400" },
  { name: "Hold", duration: 4, color: "bg-sage-500" },
  { name: "Exhale", duration: 4, color: "bg-sage-600" },
] as const;

const TOTAL_SECONDS = 60;

interface BreathingExerciseProps {
  message: string;
  onComplete: () => void;
}

export function BreathingExercise({ message, onComplete }: BreathingExerciseProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (elapsed >= TOTAL_SECONDS) {
      onComplete();
      return;
    }
    const t = setTimeout(() => setElapsed((e) => e + 1), 1000);
    return () => clearTimeout(t);
  }, [elapsed, onComplete]);

  const cycleLen = PHASES.reduce((a, p) => a + p.duration, 0);
  const pos = elapsed % cycleLen;
  let acc = 0;
  let phase: (typeof PHASES)[number] = PHASES[0];
  let phaseElapsed = 0;
  for (const p of PHASES) {
    if (pos < acc + p.duration) {
      phase = p;
      phaseElapsed = pos - acc;
      break;
    }
    acc += p.duration;
  }

  const scale =
    0.85 +
    (phase.name === "Inhale"
      ? (phaseElapsed / phase.duration) * 0.25
      : phase.name === "Exhale"
        ? (1 - phaseElapsed / phase.duration) * 0.25
        : 0.25);
  const remaining = TOTAL_SECONDS - elapsed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sage-900/60 p-4 backdrop-blur-sm sm:p-6">
      <div className="w-full max-w-sm animate-scale-in rounded-3xl bg-white p-6 text-center shadow-xl sm:max-w-md sm:p-8 md:p-10">
        <p className="text-sm font-medium text-sage-600 sm:text-base">
          Breathe with me
        </p>
        <div
          className={`mx-auto mt-6 flex h-32 w-32 items-center justify-center rounded-full sm:mt-8 sm:h-40 sm:w-40 md:h-44 md:w-44 ${phase.color} text-white shadow-lg transition-transform duration-1000 ease-in-out`}
          style={{ transform: `scale(${scale})` }}
        >
          <div>
            <p className="text-xl font-semibold sm:text-2xl">{phase.name}</p>
            <p className="mt-1 text-sm opacity-90">
              {phase.duration - phaseElapsed}s
            </p>
          </div>
        </div>
        <p className="mt-6 text-base font-medium text-sage-800 text-balance sm:mt-8 sm:text-lg">
          {message}
        </p>
        <p className="mt-3 text-sm text-stone-500 sm:mt-4">
          {remaining}s remaining
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sage-100 sm:mt-4">
          <div
            className="h-full bg-sage-500 transition-all duration-1000"
            style={{ width: `${(elapsed / TOTAL_SECONDS) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
