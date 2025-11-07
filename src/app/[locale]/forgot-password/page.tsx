// src/app/[locale]/forgot-password/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from "@/components/ui/label"; // Ajout de Label pour cohérence
import { motion } from 'framer-motion'; // Ajout de motion pour les animations

// Données pour les badges de plateformes (copiées des autres formulaires)
const platforms = [
  { name: "Google Maps", color: "from-red-500 to-red-600", rotation: "-rotate-3" },
  { name: "Amazon", color: "from-orange-500 to-yellow-500", rotation: "rotate-2" },
  { name: "+50 sources de plateformes", color: "from-blueviolet to-blueviolet/80", rotation: "-rotate-1" }
];

const formSchema = z.object({
  email: z.string().email("Adresse email invalide."),
});

type ForgotPasswordFormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        {/* Colonne de gauche - Hero Section - Cachée en mobile */}
        <div className="hidden lg:flex lg:flex-col lg:justify-center lg:items-start lg:p-8">
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 bg-blueviolet rounded-2xl flex items-center justify-center shadow-lg shadow-blueviolet/25">
                <Image
                  src="/s-logo.png"
                  alt="Scrapdeouf"
                  width={48}
                  height={48}
                  className="drop-shadow-lg filter brightness-0 invert object-contain"
                  priority
                />
              </div>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
              Scrapdeouf
            </h1>
            <div className="w-24 h-1 bg-blueviolet mt-4 rounded-full"></div>
          </div>

          <p className="mt-6 text-lg/8 text-gray-600">
            Bienvenue sur <span className="font-semibold text-blueviolet">Scrapdeouf.com</span>
            ! Téléchargez des leads B2B qualifiés extraits de{''}
            <span className="inline-flex flex-wrap items-center mx-2 space-x-2 space-y-2">
              {platforms.map((platform, index) => (
                <motion.span
                  key={platform.name}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                  className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${platform.color} ${platform.rotation} transform shadow-lg hover:scale-105 transition-all duration-300 cursor-default`}
                >
                  <span className="text-xs font-bold text-white whitespace-nowrap">
                    {platform.name}
                  </span>
                </motion.span>
              ))}
            </span>
          </p>
        </div>

        {/* Colonne de droite - Formulaire de mot de passe oublié */}
        <div className="flex flex-col justify-center p-4 sm:p-8">
          <div className="w-full max-w-md mx-auto">
            {/* Logo et nom en ligne - Visible uniquement en mobile */}
            <Link href="/" className="lg:hidden flex items-center justify-center mb-8 space-x-3">
              <div className="w-12 h-12 bg-blueviolet rounded-xl flex items-center justify-center shadow-lg shadow-blueviolet/25 relative z-10">
                <Image
                  src="/s-logo.png"
                  alt="Scrapdeouf"
                  width={32}
                  height={32}
                  className="drop-shadow-lg filter brightness-0 invert object-contain"
                  priority
                />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Scrapdeouf
              </h1>
            </Link>

            {/* Lien retour - Caché en mobile */}
            <div className="mb-6 hidden lg:block">
              <Link
                href="/login"
                className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-blueviolet transition-colors duration-200"
              >
                <span className="text-lg">←</span>
                <span>Retour à la connexion</span>
              </Link>
            </div>

            {/* En-tête */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 lg:text-4xl">
                Mot de passe oublié
              </h2>
              <p className="mt-2 text-gray-600">
                Entrez votre adresse email pour recevoir un code de vérification.
              </p>
              <div className="w-16 h-1 bg-blueviolet mx-auto mt-3 sm:mt-4 rounded-full"></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="email" className="sr-only">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Adresse email"
                  disabled={isLoading}
                  {...register('email')}
                  className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blueviolet focus:border-blueviolet focus:z-10 sm:text-sm ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500">{errors.email.message as string}</p>
                )}
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="group cursor-pointer relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blueviolet hover:bg-blueviolet/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blueviolet transition-colors duration-200"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi du code...
                    </span>
                  ) : (
                    'Envoyer le code de vérification'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}