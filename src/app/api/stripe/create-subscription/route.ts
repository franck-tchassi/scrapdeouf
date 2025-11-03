//stripe/create-subscription/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prismadb';
import { SubscriptionPlan } from '@prisma/client';

// Assurez-vous que votre clé secrète Stripe est définie dans les variables d'environnement
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover', 
});

// Définir les limites de crédits par plan
const CREDIT_LIMITS: Record<string, number> = {
  FREE: 100, // Ou une petite quantité pour un plan gratuit
  PRO: 5000,
  PREMIUM: 10000,
  ENTERPRISE: 40000,
};

// Helper pour obtenir l'ID de prix Stripe basé sur le plan et l'intervalle
const getStripePriceId = (planId: string, interval: string): string => {
  switch (planId) {
    case "pro":
      return interval === "monthly"
        ? process.env.STRIPE_PRICE_PRO_MONTHLY!
        : process.env.STRIPE_PRICE_PRO_YEARLY!;
    case "premium":
      return interval === "monthly"
        ? process.env.STRIPE_PRICE_PREMIUM_MONTHLY!
        : process.env.STRIPE_PRICE_PREMIUM_YEARLY!;
    case "enterprise":
      return interval === "monthly"
        ? process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY!
        : process.env.STRIPE_PRICE_ENTERPRISE_YEARLY!;
    default:
      throw new Error(`Invalid plan ID: ${planId}`);
  }
};

// Helper pour obtenir la valeur de l'énumération SubscriptionPlan
const getSubscriptionPlanEnum = (planId: string): SubscriptionPlan  => {
  switch (planId) {
    case "pro":
      return SubscriptionPlan.PRO;
    case "premium":
      return SubscriptionPlan.PREMIUM;
    case "enterprise":
      return SubscriptionPlan.ENTERPRISE;
    default:
      throw new Error(`Invalid plan ID for enum conversion: ${planId}`);
  }
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { email, payment_method, planId, interval } = await req.json(); // Récupérer planId et interval

    if (!planId || !interval) {
      return NextResponse.json({ error: 'Missing planId or interval' }, { status: 400 });
    }

    const stripePriceId = getStripePriceId(planId, interval);
    const subscriptionPlanEnum = getSubscriptionPlanEnum(planId);
    const creditsLimit = CREDIT_LIMITS[subscriptionPlanEnum] || CREDIT_LIMITS.FREE;

    // 1. Trouver ou créer un client Stripe
    let customer;
    const customers = await stripe.customers.list({ email: email, limit: 1 });

    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: email,
        payment_method: payment_method,
        invoice_settings: { default_payment_method: payment_method },
      });
    }

    // Mettre à jour l'utilisateur dans votre base de données avec le stripeCustomerId et les crédits
    const user = await prisma.user.update({
      where: { id: userId },
      data: { 
        stripeCustomerId: customer.id,
        creditsLimit: creditsLimit,
        creditsUsed: 0, // Reset credits on new subscription
        lastCreditReset: new Date(),
      },
    });

    // 2. Attacher la méthode de paiement au client si elle n'est pas déjà la par défaut
    if (customer.invoice_settings.default_payment_method !== payment_method) {
      await stripe.paymentMethods.attach(payment_method, { customer: customer.id });
      await stripe.customers.update(customer.id, {
        invoice_settings: { default_payment_method: payment_method },
      });
    }

    // 3. Créer l'abonnement avec une période d'essai de 3 jours
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: stripePriceId }], // Utiliser l'ID de prix sélectionné dynamiquement
      trial_period_days: 3,
      expand: ['latest_invoice.payment_intent', 'items.data.price'],
    });

    // 4. Stocker les détails de l'abonnement dans votre base de données
    await prisma.subscription.create({
      data: {
        userId: userId,
        stripeSubscriptionId: subscription.id,
        plan: subscriptionPlanEnum, // Utiliser la valeur de l'énumération
        interval: interval, // Utiliser l'intervalle de la requête
        status: subscription.status,
      },
    });

    return NextResponse.json({ subscription }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}