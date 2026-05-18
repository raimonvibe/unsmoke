"use client";
import { cardClass } from "@/lib/ui";

import {
  formatCountdown,
  getAchievedMilestones,
  getNextMilestone,
  getTimeUntilMilestone,
} from "@/lib/calculations";
import { getHealthSource } from "@/lib/health-sources";
import { MILESTONES, MILESTONE_SOURCE } from "@/lib/milestones";
interface HealthTimelineProps {
  quitDate: Date;
  now: Date;
}

export function HealthTimeline({ quitDate, now }: HealthTimelineProps) {
  const achieved = getAchievedMilestones(quitDate, now);
  const achievedIds = new Set(achieved.map((m) => m.id));
  const next = getNextMilestone(quitDate, now);
  const primarySource = getHealthSource(MILESTONE_SOURCE.id);

  return (
    <section className="space-y-4">
      <div className={cardClass}>
        <h2 className="text-lg font-semibold text-sage-800 sm:text-xl">
          Health timeline
        </h2>
        <p className="mb-1 mt-1 text-sm text-stone-500 sm:text-base">
          Educational milestones from published U.S. CDC quit-smoking guidance
          — not a medical assessment of your health.
        </p>
        {primarySource && (
          <p className="text-xs text-stone-500 sm:text-sm">
            Based on{" "}
            <a
              href={primarySource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-sage-700 underline decoration-sage-300 underline-offset-2 hover:text-sage-900"
            >
              CDC: Benefits of quitting smoking
            </a>
            . Not affiliated with CDC or WHO.
          </p>
        )}

        {next && (
          <div className="mb-5 mt-5 rounded-xl border-2 border-dashed border-sage-300 bg-sage-50 p-3 sm:mb-6 sm:p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-sage-600">
              Next milestone
            </p>
            <p className="mt-1 text-sm font-medium text-sage-800 sm:text-base">
              {next.benefit}
            </p>
            <p className="mt-2 flex flex-wrap gap-x-1 text-xs text-stone-600 sm:text-sm">
              <span className="font-medium">{next.label}</span>
              {next.publishedTimeframe && (
                <>
                  <span aria-hidden>·</span>
                  <span className="text-stone-500">{next.publishedTimeframe}</span>
                </>
              )}
              <span aria-hidden>·</span>
              <span className="tabular-nums text-sage-700">
                {formatCountdown(getTimeUntilMilestone(quitDate, next, now))}
              </span>
            </p>
          </div>
        )}

        <ol className="relative mt-6 space-y-0 border-l-2 border-sage-200 pl-5 sm:pl-6 md:pl-7">
          {MILESTONES.map((milestone) => {
            const done = achievedIds.has(milestone.id);
            const isNext = next?.id === milestone.id;
            return (
              <li
                key={milestone.id}
                className={`relative pb-6 last:pb-0 sm:pb-8 ${done ? "animate-fade-in" : ""}`}
              >
                <span
                  className={`absolute -left-[1.4rem] flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-all duration-500 sm:-left-[1.65rem] sm:h-7 sm:w-7 sm:text-xs ${
                    done
                      ? "border-sage-500 bg-sage-500 text-white"
                      : isNext
                        ? "border-sage-400 bg-sage-100 text-sage-700 ring-4 ring-sage-100"
                        : "border-sage-200 bg-cream text-stone-400"
                  }`}
                  aria-hidden
                >
                  {done ? "✓" : "·"}
                </span>
                <div
                  className={
                    done
                      ? "text-sage-800"
                      : isNext
                        ? "text-sage-700"
                        : "text-stone-400"
                  }
                >
                  <p className="text-sm font-semibold sm:text-base">
                    {milestone.label}
                  </p>
                  <p className="mt-0.5 text-sm leading-snug sm:text-base sm:leading-normal">
                    {milestone.benefit}
                  </p>
                  {milestone.publishedTimeframe && (
                    <p className="mt-1 text-[10px] text-stone-400 xs:text-xs">
                      Source timeframe: {milestone.publishedTimeframe}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
