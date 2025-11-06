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

    console.log(`[USER_CREDITS] 🚨 Fetching user ${userId} from database...`);

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

    // ⚠️ CORRECTION CRITIQUE : FORCER une relecture fraîche depuis la base
    const freshUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { creditsUsed: true, creditsLimit: true, lastCreditReset: true, updatedAt: true }
    });

    console.log(`[USER_CREDITS] 🚨 Initial read: ${userWithSubscriptions.creditsUsed}/${userWithSubscriptions.creditsLimit}`);
    console.log(`[USER_CREDITS] 🚨 Fresh read: ${freshUser?.creditsUsed}/${freshUser?.creditsLimit}`);
    console.log(`[USER_CREDITS] 🚨 User updated at: ${freshUser?.updatedAt}`);

    // Utiliser les données FRAÎCHES de la base
    const currentCreditsUsed = freshUser?.creditsUsed || userWithSubscriptions.creditsUsed;
    const currentCreditsLimit = freshUser?.creditsLimit || userWithSubscriptions.creditsLimit;
    const currentLastCreditReset = freshUser?.lastCreditReset || userWithSubscriptions.lastCreditReset;

    const activeSubscription = userWithSubscriptions.subscriptions[0];
    let finalCreditsLimit = CREDIT_LIMITS.FREE;
    let currentPlan = 'FREE';

    // Préparer les données de mise à jour
    let updateData: any = {};
    let needsUpdate = false;

    if (activeSubscription) {
      // LOGIQUE POUR UTILISATEURS PAYANTS
      currentPlan = activeSubscription.plan;
      finalCreditsLimit = CREDIT_LIMITS[activeSubscription.plan] || CREDIT_LIMITS.FREE;

      let nextResetDate: Date;
      if (currentLastCreditReset) {
        if (activeSubscription.interval === 'monthly') {
          nextResetDate = addMonths(currentLastCreditReset, 1);
        } else { // yearly
          nextResetDate = addYears(currentLastCreditReset, 1);
        }

        if (isPast(nextResetDate)) {
          console.log(`[USER_CREDITS] User ${userId}: Monthly/yearly reset for paid plan.`);
          updateData.creditsUsed = 0;
          updateData.lastCreditReset = new Date();
          updateData.creditsLimit = finalCreditsLimit;
          needsUpdate = true;
        }
      } else {
        // Premier reset pour abonné payant
        console.log(`[USER_CREDITS] User ${userId}: First reset for paid user.`);
        updateData.creditsUsed = 0;
        updateData.lastCreditReset = new Date();
        updateData.creditsLimit = finalCreditsLimit;
        needsUpdate = true;
      }

      // Update creditsLimit si le plan a changé
      if (currentCreditsLimit !== finalCreditsLimit) {
        console.log(`[USER_CREDITS] User ${userId}: Updating credits limit to ${finalCreditsLimit}`);
        updateData.creditsLimit = finalCreditsLimit;
        needsUpdate = true;
      }
    } else {
      // LOGIQUE POUR UTILISATEURS FREE - CORRIGÉE DÉFINITIVEMENT
      currentPlan = 'FREE';
      finalCreditsLimit = CREDIT_LIMITS.FREE;

      console.log(`[USER_CREDITS] User ${userId}: FREE user - Fresh credits: ${currentCreditsUsed}/${currentCreditsLimit}`);

      // UNIQUEMENT mettre à jour si la limite est incorrecte, en préservant les crédits utilisés
      if (currentCreditsLimit !== CREDIT_LIMITS.FREE) {
        console.log(`[USER_CREDITS] User ${userId}: Fixing FREE plan limit while preserving used credits`);
        updateData.creditsLimit = CREDIT_LIMITS.FREE;
        updateData.creditsUsed = currentCreditsUsed; // Préserver les crédits utilisés

        // Si on corrige la limite, on garde les crédits utilisés existants
        if (currentCreditsUsed > CREDIT_LIMITS.FREE) {
          // Si l'utilisateur a plus de crédits utilisés que la limite FREE, on ajuste
          updateData.creditsUsed = CREDIT_LIMITS.FREE;
          console.log(`[USER_CREDITS] Adjusting creditsUsed to limit: ${CREDIT_LIMITS.FREE}`);
        } else {
          // ⚠️ CONSERVER les crédits utilisés existants
          console.log(`[USER_CREDITS] Keeping existing creditsUsed: ${currentCreditsUsed}`);
        }

        needsUpdate = true;
      } else {
        // Configuration correcte - NE RIEN FAIRE pour les FREE users
        console.log(`[USER_CREDITS] User ${userId}: FREE config OK - no update needed`);
      }
    }

    // Mettre à jour l'utilisateur si nécessaire
    let finalUserData;
    if (needsUpdate) {
      console.log(`[USER_CREDITS] Updating user ${userId} with:`, updateData);
      finalUserData = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });
      console.log(`[USER_CREDITS] User ${userId} updated. New credits: ${finalUserData.creditsUsed}/${finalUserData.creditsLimit}`);
    } else {
      // Utiliser les données FRAÎCHES de la base
      finalUserData = {
        ...userWithSubscriptions,
        creditsUsed: currentCreditsUsed,
        creditsLimit: currentCreditsLimit,
        lastCreditReset: currentLastCreditReset
      };
      console.log(`[USER_CREDITS] User ${userId} not updated. Current credits: ${finalUserData.creditsUsed}/${finalUserData.creditsLimit}`);
    }

    return NextResponse.json({
      creditsUsed: finalUserData.creditsUsed,
      creditsLimit: finalUserData.creditsLimit,
      plan: currentPlan,
      lastCreditReset: finalUserData.lastCreditReset,
    }, { status: 200 });

  } catch (error) {
    console.error('[USER_CREDITS] Error fetching user credits:', error);
    return NextResponse.json({ error: 'Failed to fetch user credits' }, { status: 500 });
  }
}