//(protedid)/dashboard/data-extraction/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess } from "@/utils/toast";
import React from "react";

const DataExtraction = () => {
    const [url, setUrl] = React.useState("");
    const [service, setService] = React.useState("");

    const handleExtract = () => {
        if (url && service) {
            showSuccess(`Extraction lancée pour l'URL: ${url} via le service: ${service}`);
            // Logique d'extraction ici
            setUrl("");
            setService("");
        } else {
            // Gérer l'erreur ou afficher un message
            showSuccess("Veuillez remplir tous les champs.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Extraction de Données</CardTitle>
                    <CardDescription>
                        Extrayez des données précieuses de Google Maps ou Amazon.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="url">URL à extraire</Label>
                        <Input
                            id="url"
                            type="url"
                            placeholder="https://www.google.com/maps/..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="service">Service</Label>
                        <Select value={service} onValueChange={setService}>
                            <SelectTrigger id="service">
                                <SelectValue placeholder="Sélectionner un service" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="google-maps">Google Maps</SelectItem>
                                <SelectItem value="amazon">Amazon</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleExtract} className="w-full">
                        Lancer l'extraction
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default DataExtraction;