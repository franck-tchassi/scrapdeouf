"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form"; // Added Controller
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { // Added InputOTP components
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

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

type ResetPasswordFormValues = z.infer<typeof formSchema>; // Infer type from schema

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromParams = searchParams.get("email");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control, // Added control from useForm
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({ // Use inferred type here
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

  const onSubmit = async (data: ResetPasswordFormValues) => { // Use inferred type here
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

          {/* Colonne de droite - Formulaire de réinitialisation de mot de passe */}
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
                  Réinitialiser le mot de passe
                </h2>
                <p className="mt-2 text-gray-600">
                  Entrez le code de vérification evoyé par mail et votre nouveau mot de passe.
                </p>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-4 rounded-full"></div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 ">
                <div className="space-y-2 flex justify-center items-center  flex-col">
                  <Controller
                    name="otp"
                    control={control}
                    render={({ field }) => (
                      <InputOTP
                        maxLength={6}
                        {...field}
                        disabled={isLoading}
                        className="justify-center" // Center the OTP input
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
                    <p className="text-sm text-red-500 text-center">{errors.otp.message as string}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      className={`h-12 border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 pr-10 ${
                        errors.password ? 'border-red-500' : ''
                      }`}
                      placeholder="Nouveau mot de passe"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      disabled={isLoading}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible size={20} />
                      ) : (
                        <AiOutlineEye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message as string}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      className={`h-12 border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 pr-10 ${
                        errors.confirmPassword ? 'border-red-500' : ''
                      }`}
                      placeholder="Confirmer le nouveau mot de passe"
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      disabled={isLoading}
                      {...register('confirmPassword')}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <AiOutlineEyeInvisible size={20} />
                      ) : (
                        <AiOutlineEye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message as string}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 w-full bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      Réinitialisation
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    </span>
                  ) : (
                    'Réinitialiser le mot de passe'
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