"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { OnboardingFormData } from "@/lib/onboardingSchema";


export function StepCompanySize({ onNext }: { onNext: () => void }) {
  const { setValue, watch } = useFormContext<OnboardingFormData>();
  const selected = watch("companySize");

  const options = ["1", "2-10", "11-50", "51-200", "200+"];

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex flex-col gap-3 w-full max-w-sm">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => setValue("companySize", option, { shouldValidate: true })}
            className={`border rounded-md py-3 text-base ${
              selected === option
                ? "border-black bg-gray-100 font-semibold"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <Button
        onClick={onNext}
        disabled={!selected}
        className="bg-black text-white hover:bg-gray-800 px-8 py-3 mt-4"
      >
        Continue
      </Button>
    </div>
  );
}
