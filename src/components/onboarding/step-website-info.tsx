"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { OnboardingFormData } from "@/app/[locale]/onboarding/page";


interface StepWebsiteInfoProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepWebsiteInfo({ onNext, onBack }: StepWebsiteInfoProps) {
  const { control, watch, setValue, formState: { errors } } = useFormContext<OnboardingFormData>();
  const hasWebsite = watch("hasWebsite");
  const needsCustomWebsite = watch("needsCustomWebsite");

  // Gère la sélection unique pour les cases à cocher "Oui"/"Non"
  const handleHasWebsiteChange = (checked: boolean, value: "oui" | "non") => {
    if (checked) {
      setValue("hasWebsite", value, { shouldValidate: true });
    } else {
      // Si la case actuellement sélectionnée est décochée, effacer la sélection
      if (hasWebsite === value) {
        setValue("hasWebsite", "", { shouldValidate: true });
      }
    }
  };

  // Gère la sélection unique pour les cases à cocher "Oui"/"Non"
  const handleNeedsCustomWebsiteChange = (checked: boolean, value: "oui" | "non") => {
    if (checked) {
      setValue("needsCustomWebsite", value, { shouldValidate: true });
    } else {
      // Si la case actuellement sélectionnée est décochée, effacer la sélection
      if (needsCustomWebsite === value) {
        setValue("needsCustomWebsite", "", { shouldValidate: true });
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Informations sur votre site web</h2>
      
      <FormField
        control={control}
        name="hasWebsite"
        render={() => (
          <FormItem className="space-y-3">
            <FormLabel className="text-base">Avez-vous déjà un site web pour votre entreprise ou activité ?</FormLabel>
            <div className="flex space-x-4">
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={hasWebsite === "oui"}
                    onCheckedChange={(checked) => handleHasWebsiteChange(checked as boolean, "oui")}
                  />
                </FormControl>
                <FormLabel className="font-normal">Oui</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={hasWebsite === "non"}
                    onCheckedChange={(checked) => handleHasWebsiteChange(checked as boolean, "non")}
                  />
                </FormControl>
                <FormLabel className="font-normal">Non</FormLabel>
              </FormItem>
            </div>
            <FormMessage>{errors.hasWebsite?.message}</FormMessage>
          </FormItem>
        )}
      />

      {hasWebsite === "oui" && ( // Affiche le champ URL uniquement si "Oui" est sélectionné
        <FormField
          control={control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de votre site web (facultatif)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: https://www.monsite.com"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage>{errors.websiteUrl?.message}</FormMessage>
            </FormItem>
          )}
        />
      )}

      <FormField
        control={control}
        name="needsCustomWebsite"
        render={() => (
          <FormItem className="space-y-3">
            <FormLabel className="text-base">Avez-vous besoin d'un site web sur mesure pour développer votre activité ?</FormLabel>
            <div className="flex space-x-4">
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={needsCustomWebsite === "oui"}
                    onCheckedChange={(checked) => handleNeedsCustomWebsiteChange(checked as boolean, "oui")}
                  />
                </FormControl>
                <FormLabel className="font-normal">Oui</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={needsCustomWebsite === "non"}
                    onCheckedChange={(checked) => handleNeedsCustomWebsiteChange(checked as boolean, "non")}
                  />
                </FormControl>
                <FormLabel className="font-normal">Non</FormLabel>
              </FormItem>
            </div>
            <FormMessage>{errors.needsCustomWebsite?.message}</FormMessage>
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