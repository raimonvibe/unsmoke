"use client";

import { useQuitData } from "@/hooks/useQuitData";
import { pageContainerNarrowClass } from "@/lib/ui";
import { clearAllData } from "@/lib/storage";
import { Navigation } from "./Navigation";
import { Onboarding } from "./Onboarding";
import { Dashboard } from "./Dashboard";

export function AppShell({ children }: { children?: React.ReactNode }) {
  const { data, loaded, save } = useQuitData();

  if (!loaded) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center px-4">
        <p className="text-sage-600">Loading…</p>
      </div>
    );
  }

  if (!data) {
    return <Onboarding onComplete={save} />;
  }

  if (children) {
    return (
      <div className="min-h-[100dvh]">
        {children}
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh]">
      <Dashboard quitData={data} />
      <footer
        className={`${pageContainerNarrowClass} !pt-0 !pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] text-center`}
      >
        <button
          type="button"
          onClick={() => {
            if (confirm("Reset all data? This cannot be undone.")) {
              clearAllData();
              window.location.reload();
            }
          }}
          className="min-h-[2.75rem] px-4 text-xs text-stone-400 hover:text-stone-600 sm:text-sm"
        >
          Reset journey
        </button>
      </footer>
      <Navigation />
    </div>
  );
}
