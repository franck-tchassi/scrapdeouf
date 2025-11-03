import { prisma } from './prismadb';
import { scrapeGoogleMapsSearch } from './google-maps-scraper';
import { scrapeAmazonProducts } from './amazon-scraper';
import { addMonths, addYears, isPast } from 'date-fns';
import { getNextRunTime } from './scheduler';
import { ScrapeJobData } from './queue';
import { ProxyConfig } from './proxies';
import { ExtractionStatus } from '@prisma/client';

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

export async function executeScrapeLogic(jobData: ScrapeJobData) {
  const { extractionId, userId, template, isScheduledRun, proxyConfig } = jobData;
  let finalCreditsConsumed = 0;
  let finalDurationMs = 0;
  let finalPagesVisited = 0;
  let finalSuccessfulScrapes = 0;
  let finalFailedScrapes = 0;
  let finalProxyUsed = false;
  let finalProxyHost: string | undefined = undefined;
  let extractionStatus: ExtractionStatus = 'completed';
  let errorMessage: string | undefined;

  try {
    console.log(`[SCRAPE_LOGIC] Starting scrape for extraction ${extractionId} (Template: ${template})`);

    // Récupérer les détails de l'extraction et de l'utilisateur
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
      throw new Error('User not found for job.');
    }

    const activeSubscription = userWithSubscriptions.subscriptions[0];
    let currentCreditsLimit = CREDIT_LIMITS.FREE;

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
        console.log(`[SCRAPE_LOGIC] User ${userId}: Credits are being reset due to past reset date or missing lastCreditReset.`);
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
        console.log(`[SCRAPE_LOGIC] User ${userId}: No active subscription. Forcing FREE plan defaults.`);
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
      where: { id: extractionId, userId: userId },
    });

    if (!extraction) {
      throw new Error('Extraction not found for job.');
    }

    // Mettre à jour le statut de l'extraction à 'running' au début de l'exécution
    await prisma.extraction.update({
      where: { id: extractionId },
      data: { status: 'running', lastRunAt: new Date() },
    });

    let scrapeResult: {
      results: any[];
      durationMs: number;
      pagesVisited: number;
      successfulScrapes: number;
      failedScrapes: number;
      proxyUsed: boolean;
      proxyHost?: string;
    };
    let creditsNeeded = 0;

    // Sélectionner un proxy pour le scraping
    const selectedProxyConfig: ProxyConfig | undefined = proxyConfig;
    if (selectedProxyConfig) {
      console.log(`[SCRAPE_LOGIC] Using proxy: ${selectedProxyConfig.host}:${selectedProxyConfig.port}`);
      finalProxyUsed = true;
      finalProxyHost = selectedProxyConfig.host;
    } else {
      console.log('[SCRAPE_LOGIC] No proxy available, proceeding without proxy.');
      finalProxyUsed = false;
    }

    if (template === 'google_maps') {
      const { googleMapsUrl, maxResults, enrichEmails, enrichPhones } = jobData;
      if (!googleMapsUrl) throw new Error('Google Maps URL is missing.');
      
      scrapeResult = await scrapeGoogleMapsSearch(googleMapsUrl, maxResults || 20, selectedProxyConfig, enrichEmails || false, enrichPhones || false);
      
      creditsNeeded = scrapeResult.results.length * CREDIT_COSTS.GOOGLE_MAPS_BASE_RESULT;
      if (enrichEmails) {
        creditsNeeded += scrapeResult.results.length * CREDIT_COSTS.GOOGLE_MAPS_ENRICH_EMAIL;
      }
      if (enrichPhones) {
        creditsNeeded += scrapeResult.results.length * CREDIT_COSTS.GOOGLE_MAPS_ENRICH_PHONE;
      }

    } else if (template === 'amazon') {
      const { amazonUrl, amazonMaxResults } = jobData;
      if (!amazonUrl) throw new Error('Amazon URL is missing.');
      
      scrapeResult = await scrapeAmazonProducts(amazonUrl, amazonMaxResults || 5, selectedProxyConfig);
      
      creditsNeeded = scrapeResult.results.length * CREDIT_COSTS.AMAZON_BASE_PRODUCT;
      creditsNeeded += scrapeResult.results.length * CREDIT_COSTS.AMAZON_DETAIL_ENRICHMENT;

    } else {
      throw new Error('Unsupported extraction template.');
    }

    finalDurationMs = scrapeResult.durationMs;
    finalPagesVisited = scrapeResult.pagesVisited;
    finalSuccessfulScrapes = scrapeResult.successfulScrapes;
    finalFailedScrapes = scrapeResult.failedScrapes;
    finalProxyUsed = scrapeResult.proxyUsed;
    finalProxyHost = scrapeResult.proxyHost;
    finalCreditsConsumed = creditsNeeded;

    if (currentCreditsUsed + creditsNeeded > currentCreditsLimitFinal) {
      throw new Error(`Insufficient credits. Needed: ${creditsNeeded}, Available: ${currentCreditsLimitFinal - currentCreditsUsed}.`);
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        creditsUsed: currentCreditsUsed + finalCreditsConsumed,
      },
    });

    console.log(`[SCRAPE_LOGIC] User ${userId}: Credits deducted. New usage: ${currentCreditsUsed + finalCreditsConsumed}/${currentCreditsLimitFinal}.`);
    console.log(`[SCRAPE_LOGIC] Extraction ${extractionId} completed successfully with ${scrapeResult.results.length} results`);

    let nextRunAtDate: Date | null = extraction.nextRunAt;
    if (isScheduledRun && extraction.cronExpression) {
      nextRunAtDate = await getNextRunTime(extraction.cronExpression);
    }

    await prisma.extraction.update({
      where: { id: extractionId },
      data: {
        status: 'completed',
        resultsData: JSON.stringify(scrapeResult.results),
        creditsConsumed: finalCreditsConsumed,
        updatedAt: new Date(),
        durationMs: finalDurationMs,
        pagesVisited: finalPagesVisited,
        successfulScrapes: finalSuccessfulScrapes,
        failedScrapes: finalFailedScrapes,
        proxyUsed: finalProxyUsed,
        proxyHost: finalProxyHost,
        nextRunAt: nextRunAtDate,
      },
    });
    return {
      success: true,
      results: scrapeResult.results,
      monitoring: {
        durationMs: finalDurationMs,
        pagesVisited: finalPagesVisited,
        successfulScrapes: finalSuccessfulScrapes,
        failedScrapes: finalFailedScrapes,
        proxyUsed: finalProxyUsed,
        proxyHost: finalProxyHost,
      },
      creditsConsumed: finalCreditsConsumed,
    };

  } catch (error: any) {
    console.error(`[SCRAPE_LOGIC] Error processing extraction ${extractionId}:`, error.message);
    extractionStatus = 'error';
    errorMessage = error.message;

    await prisma.extraction.update({
      where: { id: extractionId },
      data: {
        status: 'error',
        updatedAt: new Date(),
        durationMs: finalDurationMs,
        pagesVisited: finalPagesVisited,
        successfulScrapes: finalSuccessfulScrapes,
        failedScrapes: finalFailedScrapes,
        proxyUsed: finalProxyUsed,
        proxyHost: finalProxyHost,
      },
    });
    throw error;
  }
}