// lib/validation/onboardingSchema.ts
import { z } from "zod";

export const onboardingSchema = z.object({
  companySize: z.string().min(1, "La taille de l'entreprise est requise."),
  mainObjective: z.string().min(1, "Veuillez sélectionner un objectif principal."),
  mainUsage: z.string().min(1, "Veuillez sélectionner votre utilisation principale."),
  hasWebsite: z.string().min(1, "Veuillez indiquer si vous avez un site web."),
  websiteUrl: z.string().url("Veuillez entrer une URL valide.").optional().or(z.literal("")),
  needsCustomWebsite: z.string().min(1, "Veuillez indiquer si vous avez besoin d'un site web sur mesure."),
  scrapingPlatforms: z.array(z.string()).min(1, "Veuillez sélectionner au moins une plateforme à scrapper."),
  otherScrapingPlatform: z.string().optional().or(z.literal("")),
  discoverySource: z.string().min(1, "Veuillez indiquer comment vous nous avez découvert."),
}).refine((data) => {
  // si hasWebsite === "oui" alors websiteUrl doit être une URL non vide
  if (data.hasWebsite === "oui") {
    return !!data.websiteUrl && data.websiteUrl.trim() !== "";
  }
  return true;
}, {
  message: "Veuillez entrer l'URL de votre site web.",
  path: ["websiteUrl"],
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
