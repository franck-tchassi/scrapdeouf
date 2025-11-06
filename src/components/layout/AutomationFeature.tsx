"use client";

import React, { useEffect, useRef } from "react";
import { Zap, Database, Workflow, Cloud, Bot, ArrowRight, Play } from "lucide-react";

const AutomationFeature = () => {
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
            path: '/automate.json'
          });
        }
      }
    };

    loadLottie();
  }, []);

  const integrations = [
    { name: "HubSpot", color: "text-orange-600", bg: "bg-orange-50" },
    { name: "Google Sheets", color: "text-green-600", bg: "bg-green-50" },
    { name: "Notion", color: "text-gray-800", bg: "bg-gray-100" },
    { name: "Airtable", color: "text-purple-600", bg: "bg-purple-50" },
    { name: "Zapier", color: "text-red-500", bg: "bg-red-50" },
    { name: "Slack", color: "text-purple-500", bg: "bg-purple-50" },
    { name: "Shopify", color: "text-green-700", bg: "bg-green-50" },
    { name: "Mailchimp", color: "text-blue-600", bg: "blue-50" }
  ];

  const features = [
    {
      icon: Workflow,
      title: "Workflows automatisés",
      description: "Créez des séquences complexes sans code"
    },
    {
      icon: Database,
      title: "Synchronisation en temps réel", 
      description: "Données toujours à jour dans tous vos outils"
    },
    {
      icon: Bot,
      title: "Déclencheurs intelligents",
      description: "Actions automatiques basées sur vos données"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/50">
      <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Colonne de contenu */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold w-fit border border-green-200">
              <Zap className="w-4 h-4" />
              AUTOMATISATION INTELLIGENTE
            </div>

            {/* Titre principal */}
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Vos données s'intègrent
                automatiquement
              
            </h2>

            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed">
              Les données que vous collectez avec{" "}
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">Scrapdeouf</span> 
              {" "}ne dorment pas dans un tableau : elles s'intègrent automatiquement à plus de 
              {" "}<span className="font-semibold">7 000 outils</span> — Google Sheets, Notion, HubSpot, Airtable, Slack, et bien d'autres. 
              Automatisez vos campagnes, enrichissez votre CRM, lancez des séquences d'e-mails ou générez vos rapports 
              {" "}<span className="font-semibold">sans aucune action manuelle</span>.
            </p>

          </div>

          {/* Colonne illustration Lottie */}
          <div className="relative order-first lg:order-last">
            <div className="relative">
              {/* Container principal de l'animation */}
              <div className="rounded-3xl p-8 ">
                <div 
                  ref={lottieRef}
                  className="w-full h-80 bg-none lg:h-96 xl:h-[450px] flex items-center justify-center"
                />
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutomationFeature;