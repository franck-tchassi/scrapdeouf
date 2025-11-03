
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prismadb';
import { addOneTimeScrapeJob, removeScheduledScrapeJob } from '@/lib/scheduler'; // Nouveaux imports
import { ScrapeJobData } from '@/lib/queue';
import { isPast } from 'date-fns'; // Import de isPast

// POST: Créer ou mettre à jour une planification
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: extractionId } = await params;

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { scheduledAt } = await req.json(); // Recevoir scheduledAt

    console.log(`[API SCHEDULE] Received scheduledAt for extraction ${extractionId}: "${scheduledAt}"`);

    if (!scheduledAt) {
      return NextResponse.json({ error: 'Scheduled date and time are required' }, { status: 400 });
    }

    const scheduledAtDate = new Date(scheduledAt);
    if (isNaN(scheduledAtDate.getTime()) || isPast(scheduledAtDate)) {
      return NextResponse.json({ error: 'Invalid or past scheduled date and time provided' }, { status: 400 });
    }

    const extraction = await prisma.extraction.findUnique({
      where: { id: extractionId, userId: session.user.id },
    });

    if (!extraction) {
      return NextResponse.json({ error: 'Extraction not found' }, { status: 404 });
    }

    // Préparer les données du job pour la file d'attente
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
      isScheduledRun: true,
    };

    // Ajouter le job unique à BullMQ
    const scheduleJobId = await addOneTimeScrapeJob(extraction.id, scheduledAtDate, jobData);

    // Mettre à jour l'extraction dans la base de données
    const updatedExtraction = await prisma.extraction.update({
      where: { id: extraction.id },
      data: {
        isScheduled: true,
        cronExpression: null, // Pas d'expression cron pour une planification unique
        nextRunAt: scheduledAtDate, // C'est la date/heure de planification
        scheduleJobId: scheduleJobId,
        status: 'scheduled',
      },
    });

    return NextResponse.json(updatedExtraction, { status: 200 });

  } catch (error: any) {
    console.error('[API] Error scheduling extraction:', error);
    return NextResponse.json({ error: error.message || 'Failed to schedule extraction' }, { status: 500 });
  }
}

// DELETE: Supprimer une planification
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: extractionId } = await params;

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const extraction = await prisma.extraction.findUnique({
      where: { id: extractionId, userId: session.user.id },
    });

    if (!extraction) {
      return NextResponse.json({ error: 'Extraction not found' }, { status: 404 });
    }

    if (extraction.isScheduled && extraction.scheduleJobId) {
      await removeScheduledScrapeJob(extraction.scheduleJobId); // Supprimer par l'ID du job BullMQ
    }

    // Mettre à jour l'extraction dans la base de données
    const updatedExtraction = await prisma.extraction.update({
      where: { id: extraction.id },
      data: {
        isScheduled: false,
        cronExpression: null,
        nextRunAt: null,
        scheduleJobId: null,
        status: 'draft',
      },
    });

    return NextResponse.json(updatedExtraction, { status: 200 });

  } catch (error: any) {
    console.error('[API] Error unscheduling extraction:', error);
    return NextResponse.json({ error: error.message || 'Failed to unschedule extraction' }, { status: 500 });
  }
}