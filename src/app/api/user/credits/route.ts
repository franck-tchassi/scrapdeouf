//api/user/credits/route.ts


import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prismadb';
import { addMonths, addYears, isPast } from 'date-fns';

// Définir les limites de crédits par plan
const CREDIT_LIMITS: Record<string, number> = {
  FREE: 100,
  PRO: 5000,
  PREMIUM: 10000,
  ENTERPRISE: 40000,
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Récupérer l'utilisateur avec ses abonnements actifs
    const userWithSubscriptions = await prisma.user.findUnique({
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
    let currentPlan = 'FREE';

    // Préparer les données de mise à jour
    let updateData: any = {};
    let needsUpdate = false;

    if (activeSubscription) {
      currentPlan = activeSubscription.plan;
      currentCreditsLimit = CREDIT_LIMITS[activeSubscription.plan] || CREDIT_LIMITS.FREE;

      // Vérifier si les crédits doivent être réinitialisés
      let nextResetDate: Date;
      if (activeSubscription.interval === 'monthly') {
        nextResetDate = addMonths(userWithSubscriptions.lastCreditReset, 1);
      } else { // yearly
        nextResetDate = addYears(userWithSubscriptions.lastCreditReset, 1);
      }

      if (isPast(nextResetDate)) {
        console.log(`Credits for user ${userId} are being reset.`);
        updateData.creditsUsed = 0;
        updateData.lastCreditReset = new Date();
        updateData.creditsLimit = currentCreditsLimit;
        needsUpdate = true;
      } else if (userWithSubscriptions.creditsLimit !== currentCreditsLimit) {
        // Update creditsLimit if plan changed without a reset
        updateData.creditsLimit = currentCreditsLimit;
        needsUpdate = true;
      }
    } else if (userWithSubscriptions.creditsLimit !== CREDIT_LIMITS.FREE || userWithSubscriptions.creditsUsed > 0) {
      // If no active subscription, ensure user is on FREE plan and credits are reset
      updateData.creditsUsed = 0;
      updateData.creditsLimit = CREDIT_LIMITS.FREE;
      updateData.lastCreditReset = new Date();
      needsUpdate = true;
    }

    // Mettre à jour l'utilisateur si nécessaire
    let finalUserData;
    if (needsUpdate) {
      finalUserData = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });
    } else {
      finalUserData = userWithSubscriptions;
    }

    return NextResponse.json({
      creditsUsed: finalUserData.creditsUsed,
      creditsLimit: finalUserData.creditsLimit,
      plan: currentPlan,
      lastCreditReset: finalUserData.lastCreditReset,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user credits:', error);
    return NextResponse.json({ error: 'Failed to fetch user credits' }, { status: 500 });
  }
}