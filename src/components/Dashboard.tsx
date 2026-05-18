"use client";

import type { QuitData } from "@/lib/types";
import { pageContainerClass, sectionTitleClass } from "@/lib/ui";
import { useNow } from "@/hooks/useNow";
import { DashboardStats } from "./DashboardStats";
import { HealthTimeline } from "./HealthTimeline";
import { CravingButton } from "./CravingButton";
import { HealthSourcesPanel } from "./HealthSourcesPanel";

interface DashboardProps {
  quitData: QuitData;
}

export function Dashboard({ quitData }: DashboardProps) {
  const now = useNow();
  const quitDate = new Date(quitData.quitDate);

  return (
    <div className={`${pageContainerClass} space-y-5 sm:space-y-6 md:space-y-8`}>
      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-sage-500">
          Unsmoke
        </p>
        <h1 className={`mt-1 ${sectionTitleClass}`}>Your journey</h1>
        <p className="mt-1 text-sm text-stone-500 sm:text-base">
          You are doing great
        </p>
      </header>

      <DashboardStats quitData={quitData} now={now} />
      <CravingButton />
      <HealthTimeline quitDate={quitDate} now={now} />
      <HealthSourcesPanel variant="full" />
    </div>
  );
}
