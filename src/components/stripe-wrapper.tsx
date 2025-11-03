"use client";

import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";

interface StripeWrapperProps {
  children: React.ReactNode;
  publishableKey: string;
}

const StripeWrapper: React.FC<StripeWrapperProps> = ({
  children,
  publishableKey,
}) => {
  const stripePromise = React.useMemo(
    () => loadStripe(publishableKey),
    [publishableKey]
  );

  const options: StripeElementsOptions = {
    mode: "setup", // Use 'setup' mode for collecting payment methods for future use (subscriptions)
    currency: "eur", // You can change this to your desired currency
    paymentMethodTypes: ['card'], // Forcer l'affichage des champs de carte uniquement ici
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeWrapper;