"use client";

import { 
  Search, 
  BarChart3, 
  Zap, 
  Shield, 
  Workflow, 
  Lock, 
  Download,
  MessageCircle
} from "lucide-react";
import ScrapdeoufAi from "./Scrapdeouf";


const features = [
    
    {
      icon: MessageCircle,
      title: "Assistant IA & Chatbot Intelligent",
      description: "Deux niveaux d'assistance IA : version basique pour tous les utilisateurs, et version avancée avec analyses prédictives pour les abonnés premium. Notre chatbot comprend le contexte et fournit des réponses personnalisées.",
      example: "Version basique : réponses instantanées sur l'utilisation des fonctionnalités. Version premium : analyses de données complexes et recommandations stratégiques automatisées.",
      color: "text-pink-600",
      export: "Rapports IA, Analyses automatiques, Recommandations",
      
    },
    {
      icon: Search,
      title: "Scraping Intelligent Multi-Sources",
      description: "Notre moteur de scraping avancé extrait et structure automatiquement les données cruciales depuis toutes vos sources : emails, prix, descriptions produits, fiches techniques. Optimisez votre collecte de données avec une précision de 99,8%.",
      example: "Extrayez automatiquement toutes les fiches produits d'un site concurrent en moins de 5 minutes, parfaitement organisées et prêtes à l'analyse.",
      color: "text-blue-600",
      export: "CSV, Excel, JSON",
      image: "/fichier-scrap.png"
    },
    {
      icon: BarChart3,
      title: "Analytics Mots-Clés en Temps Réel",
      description: "Accédez aux volumes de recherche Google, CPC et niveaux de concurrence directement dans votre interface. Données toujours fraîches et actualisées quotidiennement.",
      example: "Pour 'application fitness', découvrez que 'programme sportif maison' génère 50K recherches/mois avec une concurrence faible.",
      color: "text-purple-600",
      export: "Excel, Google Sheets, Tableau",
      image: "/fichier-scrap.png"
    },
    {
      icon: Zap,
      title: "Croisement Data & SEO Intelligent",
      description: "Corrélez automatiquement les données scrapées avec les tendances de recherche pour identifier des opportunités uniques et rentables.",
      example: "Scrapez 100 sites e-commerce → identifiez automatiquement les produits populaires mais absents des résultats Google.",
      color: "text-orange-600",
      export: "Rapports PDF, Excel, Dashboards",
      image: "/fichier-scrap.png"
    },
    {
      icon: Shield,
      title: "Automatisation Éthique et Fiable",
      description: "Notre technologie utilise des proxies intelligents et simule un comportement humain réaliste pour éviter les blocages, dans le respect strict des CGU.",
      example: "Lancez une collecte massive sur 5000 pages sans jamais être bloqué, avec des pauses automatiques entre les requêtes.",
      color: "text-teal-600",
      export: "Logs détaillés, Rapports d'audit",
      image: "/fichier-scrap.png"
    },
    {
      icon: Workflow,
      title: "Workflows Automatisés & Templates",
      description: "Des templates prêts à l'emploi conçus par des experts pour freelances SEO, agences et créateurs de contenu.",
      example: "Template 'Prospection B2B' : scrapez entreprises cibles + analysez mots-clés stratégiques + export vers votre CRM.",
      color: "text-indigo-600",
      export: "Zapier, Webhooks, API",
      image: "/fichier-scrap.png"
    },
    
];

function FeatureCard({ feature, index }: { feature: any; index: number }) {
  const Icon = feature.icon;

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 p-8 rounded-xl border border-white/10 bg-white/5 hover:shadow-lg transition-shadow backdrop-blur-sm">
      
      {/* Visuel */}
      <div className={`flex-1 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
        <div className="relative">
          {feature.icon === MessageCircle ? (
            <ScrapdeoufAi />
          ) : (
            <img 
              src={feature.image} 
              alt={`${feature.title} - Interface Professionnelle`}
              className="w-full h-90 object-cover rounded"
            />
          )}
        </div>
      </div>

      {/* Contenu texte */}
      <div className={`flex-1 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'} text-center lg:text-left`}>
        <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
          <div className={`p-2 rounded-lg bg-white/10 ${feature.color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            {feature.title}
          </h3>
        </div>

        <p className="text-gray-300 mb-6 leading-relaxed">
          {feature.description}
        </p>

        <div className="bg-white/10 rounded-lg p-4 border border-white/10 mb-4">
          <p className="text-sm text-gray-200">
            <span className="font-semibold text-white">Exemple :</span> {feature.example}
          </p>
        </div>

        {/* Bloc spécial chatbot */}
        {feature.icon === MessageCircle && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-500/30">
              <h4 className="font-semibold text-blue-200 text-sm mb-1">Version Basique</h4>
              <p className="text-xs text-blue-100">Support instantané • Documentation • FAQ • Réponses contextuelles</p>
            </div>
            <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/30">
              <h4 className="font-semibold text-purple-200 text-sm mb-1">Version Premium</h4>
              <p className="text-xs text-purple-100">Analyses IA avancées • Recommandations stratégiques • Automatisation complète</p>
            </div>
          </div>
        )}

        {/* Formats d’export */}
        <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
          {feature.export.split(', ').map((format: string, i: number) => (
            <span
              key={i}
              className="px-2 py-1 bg-white/10 border border-white/20 rounded text-xs text-gray-200"
            >
              {format}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}


export function LandingFeatures() {
  return (
    <section id="features" className="relative isolate bg-gray-900 py-20 text-white">
      {/* Dégradé flou en arrière-plan (haut) */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr to-[#9089fc] from-[#4F46E5] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      <div className="container mx-auto px-4 max-w-6xl z-10 relative">
        {/* Features Grid */}
        <div className="space-y-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
            />
          ))}
        </div>
      </div>
      
    </section>
  );
}

