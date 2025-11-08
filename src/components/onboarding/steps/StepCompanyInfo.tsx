// components/onboarding/steps/StepCompanyInfo.tsx
"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { OnboardingFormData } from "@/lib/onboardingSchema";

export function StepCompanyInfo({ onNext }: { onNext: () => void }) {
  const { setValue, watch } = useFormContext<OnboardingFormData>();
  const selected = watch("companySize");

  const options = [
    { id: "1", label: "1 (indépendant)" },
    { id: "2-10", label: "2-10" },
    { id: "11-50", label: "11-50" },
    { id: "51-200", label: "51-200" },
    { id: "201-1000", label: "201-1000" },
    { id: "1000+", label: "+1000" },
  ];

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="w-full max-w-xl mx-auto">
        <div className="grid gap-3">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setValue("companySize", o.id, { shouldValidate: true })}
              className={`w-full text-left px-4 py-3 rounded-md border ${
                selected === o.id ? "border-black bg-gray-100 font-semibold" : "border-gray-300"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full flex justify-end">
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
