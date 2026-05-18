"use client";

import { useState } from "react";
import { cardClass } from "@/lib/ui";
import {
  APP_DISCLAIMER,
  HEALTH_SOURCES,
  NICOTINE_DISCLAIMER,
  SAVINGS_DISCLAIMER,
} from "@/lib/health-sources";
import { MILESTONE_SOURCE } from "@/lib/milestones";

interface HealthSourcesPanelProps {
  /** Show savings + nicotine notes (dashboard) vs health-only */
  variant?: "full" | "health";
}

export function HealthSourcesPanel({ variant = "full" }: HealthSourcesPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className={`${cardClass} !p-4 sm:!p-5`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-sage-800 sm:text-base">
          Sources & disclaimer
        </span>
        <span className="shrink-0 text-sage-500" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div className="mt-4 space-y-4 border-t border-sage-100 pt-4 text-sm text-stone-600">
          <p className="leading-relaxed">{APP_DISCLAIMER}</p>

          {variant === "full" && (
            <>
              <p className="leading-relaxed">{SAVINGS_DISCLAIMER}</p>
              <p className="leading-relaxed">{NICOTINE_DISCLAIMER}</p>
            </>
          )}

          <div>
            <h3 className="mb-2 font-medium text-sage-800">
              Health timeline
            </h3>
            <p className="mb-2 leading-relaxed">
              Milestones follow the U.S. CDC table &quot;Health benefits of
              quitting smoking over time.&quot; We use a single representative
              day within each CDC range so the in-app countdown can progress
              (for example, &quot;several days&quot; is shown at 3 days).
            </p>
            <SourceLink source={MILESTONE_SOURCE} />
          </div>

          <div>
            <h3 className="mb-2 font-medium text-sage-800">
              Additional references
            </h3>
            <ul className="space-y-3">
              {HEALTH_SOURCES.filter((s) => s.id !== MILESTONE_SOURCE.id).map(
                (source) => (
                  <li key={source.id}>
                    <SourceLink source={source} />
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

function SourceLink({
  source,
}: {
  source: { name: string; url: string; note: string };
}) {
  return (
    <div>
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-sage-700 underline decoration-sage-300 underline-offset-2 hover:text-sage-900"
      >
        {source.name}
      </a>
      <p className="mt-0.5 text-xs leading-relaxed text-stone-500 sm:text-sm">
        {source.note}
      </p>
    </div>
  );
}
