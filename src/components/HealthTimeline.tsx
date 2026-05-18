"use client";
import { cardClass } from "@/lib/ui";

import {
  formatCountdown,
  getAchievedMilestones,
  getMilestoneProgress,
  getNextMilestone,
  getTimeUntilMilestone,
} from "@/lib/calculations";
import { CDC_BENEFITS_OVER_TIME, WHO_CESSATION } from "@/lib/health-sources";
import {
  getMilestoneCategoryIcon,
  getMilestoneSourceShortName,
  groupMilestonesByPhase,
  groupYearMilestonesByBand,
  MILESTONE_PHASE_LABELS,
  MILESTONE_PHASE_ORDER,
  MILESTONES,
  YEAR_BAND_LABELS,
} from "@/lib/milestones";
import type { Milestone } from "@/lib/types";

interface HealthTimelineProps {
  quitDate: Date;
  now: Date;
}

export function HealthTimeline({ quitDate, now }: HealthTimelineProps) {
  const achieved = getAchievedMilestones(quitDate, now);
  const achievedIds = new Set(achieved.map((m) => m.id));
  const next = getNextMilestone(quitDate, now);
  const progressPct = getMilestoneProgress(quitDate, now);
  const phaseGroups = groupMilestonesByPhase();

  return (
    <section className="space-y-4">
      <div className={cardClass}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-sage-800 sm:text-xl">
              Health timeline
            </h2>
            <p className="mt-1 text-sm text-stone-500 sm:text-base">
              Official CDC &amp; WHO recovery milestones — for education, not a
              medical assessment.
            </p>
          </div>
          <div className="rounded-xl bg-sage-50 px-3 py-2 text-center">
            <p className="text-lg font-bold tabular-nums text-sage-700">
              {achieved.length}/{MILESTONES.length}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-sage-600 xs:text-xs">
              reached
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs text-stone-500 sm:text-sm">
            <span>Overall progress</span>
            <span className="font-semibold text-sage-700">{progressPct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-sage-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sage-400 to-sage-600 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <p className="mt-3 text-xs text-stone-500 sm:text-sm">
          Sources:{" "}
          <a
            href={CDC_BENEFITS_OVER_TIME.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-sage-700 underline decoration-sage-300 underline-offset-2 hover:text-sage-900"
          >
            CDC
          </a>
          {" · "}
          <a
            href={WHO_CESSATION.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-sage-700 underline decoration-sage-300 underline-offset-2 hover:text-sage-900"
          >
            WHO
          </a>
          . Not affiliated with CDC or WHO.
        </p>

        {next && (
          <div className="mt-5 rounded-xl border-2 border-dashed border-sage-300 bg-gradient-to-br from-sage-50 to-white p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-sage-600">
              Up next
            </p>
            <div className="mt-2">
              <MilestoneRow
                milestone={next}
                done={false}
                isNext
                quitDate={quitDate}
                now={now}
                showCountdown
              />
            </div>
          </div>
        )}

        <div className="mt-8 space-y-8">
          {MILESTONE_PHASE_ORDER.map((phase) => {
            const items = phaseGroups.get(phase) ?? [];
            if (items.length === 0) return null;
            const phaseDone = items.filter((m) => achievedIds.has(m.id)).length;

            return (
              <div key={phase}>
                <div className="mb-4 flex items-baseline justify-between gap-2">
                  <h3 className="text-sm font-semibold text-sage-800 sm:text-base">
                    {MILESTONE_PHASE_LABELS[phase]}
                  </h3>
                  <span className="shrink-0 text-xs text-stone-400">
                    {phaseDone}/{items.length}
                  </span>
                </div>
                {phase === "years" ? (
                  <div className="space-y-6">
                    {YEAR_BAND_LABELS.map((band) => {
                      const bandItems =
                        groupYearMilestonesByBand(items).get(band.label) ?? [];
                      if (bandItems.length === 0) return null;
                      const bandDone = bandItems.filter((m) =>
                        achievedIds.has(m.id)
                      ).length;
                      return (
                        <div key={band.label}>
                          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-stone-500">
                            {band.label}
                            <span className="ml-2 normal-case text-stone-400">
                              {bandDone}/{bandItems.length}
                            </span>
                          </p>
                          <MilestoneList
                            items={bandItems}
                            achievedIds={achievedIds}
                            next={next}
                            quitDate={quitDate}
                            now={now}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <MilestoneList
                    items={items}
                    achievedIds={achievedIds}
                    next={next}
                    quitDate={quitDate}
                    now={now}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MilestoneList({
  items,
  achievedIds,
  next,
  quitDate,
  now,
}: {
  items: Milestone[];
  achievedIds: Set<string>;
  next: Milestone | null;
  quitDate: Date;
  now: Date;
}) {
  return (
    <ol className="relative space-y-0 border-l-2 border-sage-200 pl-5 sm:pl-6">
      {items.map((milestone) => (
        <li
          key={milestone.id}
          className={`relative pb-5 last:pb-0 sm:pb-6 ${
            achievedIds.has(milestone.id) ? "animate-fade-in" : ""
          }`}
        >
          <span
            className={`absolute -left-[1.4rem] flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-all duration-500 sm:-left-[1.65rem] sm:h-7 sm:w-7 sm:text-xs ${
              achievedIds.has(milestone.id)
                ? "border-sage-500 bg-sage-500 text-white"
                : next?.id === milestone.id
                  ? "border-sage-400 bg-sage-100 text-sage-700 ring-4 ring-sage-100"
                  : "border-sage-200 bg-cream text-stone-400"
            }`}
            aria-hidden
          >
            {achievedIds.has(milestone.id) ? "✓" : "·"}
          </span>
          <MilestoneRow
            milestone={milestone}
            done={achievedIds.has(milestone.id)}
            isNext={next?.id === milestone.id}
            quitDate={quitDate}
            now={now}
            showCountdown={next?.id === milestone.id}
          />
        </li>
      ))}
    </ol>
  );
}

function MilestoneRow({
  milestone,
  done,
  isNext,
  quitDate,
  now,
  showCountdown,
}: {
  milestone: Milestone;
  done: boolean;
  isNext: boolean;
  quitDate: Date;
  now: Date;
  showCountdown?: boolean;
}) {
  const source = getMilestoneSourceShortName(milestone.sourceId);
  const icon = getMilestoneCategoryIcon(milestone.category);

  return (
    <div
      className={
        done
          ? "text-sage-800"
          : isNext
            ? "text-sage-700"
            : "text-stone-400"
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-base" aria-hidden>
          {icon}
        </span>
        <p className="text-sm font-semibold sm:text-base">{milestone.label}</p>
        <span
          className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide xs:text-xs ${
            source === "WHO"
              ? "bg-sky-50 text-sky-800"
              : "bg-sage-100 text-sage-800"
          }`}
        >
          {source}
        </span>
      </div>
      <p className="mt-0.5 text-sm leading-snug sm:text-base sm:leading-normal">
        {milestone.benefit}
      </p>
      {milestone.publishedTimeframe && (
        <p className="mt-1 text-[10px] text-stone-400 xs:text-xs">
          Published range: {milestone.publishedTimeframe}
        </p>
      )}
      {showCountdown && !done && (
        <p className="mt-2 text-xs font-medium tabular-nums text-sage-700 sm:text-sm">
          In {formatCountdown(getTimeUntilMilestone(quitDate, milestone, now))}
        </p>
      )}
    </div>
  );
}
