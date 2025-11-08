// components/onboarding/steps/StepDiscoverySource.tsx
"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { OnboardingFormData } from "@/lib/onboardingSchema";

const options = [
  { id: "google", label: "Google" },
  { id: "youtube", label: "YouTube" },
  { id: "recommandation", label: "Recommandation" },
  { id: "bing", label: "Bing" },
  { id: "reseaux_sociaux", label: "Réseaux sociaux" },
  { id: "article_blog", label: "Article/Blog" },
  { id: "newsletter", label: "Newsletter" },
  { id: "autre", label: "Autre" },
];

export function StepDiscoverySource({ onNext, onBack }: { onNext: () => void; onBack?: () => void }) {
  const { setValue, watch } = useFormContext<OnboardingFormData>();
  const selected = watch("discoverySource");

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="w-full max-w-xl mx-auto grid gap-3">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => setValue("discoverySource", o.id, { shouldValidate: true })}
            className={`w-full text-left px-4 py-3 rounded-md border ${
              selected === o.id ? "border-black bg-gray-100 font-semibold" : "border-gray-300"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="w-full flex justify-between">
        <button onClick={onBack} className="px-4 py-2 rounded-md border">Précédent</button>
        <button onClick={onNext} className={`px-6 py-3 rounded-md text-white ${selected ? "bg-black" : "bg-gray-300 cursor-not-allowed"}`} disabled={!selected}>Continuer</button>
      </div>
    </div>
  );
}
