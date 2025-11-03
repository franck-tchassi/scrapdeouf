import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prismadb';
import { format, subMonths, startOfMonth } from 'date-fns';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Récupérer les extractions de l'utilisateur pour les 6 derniers mois
    const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5)); // Inclut le mois actuel + les 5 précédents

    const extractions = await prisma.extraction.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: sixMonthsAgo,
        },
        status: 'completed', // Nous nous intéressons aux extractions terminées
      },
      select: {
        createdAt: true,
        creditsConsumed: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Initialiser les données pour les 6 derniers mois
    const monthlyStatsMap = new Map<string, { creditsUsed: number; extractionsCompleted: number }>();
    for (let i = 0; i < 6; i++) {
      const month = format(startOfMonth(subMonths(new Date(), 5 - i)), 'yyyy-MM');
      monthlyStatsMap.set(month, { creditsUsed: 0, extractionsCompleted: 0 });
    }

    // Agréger les données par mois
    extractions.forEach(extraction => {
      const month = format(startOfMonth(extraction.createdAt), 'yyyy-MM');
      const stats = monthlyStatsMap.get(month);
      if (stats) {
        stats.creditsUsed += extraction.creditsConsumed || 0;
        stats.extractionsCompleted += 1;
      }
    });

    const aggregatedData = Array.from(monthlyStatsMap.entries()).map(([month, stats]) => ({
      date: month,
      creditsUsed: stats.creditsUsed,
      extractionsCompleted: stats.extractionsCompleted,
    }));

    return NextResponse.json(aggregatedData, { status: 200 });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Failed to fetch user statistics' }, { status: 500 });
  }
}