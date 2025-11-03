"use client";

import React from "react";
import StripeWrapper from "@/components/stripe-wrapper";
import SubscriptionForm from "@/components/subscription-form";

export default function SubscribePage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <div className="flex items-center justify-center  p-4">
        <p className="text-red-500">
          La clé publique Stripe n'est pas configurée. Veuillez vérifier votre
          fichier .env.local.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center  p-4">
      <StripeWrapper publishableKey={publishableKey}>
        <SubscriptionForm searchParams={searchParams} />
      </StripeWrapper>
    </div>
  );
}