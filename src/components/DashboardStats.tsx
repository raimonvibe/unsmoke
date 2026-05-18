"use client";
import { cardClass, statGridClass } from "@/lib/ui";

import {
  formatCurrency,
  getAchievedMilestones,
  getLatestAchievedMilestone,
  getMilestoneProgress,
  getNextMilestone,
  getTimeSinceQuit,
} from "@/lib/calculations";
import {
  getMilestoneCategoryIcon,
  getMilestoneSourceShortName,
  MILESTONES,
} from "@/lib/milestones";
import {
  getConsumptionStats,
  getDailyCost,
  getTotalMoneySaved,
} from "@/lib/usage";
import type { QuitData } from "@/lib/types";

interface DashboardStatsProps {
  quitData: QuitData;
  now: Date;
}

export function DashboardStats({ quitData, now }: DashboardStatsProps) {
  const quitDate = new Date(quitData.quitDate);
  const time = getTimeSinceQuit(quitDate, now);
  const moneySaved = getTotalMoneySaved(quitData, quitDate, now);
  const milestonePct = Math.min(
    100,
    Math.max(0, getMilestoneProgress(quitDate, now))
  );
  const achievedCount = getAchievedMilestones(quitDate, now).length;
  const latestWin = getLatestAchievedMilestone(quitDate, now);
  const nextMilestone = getNextMilestone(quitDate, now);
  const consumptionStats = getConsumptionStats(quitData, quitDate, now);
  const hasEstimatedTobaccoNicotine = consumptionStats.some(
    (s) => s.hint === "Estimated from blend"
  );

  return (
    <section className="space-y-4 sm:space-y-5">
      <div className={`${cardClass} text-center`}>
        <p className="text-sm font-medium text-sage-600 sm:text-base">
          Smoke-free for
        </p>
        <div className="mt-3 grid grid-cols-4 gap-1.5 xs:gap-2 sm:mt-4 sm:gap-3">
          {[
            { value: time.days, label: "days" },
            { value: time.hours, label: "hrs" },
            { value: time.minutes, label: "min" },
            { value: time.seconds, label: "sec" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="rounded-lg bg-sage-50/90 px-1 py-2.5 xs:rounded-xl xs:px-2 xs:py-3 sm:py-4"
            >
              <span className="block text-xl font-bold tabular-nums leading-none text-sage-800 xs:text-2xl sm:text-3xl md:text-4xl">
                {value}
              </span>
              <span className="mt-1 block text-[10px] text-stone-500 xs:text-xs">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={statGridClass}>
        <StatCard
          label="Money saved"
          value={formatCurrency(moneySaved)}
          icon="💰"
          hint={`${formatCurrency(getDailyCost(quitData))}/day not spent`}
          className="col-span-2"
        />
        {consumptionStats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            hint={stat.hint}
          />
        ))}
      </div>

      {hasEstimatedTobaccoNicotine && (
        <p className="px-1 text-center text-xs text-stone-500 sm:text-sm">
          Nicotine figures marked &quot;est.&quot; are approximate when not on
          your pack label.
        </p>
      )}

      {latestWin && (
        <div className="rounded-2xl border border-sage-200 bg-gradient-to-br from-sage-50 to-white p-4 shadow-sm sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-sage-600">
            Latest health win
          </p>
          <div className="mt-2 flex items-start gap-3">
            <span className="text-2xl" aria-hidden>
              {getMilestoneCategoryIcon(latestWin.category)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sage-800 sm:text-base">
                {latestWin.benefit}
              </p>
              <p className="mt-1 text-xs text-stone-500 sm:text-sm">
                {latestWin.label} ·{" "}
                {getMilestoneSourceShortName(latestWin.sourceId)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={cardClass}>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium text-sage-700 sm:text-base">
            Health milestones
          </span>
          <span className="text-sm font-bold text-sage-600 sm:text-base">
            {achievedCount}/{MILESTONES.length}
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-sage-100 sm:h-3">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sage-400 to-sage-600 transition-all duration-1000 ease-out"
            style={{ width: `${milestonePct}%` }}
          />
        </div>
        {nextMilestone && (
          <p className="mt-2 text-xs text-stone-600 sm:text-sm">
            <span className="font-medium text-sage-700">Up next:</span>{" "}
            {nextMilestone.benefit}
            <span className="text-stone-400"> · {nextMilestone.label}</span>
          </p>
        )}
        <p className="mt-2 text-xs text-stone-500 sm:text-sm">
          CDC &amp; WHO recovery milestones reached in this app — not a medical
          score or personal health reading
        </p>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  icon,
  hint,
  className = "",
}: {
  label: string;
  value: string;
  icon: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={`${cardClass} flex min-h-[6.5rem] flex-col items-center justify-center px-2 py-3 text-center sm:min-h-[7.5rem] sm:px-3 ${className}`}
    >
      <span className="text-xl sm:text-2xl" aria-hidden>
        {icon}
      </span>
      <span className="mt-1.5 max-w-full break-words text-base font-bold leading-tight text-sage-800 sm:mt-2 sm:text-lg">
        {value}
      </span>
      <span className="mt-1 line-clamp-2 text-[10px] leading-snug text-stone-500 xs:text-xs">
        {label}
      </span>
      {hint && (
        <span className="mt-0.5 line-clamp-2 text-[9px] leading-tight text-stone-400 xs:text-[10px]">
          {hint}
        </span>
      )}
    </div>
  );
}
