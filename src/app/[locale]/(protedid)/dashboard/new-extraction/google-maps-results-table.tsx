//(protedid)/dashboard/new-extraction/google-maps-results-table.tsx
"use client";


import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, Code, Mail, Phone, Globe, MapPin, ExternalLink, Star, Users, Camera, Euro, Tag, Timer, FileSearch, CheckCircle, XCircle, Cloud } from "lucide-react"; // Ajout de nouvelles icônes
import * as XLSX from "xlsx";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Ajout de CardHeader et CardTitle

// Type pour une ligne de résultat d'extraction Google Maps
export type GoogleMapsResultRow = {
  id: string; // Ajouté pour une clé unique si non présente dans les données brutes
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  rating: number | null; // Rendu non-optionnel, peut être null
  reviewCount: number | null; // Rendu non-optionnel, peut être null
  phoneFull: string | null; // Rendu non-optionnel, peut être null
  website: string | null; // Rendu non-optionnel, peut être null
  websiteDomain: string | null; // Rendu non-optionnel, peut être null
  priceLevel: number | null; // Rendu non-optionnel, peut être null
  emailsDetected: string[];
  phonesDetected: string[];
  contactPagesCount: number;
  socialNetworks: { type: string; url: string }[];
  googleMapsUrl: string;
  photosCount: number; // Changé de 'photos' à 'photosCount' et typé comme nombre
  category: string | null; // Ajout de la catégorie
};

// Nouveau type pour les données de monitoring
export type MonitoringData = {
  durationMs: number;
  pagesVisited: number;
  successfulScrapes: number;
  failedScrapes: number;
  proxyUsed: boolean;
  proxyHost?: string;
};

