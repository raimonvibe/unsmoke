export const BREATHING_PHASES = [
  { name: "Inhale", durationMs: 4000 },
  { name: "Hold", durationMs: 4000 },
  { name: "Exhale", durationMs: 4000 },
] as const;

export const BREATHING_CYCLE_MS = BREATHING_PHASES.reduce(
  (sum, p) => sum + p.durationMs,
  0
);

export const BREATHING_TOTAL_MS = 60_000;

export type BreathingPhaseName = (typeof BREATHING_PHASES)[number]["name"];

export interface BreathingFrame {
  phase: (typeof BREATHING_PHASES)[number];
  phaseIndex: number;
  phaseElapsedMs: number;
  phaseProgress: number;
  scale: number;
  totalProgress: number;
}

export function getBreathingFrame(elapsedMs: number): BreathingFrame {
  const capped = Math.max(0, elapsedMs);
  const pos = capped % BREATHING_CYCLE_MS;
  let acc = 0;

  for (let i = 0; i < BREATHING_PHASES.length; i++) {
    const phase = BREATHING_PHASES[i];
    if (pos < acc + phase.durationMs) {
      const phaseElapsedMs = pos - acc;
      const phaseProgress = phaseElapsedMs / phase.durationMs;
      const scale = scaleForPhase(phase.name, phaseProgress);
      return {
        phase,
        phaseIndex: i,
        phaseElapsedMs,
        phaseProgress,
        scale,
        totalProgress: Math.min(1, capped / BREATHING_TOTAL_MS),
      };
    }
    acc += phase.durationMs;
  }

  const last = BREATHING_PHASES[BREATHING_PHASES.length - 1];
  return {
    phase: last,
    phaseIndex: BREATHING_PHASES.length - 1,
    phaseElapsedMs: last.durationMs,
    phaseProgress: 1,
    scale: scaleForPhase(last.name, 1),
    totalProgress: Math.min(1, capped / BREATHING_TOTAL_MS),
  };
}

function scaleForPhase(name: BreathingPhaseName, t: number): number {
  const p = Math.min(1, Math.max(0, t));
  if (name === "Inhale") return 0.88 + p * 0.22;
  if (name === "Exhale") return 1.1 - p * 0.22;
  return 1.1;
}

export function secondsLeftInPhase(frame: BreathingFrame): number {
  return Math.max(
    0,
    Math.ceil((frame.phase.durationMs - frame.phaseElapsedMs) / 1000)
  );
}
