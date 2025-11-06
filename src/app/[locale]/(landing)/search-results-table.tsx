
"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink, Phone, Globe, MapPin, Download, Mail } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import dynamic from "next/dynamic";

// Chargement dynamique de Lottie
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// Définition du type pour un résultat de recherche (simplifié)
interface SearchResult {
    id: string;
    nom: string;
    adresse: string;
    ville: string;
    pays: string;
    siteWeb?: string;
    telephone?: string;
    lienMaps: string;
}

interface SearchResultsTableProps {
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string | null;
}

export function SearchResultsTable({
  results,
  isLoading,
  error,
  searchQuery,
}: SearchResultsTableProps) {
  const [animationData, setAnimationData] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // Charger l'animation depuis le dossier public
    const loadAnimation = async () => {
      try {
        const response = await fetch('/loading.json');
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'animation:', error);
      }
    };

    loadAnimation();

    // Simuler un chargement initial de page
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des résultats");
    }
  }, [error]);

  // Fonction pour obtenir le nom de domaine du site web
  const getDomainName = (url: string): string => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain;
    } catch {
      return url;
    }
  };

  // Fonction pour flouter les données sensibles
  const blurData = (text: string, visibleChars: number = 2): string => {
    if (!text) return '';
    if (text.length <= visibleChars) return '*'.repeat(text.length);
    return text.substring(0, visibleChars) + '*'.repeat(text.length - visibleChars);
  };

  // Afficher l'animation Lottie pendant le chargement initial
  if (isPageLoading) {
    return (
      <div className="w-full max-w-full mx-auto mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col items-center justify-center py-16">
          {animationData && Lottie && (
            <Lottie 
              animationData={animationData} 
              loop={true}
              autoplay={true}
              style={{ width: 120, height: 120 }}
            />
          )}
          <p className="text-gray-600 mt-4 text-lg">Chargement des résultats...</p>
        </div>
      </div>
    );
  }

  // Afficher l'animation pendant le chargement des données
  if (isLoading) {
    return (
      <div className="w-full max-w-full mx-auto mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">
          {searchQuery || "Recherche en cours..."}
        </h2>
        <div className="flex flex-col items-center justify-center py-12">
          {animationData && Lottie && (
            <Lottie 
              animationData={animationData} 
              loop={true}
              autoplay={true}
              style={{ width: 100, height: 100 }}
            />
          )}
          <p className="text-gray-600 mt-4">Recherche en cours...</p>
        </div>
      </div>
    );
  }

  return (
      <div className="w-full max-w-full mx-auto mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      {/* En-tête avec statistiques */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            {searchQuery || "Résultats de recherche"}
          </h2>
          
        </div>
        
        {results.length > 0 && (
          <Link href="/login" passHref>
            <Button className="bg-gradient-to-r cursor-pointer from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transition-all duration-200 hover:shadow-xl">
              <Download className="h-4 w-4" />
              Télécharger 100 contacts
            </Button>
          </Link>
        )}
      </div>

      {error && (
        <div className="text-center py-12 text-red-600 bg-red-50 rounded-lg border border-red-200">
          <p className="text-lg font-semibold">Une erreur est survenue</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      )}

      {!error && results.length === 0 && (
        <div className="text-center py-16 text-gray-600 bg-gray-50 rounded-lg border border-gray-200">
          <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-semibold">Aucun résultat trouvé</p>
          <p className="text-sm mt-2">Essayez de modifier vos critères de recherche</p>
        </div>
      )}

      {!error && results.length > 0 && (
        <div className="relative overflow-hidden rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Établissement</TableHead>
                  <TableHead className="font-semibold text-gray-700">Adresse</TableHead>
                  <TableHead className="font-semibold text-gray-700">Pays</TableHead>
                  <TableHead className="font-semibold text-gray-700">Website</TableHead>
                  <TableHead className="font-semibold text-gray-700">Téléphone</TableHead>
                  <TableHead className="font-semibold text-gray-700">Email</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow 
                    key={result.id} 
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    {/* Colonne Établissement */}
                    <TableCell className="max-w-[200px] text-left">
                      <div className="font-semibold text-gray-900 line-clamp-2">
                        {result.nom}
                      </div>
                    </TableCell>

                    {/* Colonne Adresse */}
                    <TableCell className="max-w-[200px]">
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {result.adresse}
                      </div>
                    </TableCell>

                    {/* Colonne Pays */}
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {result.pays}
                      </div>
                    </TableCell>

                    {/* Colonne Website */}
                    <TableCell>
                      {result.siteWeb ? (
                        <a
                          href={result.siteWeb}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                          title={result.siteWeb}
                        >
                          <Globe className="h-3 w-3" />
                          <span className="truncate max-w-[120px]">
                            {getDomainName(result.siteWeb)}
                          </span>
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">N/A</span>
                      )}
                    </TableCell>

                    {/* Colonne Téléphone */}
                    <TableCell>
                      {result.telephone ? (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{blurData(result.telephone, 9)}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Non disponible</span>
                      )}
                    </TableCell>

                    {/* Colonne Email (flouté visible) */}
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-400 blur-sm select-none">
                          contact@entreprise.com
                        </span>
                      </div>
                    </TableCell>

                    {/* Colonne Actions */}
                    <TableCell className="text-right">
                      <a
                        href={result.lienMaps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Voir sur Maps
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Overlay de flou pour les résultats limités */}
          {results.length > 3 && (
            <>
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none" />
              
              
            </>
          )}
        </div>
      )}
    </div>
  );
}