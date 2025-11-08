// components/onboarding/steps/StepWebsiteInfo.tsx
"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { OnboardingFormData } from "@/lib/onboardingSchema";

export function StepWebsiteInfo({ onNext, onBack }: { onNext: () => void; onBack?: () => void }) {
  const { setValue, watch, register, formState: { errors } } = useFormContext<OnboardingFormData>();
  const hasWebsite = watch("hasWebsite");
  const needsCustom = watch("needsCustomWebsite");

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="w-full max-w-xl mx-auto">
        <div className="space-y-3">
          <div className="text-left">
            <div className="font-medium mb-2">Avez-vous déjà un site web ?</div>
            <div className="flex gap-3">
              <label className={`px-4 py-2 border rounded ${hasWebsite === "oui" ? "bg-gray-100 border-black" : "border-gray-300"}`}>
                <input
                  type="radio"
                  className="mr-2"
                  {...register("hasWebsite")}
                  value="oui"
                  onChange={() => setValue("hasWebsite", "oui", { shouldValidate: true })}
                />
                Oui
              </label>
              <label className={`px-4 py-2 border rounded ${hasWebsite === "non" ? "bg-gray-100 border-black" : "border-gray-300"}`}>
                <input
                  type="radio"
                  className="mr-2"
                  {...register("hasWebsite")}
                  value="non"
                  onChange={() => setValue("hasWebsite", "non", { shouldValidate: true })}
                />
                Non
              </label>
            </div>
            {errors.hasWebsite && <p className="text-sm text-red-600 mt-1">{String(errors.hasWebsite?.message)}</p>}
          </div>

          {hasWebsite === "oui" && (
            <div>
              <label className="block text-sm font-medium mb-1">URL de votre site web</label>
              <input
                {...register("websiteUrl")}
                className="w-full px-3 py-2 border rounded"
                placeholder="https://www.monsite.com"
              />
              {errors.websiteUrl && <p className="text-sm text-red-600 mt-1">{String(errors.websiteUrl?.message)}</p>}
            </div>
          )}

          <div>
            <div className="font-medium mb-2">Avez-vous besoin d'un site web sur mesure ?</div>
            <div className="flex gap-3">
              <label className={`px-4 py-2 border rounded ${needsCustom === "oui" ? "bg-gray-100 border-black" : "border-gray-300"}`}>
                <input
                  type="radio"
                  className="mr-2"
                  {...register("needsCustomWebsite")}
                  value="oui"
                  onChange={() => setValue("needsCustomWebsite", "oui", { shouldValidate: true })}
                />
                Oui
              </label>
              <label className={`px-4 py-2 border rounded ${needsCustom === "non" ? "bg-gray-100 border-black" : "border-gray-300"}`}>
                <input
                  type="radio"
                  className="mr-2"
                  {...register("needsCustomWebsite")}
                  value="non"
                  onChange={() => setValue("needsCustomWebsite", "non", { shouldValidate: true })}
                />
                Non
              </label>
            </div>
            {errors.needsCustomWebsite && <p className="text-sm text-red-600 mt-1">{String(errors.needsCustomWebsite?.message)}</p>}
          </div>
        </div>
      </div>

      <div className="w-full flex justify-between">
        <button onClick={onBack} className="px-4 py-2 rounded-md border">Précédent</button>
        <button onClick={onNext} className="px-6 py-3 rounded-md text-white bg-black">Continuer</button>
      </div>
    </div>
  );
}
