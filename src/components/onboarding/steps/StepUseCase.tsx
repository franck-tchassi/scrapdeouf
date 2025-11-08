// components/onboarding/steps/StepUseCase.tsx
"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { OnboardingFormData } from "@/lib/onboardingSchema";

export function StepUseCase({ onNext, onBack }: { onNext: () => void; onBack?: () => void }) {
  const { setValue, watch } = useFormContext<OnboardingFormData>();
  const selected = watch("mainObjective");

  const options = [
    { id: "developper_ventes", label: "Développer les ventes de mon entreprise" },
    { id: "developper_activite_freelance", label: "Développer mon activité indépendante/freelance" },
    { id: "lancer_nouveau_projet", label: "Lancer un nouveau projet/startup" },
    { id: "explorer_prospection_b2b", label: "Explorer les possibilités de prospection B2B" },
  ];

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="w-full max-w-xl mx-auto">
        <div className="grid gap-3">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setValue("mainObjective", o.id, { shouldValidate: true })}
              className={`w-full text-left px-4 py-3 rounded-md border ${
                selected === o.id ? "border-black bg-gray-100 font-semibold" : "border-gray-300"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
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
