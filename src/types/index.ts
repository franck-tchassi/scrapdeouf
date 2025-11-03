//types/index.ts

import { Extraction as PrismaExtraction, User as PrismaUser, Subscription as PrismaSubscription, ExtractionStatus } from '@prisma/client';
import { AmazonProductRow } from '@/lib/amazon-scraper';
import { GoogleMapsResultRow, MonitoringData } from '@/app/[locale]/(protedid)/dashboard/new-extraction/google-maps-results-table';

// Définit une interface pour l'extraction côté client, étendant le type Prisma
// et ajoutant des propriétés spécifiques au client comme resultsCount et les données de monitoring.
export interface ClientExtraction extends PrismaExtraction {
  resultsCount?: number;
  // Ajout des champs spécifiques à Amazon
  amazonUrl: string | null; // Correspond à Prisma String?
  amazonMaxResults: number | null; // Correspond à Prisma Int?
  // Ajout des champs de monitoring pour Google Maps
  durationMs: number | null; // Correspond à Prisma Int?
  pagesVisited: number | null; // Correspond à Prisma Int?
  successfulScrapes: number | null; // Correspond à Prisma Int?
  failedScrapes: number | null; // Correspond à Prisma Int?
  proxyUsed: boolean | null; // Correspond à Prisma Boolean?
  proxyHost: string | null; // Correspond à Prisma String?
  // Ajout des champs de planification
  isScheduled: boolean;
  cronExpression: string | null;
  nextRunAt: Date | null;
  lastRunAt: Date | null;
  scheduleJobId: string | null;
  status: ExtractionStatus; // S'assurer que le statut est inclus
}

// Types pour les résultats d'extraction
export type ExtractionResult = GoogleMapsResultRow[] | AmazonProductRow[];

// Type pour les données de monitoring (déjà défini dans google-maps-results-table.tsx, mais exporté ici pour une utilisation plus large)
export type GlobalMonitoringData = MonitoringData;

// Type SafeUser pour les données utilisateur passées aux composants clients
export type SafeUser = Omit<
  PrismaUser,
  "createdAt" | "updatedAt" | "emailVerified" | "hashedPassword" | "subscriptions" | "extractions" | "lastCreditReset"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
  // Ajout des champs de crédits
  creditsUsed: number;
  creditsLimit: number;
  lastCreditReset: string;
  // Ajout des abonnements actifs
  activeSubscription?: SafeSubscription | null;
  // Nouveaux champs pour le dashboard
  totalExtractions: number;
  completedExtractions: number;
};

export type SafeSubscription = Omit<
  PrismaSubscription,
  "createdAt"
> & {
  createdAt: string;
};