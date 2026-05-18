"use client";

import { useState } from "react";
import { getRandomMessage } from "@/lib/messages";
import { logCraving } from "@/lib/storage";
import { BreathingExercise } from "./BreathingExercise";

interface CravingButtonProps {
  onCravingLogged?: () => void;
}

export function CravingButton({ onCravingLogged }: CravingButtonProps) {
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState("");

  function handleClick() {
    logCraving();
    onCravingLogged?.();
    setMessage(getRandomMessage());
    setActive(true);
  }

  if (active) {
    return (
      <BreathingExercise
        message={message}
        onComplete={() => setActive(false)}
        onClose={() => setActive(false)}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full min-h-[3.25rem] rounded-2xl border-2 border-sage-300 bg-gradient-to-br from-sage-50 to-warm-50 px-4 py-5 text-base font-semibold text-sage-800 shadow-sm transition-all hover:border-sage-400 hover:shadow-md active:scale-[0.98] animate-pulse-soft sm:px-6 sm:py-6 sm:text-lg"
    >
      I have a craving right now
    </button>
  );
}
