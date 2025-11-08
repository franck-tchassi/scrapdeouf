// components/onboarding/steps/StepSummary.tsx
"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { OnboardingFormData } from "@/lib/onboardingSchema";

export function StepSummary({ onBack, onFinish }: { onBack?: () => void; onFinish: () => void }) {
  const { getValues } = useFormContext<OnboardingFormData>();
  const data = getValues();

  // merge other option
  const scraping = (data.scrapingPlatforms || []).filter((p) => p !== "other_option_checkbox");
  if ((data.scrapingPlatforms || []).includes("other_option_checkbox") && data.otherScrapingPlatform) {
    scraping.push(data.otherScrapingPlatform);
  }

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="w-full max-w-2xl bg-gray-50 p-4 rounded">
        <p><strong>Taille :</strong> {data.companySize || "-"}</p>
        <p><strong>Objectif :</strong> {data.mainObjective || "-"}</p>
        <p><strong>Utilisation :</strong> {data.mainUsage || "-"}</p>
        <p><strong>A un site :</strong> {data.hasWebsite === "oui" ? "Oui" : "Non"}</p>
        {data.hasWebsite === "oui" && <p><strong>URL :</strong> {data.websiteUrl || "-"}</p>}
        <p><strong>Besoin site sur-mesure :</strong> {data.needsCustomWebsite === "oui" ? "Oui" : "Non"}</p>
        <p><strong>Plateformes :</strong> {scraping.length ? scraping.join(", ") : "Aucune"}</p>
        <p><strong>Découverte :</strong> {data.discoverySource || "-"}</p>
      </div>

      <div className="w-full flex justify-between">
        <button onClick={onBack} className="px-4 py-2 rounded-md border">Précédent</button>
        <button onClick={onFinish} className="px-6 py-3 rounded-md text-white bg-black">Terminer</button>
      </div>
    </div>
  );
}
