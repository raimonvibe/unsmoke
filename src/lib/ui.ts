/** Main app pages (Home, Stats) — phone/tablet friendly, capped on desktop */
export const pageContainerClass =
  "mx-auto w-full max-w-lg px-4 pt-5 pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] sm:max-w-xl sm:px-6 sm:pt-7 sm:pb-[calc(6rem+env(safe-area-inset-bottom,0px))] md:max-w-xl md:px-8 md:pt-8 lg:max-w-xl";

/** Forms (onboarding) — stay narrow on all screen sizes */
export const pageContainerNarrowClass =
  "mx-auto w-full max-w-md px-4 py-8 pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] sm:max-w-lg sm:px-6 sm:py-10 md:max-w-lg lg:max-w-lg";

export const cardClass =
  "rounded-2xl border border-sage-100 bg-white/95 p-4 shadow-sm backdrop-blur-sm sm:rounded-2xl sm:p-5 md:p-6";

export const inputClass =
  "w-full min-h-[2.75rem] rounded-xl border-2 border-sage-200 bg-white px-4 py-2.5 text-base text-stone-800 transition-colors focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200 sm:min-h-[2.5rem] sm:py-3 sm:text-sm";

export const selectClass =
  "w-full min-h-[2.75rem] cursor-pointer appearance-none rounded-xl border-2 border-sage-200 bg-white bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat px-4 py-2.5 text-base text-stone-800 transition-colors focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200 sm:min-h-[2.5rem] sm:bg-[length:0.875rem] sm:py-3 sm:pr-10 sm:text-sm [background-image:url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%23527852%27%3E%3Cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E')]";

/** Native date/time inputs — larger tap target and visible picker icon */
export const pickerInputClass =
  "w-full min-h-[3rem] cursor-pointer appearance-none rounded-xl border-2 border-sage-200 bg-white px-4 py-2.5 text-base text-stone-800 transition-colors focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200 [color-scheme:light] [&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-calendar-picker-indicator]:h-6 [&::-webkit-calendar-picker-indicator]:w-6 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-datetime-edit]:flex-1";

export const btnPrimaryClass =
  "min-h-[2.75rem] rounded-xl bg-sage-600 px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-sage-700 hover:shadow-lg active:scale-[0.98] sm:py-4 sm:text-sm";

/** Stat cards — two columns within the page column */
export const statGridClass =
  "grid grid-cols-2 gap-2.5 sm:gap-3";

export const sectionTitleClass =
  "text-xl font-semibold text-sage-800 sm:text-2xl";

/** Bottom nav aligned with page content width */
export const navInnerClass =
  "mx-auto flex w-full max-w-lg justify-around gap-1 px-3 py-2.5 sm:max-w-xl sm:gap-2 sm:px-4 sm:py-3 md:max-w-xl";
