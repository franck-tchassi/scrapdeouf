"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { Extraction as PrismaExtraction } from "@prisma/client"; // Importation depuis @prisma/client

interface DeleteExtractionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  extraction: PrismaExtraction | null; // Utilisation de PrismaExtraction
  onConfirmDelete: (id: string) => void;
}

const DeleteExtractionModal: React.FC<DeleteExtractionModalProps> = ({
  isOpen,
  onOpenChange,
  extraction,
  onConfirmDelete,
}) => {
  const handleDelete = () => {
    if (extraction) {
      onConfirmDelete(extraction.id);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3 text-lg">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            Confirmer la suppression
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Êtes-vous sûr de vouloir supprimer l'extraction{" "}
            <span className="font-semibold text-gray-900">{extraction?.name}</span>" ?
          </AlertDialogDescription>
          {/* La div d'avertissement est maintenant un frère de AlertDialogDescription */}
          <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200 mt-3">
            <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <span className="text-sm text-red-700 font-medium">
              Cette action est irréversible et supprimera définitivement l'extraction.
            </span>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-3">
          <AlertDialogCancel asChild>
            <Button variant="outline" className="flex-1 cursor-pointer">
              Annuler
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handleDelete} className="flex-1 cursor-pointer">
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteExtractionModal;