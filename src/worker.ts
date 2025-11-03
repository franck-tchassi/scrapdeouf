import { scrapeWorker } from './lib/worker';

console.log('BullMQ worker process started. Listening for jobs...');

// Garder le processus en vie et gérer l'arrêt propre
process.on('SIGINT', async () => {
  console.log('Shutting down worker...');
  await scrapeWorker.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down worker...');
  await scrapeWorker.close();
  process.exit(0);
});