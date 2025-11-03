"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input"; // NOUVEL IMPORT
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { OnboardingFormData } from "@/app/[locale]/onboarding/page";


interface StepScrapingPlatformsProps {
  onNext: () => void;
  onBack: () => void;
}

const scrapingPlatformsOptions = [
  { id: "google_maps", label: "Google Maps" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "yellow_pages", label: "Pages Jaunes / Annuaires" },
  { id: "custom_websites", label: "Sites web spécifiques (e-commerce, blogs, etc.)" },
  { id: "social_media", label: "Autres réseaux sociaux (Facebook, Instagram, Twitter)" },
  { id: "e_commerce_platforms", label: "Plateformes e-commerce (Amazon, Etsy)" },
  { id: "other_option_checkbox", label: "Autre (précisez)" }, // NOUVELLE OPTION
];

export function StepScrapingPlatforms({ onNext, onBack }: StepScrapingPlatformsProps) {
  const { control, watch, setValue, formState: { errors } } = useFormContext<OnboardingFormData>();
  const selectedPlatforms = watch("scrapingPlatforms");
  const isOtherChecked = selectedPlatforms.includes("other_option_checkbox");

  const handleCheckboxChange = (checked: boolean, value: string) => {
    if (checked) {
      setValue("scrapingPlatforms", [...selectedPlatforms, value], { shouldValidate: true });
    } else {
      const newSelection = selectedPlatforms.filter((platform: any) => platform !== value);
      setValue("scrapingPlatforms", newSelection, { shouldValidate: true });
      // Si la case "Autre" est décochée, effacer également le champ de saisie personnalisé
      if (value === "other_option_checkbox") {
        setValue("otherScrapingPlatform", "", { shouldValidate: true });
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Quels sites ou plateformes souhaitez-vous scrapper ?</h2>
      <FormField
        control={control}
        name="scrapingPlatforms"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Sélectionnez toutes les plateformes pertinentes</FormLabel>
            </div>
            {scrapingPlatformsOptions.map((item) => (
              <FormField
                key={item.id}
                control={control}
                name="scrapingPlatforms"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={item.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.id)}
                          onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, item.id)}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
            <FormMessage>{errors.scrapingPlatforms?.message}</FormMessage>
          </FormItem>
        )}
      />

      {isOtherChecked && ( // Affiche le champ de saisie uniquement si "Autre" est coché
        <FormField
          control={control}
          name="otherScrapingPlatform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la plateforme personnalisée</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: MonSiteECommerce.com"
                  {...field}
                  value={field.value || ""} // Assure que le composant est contrôlé
                />
              </FormControl>
              <FormMessage>{errors.otherScrapingPlatform?.message}</FormMessage>
            </FormItem>
          )}
        />
      )}

      <div className="flex justify-between">
        <Button variant="outline" className="cursor-pointer" onClick={onBack}>Précédent</Button>
        <Button className="cursor-pointer" onClick={onNext}>Suivant</Button>
      </div>
    </div>
  );
}