//components/onboarding/step-summary.tsx

"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { OnboardingFormData } from "@/lib/onboardingSchema";


interface StepSummaryProps {
  onFinish: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function StepSummary({ onFinish, onBack, isLoading }: StepSummaryProps) {
  const { getValues } = useFormContext<OnboardingFormData>();
  const formData = getValues();

  // Filtre l'ID du placeholder "other_option_checkbox" et combine avec l'entrée personnalisée si présente
  const displayedScrapingPlatforms = formData.scrapingPlatforms.filter(
    (platform: any) => platform !== "other_option_checkbox"
  );
  if (formData.scrapingPlatforms.includes("other_option_checkbox") && formData.otherScrapingPlatform) {
    displayedScrapingPlatforms.push(formData.otherScrapingPlatform);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Résumé de votre onboarding</h2>
      <div className="space-y-4 text-muted-foreground">
        <div>
          <h3 className="font-medium text-foreground">Informations générales :</h3>
          <p><strong>Taille de l'entreprise :</strong> {formData.companySize}</p>
        </div>
        <div>
          <h3 className="font-medium text-foreground">Objectif principal avec Scraap.ai :</h3>
          <p>{formData.mainObjective}</p>
        </div>
        <div>
          <h3 className="font-medium text-foreground">Utilisation principale :</h3>
          <p>{formData.mainUsage}</p>
        </div>
        <div>
          <h3 className="font-medium text-foreground">Informations sur le site web :</h3>
          <p><strong>A un site web :</strong> {formData.hasWebsite === "oui" ? "Oui" : "Non"}</p>
          {formData.hasWebsite === "oui" && formData.websiteUrl && (
            <p><strong>URL du site web :</strong> <a href={formData.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{formData.websiteUrl}</a></p>
          )}
          <p><strong>Besoin d'un site web sur mesure :</strong> {formData.needsCustomWebsite === "oui" ? "Oui" : "Non"}</p>
        </div>
        <div>
          <h3 className="font-medium text-foreground">Plateformes à scrapper :</h3>
          <p>{displayedScrapingPlatforms.join(", ") || "Aucune sélectionnée"}</p>
        </div>
        <div>
          <h3 className="font-medium text-foreground">Comment avez-vous découvert Scraap.ai :</h3>
          <p>{formData.discoverySource}</p>
        </div>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="cursor-pointer" disabled={isLoading}>Précédent</Button>
        <Button onClick={onFinish} className="cursor-pointer" disabled={isLoading}>
          {isLoading ? "Finalisation..." : "Terminer"}
        </Button>
      </div>
    </div>
  );
}