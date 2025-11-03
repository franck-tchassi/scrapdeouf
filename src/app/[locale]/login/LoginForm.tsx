"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import SubscribePage from "@/components/subscribe";
import dynamic from "next/dynamic";
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FieldValues, useForm } from 'react-hook-form'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

// Chargement dynamique de Lottie
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// Données pour les badges de plateformes
const platforms = [
  { name: "Google Maps", color: "from-red-500 to-red-600", rotation: "-rotate-3" },
  { name: "Amazon", color: "from-orange-500 to-yellow-500", rotation: "rotate-2" },
  { name: "+50 sources de plateformes", color: "from-purple-500 to-indigo-600", rotation: "-rotate-1" }
]

export default function LoginForm() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || undefined;
  const [isLoading, setIsLoading] = useState(true);
  const [animationData, setAnimationData] = useState(null);

  // États pour le formulaire de connexion
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: "onBlur"
  });

  useEffect(() => {
    // Charger l'animation depuis le dossier public
    const loadAnimation = async () => {
      try {
        const response = await fetch('/loading.json');
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'animation:', error);
      }
    };

    loadAnimation();

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const onLoginSubmit = async (data: FieldValues) => {
    setIsLoginLoading(true);
    try {
      const callback: any = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (!callback?.ok) {
        toast.error(callback?.error || "Identifiants incorrects");
        return;
      }

      // récupérer l'utilisateur courant (route /api/user/me)
      // petit retry car la session peut ne pas être instantanée
      let userRes: Response | null = null;
      for (let i = 0; i < 4; i++) {
        userRes = await fetch("/api/user/me");
        if (userRes.ok) break;
        await new Promise((r) => setTimeout(r, 300)); // 300ms
      }

      if (!userRes || !userRes.ok) {
        toast.success("Connexion réussie !");
        router.push("/dashboard");
        router.refresh();
        return;
      }

      const { user } = await userRes.json();
      toast.success("Connexion réussie !");

      if (!user.hasCompletedOnboarding) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <div className="overflow-hidden py-8 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {/* Colonne de gauche - Hero Section - Cachée en mobile */}
          <div className="lg:pt-4 lg:pr-8 hidden lg:block">
            <div className="lg:max-w-lg">
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center  shadow-indigo-500/25">
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
                <div className="w-24 h-1 bg-blue-500 mt-4 rounded-full"></div>
              </div>

              <p className="mt-6 text-lg/8 text-gray-600">
                Bienvenue sur <span className="font-semibold text-blue-600">Scrapdeouf.com</span>
                ! Téléchargez des leads B2B qualifiés extraits de{''}
                <span className="inline-flex items-center mx-2 space-x-2">
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
          </div>

          {/* Colonne de droite - Formulaire de connexion */}
          <div className="p-4 sm:p-8">
            <div className="w-full max-w-md mx-auto">
              {/* Logo et nom en ligne - Visible uniquement en mobile */}
              <Link href="/" className="lg:hidden flex items-center justify-center mb-8 space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center  shadow-indigo-500/25 backdrop-blur-sm">
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
                  className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <span className="text-lg">←</span>
                  <span>Revenir à l'accueil</span>
                </Link>
              </div>

              {/* En-tête */}
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 lg:text-4xl">
                  Connexion
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-3 sm:mt-4 rounded-full"></div>
              </div>

              {/* Formulaire de connexion - Plus de chargement en mobile */}
              <div className="relative mb-6 sm:mb-8">
                {/* En mode mobile: afficher directement le formulaire */}
                <div className="block sm:hidden">
                  <div className="w-full space-y-4">
                    {/* Bouton Google */}
                    <div className="grid gap-3">
                      <Button
                        variant="outline"
                        onClick={() => { signIn('google') }}
                        disabled={isLoginLoading}
                        className="h-12 w-full flex items-center justify-center gap-2 bg-white text-gray-900 hover:bg-gray-100 border-gray-300 text-sm"
                      >
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
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
                        Continuer avec Google
                      </Button>
                    </div>

                    {/* Séparateur */}
                    <div className="relative mb-3">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">Ou</span>
                      </div>
                    </div>

                    {/* Formulaire email/mot de passe */}
                    <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-3">
                      <div className="space-y-2">
                        <Input
                          className={`h-12 border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 text-sm ${errors.email ? 'border-red-500' : ''
                            }`}
                          placeholder="Email"
                          type="email"
                          id="email"
                          disabled={isLoginLoading}
                          {...register('email', {
                            required: 'L\'email est requis.',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                              message: 'Adresse email invalide.'
                            }
                          })}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">{errors.email.message as string}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="relative">
                          <Input
                            className={`h-12 border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 pr-10 text-sm ${errors.password ? 'border-red-500' : ''
                              }`}
                            placeholder="Mot de passe"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            disabled={isLoginLoading}
                            {...register('password', {
                              required: 'Le mot de passe est requis.'
                            })}
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

                      <div className="flex items-center justify-end">
                        <div className="text-sm">
                          <a
                            href="/forgot-password"
                            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                          >
                            Mot de passe oublié ?
                          </a>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoginLoading}
                        className="h-12 w-full bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                      >
                        {isLoginLoading ? (
                          <span className="flex items-center justify-center">
                            Connexion
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          </span>
                        ) : (
                          'Se connecter'
                        )}
                      </Button>

                      <p className="text-center text-sm text-gray-600">
                        Pas encore de compte ?{' '}
                        <a
                          href="/register"
                          className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                        >
                          S'inscrire
                        </a>
                      </p>
                    </form>
                  </div>
                </div>

                {/* En mode desktop: garder l'animation de chargement */}
                <div className="hidden sm:block min-h-[400px] flex items-center justify-center">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center">
                      {animationData && (
                        <Lottie
                          animationData={animationData}
                          loop={true}
                          autoplay={true}
                          style={{ width: 280, height: 280 }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="w-full space-y-6">
                      {/* Bouton Google */}
                      <div className="grid gap-4">
                        <Button
                          variant="outline"
                          onClick={() => { signIn('google') }}
                          disabled={isLoginLoading}
                          className="h-12 w-full flex items-center justify-center gap-2 bg-white text-gray-900 hover:bg-gray-100 border-gray-300 text-base"
                        >
                          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
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
                          Continuer avec Google
                        </Button>
                      </div>

                      {/* Séparateur */}
                      <div className="relative mb-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="bg-white px-2 text-gray-500">Ou</span>
                        </div>
                      </div>

                      {/* Formulaire email/mot de passe */}
                      <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-4">
                        <div className="space-y-2">
                          <Input
                            className={`h-12 border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 text-base ${errors.email ? 'border-red-500' : ''
                              }`}
                            placeholder="Email"
                            type="email"
                            id="email"
                            disabled={isLoginLoading}
                            {...register('email', {
                              required: 'L\'email est requis.',
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: 'Adresse email invalide.'
                              }
                            })}
                          />
                          {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message as string}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="relative">
                            <Input
                              className={`h-12 border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 pr-10 text-base ${errors.password ? 'border-red-500' : ''
                                }`}
                              placeholder="Mot de passe"
                              type={showPassword ? 'text' : 'password'}
                              id="password"
                              disabled={isLoginLoading}
                              {...register('password', {
                                required: 'Le mot de passe est requis.'
                              })}
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

                        <div className="flex items-center justify-end">
                          <div className="text-sm">
                            <a
                              href="/forgot-password"
                              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                            >
                              Mot de passe oublié ?
                            </a>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          disabled={isLoginLoading}
                          className="h-12 w-full bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-70 disabled:cursor-not-allowed text-base"
                        >
                          {isLoginLoading ? (
                            <span className="flex items-center justify-center">
                              Connexion
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            </span>
                          ) : (
                            'Se connecter'
                          )}
                        </Button>

                        <p className="text-center text-sm text-gray-600">
                          Pas encore de compte ?{' '}
                          <a
                            href="/register"
                            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                          >
                            S'inscrire
                          </a>
                        </p>
                      </form>
                    </div>
                  )}
                </div>
              </div>

              {/* Note de sécurité */}
              <div className="mt-4 sm:mt-6 text-center">
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