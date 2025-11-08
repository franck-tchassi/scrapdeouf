//onboarding/page.tsx

// app/[locale]/onboarding/page.tsx
"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import { onboardingSchema, OnboardingFormData } from "@/lib/onboardingSchema";
import { TypeformLayout } from "@/components/onboarding/TypeformLayout";

import { StepCompanyInfo } from "@/components/onboarding/steps/StepCompanyInfo";
import { StepUseCase } from "@/components/onboarding/steps/StepUseCase";
import { StepMainUsage } from "@/components/onboarding/steps/StepMainUsage";
import { StepWebsiteInfo } from "@/components/onboarding/steps/StepWebsiteInfo";
import { StepScrapingPlatforms } from "@/components/onboarding/steps/StepScrapingPlatforms";
import { StepDiscoverySource } from "@/components/onboarding/steps/StepDiscoverySource";
import { StepSummary } from "@/components/onboarding/steps/StepSummary";

const steps = [
  { title: "Quelle est la taille de votre entreprise ?", key: "companySize" },
  { title: "Quel est votre objectif principal ?", key: "mainObjective" },
  { title: "Quelle sera votre utilisation principale ?", key: "mainUsage" },
  { title: "Informations sur votre site web", key: "website" },
  { title: "Quelles plateformes voulez-vous scrapper ?", key: "scrapingPlatforms" },
  { title: "Comment avez-vous découvert Scraap.ai ?", key: "discoverySource" },
  { title: "Résumé", key: "summary" },
];

export default function OnboardingPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const totalSteps = steps.length;

  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      companySize: "",
      mainObjective: "",
      mainUsage: "",
      hasWebsite: "",
      websiteUrl: "",
      needsCustomWebsite: "",
      scrapingPlatforms: [],
      otherScrapingPlatform: "",
      discoverySource: "",
    },
    mode: "onChange",
  });

  const { trigger, getValues } = methods;

  const handleNext = async () => {
    // Validate depending on step
    let ok = false;
    const s = stepIndex;

    if (s === 0) ok = await trigger("companySize");
    else if (s === 1) ok = await trigger("mainObjective");
    else if (s === 2) ok = await trigger("mainUsage");
    else if (s === 3) {
      const vals = getValues();
      const hasWebsiteValid = await trigger("hasWebsite");
      const needsCustomValid = await trigger("needsCustomWebsite");
      let websiteUrlValid = true;
      if (vals.hasWebsite === "oui") websiteUrlValid = await trigger("websiteUrl");
      ok = hasWebsiteValid && needsCustomValid && websiteUrlValid;
    } else if (s === 4) {
      const vals = getValues();
      const isOther = vals.scrapingPlatforms?.includes("other_option_checkbox");
      const platformsValid = await trigger("scrapingPlatforms");
      if (isOther) {
        const otherValid = await trigger("otherScrapingPlatform");
        if (isOther && !vals.otherScrapingPlatform) {
          methods.setError("otherScrapingPlatform", { type: "manual", message: "Veuillez préciser la plateforme." });
          ok = false;
        } else {
          ok = platformsValid && otherValid;
        }
      } else {
        ok = platformsValid;
      }
    } else if (s === 5) ok = await trigger("discoverySource");
    else ok = true;

    if (ok) {
      setStepIndex((p) => Math.min(p + 1, totalSteps - 1));
    } else {
      toast.error("Veuillez remplir les champs requis pour continuer.");
    }
  };

  const handleBack = () => {
    setStepIndex((p) => Math.max(0, p - 1));
  };

  const handleFinish = async () => {
    // final submit
    const vals = getValues();
    setStepIndex(totalSteps - 1); // go to summary (if not already)
    try {
      const finalPlatforms = [...(vals.scrapingPlatforms || [])];
      if (finalPlatforms.includes("other_option_checkbox") && vals.otherScrapingPlatform) {
        finalPlatforms.push(vals.otherScrapingPlatform);
      }
      const cleaned = finalPlatforms.filter((p) => p !== "other_option_checkbox");

      await fetch("/api/user/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...vals, scrapingPlatforms: cleaned }),
      });
      toast.success("Onboarding terminé !");
      // redirect if needed (ex: router.push("/dashboard"))
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la finalisation.");
    }
  };

  // choose component by index
  const StepComponent = [
    <StepCompanyInfo key="s0" onNext={handleNext} />,
    <StepUseCase key="s1" onNext={handleNext} onBack={handleBack} />,
    <StepMainUsage key="s2" onNext={handleNext} onBack={handleBack} />,
    <StepWebsiteInfo key="s3" onNext={handleNext} onBack={handleBack} />,
    <StepScrapingPlatforms key="s4" onNext={handleNext} onBack={handleBack} />,
    <StepDiscoverySource key="s5" onNext={handleNext} onBack={handleBack} />,
    <StepSummary key="s6" onBack={handleBack} onFinish={handleFinish} />,
  ][stepIndex];

  return (
    <FormProvider {...methods}>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28 }}
        >
          <TypeformLayout currentStep={stepIndex + 1} totalSteps={totalSteps} title={steps[stepIndex].title}>
            {StepComponent}
          </TypeformLayout>
        </motion.div>
      </AnimatePresence>
    </FormProvider>
  );
}
