"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";
import React from "react";

const Settings = () => {
    const [name, setName] = React.useState("Utilisateur Dyad");
    const [email, setEmail] = React.useState("utilisateur@dyad.sh");

    const handleSaveSettings = () => {
        showSuccess("Paramètres enregistrés avec succès !");
        // Logique pour sauvegarder les paramètres
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Paramètres du Compte</CardTitle>
                    <CardDescription>
                        Gérez les informations de votre profil et vos préférences.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nom</Label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled
                        />
                    </div>
                    <Button onClick={handleSaveSettings} className="w-full">
                        Enregistrer les modifications
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Settings;