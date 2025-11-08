// components/onboarding/steps/StepMainUsage.tsx
"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { OnboardingFormData } from "@/lib/onboardingSchema";

export function StepMainUsage({ onNext, onBack }: { onNext: () => void; onBack?: () => void }) {
  const { setValue, watch } = useFormContext<OnboardingFormData>();
  const selected = watch("mainUsage");

  const options = [
    { id: "recherche_qualification_prospects", label: "Recherche & qualification de prospects B2B" },
    { id: "prospection_locale", label: "Prospection commerciale locale" },
    { id: "enrichissement_bases_donnees", label: "Enrichissement de bases de données" },
    { id: "prospection_linkedin", label: "Prospection sur LinkedIn" },
    { id: "veille_concurrentielle_produits", label: "Veille concurrentielle" },
    { id: "analyse_avis_clients", label: "Analyse d'avis clients" },
    { id: "recherche_mots_cles_seo", label: "Recherche mots-clés / SEO" },
    { id: "explorer_possibilites", label: "Je ne sais pas encore — explorer" },
  ];

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="w-full max-w-xl mx-auto grid gap-3">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => setValue("mainUsage", o.id, { shouldValidate: true })}
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
        <button
          onClick={onNext}
          className={`px-6 py-3 rounded-md text-white ${selected ? "bg-black" : "bg-gray-300 cursor-not-allowed"}`}
          disabled={!selected}
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
