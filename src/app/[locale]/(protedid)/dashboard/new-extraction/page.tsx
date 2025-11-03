//(protedid)/dashboard/new-extraction/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Play, MoreVertical, Calendar, Search, Trash2, Edit, NotebookIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Extraction as PrismaExtraction } from '@prisma/client';
import { ClientExtraction } from "@/types";
import NewExtractionModal from "./new-extraction-modal";
import EditExtractionNameModal from "./edit-extraction-name-modal";
import DeleteExtractionModal from "./delete-extraction-modal";
import dynamic from "next/dynamic";

// Chargement dynamique de Lottie
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function NewExtractionPage() {
  const router = useRouter();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [extractions, setExtractions] = useState<ClientExtraction[]>([]);
  const [isLoadingExtractions, setIsLoadingExtractions] = useState(true);
  const [editingExtraction, setEditingExtraction] = useState<PrismaExtraction | null>(null);
  const [deletingExtraction, setDeletingExtraction] = useState<PrismaExtraction | null>(null);
  const [animationData, setAnimationData] = useState(null);

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

  // Charger les extractions au montage du composant
  useEffect(() => {
    const fetchExtractions = async () => {
      try {
        const response = await fetch("/api/extractions");
        if (!response.ok) {
          throw new Error("Failed to fetch extractions");
        }
        const data: PrismaExtraction[] = await response.json();

        // Ajouter un resultsCount simulé et s'assurer que les dates sont des objets Date
        const processedData: ClientExtraction[] = data.map(ext => ({
          ...ext,
          createdAt: new Date(ext.createdAt),
          updatedAt: new Date(ext.updatedAt),
          resultsCount: ext.status === "completed" ? (ext.resultsData ? JSON.parse(ext.resultsData).length : 0) : 0,
        }));
        setExtractions(processedData);
      } catch (error) {
        console.error("Error fetching extractions:", error);
        toast.error("Échec du chargement des extractions.");
      } finally {
        setIsLoadingExtractions(false);
      }
    };
    fetchExtractions();
  }, []);

  // Fonction pour ajouter une nouvelle extraction (appelée par la modale de création)
  const handleExtractionCreated = (newExtraction: PrismaExtraction) => {
    setExtractions(prev => [{
      ...newExtraction,
      createdAt: new Date(newExtraction.createdAt),
      updatedAt: new Date(newExtraction.updatedAt),
      resultsCount: 0
    }, ...prev]);
    setIsNewModalOpen(false);
    router.push(`/fr/dashboard/new-extraction/${newExtraction.id}/setup`);
  };

  // Fonction pour mettre à jour une extraction (appelée par la modale d'édition)
  const handleExtractionUpdated = (updatedExtraction: PrismaExtraction) => {
    setExtractions(prev =>
      prev.map(ext =>
        ext.id === updatedExtraction.id
          ? {
            ...ext,
            name: updatedExtraction.name,
            updatedAt: new Date(updatedExtraction.updatedAt)
          }
          : ext
      )
    );
    setIsEditModalOpen(false);
    setEditingExtraction(null);
  };

  // Fonction pour ouvrir la modale de suppression
  const openDeleteModal = (extraction: ClientExtraction) => {
    // Construire un objet compatible avec le type PrismaExtraction en fournissant
    // des valeurs par défaut pour les champs optionnels manquants.
    const prismaCompatibleExtraction: PrismaExtraction = {
      id: extraction.id,
      name: extraction.name,
      template: extraction.template as any,
      status: extraction.status as any,
      createdAt: extraction.createdAt as Date,
      updatedAt: extraction.updatedAt as Date,
      userId: extraction.userId,
      // Champs génériques / optionnels
      searchTerm: extraction.searchTerm ?? null,
      city: extraction.city ?? null,
      country: extraction.country ?? null,
      maxResults: extraction.maxResults ?? null,
      enrichEmails: extraction.enrichEmails ?? null,
      enrichPhones: extraction.enrichPhones ?? null,
      // Champs supplémentaires présents dans le schéma Prisma
      googleMapsUrl: (extraction as any).googleMapsUrl ?? null,
      amazonUrl: (extraction as any).amazonUrl ?? null,
      amazonMaxResults: (extraction as any).amazonMaxResults ?? null,
      durationMs: (extraction as any).durationMs ?? null,
      pagesVisited: (extraction as any).pagesVisited ?? null,
      successfulScrapes: (extraction as any).successfulScrapes ?? null,
      failedScrapes: (extraction as any).failedScrapes ?? null,
      proxyUsed: (extraction as any).proxyUsed ?? false,
      proxyHost: (extraction as any).proxyHost ?? null,
      resultsData: extraction.resultsData ?? null,
      creditsConsumed: (extraction as any).creditsConsumed ?? null,
      // Scheduling
      isScheduled: (extraction as any).isScheduled ?? false,
      cronExpression: (extraction as any).cronExpression ?? null,
      nextRunAt: (extraction as any).nextRunAt ?? null,
      lastRunAt: (extraction as any).lastRunAt ?? null,
      scheduleJobId: (extraction as any).scheduleJobId ?? null,
    };

    setDeletingExtraction(prismaCompatibleExtraction);
    setIsDeleteModalOpen(true);
  };

  // Fonction pour confirmer et exécuter la suppression
  const confirmDeleteExtraction = async (id: string) => {
    setIsDeleteModalOpen(false);
    try {
      const response = await fetch(`/api/extractions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete extraction");
      }

      setExtractions(prev => prev.filter(extraction => extraction.id !== id));
      toast.success("Extraction supprimée avec succès !");
    } catch (error) {
      console.error("Error deleting extraction:", error);
      toast.error("Échec de la suppression de l'extraction.");
    } finally {
      setDeletingExtraction(null);
    }
  };

  // Fonction pour modifier une extraction (ouvre la modale d'édition de nom)
  const handleEditExtraction = (extraction: ClientExtraction) => {
    // Construire un objet compatible avec le type PrismaExtraction en incluant
    // tous les champs optionnels du schéma afin d'éviter des erreurs TypeScript.
    const prismaCompatibleExtraction: PrismaExtraction = {
      id: extraction.id,
      name: extraction.name,
      template: extraction.template as any,
      status: extraction.status as any,
      createdAt: extraction.createdAt as Date,
      updatedAt: extraction.updatedAt as Date,
      userId: extraction.userId,
      // Champs génériques / optionnels
      searchTerm: extraction.searchTerm ?? null,
      city: extraction.city ?? null,
      country: extraction.country ?? null,
      maxResults: extraction.maxResults ?? null,
      enrichEmails: extraction.enrichEmails ?? null,
      enrichPhones: extraction.enrichPhones ?? null,
      // Champs supplémentaires présents dans le schéma Prisma
      googleMapsUrl: (extraction as any).googleMapsUrl ?? null,
      amazonUrl: (extraction as any).amazonUrl ?? null,
      amazonMaxResults: (extraction as any).amazonMaxResults ?? null,
      durationMs: (extraction as any).durationMs ?? null,
      pagesVisited: (extraction as any).pagesVisited ?? null,
      successfulScrapes: (extraction as any).successfulScrapes ?? null,
      failedScrapes: (extraction as any).failedScrapes ?? null,
      proxyUsed: (extraction as any).proxyUsed ?? false,
      proxyHost: (extraction as any).proxyHost ?? null,
      resultsData: extraction.resultsData ?? null,
      creditsConsumed: (extraction as any).creditsConsumed ?? null,
      // Scheduling
      isScheduled: (extraction as any).isScheduled ?? false,
      cronExpression: (extraction as any).cronExpression ?? null,
      nextRunAt: (extraction as any).nextRunAt ?? null,
      lastRunAt: (extraction as any).lastRunAt ?? null,
      scheduleJobId: (extraction as any).scheduleJobId ?? null,
    };

    setEditingExtraction(prismaCompatibleExtraction);
    setIsEditModalOpen(true);
  };

  // Obtenir la couleur du statut
  const getStatusColor = (status: ClientExtraction["status"]) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-700";
      case "running": return "bg-blue-100 text-blue-700";
      case "completed": return "bg-green-100 text-green-700";
      case "error": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Obtenir le label du statut
  const getStatusLabel = (status: ClientExtraction["status"]) => {
    switch (status) {
      case "draft": return "Brouillon";
      case "running": return "En cours";
      case "completed": return "Terminé";
      case "error": return "Erreur";
      default: return "Inconnu";
    }
  };

  // Écran de chargement avec Lottie
  if (isLoadingExtractions) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex justify-center items-center">
        <div className="text-center">
          {animationData && (
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

  return (
    <div className="min-h-[calc(100vh-80px)] p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-clip-text mb-4">
          Gestion des Extractions
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Créez et gérez vos tâches d'extraction de données. Lancez de nouvelles extractions et suivez leur progression.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Section création */}
        <Card className="mb-8 border-2 border-dashed border-gray-300 hover:border-indigo-300 transition-colors bg-gradient-to-br from-indigo-50 to-purple-50/30">
          <CardContent className="p-8 text-center">

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Commencez une nouvelle extraction
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Configurez une nouvelle tâche d'extraction de données en choisissant parmi nos templates optimisés.
            </p>
            <Button
              onClick={() => {
                setEditingExtraction(null);
                setIsNewModalOpen(true);
              }}
              className="px-8 py-3 text-lg bg-gradient-to-r cursor-pointer from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              <PlusCircle className="h-5 w-5" />
              Nouvelle Extraction
            </Button>
          </CardContent>
        </Card>

        {/* Liste des extractions */}
        {extractions.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Mes Extractions ({extractions.length})
              </h3>
              <Badge variant="secondary" className="text-sm">
                {extractions.filter(e => e.status === "completed").length} terminées
              </Badge>
            </div>

            <div className="grid gap-4">
              {extractions.map((extraction) => (
                <Link key={extraction.id} href={`/fr/dashboard/new-extraction/${extraction.id}/setup`} passHref>
                  <Card className="hover:shadow-md transition-shadow border cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                            <NotebookIcon className="h-6 w-6 text-white" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-semibold text-gray-900 text-lg truncate">
                                {extraction.name}
                              </h4>
                              <Badge className={getStatusColor(extraction.status)}>
                                {getStatusLabel(extraction.status)}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Créé le {extraction.createdAt.toLocaleDateString('fr-FR')}</span>
                              </div>
                              <span>•</span>
                              <span className="capitalize">{extraction.template.replace('-', ' ')}</span>

                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {extraction.status === "running" && (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent"></div>
                              <span className="text-sm text-gray-600">Traitement...</span>
                            </div>
                          )}

                          {extraction.status === "completed" && (
                            <Button variant="outline" size="sm">
                              Voir les résultats
                            </Button>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 cursor-pointer w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleEditExtraction(extraction); }} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4 " /> Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.preventDefault(); e.stopPropagation(); openDeleteModal(extraction); }} className="!text-red-700 hover:!text-red-500 cursor-pointer">
                                <Trash2 className="mr-2 h-4 w-4 !text-red-700 hover:!text-red-500" /> Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <Card className="text-center border-0 shadow-none bg-transparent">
            <CardContent className="p-12">
              <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune extraction créée
              </h3>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                Créez votre première extraction de données pour commencer à collecter des informations.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modale de création */}
      <NewExtractionModal
        isOpen={isNewModalOpen}
        onOpenChange={setIsNewModalOpen}
        onExtractionCreated={handleExtractionCreated}
      />

      {/* Modale de modification de nom */}
      <EditExtractionNameModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        extraction={editingExtraction}
        onExtractionUpdated={handleExtractionUpdated}
      />

      {/* Nouvelle modale de confirmation de suppression */}
      <DeleteExtractionModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        extraction={deletingExtraction}
        onConfirmDelete={confirmDeleteExtraction}
      />
    </div>
  );
}