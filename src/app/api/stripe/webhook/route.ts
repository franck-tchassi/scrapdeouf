//api/stripe/webhook/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prismadb';
import { SubscriptionPlan } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover', // Revenir à une version d'API stable et cohérente
});

// Définir les limites de crédits par plan
const CREDIT_LIMITS: Record<string, number> = {
  FREE: 100, // Ou une petite quantité pour un plan gratuit
  PRO: 5000,
  PREMIUM: 10000,
  ENTERPRISE: 40000,
};

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No Stripe signature header' }, { status: 400 });
    }

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.created':
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`Subscription ${event.type}: ${subscription.id}, Status: ${subscription.status}`);

      try {
        const existingSubscription = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        const planId = subscription.items.data[0].price?.lookup_key || subscription.items.data[0].price?.id; // Use lookup_key or price ID
        let subscriptionPlanEnum: SubscriptionPlan = SubscriptionPlan.FREE;

        if (planId) {
          // Map Stripe Price ID or Lookup Key to your SubscriptionPlan enum
          if (process.env.STRIPE_PRICE_PRO_MONTHLY === planId || process.env.STRIPE_PRICE_PRO_YEARLY === planId || planId === 'pro') {
            subscriptionPlanEnum = SubscriptionPlan.PRO;
          } else if (process.env.STRIPE_PRICE_PREMIUM_MONTHLY === planId || process.env.STRIPE_PRICE_PREMIUM_YEARLY === planId || planId === 'premium') {
            subscriptionPlanEnum = SubscriptionPlan.PREMIUM;
          } else if (process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY === planId || process.env.STRIPE_PRICE_ENTERPRISE_YEARLY === planId || planId === 'enterprise') {
            subscriptionPlanEnum = SubscriptionPlan.ENTERPRISE;
          }
        }
        
        const creditsLimit = CREDIT_LIMITS[subscriptionPlanEnum] || CREDIT_LIMITS.FREE;

        if (existingSubscription) {
          await prisma.subscription.update({
            where: { stripeSubscriptionId: subscription.id },
            data: { 
              status: subscription.status,
              plan: subscriptionPlanEnum,
              interval: subscription.items.data[0].price?.recurring?.interval || 'monthly', // Update interval
            },
          });
          // Update user's credits if subscription is active and plan changed or renewed
          if (subscription.status === 'active' || subscription.status === 'trialing') {
            await prisma.user.update({
              where: { id: existingSubscription.userId },
              data: {
                creditsLimit: creditsLimit,
                creditsUsed: 0, // Reset credits on renewal/activation
                lastCreditReset: new Date(),
              },
            });
          }
        } else {
          // This case should ideally be handled by create-subscription API, but as a fallback
          // Find user by customer ID or email
          const customer = await stripe.customers.retrieve(subscription.customer as string);
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: customer.id },
          });

          if (user) {
            await prisma.subscription.create({
              data: {
                userId: user.id,
                stripeSubscriptionId: subscription.id,
                plan: subscriptionPlanEnum,
                interval: subscription.items.data[0].price?.recurring?.interval || 'monthly',
                status: subscription.status,
              },
            });
            if (subscription.status === 'active' || subscription.status === 'trialing') {
              await prisma.user.update({
                where: { id: user.id },
                data: {
                  creditsLimit: creditsLimit,
                  creditsUsed: 0,
                  lastCreditReset: new Date(),
                },
              });
            }
          }
        }
        console.log(`Subscription ${subscription.id} status and user credits updated in DB.`);
      } catch (dbError) {
        console.error(`Database update error for subscription ${subscription.id}:`, dbError);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
      break;

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;
      console.log(`Subscription deleted: ${deletedSubscription.id}`);
      try {
        const sub = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: deletedSubscription.id },
        });
        if (sub) {
          await prisma.subscription.update({
            where: { id: sub.id },
            data: { status: deletedSubscription.status },
          });
          // Set user to FREE plan and reset credits
          await prisma.user.update({
            where: { id: sub.userId },
            data: {
              creditsLimit: CREDIT_LIMITS.FREE,
              creditsUsed: 0,
              lastCreditReset: new Date(),
            },
          });
        }
        console.log(`Subscription ${deletedSubscription.id} status and user credits reset in DB.`);
      } catch (dbError) {
        console.error(`Database update error for deleted subscription ${deletedSubscription.id}:`, dbError);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true }, { status: 200 });
}