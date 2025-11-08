//components/onboarding/step-use-case.tsx

"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { OnboardingFormData } from "@/app/[locale]/onboarding/page";


interface StepUseCaseProps {
  onNext: () => void;
  onBack: () => void;
}

const mainObjectiveOptions = [
  { id: "developper_ventes", label: "Développer les ventes de mon entreprise" },
  { id: "developper_activite_freelance", label: "Développer mon activité indépendante/freelance" },
  { id: "lancer_nouveau_projet", label: "Lancer un nouveau projet/startup" },
  { id: "explorer_prospection_b2b", label: "Explorer les possibilités de prospection B2B" },
];

export function StepUseCase({ onNext, onBack }: StepUseCaseProps) {
  const { control, watch, setValue, formState: { errors } } = useFormContext<OnboardingFormData>();
  const selectedMainObjective = watch("mainObjective");

  const handleCheckboxChange = (checked: boolean, value: string) => {
    if (checked) {
      setValue("mainObjective", value, { shouldValidate: true });
    } else {
      if (selectedMainObjective === value) {
        setValue("mainObjective", "", { shouldValidate: true });
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Quel est votre objectif principal avec Scrapdeouf.com ?</h2>
      <FormField
        control={control}
        name="mainObjective"
        render={() => (
          <FormItem className="space-y-3">
            <FormLabel>Sélectionnez un objectif</FormLabel>
            <div className="flex flex-col space-y-2">
              {mainObjectiveOptions.map((item) => (
                <FormItem key={item.id} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={selectedMainObjective === item.id}
                      onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, item.id)}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {item.label}
                  </FormLabel>
                </FormItem>
              ))}
            </div>
            <FormMessage>{errors.mainObjective?.message}</FormMessage>
          </FormItem>
        )}
      />
      <div className="flex justify-between">
        <Button className="cursor-pointer" variant="outline" onClick={onBack}>Précédent</Button>
        <Button className="cursor-pointer" onClick={onNext}>Suivant</Button>
      </div>
    </div>
  );
}