// /api/user/complete-onboarding/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      companySize,
      mainObjective,
      mainUsage,
      hasWebsite: hasWebsiteString,
      websiteUrl,
      needsCustomWebsite: needsCustomWebsiteString, 
      scrapingPlatforms,
      discoverySource,
    } = await req.json();

    // Convertir les chaînes "oui"/"non" en booléens pour Prisma
    const hasWebsite = hasWebsiteString === "oui";
    const needsCustomWebsite = needsCustomWebsiteString === "oui";

    console.log("Données d'onboarding reçues :", {
      companySize,
      mainObjective,
      mainUsage,
      hasWebsite, // Maintenant un booléen
      websiteUrl,
      needsCustomWebsite, // Maintenant un booléen
      scrapingPlatforms,
      discoverySource,
    });

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        hasCompletedOnboarding: true,
        companySize,
        mainObjective,
        mainUsage,
        hasWebsite, // Utiliser le booléen converti
        websiteUrl,
        needsCustomWebsite, // Utiliser le booléen converti
        scrapingPlatforms,
        discoverySource,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la finalisation de l'onboarding :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}