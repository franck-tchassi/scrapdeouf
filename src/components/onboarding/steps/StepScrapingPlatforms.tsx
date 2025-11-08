// components/onboarding/steps/StepScrapingPlatforms.tsx
"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { OnboardingFormData } from "@/lib/onboardingSchema";

const options = [
  { id: "google_maps", label: "Google Maps" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "yellow_pages", label: "Pages Jaunes / Annuaires" },
  { id: "custom_websites", label: "Sites web spécifiques" },
  { id: "social_media", label: "Autres réseaux sociaux" },
  { id: "e_commerce_platforms", label: "Plateformes e-commerce" },
  { id: "other_option_checkbox", label: "Autre (précisez)" },
];

export function StepScrapingPlatforms({ onNext, onBack }: { onNext: () => void; onBack?: () => void }) {
  const { watch, setValue, register, formState: { errors } } = useFormContext<OnboardingFormData>();
  const selected: string[] = watch("scrapingPlatforms") || [];
  const isOther = selected.includes("other_option_checkbox");

  const toggle = (id: string) => {
    const next = selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id];
    setValue("scrapingPlatforms", next, { shouldValidate: true });
    if (!next.includes("other_option_checkbox")) setValue("otherScrapingPlatform", "", { shouldValidate: true });
  };

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="w-full max-w-xl mx-auto grid gap-3">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => toggle(o.id)}
            className={`w-full text-left px-4 py-3 rounded-md border ${
              selected.includes(o.id) ? "border-black bg-gray-100 font-semibold" : "border-gray-300"
            }`}
          >
            {o.label}
          </button>
        ))}

        {isOther && (
          <div>
            <label className="block text-sm font-medium mb-1">Précisez la plateforme</label>
            <input
              {...register("otherScrapingPlatform")}
              className="w-full px-3 py-2 border rounded"
              placeholder="Ex: MonSiteECommerce.com"
            />
            {errors.otherScrapingPlatform && <p className="text-sm text-red-600 mt-1">{String(errors.otherScrapingPlatform?.message)}</p>}
          </div>
        )}
        {errors.scrapingPlatforms && <p className="text-sm text-red-600 mt-1">{String(errors.scrapingPlatforms?.message)}</p>}
      </div>

      <div className="w-full flex justify-between">
        <button onClick={onBack} className="px-4 py-2 rounded-md border">Précédent</button>
        <button onClick={onNext} className="px-6 py-3 rounded-md text-white bg-black">Continuer</button>
      </div>
    </div>
  );
}
