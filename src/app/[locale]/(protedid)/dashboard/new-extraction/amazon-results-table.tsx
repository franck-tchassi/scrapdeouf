//(protedid)/dashboard/new-extraction/amazon-results-table.tsx
"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, Code, ShoppingCart, Star, MessageSquare, Tag, DollarSign, Package, Image as ImageIcon, ExternalLink, Timer, FileSearch, CheckCircle, XCircle, Cloud } from "lucide-react";
import * as XLSX from "xlsx";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AmazonProductRow } from "@/lib/amazon-scraper"; // Import du type AmazonProductRow
import { MonitoringData } from "./google-maps-results-table"; // Réutilisation du type MonitoringData
import Image from "next/image"; // Import du composant Image de Next.js

function formatCSVValue(val: any) {
  if (val === null || val === undefined) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

interface AmazonResultsTableProps {
  data: AmazonProductRow[];
  monitoring?: MonitoringData | null;
}

export default function AmazonResultsTable({ data, monitoring }: AmazonResultsTableProps) {
  const rows = useMemo(() => data, [data]);

  const headers = [
    "asin",
    "title",
    "price",
    "rating",
    "reviews",
    "brand",
    "category",
    "description",
    "monthlySales",
    "inStock",
    "imageUrl",
    "productUrl",
  ];

  const exportJSON = () => {
    const filename = `extraction-amazon-${new Date().toISOString().split('T')[0]}.json`;
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
    const filename = `extraction-amazon-${new Date().toISOString().split('T')[0]}.csv`;
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
    const filename = `extraction-amazon-${new Date().toISOString().split('T')[0]}.xlsx`;
    
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
          <p className="text-gray-600 mt-1">{rows.length} produits trouvés</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2 bg-orange-600 hover:bg-orange-700">
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
        <Card className="bg-white/80 backdrop-blur-sm border-orange-200/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileSearch className="h-5 w-5 text-orange-600" />
              Statistiques de l'extraction
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Durée:</span>
              <Badge variant="outline" className="bg-orange-50 text-orange-700">
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
            {monitoring.proxyUsed !== undefined && (
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Proxy utilisé:</span>
                <Badge variant="outline" className={monitoring.proxyUsed ? "bg-purple-50 text-purple-700" : "bg-gray-100 text-gray-700"}>
                  {monitoring.proxyUsed ? `Oui (${monitoring.proxyHost || 'N/A'})` : 'Non'}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tableau des résultats */}
      <Card className="bg-white/80 backdrop-blur-sm border-orange-200/50 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-auto border rounded-lg">
            <table className="min-w-[1800px] w-full table-auto">
              <thead className="bg-gradient-to-r from-gray-50 to-orange-50/30 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    ASIN
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Titre
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-green-600" />
                      Prix
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      Note
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3 text-blue-500" />
                      Avis
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Marque
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3 text-gray-500" />
                      Catégorie
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Description
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Ventes Mensuelles
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      <Package className="h-3 w-3 text-purple-500" />
                      En Stock
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      <ImageIcon className="h-3 w-3 text-red-500" />
                      Image
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <ExternalLink className="h-3 w-3 text-blue-500" />
                      Lien Produit
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={headers.length} className="px-4 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <ShoppingCart className="h-8 w-8 text-gray-400" />
                        <p className="text-base">Aucune donnée disponible pour cette extraction.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.asin} className="hover:bg-orange-50/20 transition-colors duration-150 group">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-100">
                        {r.asin}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 border-r border-gray-100 max-w-[250px] truncate">
                        {r.title}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-100">
                        {r.price}
                      </td>
                      <td className="px-4 py-3 text-sm border-r border-gray-100">
                        {r.rating !== "N/A" ? (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium text-gray-900">{r.rating}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-100">
                        {r.reviews !== "N/A" ? r.reviews : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-100">
                        {r.brand !== "N/A" ? r.brand : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="px-4 py-3 text-sm border-r border-gray-100">
                        {r.category !== "N/A" ? (
                          <Badge variant="outline" className="bg-gray-100 text-gray-700 text-xs">
                            {r.category}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-100 max-w-[300px] truncate">
                        {r.description !== "N/A" && r.description ? r.description : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-100">
                        {r.monthlySales !== "N/A" ? r.monthlySales : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="px-4 py-3 text-sm border-r border-gray-100">
                        {r.inStock !== "N/A" ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                            {r.inStock}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm border-r border-gray-100">
                        {r.imageUrl && r.imageUrl !== "N/A" ? (
                          <a href={r.imageUrl} target="_blank" rel="noreferrer" className="block w-12 h-12 relative overflow-hidden rounded-md border border-gray-200">
                            <Image 
                              src={r.imageUrl} 
                              alt={r.title !== "N/A" ? r.title : "Product Image"} 
                              fill 
                              style={{ objectFit: 'contain' }}
                              className="hover:scale-105 transition-transform duration-200"
                            />
                          </a>
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-md text-gray-400">
                            <ImageIcon className="h-6 w-6" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {r.productUrl !== "N/A" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 text-xs h-7"
                            asChild
                          >
                            <a href={r.productUrl} target="_blank" rel="noreferrer">
                              <ExternalLink className="h-3 w-3" />
                              Voir
                            </a>
                          </Button>
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