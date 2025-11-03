//lib/worker.ts

import { Worker, Job } from 'bullmq';
import { redis } from './redis';
import { ScrapeJobData } from './queue';
import { executeScrapeLogic } from './scrape-logic'; // Import de la nouvelle fonction

// Fonction pour exécuter le scraping et mettre à jour la base de données
async function executeScrapingJob(job: Job<ScrapeJobData>) {
  try {
    await executeScrapeLogic(job.data); // Appeler la logique de scraping refactorisée
  } catch (error) {
    console.error(`[WORKER] Job ${job.id} for extraction ${job.data.extractionId} failed during executeScrapeLogic:`, error);
    throw error; // Rejeter l'erreur pour que BullMQ puisse gérer les tentatives
  }
}

// Créer une instance du worker
export const scrapeWorker = new Worker<ScrapeJobData>('scrapeQueue', executeScrapingJob, {
  connection: redis,
  concurrency: 5, // Nombre de jobs à traiter en parallèle
});

scrapeWorker.on('completed', (job) => {
  console.log(`[WORKER] Job ${job.id} for extraction ${job.data.extractionId} completed.`);
});

scrapeWorker.on('failed', (job, err) => {
  console.error(`[WORKER] Job ${job?.id} for extraction ${job?.data.extractionId} failed with error:`, err);
});

scrapeWorker.on('error', (err) => {
  console.error('[WORKER] Worker experienced an error:', err);
});

console.log('BullMQ scrapeWorker initialized.');