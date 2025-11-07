// src/components/layout/Hero.tsx
'use client'

import { useState } from 'react'
import { XMarkIcon, PlayCircleIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link';
import HighlightText from './HighlightText'; // Correction de l'importation

export default function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false)

  // Données pour les badges de plateformes
  const platforms = [
    { name: "Google Maps", color: "from-red-500 to-red-600", rotation: "-rotate-3" },
    { name: "Amazon", color: "from-orange-500 to-yellow-500", rotation: "rotate-2" },
    { name: "+50 sources de plateformes", color: "from-blueviolet to-blueviolet/80", rotation: "-rotate-1" } // Utilisation de blueviolet
  ]

  return (
    <div className=""> {/* Suppression de la classe bg-gray-900 ici */}
      <div className="relative isolate pt-20">
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
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blueviolet/30 to-blueviolet/50 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        <div className="container mx-auto max-w-screen-xl px-4 md:px-6 py-20 sm:py-28 lg:py-32">
          <div className="text-center">

            <h1 className="text-3xl font-bold tracking-tight text-balance text-gray-900 sm:text-5xl"> {/* Changement de text-white à text-gray-900 */}
              <HighlightText variant="fancy-slant" color="secondary">Automatisez</HighlightText> Votre Collecte de Données Stratégiques
            </h1>

            {/* Sous-titre avec badges stylisés */}
            <div className="mt-8 text-xl text-pretty text-gray-700 sm:text-2xl"> {/* Changement de text-gray-300 à text-gray-700 */}
              Extrayez automatiquement des données cruciales de{' '}
              <span className="inline-flex flex-wrap items-center mx-2 space-x-2 space-y-2">
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
              sources. Lead generation, analyse concurrentielle et veille marché en temps réel.
            </div>

            {/* Boutons d'action */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/login"
                className="rounded-xl bg-blueviolet cursor-pointer transition-all px-8 py-4 font-semibold text-white shadow-lg shadow-blueviolet/25 hover:shadow-blueviolet/40 hover:bg-blueviolet/80 duration-200 flex items-center justify-center gap-3 group"
              >
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
                Essayer gratuitement
              </Link>

              {/* Bouton pour ouvrir la vidéo */}
              <button
                onClick={() => setIsVideoDialogOpen(true)}
                className="rounded-xl bg-transparent backdrop-blur-sm px-8 py-4 cursor-pointer font-semibold text-blueviolet ring-1 ring-blueviolet hover:bg-blueviolet/10 hover:ring-blueviolet/80 transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden"
              >
                {/* Effet de pulse animé */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blueviolet/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <PlayCircleIcon className="w-6 h-6 text-blueviolet group-hover:scale-110 transition-transform duration-200 relative z-10" />
                <span className="relative z-10">Voir la démo</span>
              </button>
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
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blueviolet/30 to-blueviolet/50 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>

      {/* Dialog pour la vidéo */}
      <AnimatePresence>
        {isVideoDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsVideoDialogOpen(false)}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative mx-4 aspect-video w-full max-w-6xl md:mx-0"
            >
              <button
                onClick={() => setIsVideoDialogOpen(false)}
                className="absolute -top-12 -right-24 cursor-pointer rounded-full bg-neutral-900/50 p-2 text-xl text-white ring-1 backdrop-blur-md dark:bg-neutral-100/50 dark:text-black"
              >
                <XMarkIcon className="size-5" />
              </button>
              <div className="relative isolate z-[1] size-full overflow-hidden rounded-2xl border-2 border-white">
                <iframe
                  src="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                  className="size-full rounded-2xl"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}