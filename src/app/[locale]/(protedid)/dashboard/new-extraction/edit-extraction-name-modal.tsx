"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Edit3, Loader2, Sparkles } from "lucide-react";
import { Extraction as PrismaExtraction } from "@prisma/client"; // Importation depuis @prisma/client

interface EditExtractionNameModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  extraction: PrismaExtraction | null; // Utilisation de PrismaExtraction
  onExtractionUpdated: (updatedExtraction: PrismaExtraction) => void; // Utilisation de PrismaExtraction
}

const EditExtractionNameModal: React.FC<EditExtractionNameModalProps> = ({
  isOpen,
  onOpenChange,
  extraction,
  onExtractionUpdated,
}) => {
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && extraction) {
      setNewName(extraction.name);
    } else {
      setNewName("");
    }
  }, [isOpen, extraction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Le nom de l'extraction ne peut pas être vide.");
      return;
    }
    if (!extraction) {
      toast.error("Aucune extraction sélectionnée pour la modification.");
      return;
    }

    // Vérifier si le nom n'a pas changé
    if (newName === extraction.name) {
      toast.info("Aucune modification détectée.");
      onOpenChange(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/extractions/${extraction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Échec de la mise à jour de l'extraction.");
      }

      const updatedExtraction: PrismaExtraction = await response.json();
      onExtractionUpdated(updatedExtraction);
      toast.success("Nom de l'extraction mis à jour avec succès !");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating extraction name:", error);
      toast.error(error.message || "Une erreur inattendue est survenue lors de la mise à jour.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-700";
      case "running": return "bg-blue-100 text-blue-700";
      case "completed": return "bg-green-100 text-green-700";
      case "error": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft": return "Brouillon";
      case "running": return "En cours";
      case "completed": return "Terminé";
      case "error": return "Erreur";
      default: return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} >
      <DialogContent className="sm:max-w-lg p-0 bg-white border-0 shadow-2xl overflow-hidden">
        {/* Header avec gradient */}
        <div className=" px-6 py-5">
          <DialogHeader className="text-center space-y-2">
            
            <DialogTitle className="text-2xl font-bold">
              Modifier l'extraction
            </DialogTitle>
            <DialogDescription className=" text-sm">
              Renommez votre tâche d'extraction de données
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
         

          {/* Champ de saisie */}
          <div className="space-y-3">
            <Label htmlFor="name" className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              Nouveau nom
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ex: Développeurs web à Paris - Google Maps"
              required
              className="h-12 text-base border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all rounded-xl bg-white shadow-sm"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">
              Donnez un nom clair et descriptif pour identifier facilement votre extraction
            </p>
          </div>

          {/* Indicateur de caractères */}
          <div className="flex justify-between items-center text-sm">
            <span className={`${newName.length > 0 ? 'text-green-600' : 'text-gray-400'} font-medium`}>
              {newName.length > 0 ? '✓ Nom valide' : 'En attente de saisie'}
            </span>
            <span className={`text-xs ${newName.length > 50 ? 'text-red-500' : 'text-gray-500'}`}>
              {newName.length}/100 caractères
            </span>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center gap-3 pt-4 border-t border-gray-200">
            <div className="flex-1">
              {newName !== extraction?.name && newName.trim() && (
                <p className="text-sm text-green-600 flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-green-600" />
                  </div>
                  <span>Modifications détectées</span>
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="px-6 h-10 rounded-lg border cursor-pointer border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all text-sm font-medium min-w-20"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || !newName.trim() || newName === extraction?.name}
                className="px-6 h-10 rounded-lg bg-gradient-to-r cursor-pointer from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all text-sm font-medium min-w-28 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditExtractionNameModal;