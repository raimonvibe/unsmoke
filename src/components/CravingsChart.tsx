"use client";
import { cardClass } from "@/lib/ui";

import { formatChartDate } from "@/lib/stats";
import type { DailyCravingCount } from "@/lib/stats";

interface CravingsChartProps {
  data: DailyCravingCount[];
}

export function CravingsChart({ data }: CravingsChartProps) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className={cardClass}>
      <h3 className="mb-3 text-sm font-semibold text-sage-700 sm:mb-4 sm:text-base">
        Cravings — last 7 days
      </h3>
      <div className="-mx-1 overflow-x-auto pb-1 sm:mx-0 sm:overflow-visible">
        <div className="flex h-36 min-w-[280px] items-end justify-between gap-1 px-1 xs:min-w-0 xs:gap-2 sm:h-40 sm:gap-3 md:h-44">
          {data.map((d) => (
            <div
              key={d.date}
              className="flex min-w-[2rem] flex-1 flex-col items-center gap-1.5 sm:gap-2"
            >
              <span className="text-[10px] font-medium tabular-nums text-sage-700 xs:text-xs sm:text-sm">
                {d.count}
              </span>
              <div
                className="w-full max-w-[2rem] rounded-t-lg bg-sage-400 transition-all duration-500 sm:max-w-[2.5rem] md:max-w-[3rem]"
                style={{
                  height: `${(d.count / max) * 100}%`,
                  minHeight: d.count > 0 ? "8px" : "4px",
                }}
                title={`${d.count} cravings`}
              />
              <span className="w-full truncate text-center text-[9px] text-stone-500 xs:text-[10px] sm:text-xs">
                {formatChartDate(d.date)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
