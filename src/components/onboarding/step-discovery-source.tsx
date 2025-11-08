//components/onboarding/step-discovery-source.tsx

"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { OnboardingFormData } from "@/lib/onboardingSchema";



interface StepDiscoverySourceProps {
  onNext: () => void;
  onBack: () => void;
}

const discoverySourceOptions = [
  { id: "google", label: "Google" },
  { id: "youtube", label: "YouTube" },
  { id: "recommandation", label: "Recommandation d'un ami/collègue" },
  { id: "bing", label: "Bing" },
  { id: "reseaux_sociaux", label: "Réseaux sociaux (LinkedIn, Twitter, etc.)" },
  { id: "article_blog", label: "Article/Blog" },
  { id: "newsletter", label: "Newsletter" },
  { id: "autre", label: "Autre" },
];

export function StepDiscoverySource({ onNext, onBack }: StepDiscoverySourceProps) {
  const { control, watch, setValue, formState: { errors } } = useFormContext<OnboardingFormData>();
  const selectedDiscoverySource = watch("discoverySource");

  const handleCheckboxChange = (checked: boolean, value: string) => {
    if (checked) {
      setValue("discoverySource", value, { shouldValidate: true });
    } else {
      if (selectedDiscoverySource === value) {
        setValue("discoverySource", "", { shouldValidate: true });
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Comment avez-vous découvert Scrapdeouf.com ?</h2>
      <FormField
        control={control}
        name="discoverySource"
        render={() => (
          <FormItem className="space-y-3">
            <FormLabel>Sélectionnez une option</FormLabel>
            <div className="flex flex-col space-y-2">
              {discoverySourceOptions.map((item) => (
                <FormItem key={item.id} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={selectedDiscoverySource === item.id}
                      onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, item.id)}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {item.label}
                  </FormLabel>
                </FormItem>
              ))}
            </div>
            <FormMessage>{errors.discoverySource?.message}</FormMessage>
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