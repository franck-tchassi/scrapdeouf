//(protedid)/dashboard/dashboard-overview

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, CreditCard, Activity, Play, ListChecks, Sparkles } from "lucide-react"; // Suppression des icônes spécifiques aux actions rapides
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SafeUser } from "@/types";
import HighlightText from "@/components/layout/HighlightText";
import Link from "next/link";
import CreditUsageChart from "../components/charts/credit-usage-chart";


interface DashboardOverviewProps {
  currentUser: SafeUser | null;
}

export default function DashboardOverview({ currentUser }: DashboardOverviewProps) {
  const userName = currentUser?.name || currentUser?.email || "Utilisateur";
  const creditsRemaining = (currentUser?.creditsLimit || 0) - (currentUser?.creditsUsed || 0);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"> {/* Conteneur principal responsive */}
      {/* En-tête avec message de bienvenue */}
      <div className="space-y-2 mb-10 sm:mb-12">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">Tableau de bord</h2>
        <p className="text-muted-foreground text-lg sm:text-xl">
          Content de vous revoir <HighlightText variant="fancy-slant" color="secondary">{userName}</HighlightText> 👋
        </p>
      </div>

      {/* Section des statistiques clés */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10 sm:mb-12"> {/* Grille responsive pour les cartes */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Extractions Totales
            </CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUser?.totalExtractions || 0}</div>
            <p className="text-xs text-muted-foreground">
              Toutes vos extractions créées
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-green-200/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Extractions Réussies
            </CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUser?.completedExtractions || 0}</div>
            <p className="text-xs text-muted-foreground">
              Extractions terminées avec succès
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crédits Utilisés</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUser?.creditsUsed || 0}</div>
            <p className="text-xs text-muted-foreground">
              Sur {currentUser?.creditsLimit || 0} disponibles
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-yellow-200/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crédits Restants</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creditsRemaining}</div>
            <p className="text-xs text-muted-foreground">
              Avant la prochaine réinitialisation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Section du graphique (maintenant en pleine largeur) */}
      <div className="mb-10 sm:mb-12"> {/* Suppression de la grille pour cette section */}
        {/* Graphique d'utilisation des crédits */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Utilisation des Crédits</CardTitle>
            <CardDescription>
              Aperçu de votre consommation de crédits au fil du temps.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreditUsageChart />
          </CardContent>
        </Card>
      </div>

      {/* Section des dernières extractions */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-gray-600" />
            Dernières Extractions
          </CardTitle>
          <CardDescription>
            Aperçu de vos activités de scraping récentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <p>Aucune extraction récente à afficher pour le moment.</p>
            <p className="text-sm mt-2">Lancez votre première extraction pour la voir apparaître ici !</p>
          </div>
          {/* Ici, vous pourriez ajouter un tableau ou une liste des dernières extractions */}
        </CardContent>
      </Card>
    </div>
  );
}