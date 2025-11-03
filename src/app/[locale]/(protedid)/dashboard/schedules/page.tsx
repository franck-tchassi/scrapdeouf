//(protedid)/dasboard/schedules/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Clock, Calendar as CalendarIcon, Repeat, Trash2, Loader2, PlusCircle, Settings, ExternalLink, Info, ListChecks } from "lucide-react";
import { ClientExtraction } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, setHours, setMinutes, isPast } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function SchedulesPage() {
  const [allExtractions, setAllExtractions] = useState<ClientExtraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isUnscheduling, setIsUnscheduling] = useState<string | null>(null);
  const [selectedExtractionForSchedule, setSelectedExtractionForSchedule] = useState<ClientExtraction | null>(null);
  
  // États pour la sélection de date et heure
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedHour, setSelectedHour] = useState<string>("");
  const [selectedMinute, setSelectedMinute] = useState<string>("");

  // Nouvel état pour la date/heure complète de planification
  const [scheduledDateTime, setScheduledDateTime] = useState<Date | null>(null);
  const [scheduleError, setScheduleError] = useState<string | null>(null); // Renommé cronError en scheduleError

  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

  useEffect(() => {
    fetchAllExtractions();
  }, []);

  // Met à jour la date/heure complète et valide à chaque changement
  useEffect(() => {
    if (selectedDate && selectedHour !== "" && selectedMinute !== "") {
      const newDateTime = setMinutes(setHours(selectedDate, parseInt(selectedHour, 10)), parseInt(selectedMinute, 10));
      setScheduledDateTime(newDateTime);

      if (!isPast(newDateTime)) {
        setScheduleError(null);
      } else {
        setScheduleError("La date et l'heure doivent être dans le futur.");
      }
    } else {
      setScheduledDateTime(null);
      setScheduleError("Veuillez sélectionner une date et une heure.");
    }
  }, [selectedDate, selectedHour, selectedMinute]);

  const fetchAllExtractions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/extractions");
      if (!response.ok) {
        throw new Error("Failed to fetch extractions");
      }
      const data: ClientExtraction[] = await response.json();
      setAllExtractions(data);
    } catch (error) {
      console.error("Error fetching all extractions:", error);
      toast.error("Échec du chargement des extractions.");
    } finally {
      setIsLoading(false);
    }
  };

  const scheduledExtractions = allExtractions.filter(ext => ext.isScheduled);
  const unscheduledExtractions = allExtractions.filter(ext => !ext.isScheduled);

  const handleOpenScheduleDialog = (extraction: ClientExtraction | null) => {
    setSelectedExtractionForSchedule(extraction);
    setScheduleError(null); // Réinitialiser l'erreur
    setScheduleDialogOpen(true);

    if (extraction?.nextRunAt) {
      const nextRunDate = new Date(extraction.nextRunAt);
      setSelectedDate(nextRunDate);
      setSelectedHour(format(nextRunDate, 'HH'));
      setSelectedMinute(format(nextRunDate, 'mm'));
    } else {
      setSelectedDate(undefined);
      setSelectedHour("");
      setSelectedMinute("");
    }
  };

  const handleSaveSchedule = async () => {
    if (!selectedExtractionForSchedule || !scheduledDateTime || scheduleError) {
      toast.error(scheduleError || "Veuillez sélectionner une extraction et définir une date/heure valide.");
      return;
    }

    // Log pour débogage
    console.log(`[FRONTEND SCHEDULE] Sending scheduledAt for extraction ${selectedExtractionForSchedule.id}: "${scheduledDateTime.toISOString()}"`);

    setIsScheduling(true);
    try {
      const response = await fetch(`/api/extractions/${selectedExtractionForSchedule.id}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduledAt: scheduledDateTime.toISOString() }), // Envoyer la date/heure ISO
      });

      if (!response.ok) {
        const errorData = await response.json();
        setScheduleError(errorData.error || "Échec de la planification de l'extraction.");
        throw new Error(errorData.error || "Échec de la planification de l'extraction.");
      }

      toast.success("Extraction planifiée avec succès !");
      setScheduleDialogOpen(false);
      fetchAllExtractions(); // Recharger la liste complète
    } catch (error: any) {
      console.error("Error saving schedule:", error);
      toast.error(error.message || "Une erreur est survenue lors de la planification.");
    } finally {
      setIsScheduling(false);
    }
  };

  const handleUnschedule = async (extractionId: string) => {
    setIsUnscheduling(extractionId);
    try {
      const response = await fetch(`/api/extractions/${extractionId}/schedule`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Échec de l'annulation de la planification.");
      }

      toast.success("Planification annulée avec succès !");
      fetchAllExtractions(); // Recharger la liste complète
    } catch (error: any) {
      console.error("Error unscheduling:", error);
      toast.error(error.message || "Une erreur est survenue lors de l'annulation.");
    } finally {
      setIsUnscheduling(null);
    }
  };

  const getNextRunDisplay = (nextRunAt: Date | null) => {
    if (!nextRunAt) return "N/A";
    return format(nextRunAt, "dd/MM/yyyy HH:mm", { locale: fr });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="ml-4 text-lg text-gray-700">Chargement des planifications...</p>
      </div>
    );
  }

  // Calculer la valeur pour le composant Select ici
  const selectExtractionValue = selectedExtractionForSchedule?.id || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Planification des Extractions</h1>
            <p className="text-gray-600 mt-1">Gérez vos extractions automatiques et récurrentes.</p>
          </div>
          <Button onClick={() => handleOpenScheduleDialog(null)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Planifier une nouvelle extraction
          </Button>
        </div>

        {scheduledExtractions.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50 shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="max-w-sm mx-auto">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucune extraction planifiée
                </h3>
                <p className="text-gray-600 mb-4">
                  Cliquez sur "Planifier une nouvelle extraction" pour commencer.
                </p>
                <Button onClick={() => window.location.href = "/fr/dashboard/new-extraction"}>
                  <ListChecks className="h-4 w-4 mr-2" />
                  Voir toutes les extractions
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scheduledExtractions.map((extraction) => (
              <Card key={extraction.id} className="bg-white/80 backdrop-blur-sm border-blue-200/50 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold">{extraction.name}</CardTitle>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Planifiée
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Repeat className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Fréquence:</span>
                    <Badge variant="outline" className="bg-gray-100 text-gray-700">
                      {extraction.cronExpression || "Une seule fois"} {/* Afficher 'Une seule fois' */}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Prochaine exécution:</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {getNextRunDisplay(extraction.nextRunAt)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Dernière exécution:</span>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">
                      {extraction.lastRunAt ? format(extraction.lastRunAt, "dd/MM/yyyy HH:mm", { locale: fr }) : "Jamais"}
                    </Badge>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenScheduleDialog(extraction)}
                      className="gap-1"
                    >
                      <Settings className="h-4 w-4" />
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleUnschedule(extraction.id)}
                      disabled={isUnscheduling === extraction.id}
                      className="gap-1"
                    >
                      {isUnscheduling === extraction.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog pour la planification */}
        <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedExtractionForSchedule ? "Modifier la planification" : "Planifier une nouvelle extraction"}</DialogTitle>
              <DialogDescription>
                {selectedExtractionForSchedule 
                  ? `Définissez une date et une heure pour l'exécution unique de l'extraction "${selectedExtractionForSchedule.name}".`
                  : "Sélectionnez une extraction et définissez une date et une heure pour la planifier."
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {!selectedExtractionForSchedule && (
                <div className="space-y-2">
                  <Label htmlFor="extractionSelect">Sélectionner une extraction</Label>
                  <Select
                    onValueChange={(value) => {
                      const ext = allExtractions.find(e => e.id === value);
                      setSelectedExtractionForSchedule(ext || null);
                    }}
                    value={selectExtractionValue}
                    disabled={isScheduling}
                  >
                    <SelectTrigger id="extractionSelect">
                      <SelectValue placeholder="Choisir une extraction non planifiée" />
                    </SelectTrigger>
                    <SelectContent>
                      {unscheduledExtractions.length === 0 ? (
                        <div className="p-2 text-center text-sm text-gray-500">
                          Aucune extraction disponible à planifier.
                        </div>
                      ) : (
                        unscheduledExtractions.map((ext) => (
                          <SelectItem key={ext.id} value={ext.id}>
                            {ext.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="date">Date d'exécution</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                      disabled={isScheduling || !selectedExtractionForSchedule}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Heure d'exécution</Label>
                <div className="flex gap-2">
                  <Input
                    id="hour"
                    type="number"
                    placeholder="HH"
                    min="0"
                    max="23"
                    value={selectedHour}
                    onChange={(e) => setSelectedHour(e.target.value)}
                    className="w-1/2"
                    disabled={isScheduling || !selectedExtractionForSchedule}
                  />
                  <span className="flex items-center text-lg font-semibold">:</span>
                  <Input
                    id="minute"
                    type="number"
                    placeholder="MM"
                    min="0"
                    max="59"
                    value={selectedMinute}
                    onChange={(e) => setSelectedMinute(e.target.value)}
                    className="w-1/2"
                    disabled={isScheduling || !selectedExtractionForSchedule}
                  />
                </div>
              </div>

              {scheduleError && <p className="text-red-500 text-sm flex items-center gap-1"><Info className="h-4 w-4" />{scheduleError}</p>}
              <p className="text-sm text-gray-500">
                L'extraction sera lancée une seule fois à la date et l'heure spécifiées.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setScheduleDialogOpen(false)} disabled={isScheduling}>
                Annuler
              </Button>
              <Button 
                onClick={handleSaveSchedule} 
                disabled={isScheduling || !!scheduleError || !selectedExtractionForSchedule}
              >
                {isScheduling ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Enregistrer la planification
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}