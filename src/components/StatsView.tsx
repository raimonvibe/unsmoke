"use client";
import { cardClass, pageContainerClass, sectionTitleClass, statGridClass } from "@/lib/ui";

import { useEffect, useState } from "react";
import { getAchievedMilestones } from "@/lib/calculations";
import { getCravingLog } from "@/lib/storage";
import { getLast7DaysCravings, getSmokeFreeStreakDays } from "@/lib/stats";
import type { QuitData } from "@/lib/types";
import { useNow } from "@/hooks/useNow";
import { CravingsChart } from "./CravingsChart";
import { HealthSourcesPanel } from "./HealthSourcesPanel";

interface StatsViewProps {
  quitData: QuitData;
}

export function StatsView({ quitData }: StatsViewProps) {
  const now = useNow();
  const [cravings, setCravings] = useState<string[]>([]);

  useEffect(() => {
    setCravings(getCravingLog());
  }, []);

  const quitDate = new Date(quitData.quitDate);
  const achieved = getAchievedMilestones(quitDate, now);
  const chartData = getLast7DaysCravings(cravings);
  const streak = getSmokeFreeStreakDays(quitDate, now);

  return (
    <div className={`${pageContainerClass} space-y-5 sm:space-y-6 md:space-y-8`}>
      <header>
        <h1 className={sectionTitleClass}>Your stats</h1>
        <p className="mt-1 text-sm text-stone-500 sm:text-base">
          Progress at a glance
        </p>
      </header>

      <div className={`${statGridClass} md:max-w-xl`}>
        <div className={`${cardClass} text-center`}>
          <p className="text-2xl font-bold tabular-nums text-sage-700 sm:text-3xl md:text-4xl">
            {cravings.length}
          </p>
          <p className="mt-1 text-xs text-stone-500 sm:text-sm">
            Total cravings logged
          </p>
        </div>
        <div className={`${cardClass} text-center`}>
          <p className="text-2xl font-bold tabular-nums text-sage-700 sm:text-3xl md:text-4xl">
            {streak}
          </p>
          <p className="mt-1 text-xs text-stone-500 sm:text-sm">
            Day smoke-free streak
          </p>
        </div>
      </div>

      <CravingsChart data={chartData} />

      <section className={cardClass}>
        <h3 className="mb-4 text-sm font-semibold text-sage-700 sm:text-base">
          Milestones achieved ({achieved.length})
        </h3>
        {achieved.length === 0 ? (
          <p className="text-sm text-stone-500 sm:text-base">
            Keep going — your first milestone is just ahead.
          </p>
        ) : (
          <ul className="space-y-3 sm:space-y-4">
            {achieved.map((m) => (
              <li key={m.id} className="flex gap-3 text-sm animate-fade-in sm:text-base">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-500 text-xs text-white sm:h-7 sm:w-7">
                  ✓
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-sage-800">{m.label}</p>
                  <p className="text-stone-500">{m.benefit}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-xs text-stone-500 sm:text-sm">
          Milestones follow the CDC timeline on Home. Open Sources & disclaimer
          for references.
        </p>
      </section>

      <HealthSourcesPanel variant="health" />
    </div>
  );
}
