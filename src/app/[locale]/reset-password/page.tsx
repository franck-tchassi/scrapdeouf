// src/app/[locale]/reset-password/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label"; // Ajout de Label pour cohérence
import { motion } from 'framer-motion'; // Ajout de motion pour les animations

// Données pour les badges de plateformes (copiées des autres formulaires)
const platforms = [
  { name: "Google Maps", color: "from-red-500 to-red-600", rotation: "-rotate-3" },
  { name: "Amazon", color: "from-orange-500 to-yellow-500", rotation: "rotate-2" },
  { name: "+50 sources de plateformes", color: "from-blueviolet to-blueviolet/80", rotation: "-rotate-1" }
];

const formSchema = z.object({
  otp: z.string().length(6, "Le code OTP doit contenir 6 chiffres."),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule.")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule.")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.")
    .regex(/[^a-zA-Z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial."),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof formSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromParams = searchParams.get("email");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: '',
      password: '',
      confirmPassword: '',
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (!emailFromParams) {
      toast.error("Email manquant. Veuillez recommencer le processus de réinitialisation.");
      router.push("/forgot-password");
    }
  }, [emailFromParams, router]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!emailFromParams) {
      toast.error("Email manquant. Veuillez recommencer le processus de réinitialisation.");
      router.push("/forgot-password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailFromParams,
          otp: data.otp,
          newPassword: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Votre mot de passe a été réinitialisé avec succès.");
        router.push("/login");
      } else {
        if (result.error === "invalid_otp") {
          setError("otp", { type: "manual", message: result.message });
        } else if (result.error === "password_validation_failed") {
          setError("password", { type: "manual", message: result.message });
        }
        toast.error(result.message || "Erreur lors de la réinitialisation du mot de passe.");
      }
    } catch (error) {
      console.error("Reset password request error:", error);
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

        {/* Colonne de droite - Formulaire de réinitialisation de mot de passe */}
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
                Réinitialiser le mot de passe
              </h2>
              <p className="mt-2 text-gray-600">
                Entrez le code de vérification envoyé par mail et votre nouveau mot de passe.
              </p>
              <div className="w-16 h-1 bg-blueviolet mx-auto mt-3 sm:mt-4 rounded-full"></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 ">
              <div className="space-y-2 flex justify-center items-center flex-col">
                <Label htmlFor="otp" className="sr-only">Code OTP</Label>
                <Controller
                  name="otp"
                  control={control}
                  render={({ field }) => (
                    <InputOTP
                      maxLength={6}
                      {...field}
                      disabled={isLoading}
                      className="justify-center"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
                {errors.otp && (
                  <p className="mt-2 text-sm text-red-500 text-center">{errors.otp.message as string}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="sr-only">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Nouveau mot de passe"
                    disabled={isLoading}
                    {...register('password')}
                    className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blueviolet focus:border-blueviolet focus:z-10 sm:text-sm ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blueviolet focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <AiOutlineEye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-500">{errors.password.message as string}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="sr-only">Confirmer le nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Confirmer le nouveau mot de passe"
                    disabled={isLoading}
                    {...register('confirmPassword')}
                    className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blueviolet focus:border-blueviolet focus:z-10 sm:text-sm ${
                      errors.confirmPassword ? 'border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blueviolet focus:outline-none"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <AiOutlineEyeInvisible className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <AiOutlineEye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-500">{errors.confirmPassword.message as string}</p>
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
                      Réinitialisation en cours...
                    </span>
                  ) : (
                    'Réinitialiser le mot de passe'
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