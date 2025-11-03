// (protedid)/dashboard/new-extraction/[id]/setup/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Play, 
  Settings, 
  XCircle, 
  Hash, 
  Mail, 
  Phone, 
  Calendar,
  Download,
  ArrowLeft,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  Coins,
  Link,
  Copy,
  ExternalLink,
  ShoppingCart,
  Repeat, // Nouvelle icône pour la planification
  Loader2, // Pour les états de chargement
  Info, // Pour les messages d'erreur cron
  Trash2, // Ajout de l'icône Trash2 pour l'annulation de planification
} from "lucide-react";
import { Extraction as PrismaExtraction, ExtractionStatus } from '@prisma/client';
import { Badge } from "@/components/ui/badge";
import { ClientExtraction, GlobalMonitoringData } from "@/types";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
// import cron from 'node-cron'; // Supprimé car il contient des dépendances côté serveur

import dynamic from "next/dynamic";
import GoogleMapsResultsTable, { GoogleMapsResultRow } from "../../google-maps-results-table";
import AmazonResultsTable from "../../amazon-results-table";
import { AmazonProductRow } from "@/lib/amazon-scraper";

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function ExtractionSetupPage() {
  const params = useParams();
  const router = useRouter();
  const extractionId = params.id as string;

  const [extraction, setExtraction] = useState<ClientExtraction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingExtraction, setIsStartingExtraction] = useState(false);
  const [extractedResults, setExtractedResults] = useState<GoogleMapsResultRow[] | AmazonProductRow[] | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("configuration");
  const [animationData, setAnimationData] = useState(null);
  const [creditsConsumedForExtraction, setCreditsConsumedForExtraction] = useState<number | null>(null);
  const [monitoringData, setMonitoringData] = useState<GlobalMonitoringData | null>(null);

  // États pour les champs de configuration Google Maps
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string>("");
  const [googleMapsMaxResults, setGoogleMapsMaxResults] = useState<number | string>("");
  const [enrichEmails, setEnrichEmails] = useState<boolean>(false);
  const [enrichPhones, setEnrichPhones] = useState<boolean>(false);

  // États pour les champs de configuration Amazon
  const [amazonUrl, setAmazonUrl] = useState<string>("");
  const [amazonMaxResults, setAmazonMaxResults] = useState<number | string>("");

  // États pour la planification
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [cronExpression, setCronExpression] = useState<string>("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [cronError, setCronError] = useState<string | null>(null);
  const [isUnscheduling, setIsUnscheduling] = useState(false);


  // Charger l'animation Lottie
  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch('/loading.json');
        if (!response.ok) {
          throw new Error('Animation not found');
        }
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'animation:', error);
      }
    };

    loadAnimation();
  }, []);

  useEffect(() => {
    if (!extractionId) return;

    const fetchExtraction = async () => {
      try {
        const response = await fetch(`/api/extractions/${extractionId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch extraction details");
        }
        const data: PrismaExtraction = await response.json();
        
        const clientExtraction: ClientExtraction = { 
          ...data, 
          resultsCount: data.status === "completed" ? (data.resultsData ? JSON.parse(data.resultsData).length : 0) : 0,
          // Assurer que les champs de planification sont correctement typés
          isScheduled: data.isScheduled || false,
          cronExpression: data.cronExpression || null,
          nextRunAt: data.nextRunAt ? new Date(data.nextRunAt) : null,
          lastRunAt: data.lastRunAt ? new Date(data.lastRunAt) : null,
          scheduleJobId: data.scheduleJobId || null,
          status: data.status as ExtractionStatus, // Cast to ExtractionStatus
        };
        setExtraction(clientExtraction);

        // Initialiser les états avec les données existantes
        setCreditsConsumedForExtraction(clientExtraction.creditsConsumed || null);
        setMonitoringData({
          durationMs: clientExtraction.durationMs || 0,
          pagesVisited: clientExtraction.pagesVisited || 0,
          successfulScrapes: clientExtraction.successfulScrapes || 0,
          failedScrapes: clientExtraction.failedScrapes || 0,
          proxyUsed: clientExtraction.proxyUsed || false,
          proxyHost: clientExtraction.proxyHost || undefined,
        });

        if (clientExtraction.template === "google_maps") { // Utiliser google_maps
          setGoogleMapsUrl(clientExtraction.googleMapsUrl || "");
          setGoogleMapsMaxResults(clientExtraction.maxResults || "");
          setEnrichEmails(clientExtraction.enrichEmails || false);
          setEnrichPhones(clientExtraction.enrichPhones || false);
        } else if (clientExtraction.template === "amazon") {
          setAmazonUrl(clientExtraction.amazonUrl || "");
          setAmazonMaxResults(clientExtraction.amazonMaxResults || "");
        }

        // Si l'extraction est terminée, charger les résultats
        if (clientExtraction.status === "completed" && clientExtraction.resultsData) {
          setExtractedResults(JSON.parse(clientExtraction.resultsData));
          setActiveTab("results");
        }

        // Initialiser l'expression cron pour la dialog
        setCronExpression(clientExtraction.cronExpression || "");

      } catch (error) {
        console.error("Error fetching extraction:", error);
        toast.error("Échec du chargement des détails de l'extraction.");
        router.push("/fr/dashboard/new-extraction");
      } finally {
        setIsLoading(false);
      }
    };
    fetchExtraction();
  }, [extractionId, router]);

  // Simulation de progression pour l'extraction
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStartingExtraction && extraction?.status === "running") {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isStartingExtraction, extraction?.status]);

  const handleStartExtraction = async () => {
    if (!extraction || isStartingExtraction) return;

    let payload: any = { status: "running" };
    let isValid = true;

    if (extraction.template === "google_maps") {
      if (!googleMapsUrl) {
        toast.error("Veuillez saisir un lien Google Maps.");
        isValid = false;
      } else if (!validateGoogleMapsUrl(googleMapsUrl)) {
        toast.error("Veuillez saisir un lien Google Maps valide.");
        isValid = false;
      }
      payload = {
        ...payload,
        googleMapsUrl: googleMapsUrl,
        maxResults: typeof googleMapsMaxResults === 'string' && googleMapsMaxResults === '' ? null : Number(googleMapsMaxResults),
        enrichEmails: enrichEmails,
        enrichPhones: enrichPhones,
      };
    } else if (extraction.template === "amazon") {
      if (!amazonUrl) {
        toast.error("Veuillez saisir un lien Amazon.");
        isValid = false;
      } else if (!validateAmazonUrl(amazonUrl)) {
        toast.error("Veuillez saisir un lien Amazon valide.");
        isValid = false;
      }
      payload = {
        ...payload,
        amazonUrl: amazonUrl,
        amazonMaxResults: typeof amazonMaxResults === 'string' && amazonMaxResults === '' ? null : Number(amazonMaxResults),
      };
    } else {
      toast.error("Template d'extraction non supporté.");
      isValid = false;
    }

    if (!isValid) return;

    setIsStartingExtraction(true);
    setProgress(0);
    toast.info("L'extraction est en cours de démarrage...");

    try {
      // 1. Mettre à jour la configuration
      const updateConfigResponse = await fetch(`/api/extractions/${extraction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!updateConfigResponse.ok) {
        const errorData = await updateConfigResponse.json();
        throw new Error(errorData.error || "Failed to update extraction configuration.");
      }

      // 2. Lancer le scraping (directRun=true)
      const runScrapeResponse = await fetch(`/api/extractions/${extraction.id}/run-scrape?directRun=true`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!runScrapeResponse.ok) {
        const errorData = await runScrapeResponse.json();
        if (runScrapeResponse.status === 403) {
          toast.error(errorData.error || "Crédits insuffisants pour lancer l'extraction.");
          router.push("/fr/subscribe");
        } else {
          const errorMessage = errorData.error || "Échec du démarrage de l'extraction via l'orchestrateur.";
          const errorDetails = errorData.details ? `Détails: ${errorData.details}` : '';
          throw new Error(`${errorMessage} ${errorDetails}`);
        }
        return;
      }

      const { message, results, monitoring, creditsConsumed } = await runScrapeResponse.json();
      toast.success(message);

      // Mettre à jour l'état de l'UI avec les résultats directs
      setExtractedResults(results);
      setMonitoringData(monitoring);
      setCreditsConsumedForExtraction(creditsConsumed);
      setExtraction(prev => prev ? { 
        ...prev, 
        status: "completed" as ExtractionStatus, // Mettre à jour le statut à 'completed'
        resultsData: JSON.stringify(results), // Sauvegarder les résultats dans l'état de l'extraction
        creditsConsumed: creditsConsumed,
        durationMs: monitoring.durationMs,
        pagesVisited: monitoring.pagesVisited,
        successfulScrapes: monitoring.successfulScrapes,
        failedScrapes: monitoring.failedScrapes,
        proxyUsed: monitoring.proxyUsed,
        proxyHost: monitoring.proxyHost,
        resultsCount: results.length,
      } : null);
      setActiveTab("results"); // Passer à l'onglet des résultats
      setProgress(100); // Terminer la barre de progression

    } catch (error: any) {
      console.error("Error starting extraction:", error);
      toast.error(error.message || "Une erreur inattendue est survenue lors du démarrage de l'extraction.");
      setExtraction(prev => prev ? { ...prev, status: "error" as ExtractionStatus } : null);
      setProgress(0);
    } finally {
      setIsStartingExtraction(false);
    }
  };

  const handleCopyGoogleMapsExample = () => {
    const exampleUrl = "https://www.google.com/maps/search/restaurants/@48.8566,2.3522,14z/data=!3m1!4b1";
    navigator.clipboard.writeText(exampleUrl);
    toast.success("Exemple Google Maps copié dans le presse-papier !");
  };

  const handleCopyAmazonExample = () => {
    const exampleUrl = "https://www.amazon.com/s?k=gel+de+douche";
    navigator.clipboard.writeText(exampleUrl);
    toast.success("Exemple Amazon copié dans le presse-papier !");
  };

  const validateGoogleMapsUrl = (url: string): boolean => {
    if (!url) return false;
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname.includes('google.com') && parsedUrl.pathname.includes('/maps/');
    } catch {
      return false;
    }
  };

  const validateAmazonUrl = (url: string): boolean => {
    if (!url) return false;
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname.includes('amazon.') && (parsedUrl.pathname.startsWith('/s') || parsedUrl.pathname.startsWith('/dp'));
    } catch {
      return false;
    }
  };

  const getTemplateImageSrc = (template: string): string | null => {
    const templates: { [key: string]: string } = {
      "google_maps": "/scraper/googlemaps.png", // Utiliser google_maps
      "amazon": "/scraper/amazon1.png",
      "tripadvisor": "/scraper/tripadvisor.png",
      "airbnb": "/scraper/airbnb.png",
      "ebay": "/scraper/ebay.png",
    };
    return templates[template] || null;
  };

  const getStatusConfig = (status: ExtractionStatus) => {
    const configs = {
      draft: { icon: Clock, color: "text-gray-500", bg: "bg-gray-100", label: "Brouillon" },
      running: { icon: Clock, color: "text-blue-500", bg: "bg-blue-100", label: "En cours" },
      completed: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-100", label: "Terminé" },
      error: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-100", label: "Erreur" },
      scheduled: { icon: Repeat, color: "text-purple-500", bg: "bg-purple-100", label: "Planifiée" }, // Nouveau statut
    };
    return configs[status] || configs.draft;
  };

  // Écran de chargement avec Lottie uniquement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex justify-center items-center">
        <div className="text-center">
          {animationData  && (
            <div className="flex flex-col items-center justify-center">
              <Lottie 
                animationData={animationData} 
                loop={true}
                autoplay={true}
                style={{ width: 200, height: 200 }}
              />
            </div>
          ) 
          }
        </div>
      </div>
    );
  }

  if (!extraction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex justify-center items-center">
        <div className="text-center p-8 max-w-md">
          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Extraction introuvable</h2>
          <p className="text-gray-600 mb-6">L'extraction que vous recherchez n'existe pas ou a été supprimée.</p>
          <Button onClick={() => router.push("/fr/dashboard/new-extraction")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour aux extractions
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(extraction.status);
  const StatusIcon = statusConfig.icon;
  const templateImageSrc = getTemplateImageSrc(extraction.template);

  const isGoogleMapsTemplate = extraction.template === "google_maps";
  const isAmazonTemplate = extraction.template === "amazon";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/fr/dashboard/new-extraction")}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configuration d'extraction</h1>
              <p className="text-gray-600 mt-1">Gérez et lancez vos processus de collecte de données</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className={`${statusConfig.bg} ${statusConfig.color} border-0 px-3 py-1`}>
              <StatusIcon className={`h-3 w-3 mr-1 ${extraction.status === 'running' ? 'animate-spin' : ''}`} />
              {statusConfig.label}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Informations de l'extraction */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                  Informations de l'extraction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Nom</span>
                  <span className="text-sm text-gray-900 font-semibold">{extraction.name}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Template</span>
                  <div className="flex items-center gap-2">
                    {templateImageSrc && (
                      <Image
                        src={templateImageSrc}
                        alt={extraction.template}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    )}
                    <span className="text-sm text-gray-900 capitalize">{extraction.template.replace('_', ' ')}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Créée le</span>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="h-3 w-3" />
                    {new Date(extraction.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                {extraction.status === "completed" && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Résultats</span>
                      <span className="text-sm font-semibold text-green-600">
                        {extraction.resultsCount || 0} trouvés
                      </span>
                    </div>
                    {creditsConsumedForExtraction !== null && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Crédits utilisés</span>
                        <span className="text-sm font-semibold text-indigo-600 flex items-center gap-1">
                          <Coins className="h-4 w-4" /> {creditsConsumedForExtraction}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Lien vers la page de planification */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Repeat className="h-5 w-5 text-purple-600" />
                    Planification
                  </h3>
                  <p className="text-sm text-gray-600">
                    Gérez la planification de cette extraction depuis la page dédiée.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full gap-2" 
                    onClick={() => router.push("/fr/dashboard/schedules")}
                  >
                    <Calendar className="h-4 w-4" />
                    Gérer les planifications
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Carte de statut d'extraction */}
            {(extraction.status === "running" || isStartingExtraction) && (
              <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600 animate-spin" />
                    Progression
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Extraction en cours...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Cette opération peut prendre quelques minutes selon le volume de données.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm p-1">
                <TabsTrigger value="configuration" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Configuration
                </TabsTrigger>
                <TabsTrigger 
                  value="results" 
                  className="flex items-center gap-2"
                  disabled={extraction.status !== "completed"}
                >
                  <Download className="h-4 w-4" />
                  Résultats
                </TabsTrigger>
              </TabsList>

              <TabsContent value="configuration" className="space-y-6">
                {/* Configuration Google Maps */}
                {isGoogleMapsTemplate && (
                  <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50 shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Settings className="h-5 w-5 text-blue-600" />
                        Paramètres Google Maps
                      </CardTitle>
                      <CardDescription>
                        Collez votre lien Google Maps pour lancer l'extraction
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Lien Google Maps */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Link className="h-5 w-5 text-blue-600" />
                          <Label className="text-sm font-medium text-blue-900">
                            Lien Google Maps *
                          </Label>
                        </div>
                        <div className="space-y-3">
                          <Textarea
                            placeholder="Collez ici le lien de votre recherche Google Maps..."
                            value={googleMapsUrl}
                            onChange={(e) => setGoogleMapsUrl(e.target.value)}
                            className={`min-h-[100px] border-gray-300 focus:border-blue-500 rounded-lg transition-colors ${
                              googleMapsUrl && !validateGoogleMapsUrl(googleMapsUrl) ? 'border-red-300' : ''
                            }`}
                          />
                          {googleMapsUrl && !validateGoogleMapsUrl(googleMapsUrl) && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              Le lien ne semble pas être une URL Google Maps valide
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCopyGoogleMapsExample}
                              className="gap-1"
                            >
                              <Copy className="h-3 w-3" />
                              Copier un exemple
                            </Button>
                            <span>Ou</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open('https://www.google.com/maps', '_blank')}
                              className="gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Ouvrir Google Maps
                            </Button>
                          </div>
                          <p className="text-xs text-blue-700">
                            💡 <strong>Comment obtenir le lien :</strong> Faites votre recherche sur Google Maps, puis copiez l'URL depuis la barre d'adresse de votre navigateur.
                          </p>
                        </div>
                      </div>

                      {/* Nombre maximum de résultats */}
                      <div className="space-y-4 pt-4 border-t border-gray-200">
                        <Label htmlFor="googleMapsMaxResults" className="text-sm font-medium flex items-center gap-2">
                          <Hash className="h-4 w-4 text-gray-500" />
                          Nombre maximum de résultats
                        </Label>
                        <Input
                          id="googleMapsMaxResults"
                          type="number"
                          placeholder="Ex: 20, 50, 100 (laisser vide pour la valeur par défaut)"
                          value={googleMapsMaxResults}
                          onChange={(e) => setGoogleMapsMaxResults(e.target.value)}
                          min="1"
                          className="h-11 border-gray-300 focus:border-blue-500 rounded-lg transition-colors"
                        />
                        <p className="text-xs text-gray-500">
                          Laisser vide pour utiliser la valeur par défaut (20 résultats). Plus de résultats = plus de crédits utilisés.
                        </p>
                      </div>

                      {/* Options d'enrichissement */}
                      <div className="space-y-4 pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Options d'enrichissement</h3>
                        
                        <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-lg border border-blue-200/50 transition-colors hover:bg-blue-50">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Mail className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <Label htmlFor="enrichEmails" className="text-sm font-medium cursor-pointer">
                                Extraction d'emails depuis les sites web
                              </Label>
                              <p className="text-sm text-gray-600 mt-1">
                                Active le crawl des sites web pour extraire des adresses email
                              </p>
                              <span className="text-xs text-blue-600 font-medium">+5 crédits par résultat</span>
                            </div>
                          </div>
                          <Switch
                            id="enrichEmails"
                            checked={enrichEmails}
                            onCheckedChange={setEnrichEmails}
                            className="data-[state=checked]:bg-blue-600"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-purple-50/50 rounded-lg border border-purple-200/50 transition-colors hover:bg-purple-50">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Phone className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <Label htmlFor="enrichPhones" className="text-sm font-medium cursor-pointer">
                                Extraction de téléphones depuis les sites web
                              </Label>
                              <p className="text-sm text-gray-600 mt-1">
                                Active le crawl des sites web pour extraire des numéros de téléphone
                              </p>
                              <span className="text-xs text-purple-600 font-medium">+3 crédits par résultat</span>
                            </div>
                          </div>
                          <Switch
                            id="enrichPhones"
                            checked={enrichPhones}
                            onCheckedChange={setEnrichPhones}
                            className="data-[state=checked]:bg-purple-600"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Configuration Amazon */}
                {isAmazonTemplate && (
                  <Card className="bg-white/80 backdrop-blur-sm border-orange-200/50 shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-orange-600" />
                        Paramètres Amazon
                      </CardTitle>
                      <CardDescription>
                        Collez votre lien de recherche Amazon pour lancer l'extraction
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Lien Amazon */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Link className="h-5 w-5 text-orange-600" />
                          <Label className="text-sm font-medium text-orange-900">
                            Lien Amazon *
                          </Label>
                        </div>
                        <div className="space-y-3">
                          <Textarea
                            placeholder="Collez ici le lien de votre recherche Amazon (ex: https://www.amazon.com/s?k=gel+de+douche)..."
                            value={amazonUrl}
                            onChange={(e) => setAmazonUrl(e.target.value)}
                            className={`min-h-[100px] border-gray-300 focus:border-orange-500 rounded-lg transition-colors ${
                              amazonUrl && !validateAmazonUrl(amazonUrl) ? 'border-red-300' : ''
                            }`}
                          />
                          {amazonUrl && !validateAmazonUrl(amazonUrl) && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              Le lien ne semble pas être une URL Amazon valide
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCopyAmazonExample}
                              className="gap-1"
                            >
                              <Copy className="h-3 w-3" />
                              Copier un exemple
                            </Button>
                            <span>Ou</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open('https://www.amazon.com', '_blank')}
                              className="gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Ouvrir Amazon
                            </Button>
                          </div>
                          <p className="text-xs text-orange-700">
                            💡 <strong>Comment obtenir le lien :</strong> Faites votre recherche sur Amazon, puis copiez l'URL depuis la barre d'adresse de votre navigateur.
                          </p>
                        </div>
                      </div>

                      {/* Nombre maximum de résultats Amazon */}
                      <div className="space-y-4 pt-4 border-t border-gray-200">
                        <Label htmlFor="amazonMaxResults" className="text-sm font-medium flex items-center gap-2">
                          <Hash className="h-4 w-4 text-gray-500" />
                          Nombre maximum de produits
                        </Label>
                        <Input
                          id="amazonMaxResults"
                          type="number"
                          placeholder="Ex: 5, 10, 20 (laisser vide pour la valeur par défaut)"
                          value={amazonMaxResults}
                          onChange={(e) => setAmazonMaxResults(e.target.value)}
                          min="1"
                          className="h-11 border-gray-300 focus:border-orange-500 rounded-lg transition-colors"
                        />
                        <p className="text-xs text-gray-500">
                          Laisser vide pour utiliser la valeur par défaut (5 produits). Plus de résultats = plus de crédits utilisés.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Bouton de démarrage */}
                {extraction.status !== "completed" && (
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50/50 border-green-200/50">
                    <CardContent className="p-6 text-center">
                      <div className="max-w-md mx-auto">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Prêt à lancer l'extraction ?
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Le lien sera utilisé pour l'extraction.
                        </p>
                        <Button
                          onClick={handleStartExtraction}
                          disabled={
                            isStartingExtraction || 
                            extraction.status === "running" || 
                            (isGoogleMapsTemplate && (!googleMapsUrl || !validateGoogleMapsUrl(googleMapsUrl))) ||
                            (isAmazonTemplate && (!amazonUrl || !validateAmazonUrl(amazonUrl)))
                          }
                          size="lg"
                          className="px-8 py-3 text-base bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 mx-auto min-w-[200px]"
                        >
                          {isStartingExtraction || extraction.status === "running" ? (
                            <>
                              <Clock className="h-5 w-5 animate-spin" />
                              Extraction en cours...
                            </>
                          ) : (
                            <>
                              <Play className="h-5 w-5" />
                              Démarrer l'extraction
                            </>
                          )}
                        </Button>
                        {isGoogleMapsTemplate && !googleMapsUrl && (
                          <p className="text-sm text-red-600 mt-2">
                            Veuillez saisir un lien Google Maps pour démarrer l'extraction.
                          </p>
                        )}
                        {isAmazonTemplate && !amazonUrl && (
                          <p className="text-sm text-red-600 mt-2">
                            Veuillez saisir un lien Amazon pour démarrer l'extraction.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="results">
                {extraction.status === "completed" && extractedResults ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Download className="h-5 w-5 text-green-600" />
                        Résultats de l'extraction
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {extractedResults.length} résultats
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isGoogleMapsTemplate && (
                        <GoogleMapsResultsTable data={extractedResults as GoogleMapsResultRow[]} monitoring={monitoringData} />
                      )}
                      {isAmazonTemplate && (
                        <AmazonResultsTable data={extractedResults as AmazonProductRow[]} monitoring={monitoringData} />
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="max-w-sm mx-auto">
                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Aucun résultat disponible
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {extraction.status === "running" 
                            ? "L'extraction est en cours de traitement..." 
                            : "Lancez une extraction pour voir les résultats ici."}
                        </p>
                        {extraction.status !== "running" && (
                          <Button onClick={() => setActiveTab("configuration")}>
                            Configurer l'extraction
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}