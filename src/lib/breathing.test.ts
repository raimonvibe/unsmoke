import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BREATHING_CYCLE_MS, getBreathingFrame } from "./breathing";

describe("getBreathingFrame", () => {
  it("grows on inhale and shrinks on exhale within a cycle", () => {
    const inhaleStart = getBreathingFrame(0);
    const inhaleEnd = getBreathingFrame(3999);
    const exhaleEnd = getBreathingFrame(8000 + 3999);

    assert.equal(inhaleStart.phase.name, "Inhale");
    assert.ok(inhaleEnd.scale > inhaleStart.scale);
    assert.equal(exhaleEnd.phase.name, "Exhale");
    assert.ok(exhaleEnd.scale < getBreathingFrame(8000).scale);
  });

  it("loops every 12 seconds", () => {
    const a = getBreathingFrame(1000);
    const b = getBreathingFrame(1000 + BREATHING_CYCLE_MS);
    assert.equal(a.phase.name, b.phase.name);
    assert.equal(a.phaseIndex, b.phaseIndex);
  });
});

// re-export scale for test - actually scaleForPhase is not exported
// test only through getBreathingFrame
