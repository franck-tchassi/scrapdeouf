import { scrapeQueue, ScrapeJobData } from './queue';
import cron from 'node-cron'; // Gardé pour getNextRunTime si des planifications récurrentes sont ajoutées plus tard

export async function addOneTimeScrapeJob(
  extractionId: string,
  scheduledAt: Date,
  jobData: ScrapeJobData
): Promise<string> {
  console.log(`[SCHEDULER] addOneTimeScrapeJob for extraction ${extractionId} at ${scheduledAt.toISOString()}`);

  const delay = scheduledAt.getTime() - Date.now();
  if (delay < 0) {
    throw new Error('Scheduled time is in the past.');
  }

  // Utiliser un jobId cohérent pour BullMQ pour permettre un remplacement/suppression facile
  const bullMqJobId = `one-time-scrape-${extractionId}`;

  // Supprimer tout job existant avec cet ID d'abord pour s'assurer qu'un seul est actif
  await removeScheduledScrapeJob(bullMqJobId);

  const job = await scrapeQueue.add(
    bullMqJobId, // Nom cohérent pour le job
    { ...jobData, isScheduledRun: true },
    {
      delay: delay, // Planifier avec un délai spécifique
      jobId: bullMqJobId, // Utiliser l'ID cohérent ici
      removeOnComplete: true, // Supprimer le job de la file d'attente après une exécution réussie
      removeOnFail: false, // Garder le job en cas d'échec pour inspection
    }
  );

  console.log(`[SCHEDULER] Added one-time job for extraction ${extractionId} at ${scheduledAt.toISOString()}. BullMQ Job ID: ${job.id}`);
  return job.id!;
}

export async function removeScheduledScrapeJob(bullMqJobId: string): Promise<void> {
  console.log(`[SCHEDULER] Attempting to remove job with BullMQ ID: ${bullMqJobId}`);
  try {
    const job = await scrapeQueue.getJob(bullMqJobId);
    if (job) {
      await job.remove();
      console.log(`[SCHEDULER] Successfully removed BullMQ job: ${bullMqJobId}`);
    } else {
      console.log(`[SCHEDULER] BullMQ job ${bullMqJobId} not found, nothing to remove.`);
    }
  } catch (error) {
    console.error(`[SCHEDULER] Error removing BullMQ job ${bullMqJobId}:`, error);
    throw error;
  }
}

// getNextRunTime n'est plus pertinent pour les planifications uniques, mais pourrait l'être pour de futures planifications cron répétables
export async function getNextRunTime(cronExpression: string): Promise<Date | null> {
  if (!cron.validate(cronExpression)) {
    console.error(`[SCHEDULER] getNextRunTime received invalid cronExpression: "${cronExpression}"`);
    return null;
  }
  try {
    // Correction ici: utiliser .nextDate()
    const task = cron.schedule(cronExpression, () => {});
    const nextDate = task.execute(); // Obtient la prochaine date d'exécution
    task.destroy(); // Détruire la tâche cron après avoir obtenu la date
    return nextDate;
  } catch (error) {
    console.error("Error getting next run time:", error);
    return null;
  }
}