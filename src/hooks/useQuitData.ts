"use client";

import { useCallback, useEffect, useState } from "react";
import { getQuitData, saveQuitData } from "@/lib/storage";
import type { QuitData } from "@/lib/types";

export function useQuitData() {
  const [data, setData] = useState<QuitData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setData(getQuitData());
    setLoaded(true);
  }, []);

  const save = useCallback((quitData: QuitData) => {
    saveQuitData(quitData);
    setData(quitData);
  }, []);

  return { data, loaded, save };
}
