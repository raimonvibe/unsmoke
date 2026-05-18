"use client";

import { useState } from "react";
import { useQuitData } from "@/hooks/useQuitData";
import { pageContainerClass } from "@/lib/ui";
import { clearAllData } from "@/lib/storage";
import { LocalDataNotice } from "./LocalDataNotice";
import { Navigation } from "./Navigation";
import { Onboarding } from "./Onboarding";
import { Dashboard } from "./Dashboard";

export function AppShell({ children }: { children?: React.ReactNode }) {
  const { data, loaded, save, clear } = useQuitData();
  const [editing, setEditing] = useState(false);

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

  if (editing) {
    return (
      <Onboarding
        initialData={data}
        onComplete={(updated) => {
          save(updated);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  if (children) {
    return (
      <div className="min-h-[100dvh]">
        <main className={pageContainerClass}>{children}</main>
        <Navigation />
      </div>
    );
  }

  function handleRelapse() {
    if (
      !confirm(
        "That's okay — quitting often takes more than one try. Start fresh with a new setup? Your journey stats will reset."
      )
    ) {
      return;
    }
    clear();
  }

  return (
    <div className="min-h-[100dvh]">
      <main className={pageContainerClass}>
        <Dashboard
          quitData={data}
          onEdit={() => setEditing(true)}
          onRelapse={handleRelapse}
        />
        <footer className="mt-6 space-y-3 pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] text-center">
          <LocalDataNotice className="mx-auto max-w-md px-2" />
          <button
            type="button"
            onClick={() => {
              if (confirm("Reset all data including craving log? This cannot be undone.")) {
                clearAllData();
                window.location.reload();
              }
            }}
            className="min-h-[2.75rem] px-4 text-xs text-stone-400 hover:text-stone-600 sm:text-sm"
          >
            Reset all data
          </button>
        </footer>
      </main>
      <Navigation />
    </div>
  );
}