function formatCSVValue(val: any) {
  if (val === null || val === undefined) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

interface GoogleMapsResultsTableProps {
  data: GoogleMapsResultRow[];
  monitoring?: MonitoringData | null; // Modifié pour accepter null ou undefined
}

export default function GoogleMapsResultsTable({ data, monitoring }: GoogleMapsResultsTableProps) {
  const rows = useMemo(() => data, [data]);

  const headers = [
    "name",
    "address", 
    "city",
    "postalCode",
    "country",
    "rating",
    "reviewCount",
    "priceLevel",
    "category", // Ajout de la catégorie aux en-têtes
    "phoneFull",
    "website",
    "websiteDomain",
    "emailsDetected",
    "phonesDetected",
    "contactPagesCount",
    "socialNetworks",
    "googleMapsUrl",
    "photosCount"
  ];

  const exportJSON = () => {
    const filename = `extraction-google-maps-${new Date().toISOString().split('T')[0]}.json`;
    const blob = new Blob([JSON.stringify(rows, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const filename = `extraction-google-maps-${new Date().toISOString().split('T')[0]}.csv`;
    const headerLine = headers.join(",") + "\n";
    const lines = rows.map((r) =>
      headers.map((h) => {
        const value = (r as any)[h];
        if (Array.isArray(value)) {
          return formatCSVValue(value.map((item: any) => typeof item === 'object' ? JSON.stringify(item) : item).join('; '));
        }
        if (typeof value === 'object' && value !== null) {
          return formatCSVValue(JSON.stringify(value));
        }
        return formatCSVValue(value);
      }).join(",")
    );
    const csv = headerLine + lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportXLSX = () => {
    const filename = `extraction-google-maps-${new Date().toISOString().split('T')[0]}.xlsx`;
    
    const worksheetData = rows.map((r) => {
      const out: any = {};
      headers.forEach((h) => {
        const value = (r as any)[h];
        if (Array.isArray(value)) {
          out[h] = value.map((item: any) => typeof item === 'object' ? JSON.stringify(item) : item).join('; ');
        } else if (typeof value === 'object' && value !== null) {
          out[h] = JSON.stringify(value);
        } else {
          out[h] = value ?? "";
        }
      });
      return out;
    });

    const ws = XLSX.utils.json_to_sheet(worksheetData, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ExtractedData");
    XLSX.writeFile(wb, filename);
  };

  // Fonction toast simplifiée pour les notifications
  const toast = {
    info: (message: string) => {
      console.info(message);
      // Dans une vraie application, vous utiliseriez votre système de toast (sonner, react-hot-toast, etc.)
      if (typeof window !== 'undefined') {
        alert(message);
      }
    }
  };

  const formatPriceLevel = (level: number | null | undefined) => {
    if (level === null || level === undefined) return "-";
    switch (level) {
      case 0: return "Gratuit";
      case 1: return "€";
      case 2: return "€€";
      case 3: return "€€€";
      case 4: return "€€€€";
      default: return "-";
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="w-full space-y-6">
      {/* En-tête avec export */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Résultats de l'extraction</h2>
          <p className="text-gray-600 mt-1">{rows.length} établissements trouvés</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4" />
              Exporter les données
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={exportJSON} className="gap-2 cursor-pointer">
              <Code className="h-4 w-4" />
              Format JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportCSV} className="gap-2 cursor-pointer">
              <FileText className="h-4 w-4" />
              Format CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportXLSX} className="gap-2 cursor-pointer">
              <FileSpreadsheet className="h-4 w-4" />
              Excel (.xlsx)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Section de Monitoring */}
      {monitoring && (
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileSearch className="h-5 w-5 text-blue-600" />
              Statistiques de l'extraction
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Durée:</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {formatDuration(monitoring.durationMs)}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <FileSearch className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Pages visitées:</span>
              <Badge variant="outline" className="bg-gray-100 text-gray-700">
                {monitoring.pagesVisited}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium">Scrapes réussis:</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {monitoring.successfulScrapes}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="font-medium">Scrapes échoués:</span>
              <Badge variant="outline" className="bg-red-50 text-red-700">
                {monitoring.failedScrapes}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Cloud className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Proxy utilisé:</span>
              <Badge variant="outline" className={monitoring.proxyUsed ? "bg-purple-50 text-purple-700" : "bg-gray-100 text-gray-700"}>
                {monitoring.proxyUsed ? `Oui (${monitoring.proxyHost || 'N/A'})` : 'Non'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tableau des résultats */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-auto border rounded-lg">
            {/* Augmentation de la largeur minimale */}
            <table className="min-w-[1600px] w-full table-auto">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50/30 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Nom
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Adresse
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Ville
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Code Postal
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Pays
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      Note
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-blue-500" />
                      Avis
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      <Euro className="h-3 w-3 text-green-600" />
                      Prix
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3 text-gray-500" /> {/* Icône pour la catégorie */}
                      Catégorie
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-green-500" />
                      Téléphone
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3 text-blue-500" />
                      Site Web
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Domaine
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-purple-500" />
                      Emails
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Pages Contact
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Réseaux Sociaux
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Lien Maps
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <Camera className="h-3 w-3 text-orange-500" />
                      Photos
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={17} className="px-4 py-8 text-center text-gray-500"> {/* Colspan ajusté */}
                      <div className="flex flex-col items-center gap-2">
                        <MapPin className="h-8 w-8 text-gray-400" />
                        <p className="text-base">Aucune donnée disponible pour cette extraction.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="hover:bg-blue-50/20 transition-colors duration-150 group">
                      {/* Nom */}
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 border-r border-gray-100">
                        {r.name}
                      </td>
                      
                      {/* Adresse */}
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-100">
                        {r.address}
                      </td>
                      
                      {/* Ville */}
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-100">
                        {r.city}
                      </td>
                      
                      {/* Code Postal */}
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-100">
                        {r.postalCode}
                      </td>
                      
                      {/* Pays */}
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-100">
                        {r.country}
                      </td>
                      
                      {/* Note */}
                      <td className="px-4 py-3 text-sm border-r border-gray-100">
                        {typeof r.rating === 'number' ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(r.rating as number) 
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-medium text-gray-900">{r.rating}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      
                      {/* Avis */}
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-100">
                        {typeof r.reviewCount === 'number' ? (
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-gray-400" />
                            <span>{r.reviewCount.toLocaleString()}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>

                      {/* Niveau de Prix */}
                      <td className="px-4 py-3 text-sm border-r border-gray-100">
                        <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                          {formatPriceLevel(r.priceLevel)}
                        </Badge>
                      </td>

                      {/* Catégorie */}
                      <td className="px-4 py-3 text-sm border-r border-gray-100">
                        {r.category ? (
                          <Badge variant="outline" className="bg-gray-100 text-gray-700 text-xs">
                            {r.category}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      
                      {/* Téléphone */}
                      <td className="px-4 py-3 text-sm border-r border-gray-100">
                        {r.phoneFull ? (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-green-500" />
                            <span className="text-gray-700">{r.phoneFull}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      
                      {/* Site Web */}
                      <td className="px-4 py-3 text-sm border-r border-gray-100">
                        {r.website ? (
                          <a
                            href={r.website}
                            className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 transition-colors"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Globe className="h-3 w-3" />
                            <span className="truncate max-w-[120px]">{r.websiteDomain || 'Visiter'}</span>
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      
                      {/* Domaine */}
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-100">
                        {r.websiteDomain ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                            {r.websiteDomain}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      
                      {/* Emails */}
                      <td className="px-4 py-3 text-sm border-r border-gray-100">
                        {r.emailsDetected && r.emailsDetected.length > 0 ? (
                          <div className="flex flex-col space-y-1">
                            {r.emailsDetected.map((email, index) => (
                              <span key={index} className="text-gray-700 truncate max-w-[150px]">
                                {email}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      
                      {/* Pages Contact */}
                      <td className="px-4 py-3 text-sm border-r border-gray-100">
                        {r.contactPagesCount > 0 ? (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 text-xs">
                            {r.contactPagesCount}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      
                      {/* Réseaux Sociaux */}
                      <td className="px-4 py-3 text-sm border-r border-gray-100">
                        {r.socialNetworks && r.socialNetworks.length > 0 ? (
                          <div className="space-y-1">
                            <div className="text-xs text-gray-700">
                              {Array.from(new Set(r.socialNetworks.map(s => s.type))) // Filtrer les doublons ici
                                .slice(0, 3)
                                .join(', ')}
                              {Array.from(new Set(r.socialNetworks.map(s => s.type))).length > 3 && 
                                `... (+${Array.from(new Set(r.socialNetworks.map(s => s.type))).length - 3})`}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      
                      {/* Lien Maps */}
                      <td className="px-4 py-3 text-sm border-r border-gray-100">
                        {r.googleMapsUrl ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 text-xs h-7"
                            asChild
                          >
                            <a href={r.googleMapsUrl} target="_blank" rel="noreferrer">
                              <ExternalLink className="h-3 w-3" />
                              Maps
                            </a>
                          </Button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      
                      {/* Photos */}
                      <td className="px-4 py-3 text-sm">
                        {r.photosCount > 0 ? (
                          <Badge variant="outline" className="bg-red-50 text-red-700 text-xs gap-1">
                            <Camera className="h-3 w-3" />
                            {r.photosCount}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}