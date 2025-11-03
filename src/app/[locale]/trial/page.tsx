"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import SubscribePage from "@/components/subscribe";
import dynamic from "next/dynamic";
import { motion } from "framer-motion"

// Chargement dynamique de Lottie
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// Données pour les badges de plateformes
const platforms = [
  { name: "Google Maps", color: "from-red-500 to-red-600", rotation: "-rotate-3" },
  { name: "Amazon", color: "from-orange-500 to-yellow-500", rotation: "rotate-2" },
  { name: "+50 sources de plateformes", color: "from-purple-500 to-indigo-600", rotation: "-rotate-1" }
]

export default function TrialPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || undefined;
  const [isLoading, setIsLoading] = useState(true);
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    // Charger l'animation depuis le dossier public
    const loadAnimation = async () => {
      try {
        const response = await fetch('/loading.json');
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'animation:', error);
      }
    };

    loadAnimation();

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="overflow-hidden py-8 sm:py-24 lg:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {/* Colonne de gauche - Hero Section - Cachée en mobile */}
          <div className="lg:pt-4 lg:pr-8 hidden lg:block">
            <div className="lg:max-w-lg">
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-indigo-500/25">
                    <Image
                      src="/s-logo.png"
                      alt="Scrapdeouf"
                      width={48}
                      height={48}
                      className="drop-shadow-lg filter brightness-0 invert object-contain"
                      priority
                    />
                  </div>
                </div>
                <h1 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                  Scrapdeouf
                </h1>
                <div className="w-24 h-1 bg-blue-500 mt-4 rounded-full"></div>
              </div>

              <p className="mt-6 text-lg/8 text-gray-600">
                Bienvenue sur <span className="font-semibold text-blue-600">Scrapdeouf.com</span>
                ! Téléchargez des leads B2B qualifiés extraits de{''}
                <span className="inline-flex items-center mx-2 space-x-2">
                  {platforms.map((platform, index) => (
                    <motion.span
                      key={platform.name}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 200
                      }}
                      className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${platform.color} ${platform.rotation} transform shadow-lg hover:scale-105 transition-all duration-300 cursor-default`}
                    >
                      <span className="text-xs font-bold text-white whitespace-nowrap">
                        {platform.name}
                      </span>
                    </motion.span>
                  ))}
                </span>
              </p>
            </div>
          </div>

          {/* Colonne de droite - Formulaire */}
          <div className="p-4 sm:p-8">
            <div className="w-full max-w-md mx-auto">
              {/* Logo et nom en ligne - Visible uniquement en mobile */}
              <Link href="/" className="lg:hidden flex items-center justify-center mb-8 space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-indigo-500/25 backdrop-blur-sm">
                  <Image
                    src="/s-logo.png"
                    alt="Scrapdeouf"
                    width={32}
                    height={32}
                    className="drop-shadow-lg filter brightness-0 invert object-contain"
                    priority
                  />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Scrapdeouf
                </h1>
              </Link>

              {/* Lien retour - Caché en mobile */}
              <div className="mb-6 hidden lg:block">
                <Link 
                  href="/login" 
                  className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <span className="text-lg">←</span>
                  <span>Revenir à l'écran de connexion</span>
                </Link>
              </div>

              {/* En-tête */}
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 lg:text-4xl">
                  Essai Gratuit
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-3 sm:mt-4 rounded-full"></div>
              </div>

              {/* Informations essai */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start space-x-3">
                    <p className="text-gray-700 text-sm/6">
                      <span className="font-semibold">Vous pouvez utiliser l'application gratuitement pendant 3 jours et vous désabonner à tout moment.</span>
                    </p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <p className="text-gray-700 text-sm/6">
                      <span className="font-bold text-gray-900">Si vous continuez au-delà des 3 jours, vous serez prélevé de 35 € chaque mois.</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Séparateur */}
              <div className="relative mb-6 sm:mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Formulaire d'abonnement</span>
                </div>
              </div>

              {/* Animation de chargement ou Composant d'abonnement */}
              <div className="relative mb-6 sm:mb-8 min-h-[200px] flex items-center justify-center">
                {/* En mode mobile: afficher directement le formulaire */}
                <div className="block sm:hidden w-full">
                  <SubscribePage searchParams={{ status }} />
                </div>

                {/* En mode desktop: garder l'animation de chargement */}
                <div className="hidden sm:block w-full p-9">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center">
                      {animationData && (
                        <Lottie 
                          animationData={animationData} 
                          loop={true}
                          autoplay={true}
                          style={{ width: 280, height: 280 }}
                        />
                      )}
                    </div>
                  ) : (
                    <SubscribePage searchParams={{ status }} />
                  )}
                </div>
              </div>

              {/* Note de confiance */}
              <div className="mt-4 sm:mt-6 text-center">
                <p className="text-xs text-gray-500">
                  🔒 Paiement sécurisé par Stripe • Aucune donnée bancaire stockée sur nos serveurs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}