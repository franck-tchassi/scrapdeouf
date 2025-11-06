//api/stripe/webhook/route.ts

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/prismadb';
import { SubscriptionPlan } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Définir les limites de crédits par plan
const CREDIT_LIMITS = {
  FREE: 100,
  PRO: 5000,
  PREMIUM: 10000,
  ENTERPRISE: 40000,
};

// Mapping des priceIds vers les plans
const PRICE_ID_TO_PLAN: Record<string, SubscriptionPlan> = {
  // Production priceIds
  'price_1SPuzMAkgFpt9TxPsK9g7gbQ': SubscriptionPlan.PRO,
  'price_1SPv28AkgFpt9TxPw0Vac27F': SubscriptionPlan.PRO, 
  'price_1SPv4LAkgFpt9TxPgS9etmIe': SubscriptionPlan.PREMIUM,
  'price_1SPv5KAkgFpt9TxPblXTZdfY': SubscriptionPlan.PREMIUM,
  'price_1SPv6fAkgFpt9TxPOaDeZU91': SubscriptionPlan.ENTERPRISE,
  'price_1SPv7UAkgFpt9TxPIkLWwEDK': SubscriptionPlan.ENTERPRISE,
  
  // Development priceIds
  'price_1SPuYuAkgFpt9TxPBzcZZLPs': SubscriptionPlan.PRO,
  'price_1SPub2AkgFpt9TxPTd41uvzM': SubscriptionPlan.PRO,
  'price_1SPucTAkgFpt9TxPOvpxUmJl': SubscriptionPlan.PREMIUM,
  'price_1SPuczAkgFpt9TxPLCYndrYk': SubscriptionPlan.PREMIUM,
  'price_1SPueCAkgFpt9TxP7e3Q8Owo': SubscriptionPlan.ENTERPRISE,
  'price_1SPuemAkgFpt9TxPfqikl4td': SubscriptionPlan.ENTERPRISE,
};

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    console.error('La signature du webhook est manquante.');
    return NextResponse.json({ error: 'Webhook signature missing' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret!);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    console.log(`🔄 Processing event type: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('🛒 Checkout session completed:', session.id);
        
        if (!session.customer || !session.subscription) {
          throw new Error('Customer ID ou Subscription ID manquant dans la session');
        }

        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        
        // Récupérer les détails complets de l'abonnement
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;
        
        // Déterminer le plan basé sur le priceId
        const subscriptionPlan = PRICE_ID_TO_PLAN[priceId] || SubscriptionPlan.FREE;
        const creditsLimit = CREDIT_LIMITS[subscriptionPlan] || CREDIT_LIMITS.FREE;
        const interval = subscription.items.data[0].price.recurring?.interval || 'month';

        console.log(`💰 Price ID: ${priceId}, Plan: ${subscriptionPlan}, Credits: ${creditsLimit}`);

        // Récupérer le customer pour avoir l'email
        const customer = await stripe.customers.retrieve(customerId);
        if ('deleted' in customer || !customer.email) {
          throw new Error('Customer invalide ou email manquant');
        }

        // Chercher l'utilisateur par stripeCustomerId ou email
        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { stripeCustomerId: customerId },
              { email: customer.email }
            ]
          }
        });

        if (user) {
          // ⚠️ CORRECTION : NE PAS réinitialiser creditsUsed pour les utilisateurs existants
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              stripeCustomerId: customerId,
              email: customer.email,
              isActive: true,
              creditsLimit: creditsLimit,
              // ⚠️ creditsUsed conserve sa valeur existante
              lastCreditReset: new Date(),
            },
          });
          console.log(`✅ User updated: ${user.id}, credits: ${user.creditsUsed}/${user.creditsLimit}`);
        } else {
          // Nouvel utilisateur - initialiser à 0
          user = await prisma.user.create({
            data: {
              email: customer.email,
              stripeCustomerId: customerId,
              isActive: true,
              creditsLimit: creditsLimit,
              creditsUsed: 0,
              lastCreditReset: new Date(),
            },
          });
          console.log(`✅ New user created: ${user.id}`);
        }

        // Créer ou mettre à jour l'abonnement
        await prisma.subscription.upsert({
          where: { stripeSubscriptionId: subscriptionId },
          update: {
            plan: subscriptionPlan,
            interval: interval,
            status: subscription.status,
          },
          create: {
            userId: user.id,
            stripeSubscriptionId: subscriptionId,
            plan: subscriptionPlan,
            interval: interval,
            status: subscription.status,
          },
        });

        console.log(`✅ Subscription processed for user ${user.id}, plan: ${subscriptionPlan}`);
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`📦 Subscription ${event.type}: ${subscription.id}`);

        const priceId = subscription.items.data[0].price.id;
        const subscriptionPlan = PRICE_ID_TO_PLAN[priceId] || SubscriptionPlan.FREE;
        const creditsLimit = CREDIT_LIMITS[subscriptionPlan] || CREDIT_LIMITS.FREE;
        const interval = subscription.items.data[0].price.recurring?.interval || 'month';

        // Trouver l'abonnement existant
        const existingSubscription = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
          include: { user: true },
        });

        if (existingSubscription) {
          // Mettre à jour l'abonnement existant
          await prisma.subscription.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              status: subscription.status,
              plan: subscriptionPlan,
              interval: interval,
            },
          });

          // Mettre à jour les crédits si l'abonnement est actif
          if (subscription.status === 'active' || subscription.status === 'trialing') {
            // ⚠️ CORRECTION : NE PAS réinitialiser creditsUsed
            await prisma.user.update({
              where: { id: existingSubscription.userId },
              data: {
                creditsLimit: creditsLimit,
                // ⚠️ creditsUsed conserve sa valeur existante
                lastCreditReset: new Date(),
                isActive: true,
              },
            });
            console.log(`✅ Credits limit updated for user ${existingSubscription.userId}`);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`🗑️ Subscription deleted: ${subscription.id}`);

        const sub = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (sub) {
          // Mettre à jour le statut de l'abonnement
          await prisma.subscription.update({
            where: { stripeSubscriptionId: subscription.id },
            data: { status: 'canceled' },
          });

          // ⚠️ CORRECTION : Revenir au plan FREE SANS réinitialiser creditsUsed
          await prisma.user.update({
            where: { id: sub.userId },
            data: {
              creditsLimit: CREDIT_LIMITS.FREE,
              // ⚠️ creditsUsed conserve sa valeur existante
              isActive: false,
            },
          });
          console.log(`✅ Subscription canceled and user ${sub.userId} downgraded to FREE plan`); 
        }
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error(`❌ Webhook processing error:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 500 }
    );
  }
}