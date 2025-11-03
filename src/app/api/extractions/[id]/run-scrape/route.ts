//api/extractions/[id]/run-scrape/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prismadb';
import { addMonths, addYears, isPast } from 'date-fns';
import { SubscriptionPlan } from '@prisma/client';
import { scrapeQueue, ScrapeJobData } from '@/lib/queue';
import { executeScrapeLogic } from '@/lib/scrape-logic'; // Import de la nouvelle fonction
import { getRandomProxy } from '@/lib/google-maps-scraper'; // Pour le proxy en exécution directe

// Définir les limites de crédits par plan
const CREDIT_LIMITS: Record<string, number> = {
  FREE: 100,
  PRO: 10000,
  PREMIUM: 20000,
  ENTERPRISE: 80000,
};

// Coûts des crédits par action
const CREDIT_COSTS = {
  GOOGLE_MAPS_BASE_RESULT: 1,
  GOOGLE_MAPS_ENRICH_PHONE: 3,
  GOOGLE_MAPS_ENRICH_EMAIL: 5,
  AMAZON_BASE_PRODUCT: 1,
  AMAZON_DETAIL_ENRICHMENT: 2,
};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Utilisation de Promise pour params
) {
  const { id: extractionId } = await params; // Await params ici
  let estimatedCreditsNeeded = 0;

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const directRun = searchParams.get('directRun') === 'true'; // Nouveau paramètre pour l'exécution directe

    // 1. Récupérer les détails de l'extraction et de l'utilisateur
    let userWithSubscriptions = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          where: { status: 'active' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!userWithSubscriptions) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const activeSubscription = userWithSubscriptions.subscriptions[0];
    let currentCreditsLimit = CREDIT_LIMITS.FREE;

    // Variables pour stocker les données utilisateur mises à jour
    let currentCreditsUsed = userWithSubscriptions.creditsUsed;
    let currentCreditsLimitFinal = userWithSubscriptions.creditsLimit;
    let currentLastCreditReset = userWithSubscriptions.lastCreditReset;

    if (activeSubscription) {
      currentCreditsLimit = CREDIT_LIMITS[activeSubscription.plan] || CREDIT_LIMITS.FREE;

      let nextResetDate: Date;
      if (userWithSubscriptions.lastCreditReset) {
        if (activeSubscription.interval === 'monthly') {
          nextResetDate = addMonths(userWithSubscriptions.lastCreditReset, 1);
        } else { // yearly
          nextResetDate = addYears(userWithSubscriptions.lastCreditReset, 1);
        }
      } else {
        nextResetDate = new Date();
      }

      if (isPast(nextResetDate) || !userWithSubscriptions.lastCreditReset) {
        console.log(`[RUN_SCRAPE] User ${userId}: Credits are being reset due to past reset date or missing lastCreditReset.`);
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            creditsUsed: 0,
            lastCreditReset: new Date(),
            creditsLimit: currentCreditsLimit,
          },
        });
        currentCreditsUsed = updatedUser.creditsUsed;
        currentCreditsLimitFinal = updatedUser.creditsLimit;
        currentLastCreditReset = updatedUser.lastCreditReset;
      } else if (userWithSubscriptions.creditsLimit !== currentCreditsLimit) {
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            creditsLimit: currentCreditsLimit,
          },
        });
        currentCreditsLimitFinal = updatedUser.creditsLimit;
      }
    } else { // No active subscription
      if (userWithSubscriptions.creditsLimit !== CREDIT_LIMITS.FREE || userWithSubscriptions.creditsUsed > 0 || !userWithSubscriptions.lastCreditReset) {
        console.log(`[RUN_SCRAPE] User ${userId}: No active subscription. Forcing FREE plan defaults.`);
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            creditsUsed: 0,
            creditsLimit: CREDIT_LIMITS.FREE,
            lastCreditReset: new Date(),
          },
        });
        currentCreditsUsed = updatedUser.creditsUsed;
        currentCreditsLimitFinal = updatedUser.creditsLimit;
        currentLastCreditReset = updatedUser.lastCreditReset;
      }
    }

    const extraction = await prisma.extraction.findUnique({
      where: { id: extractionId, userId: session.user.id },
    });

    if (!extraction) {
      return NextResponse.json({ error: 'Extraction not found' }, { status: 404 });
    }

    // Estimer les crédits nécessaires pour la vérification préalable
    if (extraction.template === 'google_maps') {
      estimatedCreditsNeeded = (extraction.maxResults || 20) * CREDIT_COSTS.GOOGLE_MAPS_BASE_RESULT;
      if (extraction.enrichEmails) {
        estimatedCreditsNeeded += (extraction.maxResults || 20) * CREDIT_COSTS.GOOGLE_MAPS_ENRICH_EMAIL;
      }
      if (extraction.enrichPhones) {
        estimatedCreditsNeeded += (extraction.maxResults || 20) * CREDIT_COSTS.GOOGLE_MAPS_ENRICH_PHONE;
      }
    } else if (extraction.template === 'amazon') {
      estimatedCreditsNeeded = (extraction.amazonMaxResults || 5) * CREDIT_COSTS.AMAZON_BASE_PRODUCT;
      estimatedCreditsNeeded += (extraction.amazonMaxResults || 5) * CREDIT_COSTS.AMAZON_DETAIL_ENRICHMENT;
    } else {
      return NextResponse.json({ error: 'Unsupported extraction template' }, { status: 400 });
    }

    if (currentCreditsUsed + estimatedCreditsNeeded > currentCreditsLimitFinal) {
      console.log(`[RUN_SCRAPE] User ${userId}: Insufficient credits. Needed: ${estimatedCreditsNeeded}, Available: ${currentCreditsLimitFinal - currentCreditsUsed}.`);
      return NextResponse.json(
        { 
          error: `Crédits insuffisants. Vous avez besoin de ${estimatedCreditsNeeded} crédits mais il ne vous en reste que ${currentCreditsLimitFinal - currentCreditsUsed}.`,
        },
        { status: 403 }
      );
    }

    // Préparer les données du job
    const jobData: ScrapeJobData = {
      extractionId: extraction.id,
      userId: extraction.userId,
      template: extraction.template,
      googleMapsUrl: extraction.googleMapsUrl || undefined,
      maxResults: extraction.maxResults || undefined,
      enrichEmails: extraction.enrichEmails || undefined,
      enrichPhones: extraction.enrichPhones || undefined,
      amazonUrl: extraction.amazonUrl || undefined,
      amazonMaxResults: extraction.amazonMaxResults || undefined,
      isScheduledRun: false,
      proxyConfig: getRandomProxy(), // Sélectionner un proxy pour le job
    };

    if (directRun) {
      console.log(`[RUN_SCRAPE] Executing extraction ${extraction.id} directly.`);
      // Exécuter la logique de scraping directement
      const result = await executeScrapeLogic(jobData);
      return NextResponse.json({
        message: 'Extraction directe terminée avec succès.',
        results: result.results,
        monitoring: result.monitoring,
        creditsConsumed: result.creditsConsumed,
      }, { status: 200 });
    } else {
      console.log(`[RUN_SCRAPE] Adding extraction ${extraction.id} to queue.`);
      // Mettre à jour le statut de l'extraction à 'running' avant d'ajouter à la queue
      await prisma.extraction.update({
        where: { id: extraction.id },
        data: { status: 'running', lastRunAt: new Date() },
      });

      // Ajouter le job à la file d'attente
      const job = await scrapeQueue.add(`manual-scrape-${extraction.id}-${Date.now()}`, jobData);

      console.log(`[RUN_SCRAPE] Job ${job.id} added to queue for extraction ${extraction.id}.`);

      return NextResponse.json({ 
        message: 'Extraction ajoutée à la file d\'attente. Les résultats seront disponibles bientôt.',
        jobId: job.id,
        estimatedCreditsNeeded: estimatedCreditsNeeded,
      }, { status: 202 });
    }
    
  } catch (error: any) {
    console.error('[RUN_SCRAPE] Error in run-scrape:', error);
    
    // En cas d'erreur avant l'ajout à la queue, le statut reste inchangé ou est mis à 'error'
    try {
      await prisma.extraction.update({
        where: { id: extractionId },
        data: {
          status: 'error',
          updatedAt: new Date(),
        },
      });
    } catch (dbError) {
      console.error('[RUN_SCRAPE] Error updating extraction status to error:', dbError);
    }
    
    return NextResponse.json({ 
      error: error.message || 'Internal server error',
    }, { status: 500 });
  }
}