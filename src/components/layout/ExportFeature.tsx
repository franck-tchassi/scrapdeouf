"use client";

import React, { useEffect, useRef } from "react";
import { Download, FileText, Table, Code, File, Database, Zap, CloudDownload } from "lucide-react";

const ExportFeature = () => {
  const lottieRef = useRef(null);

  useEffect(() => {
    const loadLottie = async () => {
      if (typeof window !== "undefined") {
        const lottie = await import('lottie-web');
        if (lottieRef.current) {
          lottie.default.loadAnimation({
            container: lottieRef.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/fichierexport.json'
          });
        }
      }
    };

    loadLottie();
  }, []);

  const formats = [
    {
      icon: Table,
      name: "CSV",
      color: "text-green-600"
    },
    {
      icon: FileText,
      name: "Excel", 
      color: "text-green-700"
    },
    {
      icon: Code,
      name: "JSON",
      color: "text-yellow-600"
    },
    {
      icon: File,
      name: "PDF",
      color: "text-red-600"
    },
    {
      icon: Database,
      name: "XML",
      color: "text-orange-600"
    },
    {
      icon: FileText,
      name: "TXT",
      color: "text-gray-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white to-blue-50/30">
      <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Colonne de contenu */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold w-fit border border-blue-200">
              <CloudDownload className="w-4 h-4" />
              EXPORT MULTI-FORMATS
            </div>

            {/* Titre principal */}
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Exportez vos données scrapées dans tous les formats
            </h2>

            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed">
              Exportez vos données scrapées dans tous les formats nécessaires. 
              Intégration native avec vos outils préférés.
            </p>

            {/* Exemple concret */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-900 mb-2">Scraping optimisé :</p>
                  <p className="text-blue-800">
                    Exportez vos données scrapées en CSV pour Mailchimp, 
                    ou directement vers Google Sheets en un clic.
                  </p>
                </div>
              </div>
            </div>

            {/* Grille des formats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {formats.map((format, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group hover:scale-105"
                >
                  <div className="bg-gray-50 rounded-lg p-3 group-hover:bg-blue-50 transition-colors duration-300">
                    <format.icon className={`w-6 h-6 ${format.color}`} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{format.name}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Colonne illustration Lottie agrandie */}
          <div className="relative order-first lg:order-last">
            <div className="relative">
              {/* Container principal de l'animation agrandi */}
              <div className="rounded-3xl p-8">
                <div 
                  ref={lottieRef}
                  className="w-full h-80 lg:h-96 xl:h-[450px] flex items-center justify-center scale-110"
                />
              </div>
              
              {/* Effet de brillance */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExportFeature;