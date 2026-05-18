"use client";

import { LocalDataNotice } from "@/components/LocalDataNotice";
import { btnSecondaryClass, cardClass } from "@/lib/ui";

interface JourneyActionsProps {
  onEdit: () => void;
  onRelapse: () => void;
}

export function JourneyActions({ onEdit, onRelapse }: JourneyActionsProps) {
  return (
    <section className={`${cardClass} space-y-3`} aria-label="Journey options">
      <h2 className="text-sm font-semibold text-sage-800 sm:text-base">
        Need to change something?
      </h2>
      <p className="text-xs leading-relaxed text-stone-500 sm:text-sm">
        You can update your quit date or usage details anytime. If things
        didn&apos;t work out, that&apos;s okay — many people try more than once.
      </p>
      <button
        type="button"
        onClick={onEdit}
        className={`${btnSecondaryClass} w-full`}
      >
        Update my details
      </button>
      <button
        type="button"
        onClick={onRelapse}
        className="w-full min-h-[2.75rem] rounded-xl px-4 py-2.5 text-sm font-medium text-stone-500 transition-colors hover:bg-sage-50 hover:text-sage-800 sm:text-base"
      >
        It didn&apos;t work out — start over
      </button>
      <LocalDataNotice className="border-t border-sage-100 pt-3" />
    </section>
  );
}
