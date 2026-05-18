"use client";

import { AppShell } from "@/components/AppShell";
import { StatsView } from "@/components/StatsView";
import { useQuitData } from "@/hooks/useQuitData";

export default function StatsPage() {
  const { data, loaded } = useQuitData();

  if (!loaded || !data) {
    return <AppShell />;
  }

  return (
    <AppShell>
      <StatsView quitData={data} />
    </AppShell>
  );
}
