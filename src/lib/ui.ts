/** Centered content column — never wider than ~512px on any screen */
export const contentColumnClass =
  "mx-auto w-full max-w-md px-4 sm:max-w-lg sm:px-6";

/** Main app pages (Home, Stats) */
export const pageContainerClass = `${contentColumnClass} pt-5 pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] sm:pt-7 sm:pb-[calc(6rem+env(safe-area-inset-bottom,0px))] md:pt-8`;

/** Onboarding */
export const pageContainerNarrowClass = `${contentColumnClass} py-8 pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] sm:py-10`;

export const cardClass =
  "rounded-2xl border border-sage-100 bg-white/95 p-4 shadow-sm backdrop-blur-sm sm:rounded-2xl sm:p-5 md:p-6";

export const inputClass =
  "w-full min-h-[2.75rem] rounded-xl border-2 border-sage-200 bg-white px-4 py-2.5 text-base text-stone-800 transition-colors focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200 sm:min-h-[2.5rem] sm:py-3 sm:text-sm";

export const selectClass =
  "w-full min-h-[2.75rem] cursor-pointer appearance-none rounded-xl border-2 border-sage-200 bg-white bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat px-4 py-2.5 text-base text-stone-800 transition-colors focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200 sm:min-h-[2.5rem] sm:bg-[length:0.875rem] sm:py-3 sm:pr-10 sm:text-sm [background-image:url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%23527852%27%3E%3Cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E')]";

export const pickerInputClass =
  "w-full min-h-[3rem] cursor-pointer appearance-none rounded-xl border-2 border-sage-200 bg-white px-4 py-2.5 text-base text-stone-800 transition-colors focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200 [color-scheme:light] [&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-calendar-picker-indicator]:h-6 [&::-webkit-calendar-picker-indicator]:w-6 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-datetime-edit]:flex-1";

export const btnPrimaryClass =
  "min-h-[2.75rem] rounded-xl bg-sage-600 px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-sage-700 hover:shadow-lg active:scale-[0.98] sm:py-4 sm:text-sm";

export const btnSecondaryClass =
  "min-h-[2.75rem] rounded-xl border-2 border-sage-300 bg-white px-6 py-3.5 text-base font-semibold text-sage-800 transition-all hover:border-sage-400 hover:bg-sage-50 active:scale-[0.98] sm:py-4 sm:text-sm";

export const statGridClass = "grid grid-cols-2 gap-2.5 sm:gap-3";

export const sectionTitleClass =
  "text-xl font-semibold text-sage-800 sm:text-2xl";

/** Bottom nav: compact tabs centered, not stretched edge-to-edge */
export const navInnerClass =
  "mx-auto flex w-full max-w-md items-center justify-center gap-3 px-4 py-2.5 sm:max-w-lg sm:gap-6";

export const navLinkClass =
  "flex min-h-[3rem] min-w-[5.5rem] flex-col items-center justify-center gap-0.5 rounded-xl px-5 py-2 text-xs font-medium transition-colors sm:min-h-[3.25rem] sm:min-w-[6.5rem] sm:gap-1 sm:text-sm";
