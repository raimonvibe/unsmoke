"use client";
import { cardClass } from "@/lib/ui";

import {
  formatCountdown,
  formatProgressPercent,
  getAchievedMilestones,
  getElapsedPercent,
  getMilestoneProgress,
  getNextMilestone,
  getTimeUntilMilestone,
} from "@/lib/calculations";
import {
  getMilestoneCategoryIcon,
  getMilestonesForQuitData,
  getMilestoneSourceShortName,
  groupMilestonesByPhase,
  groupYearMilestonesByBand,
  MILESTONE_PHASE_LABELS,
  MILESTONE_PHASE_ORDER,
  RECOVERY_WINDOWS,
  usesSmokedTobacco,
  YEAR_BAND_LABELS,
} from "@/lib/milestones";
import { getHealthSource } from "@/lib/health-sources";
import type { Milestone, QuitData } from "@/lib/types";

interface HealthTimelineProps {
  quitData: QuitData;
  now: Date;
}

export function HealthTimeline({ quitData, now }: HealthTimelineProps) {
  const quitDate = new Date(quitData.quitDate);
  const milestones = getMilestonesForQuitData(quitData);
  const vapingOnly = !usesSmokedTobacco(quitData);
  const achieved = getAchievedMilestones(quitDate, now, milestones);
  const achievedIds = new Set(achieved.map((m) => m.id));
  const next = getNextMilestone(quitDate, now, milestones);
  const progressPct = getMilestoneProgress(quitDate, now, milestones);
  const phaseGroups = groupMilestonesByPhase(milestones);

  return (
    <section className="space-y-4">
      <div className={cardClass}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-sage-800 sm:text-xl">
              Health timeline
            </h2>
            <p className="mt-1 text-sm text-stone-500 sm:text-base">
              What typically happens in your body after quitting, from health
              agencies and research. For education, not a medical assessment.
            </p>
          </div>
          <div className="rounded-xl bg-sage-50 px-3 py-2 text-center">
            <p className="text-lg font-bold tabular-nums text-sage-700">
              {achieved.length}/{milestones.length}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-sage-600 xs:text-xs">
              reached
            </p>
          </div>
        </div>

        <div className="mt-4">
          <ProgressBar
            label="Overall progress"
            valueLabel={`${progressPct}%`}
            pct={progressPct}
          />
        </div>

        <div className="mt-5 space-y-3 rounded-xl bg-sage-50/60 p-3 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-sage-600">
            Recovery windows
          </p>
          {RECOVERY_WINDOWS.map((window) => {
            const pct = getElapsedPercent(quitDate, window.durationMs, now);
            const inWindow = milestones.filter(
              (m) => m.durationMs <= window.durationMs
            );
            const doneInWindow = inWindow.filter((m) =>
              achievedIds.has(m.id)
            ).length;
            return (
              <ProgressBar
                key={window.id}
                label={window.label}
                valueLabel={`${formatProgressPercent(pct)} · ${doneInWindow}/${inWindow.length} wins`}
                pct={pct}
              />
            );
          })}
        </div>

        {vapingOnly && (
          <p className="mt-4 rounded-xl border border-sky-100 bg-sky-50/70 p-3 text-xs leading-relaxed text-sky-900 sm:text-sm">
            You quit vaping, so this timeline shows nicotine-related changes
            only. Milestones about carbon monoxide, tar and long-term smoking
            risk come from smoking research and are hidden. Long-term data on
            quitting vaping is still limited.
          </p>
        )}

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
                <div className="mb-4">
                  <div className="mb-1.5 flex items-baseline justify-between gap-2">
                    <h3 className="text-sm font-semibold text-sage-800 sm:text-base">
                      {MILESTONE_PHASE_LABELS[phase]}
                    </h3>
                    <span className="shrink-0 text-xs tabular-nums text-stone-400">
                      {phaseDone}/{items.length}
                    </span>
                  </div>
                  <BarTrack pct={(phaseDone / items.length) * 100} />
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

function BarTrack({ pct, thin = false }: { pct: number; thin?: boolean }) {
  return (
    <div
      className={`${thin ? "h-1.5" : "h-2"} overflow-hidden rounded-full bg-sage-100`}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-sage-400 to-sage-600 transition-all duration-700"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  );
}

function ProgressBar({
  label,
  valueLabel,
  pct,
}: {
  label: string;
  valueLabel: string;
  pct: number;
}) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between gap-2 text-xs text-stone-500 sm:text-sm">
        <span>{label}</span>
        <span className="font-semibold tabular-nums text-sage-700">
          {valueLabel}
        </span>
      </div>
      <BarTrack pct={pct} />
    </div>
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
          />
        </li>
      ))}
    </ol>
  );
}

const SOURCE_BADGE_CLASSES: Record<string, string> = {
  CDC: "bg-sage-100 text-sage-800",
  WHO: "bg-sky-50 text-sky-800",
  NHS: "bg-blue-50 text-blue-800",
};

function MilestoneRow({
  milestone,
  done,
  isNext,
  quitDate,
  now,
}: {
  milestone: Milestone;
  done: boolean;
  isNext: boolean;
  quitDate: Date;
  now: Date;
}) {
  const source = getMilestoneSourceShortName(milestone.sourceId);
  const sourceUrl = getHealthSource(milestone.sourceId)?.url;
  const icon = getMilestoneCategoryIcon(milestone.category);
  const pct = getElapsedPercent(quitDate, milestone.durationMs, now);
  const reachedOn = new Date(quitDate.getTime() + milestone.durationMs);

  return (
    <div
      className={
        done
          ? "text-sage-800"
          : isNext
            ? "text-sage-700"
            : "text-stone-500"
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-base" aria-hidden>
          {icon}
        </span>
        <p className="text-sm font-semibold sm:text-base">{milestone.label}</p>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={getHealthSource(milestone.sourceId)?.name}
          className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide xs:text-xs ${
            SOURCE_BADGE_CLASSES[source] ?? "bg-stone-100 text-stone-700"
          }`}
        >
          {source}
        </a>
      </div>
      <p className="mt-0.5 text-sm leading-snug sm:text-base sm:leading-normal">
        {milestone.benefit}
      </p>
      {milestone.publishedTimeframe && (
        <p className="mt-1 text-[10px] text-stone-400 xs:text-xs">
          Published range: {milestone.publishedTimeframe}
        </p>
      )}
      {done ? (
        <p className="mt-1.5 text-xs font-medium text-sage-600">
          Reached {reachedOn.toLocaleDateString(undefined, { dateStyle: "medium" })}
        </p>
      ) : (
        <div className="mt-2">
          <BarTrack pct={pct} thin />
          <p
            className={`mt-1 flex justify-between gap-2 text-xs tabular-nums ${
              isNext ? "font-medium text-sage-700" : "text-stone-400"
            }`}
          >
            <span>{formatProgressPercent(pct)}</span>
            <span>
              In {formatCountdown(getTimeUntilMilestone(quitDate, milestone, now))}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
