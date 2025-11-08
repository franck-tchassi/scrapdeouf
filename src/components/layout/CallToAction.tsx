// src/components/layout/CallToAction.tsx

"use client";

import Link from "next/link";
import HighlightText from "./HighlightText";
import SocialProof from "./SocialProof";
import { PlayCircleIcon } from '@heroicons/react/24/outline';

export function CallToAction() {
  return (
    <section className="relative bg-gray-100/50  py-20 sm:py-28 overflow-hidden">
      {/* Effet d'arrière-plan flou */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blueviolet/10 to-blueviolet/20 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      <div className="container mx-auto max-w-screen-xl px-4 md:px-6 relative z-10">
        <div className="text-center">

          {/* Social Proof au-dessus du titre */}
          <div className="flex justify-center mb-8 sm:mb-10">
            <SocialProof />
          </div>

          {/* Titre principal */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Prêt à transformer vos données en{" "}
            <HighlightText
              variant="fancy-slant"
              color="secondary"
            >
              avantage compétitif
            </HighlightText>{" "}
            ?
          </h2>

          {/* Sous-titre */}
          <p className="text-base sm:text-lg text-gray-700 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            Rejoignez les centaines de professionnels qui utilisent déjà notre
            plateforme pour accélérer leur croissance et prendre de meilleures
            décisions.
          </p>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={"/login"}>
              <button className="rounded-xl bg-blueviolet cursor-pointer transition-all px-8 py-4 font-semibold text-white shadow-lg shadow-blueviolet/25 hover:shadow-blueviolet/40 hover:bg-blueviolet/80 duration-200 flex items-center justify-center gap-3 group transform hover:scale-105">
                {/* Icône éclair */}
                <svg 
                  className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 10V3L4 14h7v7l9-11h-7z" 
                  />
                </svg>
                Commencer gratuitement
              </button>
            </Link>
            
          </div>
        </div>
      </div>

      {/* Effet d'arrière-plan bas */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blueviolet/10 to-blueviolet/20 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </section>
  );
}