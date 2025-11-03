//actions/getCurrentUser.ts


import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prismadb";
import { SafeUser, SafeSubscription } from "@/types";
import { addMonths, addYears, isPast } from 'date-fns';
import { SubscriptionPlan } from '@prisma/client';

const CREDIT_LIMITS: Record<string, number> = {
  FREE: 100,
  PRO: 10000,
  PREMIUM: 20000,
  ENTERPRISE: 80000,
};

export async function getCurrentUser(): Promise<SafeUser | null> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return null;
    }

    let user = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
      include: {
        subscriptions: {
          where: { status: 'active' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        extractions: { // Inclure les extractions pour le comptage
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const activeSubscription = user.subscriptions[0];
    let currentCreditsLimit = CREDIT_LIMITS.FREE;

    // Logic to reset credits based on subscription plan
    if (activeSubscription) {
      currentCreditsLimit = CREDIT_LIMITS[activeSubscription.plan] || CREDIT_LIMITS.FREE;

      let nextResetDate: Date;
      if (user.lastCreditReset) {
        if (activeSubscription.interval === 'monthly') {
          nextResetDate = addMonths(user.lastCreditReset, 1);
        } else { // yearly
          nextResetDate = addYears(user.lastCreditReset, 1);
        }
      } else {
        nextResetDate = new Date(); // If no lastResetDate, set to now for first use
      }

      if (isPast(nextResetDate) || !user.lastCreditReset) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            creditsUsed: 0,
            lastCreditReset: new Date(),
            creditsLimit: currentCreditsLimit,
          },
          include: { // Inclure les relations après la mise à jour
            subscriptions: {
              where: { status: 'active' },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
            extractions: {
              select: { id: true, status: true },
            },
          },
        });
      } else if (user.creditsLimit !== currentCreditsLimit) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            creditsLimit: currentCreditsLimit,
          },
          include: { // Inclure les relations après la mise à jour
            subscriptions: {
              where: { status: 'active' },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
            extractions: {
              select: { id: true, status: true },
            },
          },
        });
      }
    } else { // No active subscription
      if (user.creditsLimit !== CREDIT_LIMITS.FREE || user.creditsUsed > 0 || !user.lastCreditReset) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            creditsUsed: 0,
            creditsLimit: CREDIT_LIMITS.FREE,
            lastCreditReset: new Date(),
          },
          include: { // Inclure les relations après la mise à jour
            subscriptions: {
              where: { status: 'active' },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
            extractions: {
              select: { id: true, status: true },
            },
          },
        });
      }
    }

    // Calculer les comptes d'extractions
    const totalExtractions = user.extractions.length;
    const completedExtractions = user.extractions.filter(e => e.status === 'completed').length;

    const safeUser: SafeUser = {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      emailVerified: user.emailVerified?.toISOString() || null,
      lastCreditReset: user.lastCreditReset?.toISOString() || new Date().toISOString(),
      activeSubscription: activeSubscription ? {
        ...activeSubscription,
        createdAt: activeSubscription.createdAt.toISOString(),
      } : null,
      totalExtractions,
      completedExtractions,
    };

    return safeUser;
  } catch (error: any) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
}