"use client";

import React from "react";
import HighlightText from "./HighlightText";

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
    <section className="w-full py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
        {/* En-tête avec titre impactant */}
        <div className="text-center mb-16">
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ne perdez plus votre <HighlightText variant="fancy-slant" color="secondary">temps</HighlightText>
            <br />
            <span className="text-gray-700">automatisez votre collecte de données</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Passez de la collecte manuelle fastidieuse à l'automatisation intelligente. 
            Scrapdeouf révolutionne votre façon d'acquérir et d'analyser les données.
          </p>
        </div>

        {/* Comparaison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8  mx-auto">
          
          {/* Colonne gauche : Sans Scrapdeouf */}
          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
            {/* Élément décoratif */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
            
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl w-20 h-20 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  AVANT
                </div>
              </div>
              <h2 className="text-2xl font-bold mt-6 text-gray-900 text-center">
                Méthode Traditionnelle
              </h2>
              <p className="text-red-600 font-semibold mt-2">Coûteux & Inefficace</p>
            </div>

            <ul className="space-y-6">
              {withoutScrapdeouf.map((item, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-4 p-4 rounded-xl bg-red-50 hover:bg-red-100 transition-colors duration-200"
                >
                  <div className="bg-white text-red-500 rounded-full p-2 shadow-sm flex-shrink-0 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg mb-2">{item.title}</p>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Bannière statistique */}
            <div className="mt-8 p-4 bg-red-100 border border-red-200 rounded-xl text-center">
              <p className="text-red-800 font-semibold">
                ⏳ <span className="font-bold">40 heures</span> perdues par mois en moyenne
              </p>
            </div>
          </div>

          {/* Colonne droite : Avec Scrapdeouf */}
          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
            {/* Élément décoratif */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
            
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl w-20 h-20 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  APRÈS
                </div>
              </div>
              <h2 className="text-2xl font-bold mt-6 text-gray-900 text-center">
                Avec Scrapdeouf
              </h2>
              <p className="text-green-600 font-semibold mt-2">Efficace & Automatisé</p>
            </div>

            <ul className="space-y-6">
              {withScrapdeouf.map((item, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-4 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors duration-200"
                >
                  <div className="bg-white text-green-500 rounded-full p-2 shadow-sm flex-shrink-0 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg mb-2">{item.title}</p>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Bannière statistique */}
            <div className="mt-8 p-4 bg-green-100 border border-green-200 rounded-xl text-center">
              <p className="text-green-800 font-semibold">
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