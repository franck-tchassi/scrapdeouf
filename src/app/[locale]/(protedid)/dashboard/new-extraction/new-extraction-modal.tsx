//(protedid)/dashboard/new-extraction-modal.tsx

"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Extraction as PrismaExtraction, ExtractionTemplate } from '@prisma/client'; // Import de ExtractionTemplate
import Image from "next/image";
import { CheckCircle2, MapPin, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewExtractionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onExtractionCreated: (extraction: PrismaExtraction) => void;
}

export default function NewExtractionModal({
  isOpen,
  onOpenChange,
  onExtractionCreated,
}: NewExtractionModalProps) {
  const [name, setName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<ExtractionTemplate | null>(null); // Utiliser ExtractionTemplate
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateExtraction = async () => {
    if (!name.trim()) {
      toast.error("Veuillez donner un nom à votre extraction.");
      return;
    }
    if (!selectedTemplate) {
      toast.error("Veuillez sélectionner un template.");
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch("/api/extractions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, template: selectedTemplate }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Échec de la création de l'extraction.");
      }

      const newExtraction: PrismaExtraction = await response.json();
      toast.success("Extraction créée avec succès !");
      onExtractionCreated(newExtraction);
      setName("");
      setSelectedTemplate(null);
    } catch (error: any) {
      console.error("Error creating extraction:", error);
      toast.error(error.message || "Une erreur inattendue est survenue.");
    } finally {
      setIsCreating(false);
    }
  };

  const templates = [
    { id: ExtractionTemplate.google_maps, name: "Google Maps", icon: MapPin, image: "/scraper/googlemaps.png", description: "Extraire des données d'établissements depuis Google Maps." },
    { id: ExtractionTemplate.amazon, name: "Amazon", icon: ShoppingCart, image: "/scraper/amazon1.png", description: "Extraire des informations sur les produits depuis Amazon." },
    // Ajoutez d'autres templates ici
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Nouvelle Extraction</DialogTitle>
          <DialogDescription className="text-gray-600">
            Donnez un nom à votre extraction et choisissez un template.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nom de l'extraction
            </Label>
            <Input
              id="name"
              placeholder="Ex: Restaurants Paris 15ème"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 border-gray-300 focus:border-indigo-500 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Choisissez un template
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
                    selectedTemplate === template.id
                      ? "border-indigo-600 bg-indigo-50/50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  )}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  {template.image ? (
                    <Image src={template.image} alt={template.name} width={40} height={40} className="mb-2 object-contain" />
                  ) : (
                    <template.icon className="h-8 w-8 text-gray-500 mb-2" />
                  )}
                  <span className="font-semibold text-gray-800 text-center">{template.name}</span>
                  {selectedTemplate === template.id && (
                    <CheckCircle2 className="h-5 w-5 text-indigo-600 absolute top-2 right-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
            className="px-4 py-2 rounded-md"
          >
            Annuler
          </Button>
          <Button
            onClick={handleCreateExtraction}
            disabled={isCreating || !name.trim() || !selectedTemplate}
            className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isCreating ? "Création..." : "Créer l'extraction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}