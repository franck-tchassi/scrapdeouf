// components/onboarding/step-main-usage.tsx  

"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { OnboardingFormData } from "@/app/[locale]/onboarding/page";


interface StepMainUsageProps {
  onNext: () => void;
  onBack: () => void;
}

const mainUsageOptions = [
  { id: "recherche_qualification_prospects", label: "Recherche et qualification de prospects B2B" },
  { id: "prospection_locale", label: "Prospection commerciale locale (Google Maps, annuaires)" },
  { id: "enrichissement_bases_donnees", label: "Enrichissement de bases de données clients/prospects" },
  { id: "prospection_linkedin", label: "Prospection sur LinkedIn et réseaux sociaux professionnels" },
  { id: "veille_concurrentielle_produits", label: "Veille concurrentielle (prix, produits, stocks)" },
  { id: "analyse_avis_clients", label: "Analyse d'avis clients et e-réputation" },
  { id: "recherche_mots_cles_seo", label: "Recherche de mots-clés et analyse SEO" },
  { id: "explorer_possibilites", label: "Je ne sais pas encore - Je souhaite explorer" },
];

export function StepMainUsage({ onNext, onBack }: StepMainUsageProps) {
  const { control, watch, setValue, formState: { errors } } = useFormContext<OnboardingFormData>();
  const selectedMainUsage = watch("mainUsage");

  const handleCheckboxChange = (checked: boolean, value: string) => {
    if (checked) {
      setValue("mainUsage", value, { shouldValidate: true });
    } else {
      if (selectedMainUsage === value) {
        setValue("mainUsage", "", { shouldValidate: true });
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Quelle sera votre utilisation principale ?</h2>
      <FormField
        control={control}
        name="mainUsage"
        render={() => (
          <FormItem className="space-y-3">
            <FormLabel>Sélectionnez votre utilisation</FormLabel>
            <div className="flex flex-col space-y-2">
              {mainUsageOptions.map((item) => (
                <FormItem key={item.id} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={selectedMainUsage === item.id}
                      onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, item.id)}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {item.label}
                  </FormLabel>
                </FormItem>
              ))}
            </div>
            <FormMessage>{errors.mainUsage?.message}</FormMessage>
          </FormItem>
        )}
      />
      <div className="flex justify-between">
        <Button variant="outline" className="cursor-pointer" onClick={onBack}>Précédent</Button>
        <Button className="cursor-pointer" onClick={onNext}>Suivant</Button>
      </div>
    </div>
  );
}