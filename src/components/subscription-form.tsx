"use client";

import React, { useState, useEffect } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import { useRouter } from "next/navigation";

interface SubscriptionFormProps {
  searchParams: { status?: string };
}

// Options de style améliorées pour les éléments de carte
const ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#1f2937",
      fontSize: "16px",
      fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#9ca3af",
        fontSize: "14px",
      },
      ":-webkit-autofill": {
        color: "#1f2937",
      },
    },
    invalid: {
      color: "#dc2626",
      iconColor: "#dc2626",
    },
    complete: {
      color: "#10b981",
      iconColor: "#10b981",
    },
  },
};

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  searchParams = {}
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [cardholderName, setCardholderName] = useState("");
  const [email] = useState("customer@example.com"); // Idéalement, cet email devrait venir de la session utilisateur
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("FR");

  useEffect(() => {
    if (searchParams?.status === "success") {
      toast.success("Votre abonnement a été configuré avec succès !");
    } else if (searchParams?.status === "failed") {
      toast.error("Échec de la configuration de l'abonnement.");
    }
  }, [searchParams?.status]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) {
      toast.error("Les informations de carte ne sont pas disponibles.");
      setIsLoading(false);
      return;
    }

    const { paymentMethod, error: createPaymentMethodError } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
      billing_details: {
        name: cardholderName,
        email: email,
        address: {
          postal_code: postalCode,
          country: country,
        },
      },
    });

    if (createPaymentMethodError) {
      toast.error(createPaymentMethodError.message || "Une erreur est survenue lors de la création de la méthode de paiement.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/stripe/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          payment_method: paymentMethod.id,
          planId: "pro",      // Spécifie le plan PRO
          interval: "monthly", // Spécifie l'intervalle mensuel
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Échec de la création de l'abonnement.");
      }

      const data = await response.json();
      console.log("Subscription successful:", data.subscription);
      toast.success("Votre abonnement d'essai a été configuré avec succès !");
      window.location.href = `${window.location.origin}/subscribe?status=success`;

    } catch (error: any) {
      console.error("Error creating subscription:", error);
      toast.error(error.message || "Une erreur inattendue est survenue lors de la création de l'abonnement.");
      window.location.href = `${window.location.origin}/subscribe?status=failed`;
    }

    setIsLoading(false);
  };

  // Appeler cette fonction après confirmation réussite du paiement/abonnement Stripe
  const markTrialComplete = async () => {
    try {
      const res = await fetch("/api/user/complete-trial", {
        method: "POST",
      });
      if (res.ok) {
        // redirection vers dashboard après mise à jour
        router.push("/dashboard");
        return;
      } else {
        console.error("complete-trial failed:", await res.text());
        // on redirige quand même vers dashboard pour l'UX
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Error calling complete-trial:", err);
      router.push("/dashboard");
    }
  };

  // Exemple d'endroit où appeler markTrialComplete :
  // - après stripe.confirmCardPayment(...) réussi
  // - ou après création d'une subscription côté serveur qui renvoie "success"
  //
  // Exemple (pseudo) :
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   // ... logique Stripe (create payment/confirm) ...
  //   if (paymentSucceeded) {
  //     await markTrialComplete();
  //   }
  // }

  return (
    <div className="flex items-center  p-4">
      <Card className="w-full max-w-lg mx-auto shadow-none border-0 bg-none ">


        <CardContent className="space-y-8">
          {/* Section Informations de Paiement */}
          <div className="space-y-4">

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom du titulaire */}
              <div className="space-y-2">

                <Input
                  id="cardholder-name"
                  type="text"
                  placeholder="Nom sur la carte"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                  required
                  className="h-12 w-115 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl text-lg font-medium placeholder:font-normal placeholder:text-gray-400"
                />
              </div>

              {/* Numéro de carte */}
              <div className="space-y-2">

                <div className="border-2 border-gray-200 focus-within:border-blue-500 transition-colors rounded-xl p-4 bg-white">
                  <CardNumberElement
                    options={{
                      ...ELEMENT_OPTIONS,
                      placeholder: "Numéro de carte"
                    }}
                  />
                </div>
              </div>

              {/* Date d'expiration et CVC */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">

                  <div className="border-2 border-gray-200 focus-within:border-blue-500 transition-colors rounded-xl p-4 bg-white">
                    <CardExpiryElement
                      options={{
                        ...ELEMENT_OPTIONS,
                        placeholder: "MM/AAAA"
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">

                  <div className="border-2 border-gray-200 focus-within:border-blue-500 transition-colors rounded-xl p-4 bg-white">
                    <CardCvcElement
                      options={{
                        ...ELEMENT_OPTIONS,
                        placeholder: "CVC"
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Code postal et Pays */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">

                  <Input
                    id="postal-code"
                    type="text"
                    placeholder="Code postal"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
                  />
                </div>
                <div className="space-y-2">

                  <Select onValueChange={setCountry} value={country} required>
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl">
                      <SelectValue placeholder="Sélectionner un pays" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {COUNTRIES.map((c) => (
                        <SelectItem
                          key={c.value}
                          value={c.value}
                          disabled={c.disabled}
                          className={c.disabled ? "text-gray-400 italic" : ""}
                        >
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bouton de soumission */}
              <Button
                type="submit"
                disabled={!stripe || isLoading || !cardholderName || !postalCode || !country}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Traitement en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Essayer Scrapdeouf pendant 3 jours</span>
                  </div>
                )}
              </Button>
            </form>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionForm;