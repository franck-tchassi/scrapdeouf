

"use client";

import React from "react";
import HighlightText from "./HighlightText";
import { XCircle, CheckCircle } from "lucide-react"; // Utilisation d'icônes Lucide React pour la cohérence

const ComparisonScrapdeouf = () => {
  const withoutScrapdeouf = [
    {
      title: "Collecte manuelle interminable",
      desc: "Vous passez des heures à copier-coller des données depuis Google Maps, Amazon et autres plateformes.",
    },
    {
      title: "Aucune donnée structurée",
      desc: "Les informations sont incomplètes, non nettoyées et difficiles à exploiter pour vos analyses ou campagnes marketing.",
    },
    {
      title: "Pas d'emails fiables",
      desc: "Impossible de collecter des adresses e-mail vérifiées : vos bases de leads sont obsolètes ou incomplètes.",
    },
    {
      title: "Recherche de mots-clés à l'aveugle",
      desc: "Vous ne savez pas quels termes vos concurrents ciblent ou quels produits explosent sur Amazon.",
    },
    {
      title: "Aucune vision concurrentielle",
      desc: "Pas de données sur les avis produits ou les performances de vos concurrents en ligne.",
    },
  ];

  const withScrapdeouf = [
    {
      title: "Automatisation totale de la collecte",
      desc: "Scrapez Google Maps, Amazon et +50 sources en un clic. Obtenez vos données prêtes à l'emploi sans effort.",
    },
    {
      title: "Données enrichies et structurées",
      desc: "Obtenez des fichiers propres, analysables et compatibles avec vos outils CRM ou marketing.",
    },
    {
      title: "Collecte automatique d'emails vérifiés",
      desc: "Scrapdeouf identifie et valide les emails professionnels réels pour booster vos campagnes B2B.",
    },
    {
      title: "Analyse concurrentielle instantanée",
      desc: "Suivez les avis produits, détectez les tendances et surpassez vos concurrents avec des insights précis.",
    },
    {
      title: "Recherche de mots-clés intelligente",
      desc: "Découvrez automatiquement les mots-clés les plus rentables pour vos produits et votre marché.",
    },
  ];

  return (
    <section className="w-full py-16 sm:py-24 "> {/* Ajout d'un fond léger pour la section */}
      <div className="container mx-auto  px-4 md:px-6">
        {/* En-tête avec titre impactant */}
        <div className="text-center mb-12 sm:mb-16">
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Ne perdez plus votre <HighlightText variant="fancy-slant" color="secondary">temps</HighlightText>
            <br className="hidden sm:inline" />
            <span className="text-gray-700">automatisez votre collecte de données</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Passez de la collecte manuelle fastidieuse à l'automatisation intelligente. 
            Scrapdeouf révolutionne votre façon d'acquérir et d'analyser les données.
          </p>
        </div>

        {/* Comparaison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          
          {/* Colonne gauche : Sans Scrapdeouf */}
          <div className="group bg-white rounded-2xl p-6 sm:p-8   transition-all duration-300 border border-gray-200 relative overflow-hidden">
            {/* Élément décoratif */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
            
            <div className="flex flex-col items-center mb-6 sm:mb-8">
              <div className="relative">
                <div className="bg-red-500  text-white rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  <XCircle className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth="2.5" /> {/* Icône Lucide */}
                </div>
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                  AVANT
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mt-4 sm:mt-6 text-gray-900 text-center">
                Méthode Traditionnelle
              </h3>
              <p className="text-red-600 font-semibold mt-1 sm:mt-2 text-sm sm:text-base">Coûteux & Inefficace</p>
            </div>

            <ul className="space-y-4 sm:space-y-6">
              {withoutScrapdeouf.map((item, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-red-50 hover:bg-red-100 transition-colors duration-200"
                >
                  <div className="bg-white text-red-500 rounded-full p-1.5 sm:p-2 shadow-sm flex-shrink-0 mt-1">
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth="2.5" /> {/* Icône Lucide */}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-base sm:text-lg mb-1">{item.title}</p>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Bannière statistique */}
            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-red-100 border border-red-200 rounded-xl text-center">
              <p className="text-red-800 font-semibold text-sm sm:text-base">
                ⏳ <span className="font-bold">40 heures</span> perdues par mois en moyenne
              </p>
            </div>
          </div>

          {/* Colonne droite : Avec Scrapdeouf */}
          <div className="group bg-white rounded-2xl p-6 sm:p-8  transition-all duration-300 border border-gray-200 relative overflow-hidden">
            {/* Élément décoratif */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blueviolet to-blueviolet/80"></div>
            
            <div className="flex flex-col items-center mb-6 sm:mb-8">
              <div className="relative">
                <div className="bg-blueviolet  text-white rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth="2.5" /> {/* Icône Lucide */}
                </div>
                <div className="absolute -top-2 -right-2 bg-blueviolet text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                  APRÈS
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mt-4 sm:mt-6 text-gray-900 text-center">
                Avec Scrapdeouf
              </h3>
              <p className="text-blueviolet font-semibold mt-1 sm:mt-2 text-sm sm:text-base">Efficace & Automatisé</p>
            </div>

            <ul className="space-y-4 sm:space-y-6">
              {withScrapdeouf.map((item, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-blueviolet/5 hover:bg-blueviolet/10 transition-colors duration-200"
                >
                  <div className="bg-white text-blueviolet rounded-full p-1.5 sm:p-2 shadow-sm flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth="2.5" /> {/* Icône Lucide */}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-base sm:text-lg mb-1">{item.title}</p>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Bannière statistique */}
            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blueviolet/10 border border-blueviolet/20 rounded-xl text-center">
              <p className="text-blueviolet-800 font-semibold text-sm sm:text-base">
                🚀 <span className="font-bold">95% de temps</span> économisé grâce à l'automatisation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonScrapdeouf;