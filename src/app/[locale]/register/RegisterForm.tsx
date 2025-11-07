// src/app/[locale]/register/RegisterForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FieldValues, useForm } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Label } from "@/components/ui/label"; // Ajout de Label pour cohérence

// Données pour les badges de plateformes
const platforms = [
  { name: "Google Maps", color: "from-red-500 to-red-600", rotation: "-rotate-3" },
  { name: "Amazon", color: "from-orange-500 to-yellow-500", rotation: "rotate-2" },
  { name: "+50 sources de plateformes", color: "from-blueviolet to-blueviolet/80", rotation: "-rotate-1" }
]

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || undefined;
  
  // États pour le formulaire d'inscription
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    },
    mode: "onBlur"
  });

  useEffect(() => {
    if (status === "error") {
      toast.error("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
    }
  }, [status]);

  const onRegisterSubmit = (data: FieldValues) => {
    setIsRegisterLoading(true);
    axios.post('/api/register', data).then(response => {
      console.log('User registered:', response.data);
      toast.success('Compte créé avec succès!');
      // Redirect to login page
      router.push('/login');
      router.refresh();
    }).catch(error => {
      console.error('Registration error:', error.response?.data || error.message);
      toast.error("Erreur lors de la création du compte");
    }).finally(() => {
      setIsRegisterLoading(false);
    });
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

        {/* Colonne de droite - Formulaire d'inscription */}
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
                href="/"
                className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-blueviolet transition-colors duration-200"
              >
                <span className="text-lg">←</span>
                <span>Revenir à l'accueil</span>
              </Link>
            </div>

            {/* En-tête */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 lg:text-4xl">
                Créer un compte
              </h2>
              <div className="w-16 h-1 bg-blueviolet mx-auto mt-3 sm:mt-4 rounded-full"></div>
            </div>

            {/* Bouton Google */}
            <div className="grid gap-3 mb-6">
              <Button
                variant="outline"
                onClick={() => { signIn('google') }}
                disabled={isRegisterLoading}
                className="w-full cursor-pointer flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blueviolet transition-colors duration-200"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                S'inscrire avec Google
              </Button>
            </div>

            {/* Séparateur */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Ou</span>
              </div>
            </div>

            {/* Formulaire d'inscription */}
            <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="name" className="sr-only">Nom complet</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nom complet"
                  disabled={isRegisterLoading}
                  {...register('name', { 
                    required: 'Le nom est requis.' 
                  })}
                  className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blueviolet focus:border-blueviolet focus:z-10 sm:text-sm ${
                    errors.name ? 'border-red-500' : ''
                  }`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-500">{errors.name.message as string}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="sr-only">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Adresse email"
                  disabled={isRegisterLoading}
                  {...register('email', {
                    required: 'L\'email est requis.',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: 'Adresse email invalide.'
                    }
                  })}
                  className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blueviolet focus:border-blueviolet focus:z-10 sm:text-sm ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500">{errors.email.message as string}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="sr-only">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Mot de passe"
                  disabled={isRegisterLoading}
                  {...register('password', {
                    required: 'Le mot de passe est requis.',
                    minLength: {
                      value: 8,
                      message: 'Le mot de passe doit contenir au moins 8 caractères.'
                    }
                  })}
                  className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blueviolet focus:border-blueviolet focus:z-10 sm:text-sm ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-500">{errors.password.message as string}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">Doit contenir au moins 8 caractères.</p>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isRegisterLoading}
                  className="group cursor-pointer relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blueviolet hover:bg-blueviolet/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blueviolet transition-colors duration-200"
                >
                  {isRegisterLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création du compte...
                    </span>
                  ) : (
                    'Créer un compte'
                  )}
                </Button>
              </div>
            </form>

            {/* Lien pour créer un compte */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Vous avez déjà un compte ?{' '}
                <Link href="/login" className="font-medium text-blueviolet hover:text-blueviolet/80">
                  Se connecter
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}