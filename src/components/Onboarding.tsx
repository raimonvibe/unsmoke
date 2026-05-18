"use client";

import { FormEvent, ReactNode, useState } from "react";
import { localDateTimeToIso } from "@/lib/date";
import { deriveProductType } from "@/lib/normalize-quit-data";
import {
  defaultQuitFormState,
  quitFormStateFromData,
} from "@/lib/quit-data-form";
import { LocalDataNotice } from "./LocalDataNotice";
import { QuitDateTimeFields } from "./QuitDateTimeFields";
import {
  btnPrimaryClass,
  btnSecondaryClass,
  inputClass,
  pageContainerNarrowClass,
  sectionTitleClass,
} from "@/lib/ui";
import type { QuitData, TobaccoVariant } from "@/lib/types";
import { APP_DISCLAIMER } from "@/lib/health-sources";
import {
  TOBACCO_VARIANT_LABELS,
  VARIANT_NICOTINE_MG_PER_GRAM,
} from "@/lib/tobacco";

interface OnboardingProps {
  onComplete: (data: QuitData) => void;
  initialData?: QuitData;
  onCancel?: () => void;
}

export function Onboarding({
  onComplete,
  initialData,
  onCancel,
}: OnboardingProps) {
  const isEdit = Boolean(initialData);
  const initial = initialData
    ? quitFormStateFromData(initialData)
    : defaultQuitFormState();

  const [quitDate, setQuitDate] = useState(initial.quitDate);
  const [quitTime, setQuitTime] = useState(initial.quitTime);

  const [usesCigarettes, setUsesCigarettes] = useState(initial.usesCigarettes);
  const [usesVaping, setUsesVaping] = useState(initial.usesVaping);
  const [usesTobacco, setUsesTobacco] = useState(initial.usesTobacco);

  const [cigarettesPerDay, setCigarettesPerDay] = useState(
    initial.cigarettesPerDay
  );
  const [costPerCigarette, setCostPerCigarette] = useState(
    initial.costPerCigarette
  );

  const [mlPerDay, setMlPerDay] = useState(initial.mlPerDay);
  const [nicotineMgPerMl, setNicotineMgPerMl] = useState(initial.nicotineMgPerMl);
  const [bottleMl, setBottleMl] = useState(initial.bottleMl);
  const [costPerBottle, setCostPerBottle] = useState(initial.costPerBottle);

  const [tobaccoVariant, setTobaccoVariant] = useState<TobaccoVariant>(
    initial.tobaccoVariant
  );
  const [gramsPerDay, setGramsPerDay] = useState(initial.gramsPerDay);
  const [packageGrams, setPackageGrams] = useState(initial.packageGrams);
  const [costPerPackage, setCostPerPackage] = useState(initial.costPerPackage);
  const [packNicotineMgPerGram, setPackNicotineMgPerGram] = useState(
    initial.packNicotineMgPerGram
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!usesCigarettes && !usesVaping && !usesTobacco) {
      return;
    }

    const sections: Pick<QuitData, "cigarettes" | "vaping" | "tobacco"> = {};

    if (usesCigarettes) {
      sections.cigarettes = {
        perDay: Math.max(1, parseFloat(cigarettesPerDay) || 1),
        costPerUnit: Math.max(0, parseFloat(costPerCigarette) || 0),
      };
    }

    if (usesVaping) {
      sections.vaping = {
        mlPerDay: Math.max(0.1, parseFloat(mlPerDay) || 0.1),
        nicotineMgPerMl: Math.max(0.1, parseFloat(nicotineMgPerMl) || 0.1),
        bottleMl: Math.max(1, parseFloat(bottleMl) || 1),
        costPerBottle: Math.max(0, parseFloat(costPerBottle) || 0),
      };
    }

    if (usesTobacco) {
      const labelMg = parseFloat(packNicotineMgPerGram);
      sections.tobacco = {
        variant: tobaccoVariant,
        gramsPerDay: Math.max(0.1, parseFloat(gramsPerDay) || 0.1),
        packageGrams: Math.max(1, parseFloat(packageGrams) || 1),
        costPerPackage: Math.max(0, parseFloat(costPerPackage) || 0),
        ...(labelMg > 0 ? { nicotineMgPerGram: labelMg } : {}),
      };
    }

    onComplete({
      quitDate: localDateTimeToIso(quitDate, quitTime),
      productType: deriveProductType(sections),
      ...sections,
    });
  }

  const productOptions = [
    {
      key: "cigarettes" as const,
      label: "Cigarettes",
      checked: usesCigarettes,
      set: setUsesCigarettes,
    },
    { key: "vaping" as const, label: "Vaping", checked: usesVaping, set: setUsesVaping },
    {
      key: "tobacco" as const,
      label: "Rolling tobacco",
      checked: usesTobacco,
      set: setUsesTobacco,
    },
  ];

  return (
    <div
      className={`${pageContainerNarrowClass} animate-fade-in !pb-8 sm:!pb-10`}
    >
      <header className="mb-8 text-center sm:mb-10">
        <span className="mb-3 inline-block text-4xl sm:text-5xl" aria-hidden>
          🌱
        </span>
        <h1 className={`${sectionTitleClass} text-balance`}>
          {isEdit ? "Update your details" : "Unsmoke"}
        </h1>
        <p className="mt-2 text-sm font-medium text-sage-600 sm:text-base">
          {isEdit ? "Adjust your journey" : "Quit smoking & vaping"}
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm text-stone-600 text-balance sm:text-base">
          {isEdit
            ? "Change your quit date or what you were using."
            : "Tell us a little about your journey."}
        </p>
        <LocalDataNotice className="mx-auto mt-3 max-w-md text-center" />
      </header>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-sage-700 sm:text-base">
            When did you quit (or plan to quit)?
          </legend>
          <QuitDateTimeFields
            quitDate={quitDate}
            quitTime={quitTime}
            onDateChange={setQuitDate}
            onTimeChange={setQuitTime}
          />
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-sage-700 sm:text-base">
            What were you using? (select all that apply)
          </legend>
          <div className="grid grid-cols-1 gap-2 xs:grid-cols-3 sm:gap-3">
            {productOptions.map(({ key, label, checked, set }) => (
              <button
                key={key}
                type="button"
                aria-pressed={checked}
                onClick={() => set(!checked)}
                className={`min-h-[2.75rem] rounded-xl border-2 px-3 py-3 text-sm font-medium transition-all sm:text-base ${
                  checked
                    ? "border-sage-500 bg-sage-100 text-sage-800"
                    : "border-sage-200 bg-white text-stone-600 hover:border-sage-300 active:bg-sage-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        {usesCigarettes && (
          <ProductSection title="Cigarettes">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-sage-700">
                Cigarettes per day
              </span>
              <input
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                value={cigarettesPerDay}
                onChange={(e) => setCigarettesPerDay(e.target.value)}
                required={usesCigarettes}
                className={inputClass}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-sage-700">
                Cost per cigarette ($)
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={costPerCigarette}
                onChange={(e) => setCostPerCigarette(e.target.value)}
                required={usesCigarettes}
                className={inputClass}
              />
            </label>
          </ProductSection>
        )}

        {usesTobacco && (
          <ProductSection title="Rolling tobacco">
            <p className="text-xs text-stone-500 sm:text-sm">
              Money saved and grams avoided use your pouch size and daily usage.
              Nicotine uses your pack label when provided; otherwise a rough
              estimate from blend strength.
            </p>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-sage-700">
                Nicotine on pack (mg per gram) — optional
              </span>
              <input
                type="number"
                min="0.1"
                step="0.1"
                inputMode="decimal"
                placeholder="e.g. 14 if shown on pouch"
                value={packNicotineMgPerGram}
                onChange={(e) => setPackNicotineMgPerGram(e.target.value)}
                className={inputClass}
              />
              <span className="block text-xs text-stone-500">
                Check your pouch label. Leave blank to estimate from blend below
                (light ~{VARIANT_NICOTINE_MG_PER_GRAM.light}, medium ~
                {VARIANT_NICOTINE_MG_PER_GRAM.medium}, heavy ~
                {VARIANT_NICOTINE_MG_PER_GRAM.heavy} mg/g).
              </span>
            </label>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-sage-700">
                Blend strength
                {packNicotineMgPerGram.trim() ? " (not used for nicotine)" : ""}
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {(
                  Object.entries(TOBACCO_VARIANT_LABELS) as [
                    TobaccoVariant,
                    string,
                  ][]
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTobaccoVariant(value)}
                    className={`min-h-[2.75rem] rounded-xl border-2 px-1 py-2.5 text-xs font-medium transition-all xs:px-2 xs:text-sm ${
                      tobaccoVariant === value
                        ? "border-sage-500 bg-sage-100 text-sage-800"
                        : "border-sage-200 bg-white text-stone-600 hover:border-sage-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-sage-700">
                Tobacco per day (grams)
              </span>
              <input
                type="number"
                min="0.1"
                step="0.1"
                inputMode="decimal"
                value={gramsPerDay}
                onChange={(e) => setGramsPerDay(e.target.value)}
                required={usesTobacco}
                className={inputClass}
              />
            </label>
            <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
              <label className="block min-w-0 space-y-2">
                <span className="text-sm font-medium text-sage-700">
                  Package size (grams)
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  value={packageGrams}
                  onChange={(e) => setPackageGrams(e.target.value)}
                  required={usesTobacco}
                  className={inputClass}
                />
              </label>
              <label className="block min-w-0 space-y-2">
                <span className="text-sm font-medium text-sage-700">
                  Cost per package ($)
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  value={costPerPackage}
                  onChange={(e) => setCostPerPackage(e.target.value)}
                  required={usesTobacco}
                  className={inputClass}
                />
              </label>
            </div>
          </ProductSection>
        )}

        {usesVaping && (
          <ProductSection title="Vaping (e-liquid)">
            <p className="text-xs text-stone-500 sm:text-sm">
              We estimate savings from liquid volume and nicotine strength — not
              puffs.
            </p>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-sage-700">
                E-liquid per day (ml)
              </span>
              <input
                type="number"
                min="0.1"
                step="0.1"
                inputMode="decimal"
                value={mlPerDay}
                onChange={(e) => setMlPerDay(e.target.value)}
                required={usesVaping}
                className={inputClass}
              />
            </label>
            <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
              <label className="block min-w-0 space-y-2">
                <span className="text-sm font-medium text-sage-700">
                  Nicotine strength (mg/ml)
                </span>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  inputMode="decimal"
                  value={nicotineMgPerMl}
                  onChange={(e) => setNicotineMgPerMl(e.target.value)}
                  required={usesVaping}
                  className={inputClass}
                />
              </label>
              <label className="block min-w-0 space-y-2">
                <span className="text-sm font-medium text-sage-700">
                  Bottle size (ml)
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  value={bottleMl}
                  onChange={(e) => setBottleMl(e.target.value)}
                  required={usesVaping}
                  className={inputClass}
                />
              </label>
            </div>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-sage-700">
                Cost per bottle ($)
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={costPerBottle}
                onChange={(e) => setCostPerBottle(e.target.value)}
                required={usesVaping}
                className={inputClass}
              />
            </label>
          </ProductSection>
        )}

        <p className="rounded-xl border border-sage-100 bg-white/80 px-4 py-3 text-xs leading-relaxed text-stone-500 sm:text-sm">
          {APP_DISCLAIMER}
        </p>

        <div className="space-y-3">
          <button
            type="submit"
            disabled={!usesCigarettes && !usesVaping && !usesTobacco}
            className={`${btnPrimaryClass} sticky bottom-4 z-10 w-full disabled:cursor-not-allowed disabled:opacity-50 sm:static`}
          >
            {isEdit ? "Save changes" : "Start my journey"}
          </button>
          {isEdit && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={`${btnSecondaryClass} w-full`}
            >
              Back to my journey
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function ProductSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="space-y-4 rounded-2xl border border-sage-100 bg-white/70 p-4 sm:bg-white/80 sm:p-5 md:p-6">
      <legend className="px-1 text-sm font-semibold text-sage-800 sm:text-base">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}
