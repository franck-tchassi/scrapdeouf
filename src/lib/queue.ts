//lib/queue.ts

import { Queue } from 'bullmq';
import { redis } from './redis';
import { ExtractionTemplate } from '@prisma/client';
import { ProxyConfig } from './proxies'; // Importez ProxyConfig

// Définir le type de données pour un job de scraping
export interface ScrapeJobData {
  extractionId: string;
  userId: string;
  template: ExtractionTemplate;
  googleMapsUrl?: string;
  maxResults?: number;
  enrichEmails?: boolean;
  enrichPhones?: boolean;
  amazonUrl?: string;
  amazonMaxResults?: number;
  isScheduledRun?: boolean; // Pour distinguer les exécutions manuelles des exécutions planifiées
  proxyConfig?: ProxyConfig; // Ajout du champ proxyConfig
}

// Créer une instance de la file d'attente
export const scrapeQueue = new Queue<ScrapeJobData>('scrapeQueue', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3, // Nombre de tentatives en cas d'échec
    backoff: {
      type: 'exponential',
      delay: 5000, // Délai initial de 5 secondes, exponentiel
    },
  },
});

console.log('BullMQ scrapeQueue initialized.');