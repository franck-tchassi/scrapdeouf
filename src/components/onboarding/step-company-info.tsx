"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { OnboardingFormData } from "@/app/[locale]/onboarding/page";


interface StepCompanyInfoProps {
  onNext: () => void;
}

const companySizeOptions = [
  { id: "1", label: "1 (indépendant)" },
  { id: "2-10", label: "2-10" },
  { id: "11-50", label: "11-50" },
  { id: "51-200", label: "51-200" },
  { id: "201-1000", label: "201-1000" },
  { id: "1000+", label: "+1000" },
];

export function StepCompanyInfo({ onNext }: StepCompanyInfoProps) {
  const { control, watch, setValue, formState: { errors } } = useFormContext<OnboardingFormData>();
  const selectedCompanySize = watch("companySize");

  const handleCheckboxChange = (checked: boolean, value: string) => {
    if (checked) {
      // If this checkbox is checked, set it as the companySize
      setValue("companySize", value, { shouldValidate: true });
    } else {
      // If the currently selected checkbox is being unchecked, clear the selection
      if (selectedCompanySize === value) {
        setValue("companySize", "", { shouldValidate: true });
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Quelle est la taille de votre entreprise ?</h2>
      <FormField
        control={control}
        name="companySize"
        render={() => (
          <FormItem className="space-y-3">
            <FormLabel>Taille de l'entreprise</FormLabel>
            <div className="flex flex-col space-y-2">
              {companySizeOptions.map((item) => (
                <FormItem key={item.id} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={selectedCompanySize === item.id}
                      onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, item.id)}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {item.label}
                  </FormLabel>
                </FormItem>
              ))}
            </div>
            <FormMessage>{errors.companySize?.message}</FormMessage>
          </FormItem>
        )}
      />
      <div className="flex justify-end">
        <Button className="cursor-pointer" onClick={onNext}>Suivant</Button>
      </div>
    </div>
  );
}