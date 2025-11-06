// src/app/[locale]/(landing)/page.tsx

"use client";


import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import Hero from "@/components/layout/Hero";
import { AnimatedSection } from "@/components/animated-section";
import { TestimonialGridSection } from "@/components/testimonial-grid-section";
import { LandingFeatures } from "@/components/layout/landing-features";
import { CallToAction } from "@/components/layout/CallToAction";
import FAQSection from "@/components/layout/FAQSection";
import SecurityCompliance from "@/components/layout/SecurityCompliance";
import ComparisonScrapdeouf from "@/components/layout/ComparisonScrapdeouf";
import ExportFeature from "@/components/layout/ExportFeature";
import AutomationFeature from "@/components/layout/AutomationFeature";








export default function LandingPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showChatIcon, setShowChatIcon] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowChatIcon(true);
      } else {
        setShowChatIcon(false);
        setIsChatOpen(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const timelineData = [
    {
      id: 1,
      image: "https://example.com/image1.jpg",
      alt: "Analyse de positionnement",
      title: "Analyse de votre positionnement actuel",
      description: "Nous analysons votre visibilité actuelle sur Google et identifions les opportunités d'amélioration.",
      layout: "left" as const // Notez le "as const" pour garantir le type littéral
    },
    {
      id: 2,
      image: "https://example.com/image2.jpg",
      alt: "Stratégie personnalisée",
      title: "Stratégie personnalisée",
      description: "Nous développons une stratégie sur mesure pour améliorer votre classement dans les résultats locaux.",
      layout: "right" as const
    },
    {
      id: 3,
      image: "https://example.com/image3.jpg",
      alt: "Suivi et optimisation",
      title: "Suivi et optimisation continue",
      description: "Nous monitorons vos performances et ajustons la stratégie pour des résultats optimaux.",
      layout: "left" as const
    }
  ]

  // Données d'exemple pour les fonctionnalités
  const featuresData = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Dashboard de génération de leads",
      title: "Génération de leads intelligente",
      description: "Système avancé de capture et qualification de leads avec scoring automatique et intégration CRM.",
      category: "Stratégie",
      layout: "left" as const
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Vérificateur et Suivi des Positions",
      title: "Suivez vos classements locaux Google",
      description: "Notre vérificateur de position local gratuit est plus précis que les meilleurs outils de SEO local. Suivez la visibilité de votre fiche d'entreprise dans les moteurs de recherche. Restez informé et réagissez immédiatement lorsque vos concurrents vous rattrapent.",
      category: "Vérificateur et Suivi des Positions",
      layout: "right" as const
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Visiloo AI",
      title: "Utilisez l'IA pour améliorer le marketing local ✨",
      description: "Travaillez mieux, pas plus dur. Rédigez des posts Google plus rapidement, répondez aux avis plus rapidement et mettez à jour les détails de votre profil d'entreprise plus intelligemment. Notre populaire outil de SEO local utilise l'IA pour vous aider à exécuter facilement des stratégies de marketing local.",
      category: "Visiloo AI",
      layout: "left" as const
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Gestion des avis Google",
      title: "Gestion centralisée des avis ⭐",
      description: "Collectez, répondez et analysez tous vos avis Google My Business depuis une interface unique.",
      category: "Gestion des Avis",
      layout: "right" as const
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Messagerie centralisée",
      title: "Messagerie unifiée ",
      description: "Gérez vos messages provenant de Google, Facebook, Instagram et plus encore depuis une seule plateforme.",
      category: "Canaux de communication",
      layout: "left" as const
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Factures et devis professionnels",
      title: "Factures & Devis Pro 📄",
      description: "Créez et envoyez des factures et devis professionnels en quelques clics, directement depuis votre espace.",
      category: "Facturation",
      layout: "right" as const
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Gestion d'organisation et équipe",
      title: "Gérez votre organisation 👥",
      description: "Créez votre organisation, invitez vos collaborateurs et attribuez des rôles pour une gestion d'équipe simplifiée.",
      category: "Collaboration",
      layout: "left" as const
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Éditeur de photos intelligent",
      title: "Éditeur photo assisté par IA ",
      description: "Améliorez automatiquement la qualité de vos photos professionnelles grâce à l'intelligence artificielle : luminosité, netteté, cadrage, suppression d’arrière-plan… tout est optimisé en un clic.",
      category: "Médias & Visuels",
      layout: "right" as const
    },
    {
      id: 9,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Publication de contenu multi-plateforme",
      title: "Publication multi-canal",
      description: "Planifiez et publiez du contenu sur tous vos canaux : site web, réseaux sociaux, annuaires.",
      category: "Publication",
      layout: "left" as const
    }
  ]



  return (
    <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
      <Hero />
      <ComparisonScrapdeouf />
      <ExportFeature />
      <AutomationFeature />
      
      <AnimatedSection
          id="testimonials-section"
          className="relative z-10 container mx-auto max-w-screen-xl px-4 md:px-6 mt-8 md:mt-16"
          delay={0.2}
        >
          <TestimonialGridSection />
      </AnimatedSection>

      <SecurityCompliance />
      
      <FAQSection />
      <CallToAction />
      {showChatIcon && (
        <Button
          className="fixed bottom-6 right-6 z-40 rounded-full shadow-xl w-14 h-14 flex items-center justify-center bg-primary text-white hover:scale-105 transition"
          size="icon"
          aria-label="Ouvrir le chatbot"
          onClick={() => setIsChatOpen(true)}
        >
          <MessageCircle size={32} />
          
        </Button>
      )}
      {/** <ChatbotWidget open={isChatOpen} onClose={() => setIsChatOpen(false)} /> **/}

    </div>
  );
}