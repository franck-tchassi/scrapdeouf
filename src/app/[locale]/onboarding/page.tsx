"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { OnboardingLayout } from "@/components/onboarding/onboarding-layout";
import { StepCompanyInfo } from "@/components/onboarding/step-company-info";
import { StepUseCase } from "@/components/onboarding/step-use-case";
import { StepMainUsage } from "@/components/onboarding/step-main-usage";
import { StepWebsiteInfo } from "@/components/onboarding/step-website-info"; // NOUVEL IMPORT
import { StepScrapingPlatforms } from "@/components/onboarding/step-scraping-platforms";
import { StepDiscoverySource } from "@/components/onboarding/step-discovery-source";
import { StepSummary } from "@/components/onboarding/step-summary";

// Define Zod schemas for each step
const step1Schema = z.object({ // Company Size
  companySize: z.string().min(1, "La taille de l'entreprise est requise."),
});

const step2Schema = z.object({ // Main Objective
  mainObjective: z.string().min(1, "Veuillez sélectionner un objectif principal."),
});

const step3Schema = z.object({ // Main Usage
  mainUsage: z.string().min(1, "Veuillez sélectionner votre utilisation principale."),
});

const step4Schema = z.object({ // Website Info (REMPLACE Data Sources)
  hasWebsite: z.string().min(1, "Veuillez indiquer si vous avez un site web."), // CHANGED TO STRING
  websiteUrl: z.string().url("Veuillez entrer une URL valide.").optional().or(z.literal("")),
  needsCustomWebsite: z.string().min(1, "Veuillez indiquer si vous avez besoin d'un site web sur mesure."), // CHANGED TO STRING
}).refine((data) => {
  // Si hasWebsite est "oui", websiteUrl ne doit pas être vide
  if (data.hasWebsite === "oui" && !data.websiteUrl) {
    return false;
  }
  return true;
}, {
  message: "Veuillez entrer l'URL de votre site web.",
  path: ["websiteUrl"],
});


const step5Schema = z.object({ // Scraping Platforms
  scrapingPlatforms: z.array(z.string()).min(1, "Veuillez sélectionner au moins une plateforme à scrapper."),
  otherScrapingPlatform: z.string().optional(),
});

const step6Schema = z.object({ // Discovery Source
  discoverySource: z.string().min(1, "Veuillez indiquer comment vous nous avez découvert."),
});

const onboardingSchema = z.object({
  companySize: z.string().min(1, "La taille de l'entreprise est requise."),
  mainObjective: z.string().min(1, "Veuillez sélectionner un objectif principal."),
  mainUsage: z.string().min(1, "Veuillez sélectionner votre utilisation principale."),
  hasWebsite: z.string().min(1, "Veuillez indiquer si vous avez un site web."), // NOUVEAU CHAMP
  websiteUrl: z.string().url("Veuillez entrer une URL valide.").optional().or(z.literal("")), // NOUVEAU CHAMP
  needsCustomWebsite: z.string().min(1, "Veuillez indiquer si vous avez besoin d'un site web sur mesure."), // NOUVEAU CHAMP
  scrapingPlatforms: z.array(z.string()).min(1, "Veuillez sélectionner au moins une plateforme à scrapper."),
  otherScrapingPlatform: z.string().optional(),
  discoverySource: z.string().min(1, "Veuillez indiquer comment vous nous avez découvert."),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      companySize: "",
      mainObjective: "",
      mainUsage: "",
      hasWebsite: "", // NOUVELLE VALEUR PAR DÉFAUT
      websiteUrl: "", // NOUVELLE VALEUR PAR DÉFAUT
      needsCustomWebsite: "", // NOUVELLE VALEUR PAR DÉFAUT
      scrapingPlatforms: [],
      otherScrapingPlatform: "",
      discoverySource: "",
    },
    mode: "onChange",
  });

  const { trigger, getValues, formState: { isValid } } = methods;

  const handleNext = async () => {
    let currentStepIsValid = false;
    if (step === 1) {
      currentStepIsValid = await trigger("companySize");
    } else if (step === 2) {
      currentStepIsValid = await trigger("mainObjective");
    } else if (step === 3) {
      currentStepIsValid = await trigger("mainUsage");
    } else if (step === 4) { // Étape des informations sur le site web
      const values = getValues();
      const hasWebsiteValid = await trigger("hasWebsite");
      const needsCustomWebsiteValid = await trigger("needsCustomWebsite");
      let websiteUrlValid = true;

      if (values.hasWebsite === "oui") { // Vérifie si "oui" est sélectionné
        websiteUrlValid = await trigger("websiteUrl");
      }
      currentStepIsValid = hasWebsiteValid && needsCustomWebsiteValid && websiteUrlValid;
    } else if (step === 5) {
      const values = getValues();
      const isOtherCheckboxChecked = values.scrapingPlatforms.includes("other_option_checkbox");

      if (isOtherCheckboxChecked) {
        const platformsValid = await trigger("scrapingPlatforms");
        const otherPlatformValid = await trigger("otherScrapingPlatform");

        if (isOtherCheckboxChecked && !values.otherScrapingPlatform) {
          methods.setError("otherScrapingPlatform", { type: "manual", message: "Veuillez préciser la plateforme." });
          currentStepIsValid = false;
        } else {
          currentStepIsValid = platformsValid && otherPlatformValid;
        }
      } else {
        currentStepIsValid = await trigger("scrapingPlatforms");
      }
    } else if (step === 6) {
      currentStepIsValid = await trigger("discoverySource");
    }

    if (currentStepIsValid && step < 7) {
      setStep(step + 1);
    } else if (!currentStepIsValid) {
      toast.error("Veuillez remplir tous les champs requis pour continuer.");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const formData = getValues();
      const finalScrapingPlatforms = [...formData.scrapingPlatforms];

      if (formData.scrapingPlatforms.includes("other_option_checkbox") && formData.otherScrapingPlatform) {
        finalScrapingPlatforms.push(formData.otherScrapingPlatform);
      }

      const cleanedScrapingPlatforms = finalScrapingPlatforms.filter(
        (platform) => platform !== "other_option_checkbox"
      );

      await fetch("/api/user/complete-onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          scrapingPlatforms: cleanedScrapingPlatforms,
          otherScrapingPlatform: undefined,
        }),
      });
      toast.success("Onboarding terminé avec succès !");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast.error("Une erreur est survenue lors de la finalisation de l'onboarding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <OnboardingLayout currentStep={step} totalSteps={7}>
        {step === 1 && <StepCompanyInfo onNext={handleNext} />}
        {step === 2 && <StepUseCase onNext={handleNext} onBack={handleBack} />}
        {step === 3 && <StepMainUsage onNext={handleNext} onBack={handleBack} />}
        {step === 4 && <StepWebsiteInfo onNext={handleNext} onBack={handleBack} />} {/* NOUVEAU COMPOSANT */}
        {step === 5 && <StepScrapingPlatforms onNext={handleNext} onBack={handleBack} />}
        {step === 6 && <StepDiscoverySource onNext={handleNext} onBack={handleBack} />}
        {step === 7 && <StepSummary onFinish={handleFinish} onBack={handleBack} isLoading={loading} />}
      </OnboardingLayout>
    </FormProvider>
  );
}