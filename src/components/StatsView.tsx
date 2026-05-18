"use client";
import {
  cardClass,
  pageContainerClass,
  sectionTitleClass,
  statGridClass,
} from "@/lib/ui";

import { useCallback, useEffect, useState } from "react";
import { formatCurrency } from "@/lib/calculations";
import { getCravingLog } from "@/lib/storage";
import { getStatsPageData } from "@/lib/stats-page";
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

  const refreshCravings = useCallback(() => {
    setCravings(getCravingLog());
  }, []);

  useEffect(() => {
    refreshCravings();
    window.addEventListener("focus", refreshCravings);
    return () => window.removeEventListener("focus", refreshCravings);
  }, [refreshCravings]);

  const stats = getStatsPageData(quitData, cravings, now);

  return (
    <div className={`${pageContainerClass} space-y-5 sm:space-y-6 md:space-y-8`}>
      <header>
        <h1 className={sectionTitleClass}>Your stats</h1>
        <p className="mt-1 text-sm text-stone-500 sm:text-base">
          Progress at a glance — same calculations as your dashboard
        </p>
      </header>

      <section className={statGridClass}>
        <div className={`${cardClass} text-center`}>
          <p className="text-2xl font-bold tabular-nums text-sage-700 sm:text-3xl">
            {formatCurrency(stats.moneySaved)}
          </p>
          <p className="mt-1 text-xs text-stone-500 sm:text-sm">Money saved</p>
          <p className="mt-0.5 text-[10px] text-stone-400">
            {formatCurrency(stats.dailyCost)}/day not spent
          </p>
        </div>
        <div className={`${cardClass} text-center`}>
          <p className="text-2xl font-bold tabular-nums text-sage-700 sm:text-3xl">
            {stats.totalCravingsLogged}
          </p>
          <p className="mt-1 text-xs text-stone-500 sm:text-sm">
            Total cravings logged
          </p>
        </div>
        <div className={`${cardClass} text-center`}>
          <p className="text-2xl font-bold tabular-nums text-sage-700 sm:text-3xl">
            {stats.smokeFreeDays}
          </p>
          <p className="mt-1 text-xs text-stone-500 sm:text-sm">
            {stats.smokeFreeDays === 1 ? "Day" : "Days"} smoke-free
          </p>
        </div>
      </section>

      {stats.consumptionStats.length > 0 && (
        <section className={statGridClass}>
          {stats.consumptionStats.map((stat) => (
            <div
              key={stat.label}
              className={`${cardClass} flex min-h-[5.5rem] flex-col items-center justify-center px-2 py-3 text-center`}
            >
              <span className="text-xl" aria-hidden>
                {stat.icon}
              </span>
              <span className="mt-1 text-base font-bold text-sage-800">
                {stat.value}
              </span>
              <span className="mt-0.5 text-[10px] text-stone-500 xs:text-xs">
                {stat.label}
              </span>
              {stat.hint && (
                <span className="mt-0.5 text-[9px] text-stone-400">
                  {stat.hint}
                </span>
              )}
            </div>
          ))}
        </section>
      )}

      <CravingsChart data={stats.last7DaysCravings} />

      <section className={cardClass}>
        <h3 className="mb-4 text-sm font-semibold text-sage-700 sm:text-base">
          Milestones achieved ({stats.milestonesAchieved.length})
        </h3>
        {stats.milestonesAchieved.length === 0 ? (
          <p className="text-sm text-stone-500 sm:text-base">
            Keep going — your first milestone is just ahead.
          </p>
        ) : (
          <ul className="space-y-3 sm:space-y-4">
            {stats.milestonesAchieved.map((m) => (
              <li
                key={m.id}
                className="flex gap-3 text-sm animate-fade-in sm:text-base"
              >
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
