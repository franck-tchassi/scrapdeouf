"use client";

import React, { useState, useEffect } from "react";
import FAQSection from "@/components/layout/FAQSection";
import { useRouter } from "next/navigation";
import { CheckIcon } from '@heroicons/react/24/solid'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

type IntervalType = "monthly" | "yearly";

const PLANS = [
  {
    id: "pro",
    name: "Pro",
    description: "Parfait pour les entrepreneurs et TPE qui débutent leur prospection.",
    features: [
      "5 000 crédits  par mois",
      "Recherche par ville dans le monde entier",
      "Filtres de recherche essentiels",
      "Export des données de base Google Maps",
      "Scraping Amazon (produits et vendeurs)",
      "Scraping Leboncoin (annonces basique)",
      "Scraping Google Search (résultats organiques)",
      "Analyse mots-clés basique (volumes de recherche)",
      "Scraping Pages Jaunes / Yelp",
      "Scraping TripAdvisor (établissements)",
      "Données réseaux sociaux basiques",
      "Export CSV, Excel basique",
      "Actualisation mensuelle des crédits",
      "Support technique par email"
    ],
    prices: {
      monthly: {
        display: "35€",
        stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY!,
        stripeLink: "https://buy.stripe.com/test_3cIfZgdlC81wcTV5udds400"
      },
      yearly: {
        display: "24.5€",
        stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY!,
        stripeLink: "https://buy.stripe.com/test_8x24gychya9EcTVbSBds402"
      },
    },
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Idéal pour les agences et indépendants gérant plusieurs clients.",
    features: [
      "10 000 crédits par mois",
      "Recherche par ville dans le monde entier",
      "Recherche par département/comté (niveau 2)",
      "Filtres de recherche essentiels et avancés",
      "Export des données complètes Google Maps",
      "Données avancées Google Maps (notes, avis, photos)",
      "Scraping Amazon complet (produits, vendeurs, prix)",
      "Scraping Leboncoin avancé (annonces complètes)",
      "Scraping Google Search avancé",
      "Analyse mots-clés complète (CPC, concurrence, tendances)",
      "Scraping +50 plateformes (Booking, Airbnb, Trustpilot)",
      "Scraping réseaux sociaux avancé",
      "Données e-commerce (CDiscount, Fnac, eBay)",
      "Scraping sites immobiliers (Seloger, BienIci)",
      "Analytics données temps réel",
      "Export multiples (CSV, Excel, JSON, PDF)",
      "API d'accès aux données",
      "Actualisation mensuelle des crédits",
      "Support prioritaire par chat"
    ],
    prices: {
      monthly: {
        display: "59€",
        stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTHLY!,
        stripeLink: "https://buy.stripe.com/test_3cIaEW1CUdlQ5rt5udds403"
      },
      yearly: {
        display: "42€",
        stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_YEARLY!,
        stripeLink: "https://buy.stripe.com/test_7sY7sK1CU6Xs2fh6yhds404"
      },
    },
    popular: true,
  },
  {
    id: "enterprise",
    name: "Entreprise",
    description: "Solution complète pour les entreprises avec des besoins avancés.",
    features: [
      "40 000 crédits par mois",
      "Recherche illimitée par ville, région, pays",
      "Filtres de recherche ultra-avancés",
      "Export données complètes Google Maps",
      "Données avancées +50 plateformes",
      "Scraping Amazon temps réel (prix, stocks, reviews)",
      "Analytics marché e-commerce complet",
      "Recherche mots-clés illimitée",
      "Analyse concurrentielle automatisée",
      "Scraping réseaux sociaux en temps réel",
      "Données sites web complètes (emails, technologies)",
      "Monitoring prix et tendances",
      "Alertes automatiques sur données critiques",
      "Tableaux de bord personnalisables",
      "Export illimité tous formats",
      "Analytics prédictifs et rapports automatiques",
      "Scraping plateformes personnalisées",
      "Formation et onboarding personnalisé",
      "Responsable de compte dédié",
      "Support prioritaire 24/7"
    ],
    prices: {
      monthly: {
        display: "299€",
        stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY!,
        stripeLink: "https://buy.stripe.com/test_6oUeVcftK6Xsf2309Tds405"
      },
      yearly: {
        display: "210€",
        stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY!,
        stripeLink: "https://buy.stripe.com/test_cNicN4gxO81w6vxe0Jds406"
      },
    },
    popular: false,
  },
];

