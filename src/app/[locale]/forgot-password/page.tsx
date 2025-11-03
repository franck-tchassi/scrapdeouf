"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form"; // Removed FieldValues
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.string().email("Adresse email invalide."),
});

type ForgotPasswordFormValues = z.infer<typeof formSchema>; // Infer type from schema

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ // Use inferred type here
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => { // Use inferred type here
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Un code OTP a été envoyé à votre adresse email.");
        router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
      } else {
        toast.error(result.message || "Erreur lors de l'envoi du code OTP.");
      }
    } catch (error) {
      console.error("Forgot password request error:", error);
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {/* Colonne de gauche - Hero Section */}
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Image 
                      src="/s-logo.png" 
                      alt="Scrapdeouf Logo" 
                      width={48} 
                      height={48}
                      className="object-contain"
                    />
                  </div>
                </div>
                <h1 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                  Scrapdeouf
                </h1>
                <div className="w-24 h-1 bg-blue-500 mt-4 rounded-full"></div>
              </div>

              <p className="mt-6 text-lg/8 text-gray-600">
                Bienvenue sur <span className="font-semibold text-blue-600">Scrapdeouf.com</span> ! Téléchargez des leads B2B qualifiés de la base Google Maps
              </p>
            </div>
          </div>

          {/* Colonne de droite - Formulaire de mot de passe oublié */}
          <div className="p-8">
            <div className="w-full max-w-md mx-auto">
              {/* Lien retour */}
              <div className="mb-6">
                <Link 
                  href="/login" 
                  className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <span className="text-lg">←</span>
                  <span>Retour à la connexion</span>
                </Link>
              </div>

              {/* En-tête */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                  Mot de passe oublié
                </h2>
                <p className="mt-2 text-gray-600">
                  Entrez votre adresse email pour recevoir un code de vérification.
                </p>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-4 rounded-full"></div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Input
                    className={`h-12 border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                    placeholder="Email"
                    type="email"
                    id="email"
                    disabled={isLoading}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message as string}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 w-full bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      Envoi du code
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    </span>
                  ) : (
                    'Envoyer le code de vérification'
                  )}
                </Button>
              </form>

              {/* Note de sécurité */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  🔒 Connexion sécurisée • Vos données sont protégées
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}