const COMPARISON = [
  {
    label: "Crédits d'export mensuels",
    pro: "5 000",
    premium: "10 000",
    enterprise: "40 000",
  },
  {
    label: "Recherche par ville",
    pro: true,
    premium: true,
    enterprise: true,
  },
  {
    label: "Recherche par département/comté",
    pro: false,
    premium: true,
    enterprise: true,
  },
  {
    label: "Recherche par région/état",
    pro: false,
    premium: false,
    enterprise: true,
  },
  {
    label: "Recherche par pays entier",
    pro: false,
    premium: false,
    enterprise: true,
  },
  {
    label: "Filtres essentiels (site, téléphone, réseaux)",
    pro: true,
    premium: true,
    enterprise: true,
  },
  {
    label: "Filtres avancés (avis, prix, photos)",
    pro: false,
    premium: true,
    enterprise: true,
  },
  {
    label: "Données avancées Google Maps",
    pro: false,
    premium: true,
    enterprise: true,
  },
  {
    label: "Scraping Amazon complet",
    pro: "Basique",
    premium: "Avancé",
    enterprise: "Temps réel",
  },
  {
    label: "Scraping Leboncoin",
    pro: "Basique",
    premium: "Complet",
    enterprise: "Avancé",
  },
  {
    label: "Scraping Google Search",
    pro: "Basique",
    premium: "Avancé",
    enterprise: "Illimité",
  },
  {
    label: "Analyse mots-clés",
    pro: "Volumes",
    premium: "Complète",
    enterprise: "Avancée",
  },
  {
    label: "Nombre de plateformes",
    pro: "10+",
    premium: "50+",
    enterprise: "Illimité",
  },
  {
    label: "Scraping réseaux sociaux",
    pro: "Basique",
    premium: "Avancé",
    enterprise: "Temps réel",
  },
  {
    label: "Données e-commerce",
    pro: "Limité",
    premium: "Étendu",
    enterprise: "Complet",
  },
  {
    label: "Export de données",
    pro: "CSV, Excel",
    premium: "Multi-formats",
    enterprise: "Illimité",
  },
  {
    label: "Accès API",
    pro: false,
    premium: "Basique",
    enterprise: "Complet",
  },
  {
    label: "Analytics et rapports",
    pro: false,
    premium: "Basique",
    enterprise: "Avancé",
  },
  {
    label: "Support",
    pro: "Email",
    premium: "Chat",
    enterprise: "24/7 + Dédié",
  },
];

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<IntervalType>("monthly");

  // plan actuellement actif de l'utilisateur (ex: "pro" | "premium" | "enterprise" | null)
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  // plan que l'utilisateur vient de sélectionner (pour désactiver le bouton pendant redirection)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  useEffect(() => {
    // Récupère le plan actuel via l'API /api/user/credits
    const fetchCurrentPlan = async () => {
      try {
        const res = await fetch('/api/user/credits');
        if (!res.ok) return;
        const data = await res.json();
        if (data?.plan) {
          setCurrentPlanId(String(data.plan).toLowerCase());
        }
      } catch (err) {
        console.error('Impossible de récupérer le plan utilisateur', err);
      }
    };
    fetchCurrentPlan();
  }, []);

  const handleChoose = (planId: string) => {
    // Si l'utilisateur clique sur son plan actuel, ne rien faire
    if (currentPlanId === planId) return;

    setSelectedPlanId(planId);

    // Trouver le plan sélectionné
    const selectedPlan = PLANS.find(plan => plan.id === planId);
    if (selectedPlan && selectedPlan.prices) {
      // Rediriger vers le lien Stripe correspondant (si fourni)
      const stripeLink = selectedPlan.prices[billingCycle].stripeLink;
      if (stripeLink) {
        // Ouvrir dans un nouvel onglet et laisser le webhook mettre à jour la DB
        window.open(stripeLink, '_blank');
        return;
      }
    }

    // Fallback vers l'ancienne méthode si pas de lien Stripe
    router.push(`/checkout?plan=${planId}&interval=${billingCycle}`);
  };

  const handleSwitchChange = (checked: boolean) => {
    setBillingCycle(checked ? "yearly" : "monthly");
  };

  // Calculer l'économie pour chaque plan
  const calculateSavings = (plan: typeof PLANS[0]) => {
    const monthlyPrice = parseFloat(plan.prices.monthly.display.replace('€', '').replace(',', '.'));
    const yearlyPrice = parseFloat(plan.prices.yearly.display.replace('€', '').replace(',', '.'));
    const yearlyCost = yearlyPrice * 12;
    const monthlyCost = monthlyPrice * 12;
    const savings = ((monthlyCost - yearlyCost) / monthlyCost) * 100;
    return Math.round(savings);
  };

  return (
    <div className="relative    px-6 py-2  lg:px-8">


      <div className="mx-auto max-w-4xl text-center">
        <p className="mt-2 text-5xl font-semibold tracking-tight text-balance  sm:text-6xl">
          Gérez vos abonnements et explorez nos forfaits
        </p>
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-gray-600 sm:text-xl/8">
        Mettez à niveau ou modifiez votre plan pour accéder à plus de fonctionnalités et de crédits.
      </p>

      {/* Switch pour Mensuel/Annuel avec économie */}
      <div className="mt-8 flex justify-center items-center space-x-4">
        <Label
          htmlFor="billing-cycle"
          className={classNames(
            "text-black", // Toujours blanc
            "text-lg font-bold cursor-pointer"
          )}
        >
          Mensuel
        </Label>

        <Switch
          id="billing-cycle"
          checked={billingCycle === "yearly"}
          onCheckedChange={handleSwitchChange}
          className="data-[state=checked]:from-indigo-600 bg-gradient-to-r data-[state=checked]:to-purple-600  data-[state=unchecked]:bg-gray-600"
        />

        <div className="flex items-center space-x-2">
          <Label
            htmlFor="billing-cycle"
            className={classNames(
              "text-black", // Toujours blanc
              "text-lg font-bold cursor-pointer"
            )}
          >
            Annuel
          </Label>
          {/* Le span est maintenant toujours rendu, mais sa visibilité est contrôlée par la classe 'invisible' */}
          <span
            className={classNames(
              "bg-green-700 text-white text-xs font-bold px-2 py-1 rounded-full",
              billingCycle === "monthly" && "invisible" // Rendre invisible si mensuel
            )}
          >
            ÉCONOMISEZ +30%
          </span>
        </div>
      </div>

      <div className="mx-auto mt-16 grid  max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
        {PLANS.map((plan, planIdx) => (
          <div
            key={plan.id}
            className={classNames(
              plan.popular ? 'relative bg-gray-900 ring-2 ring-indigo-500' : 'bg-gray-800',
              plan.popular
                ? ''
                : planIdx === 0
                  ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl'
                  : planIdx === 1
                    ? 'sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none'
                    : 'rounded-b-3xl sm:rounded-t-none lg:rounded-tr-3xl',
              'rounded-3xl p-8 ring-1 ring-white/10 sm:p-10',
            )}
          >
            {(plan.popular || currentPlanId === plan.id) && (
              <div className={classNames(
                "absolute top-0 right-0 px-4 py-1 text-sm font-bold transform translate-x-2 -translate-y-2",
                currentPlanId === plan.id
                  ? "bg-green-600 text-white rotate-0"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rotate-6"
              )}>
                {currentPlanId === plan.id ? 'OFFRE ACTUELLE' : 'POPULAIRE'}
              </div>
            )}

            <div className="flex items-center gap-2">
              <h3
                className={classNames(
                  currentPlanId === plan.id ? 'text-green-400' : 'text-indigo-400',
                  'text-base/7 font-semibold'
                )}
              >
                {plan.name}
              </h3>
              {currentPlanId === plan.id && (
                <CheckIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
              )}
            </div>            <div className="mt-4 flex flex-col items-baseline gap-x-2">
              {billingCycle === "yearly" && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400 text-sm line-through">
                    {plan.prices.monthly.display}/mois
                  </span>
                  <span className="bg-green-700 text-white text-xs font-bold px-2 py-1 rounded">
                    Économisez 30%
                  </span>
                </div>
              )}

              <div className="flex items-baseline gap-x-2">
                <span className={classNames(
                  plan.popular ? 'text-white' : 'text-white',
                  'text-5xl font-semibold tracking-tight'
                )}>
                  {plan.prices ? plan.prices[billingCycle].display : "Sur mesure"}
                </span>
                {plan.prices && (
                  <span className={classNames(
                    plan.popular ? 'text-gray-400' : 'text-gray-400',
                    'text-base'
                  )}>
                    {billingCycle === "monthly" ? "/mois" : "/mois"}
                  </span>
                )}
              </div>

            </div>

            <p className={classNames(
              plan.popular ? 'text-gray-300' : 'text-gray-300',
              'mt-6 text-base/7'
            )}>
              {plan.description}
            </p>

            <ul
              role="list"
              className={classNames(
                plan.popular ? 'text-gray-300' : 'text-gray-300',
                'mt-8 space-y-3 text-sm/6 sm:mt-10',
              )}
            >
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    aria-hidden="true"
                    className={classNames(
                      plan.popular ? 'text-indigo-400' : 'text-indigo-400',
                      'h-6 w-5 flex-none'
                    )}
                  />
                  {feature}
                </li>
              ))}
            </ul>

            {
              (() => {
                const isCurrent = currentPlanId === plan.id;
                const isPending = selectedPlanId === plan.id;
                return (
                  <button
                    onClick={() => handleChoose(plan.id)}
                    disabled={isCurrent || !!isPending}
                    className={classNames(
                      isCurrent
                        ? 'opacity-60 cursor-not-allowed bg-gray-700 text-white'
                        : plan.popular
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 cursor-pointer text-white hover:from-indigo-400 hover:to-purple-400 focus-visible:outline-indigo-500'
                          : plan.id === "enterprise"
                            ? 'bg-gray-700 text-white cursor-pointer hover:bg-gray-600'
                            : 'bg-white/10 text-white ring-1 cursor-pointer ring-white/5 hover:bg-white/20 focus-visible:outline-white/75',
                      (isPending && !isCurrent) ? 'opacity-80 cursor-wait' : '',
                      'mt-8 block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10'
                    )}
                  >
                    {isCurrent ? 'Votre offre actuelle' : isPending ? 'Redirection...' : 'Sélectionner cette offre'}
                  </button>
                )
              })()
            }
          </div>
        ))}
      </div>

      {/* Section Comparaison des fonctionnalités */}
      <div className="mx-auto mt-24 max-w-7xl">
        <div className="bg-gray-800 rounded-2xl p-8 ring-1 ring-white/10 sm:p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white">Comparaison des fonctionnalités</h2>
            <p className="mt-4 text-lg text-gray-400">
              Découvrez quelle offre correspond le mieux à vos besoins
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-4 px-6 text-left text-white font-semibold w-1/3 min-w-[200px]">
                    Fonctionnalités
                  </th>
                  <th className="py-4 px-6 text-center text-white font-semibold">Pro</th>
                  <th className="py-4 px-6 text-center text-indigo-400 font-semibold bg-indigo-900/20">
                    Premium
                  </th>
                  <th className="py-4 px-6 text-center text-white font-semibold">
                    Entreprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-700/20' : ''}>
                    <td className="py-4 px-6 text-white">{row.label}</td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? (
                          <CheckIcon className="h-6 w-5 text-indigo-400 mx-auto" />
                        ) : (
                          <span className="text-gray-500">—</span>
                        )
                      ) : (
                        <span className="text-gray-300">{row.pro}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center bg-indigo-900/10">
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? (
                          <CheckIcon className="h-6 w-5 text-indigo-400 mx-auto" />
                        ) : (
                          <span className="text-gray-500">—</span>
                        )
                      ) : (
                        <span className="text-gray-300">{row.premium}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? (
                          <CheckIcon className="h-6 w-5 text-indigo-400 mx-auto" />
                        ) : (
                          <span className="text-gray-500">—</span>
                        )
                      ) : (
                        <span className="text-gray-300">{row.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>


    </div>
  );
}