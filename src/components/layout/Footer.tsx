'use client';

import { useState } from 'react';
import { Mail as EnvelopeIcon, Send as PaperAirplaneIcon } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import {
  useChangeLocale,
  useCurrentLocale,
  useI18n,
} from "../../locales/client";

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Hooks pour l'internationalisation
  const changeLocale = useChangeLocale();
  const currentLocale = useCurrentLocale();
  const t = useI18n();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setEmail('');
        setIsSubscribed(true);
      } else {
        setError(data.error || "Une erreur s'est produite");
      }
    } catch (error) {
      setError("Erreur de connexion. Veuillez réessayer.");
      console.error('Erreur newsletter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Options de langue avec labels traduits
  const languageOptions = [
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'English' },
    { value: 'it', label: 'Italiano' },
    { value: 'es', label: 'Español' },
    { value: 'pt', label: 'Português' },
    { value: 'de', label: 'Deutsch' }
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locale = e.target.value as 'fr' | 'en' | 'it' | 'es' | 'pt' | 'de';
    changeLocale(locale);
  };

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Éléments d'arrière-plan décoratifs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Newsletter Section - Design Premium */}
      <div className="border-b border-gray-800 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                Restez informé des dernières actualités
              </h3>
              <p className="text-gray-300 text-lg mb-6">
                Recevez nos conseils experts et les dernières tendances du marketing digital directement dans votre boîte mail.
              </p>

              <div className="flex items-start space-x-3 p-4 bg-gray-800/50 rounded-lg border-l-4 border-indigo-500">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  <span className="font-semibold text-indigo-300">+100 professionnels</span> suivent déjà nos conseils exclusifs
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-30"></div>
              <div className="relative bg-gray-800/80 backdrop-blur-sm p-8 rounded-lg border border-gray-700/50">
                <AnimatePresence mode="wait">
                  {isSubscribed ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-4"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-semibold mb-2">Félicitations !</h4>
                      <p className="text-green-300 mb-4">Votre inscription est confirmée.</p>
                      <p className="text-gray-400 text-sm">
                        Vous recevrez prochainement nos conseils experts et actualités.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <div>
                        <label htmlFor="newsletter-email" className="block text-sm font-medium text-gray-300 mb-2">
                          Votre email professionnel
                        </label>
                        <div className="relative">
                          <input
                            id="newsletter-email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setError('');
                            }}
                            placeholder="email@votre-entreprise.com"
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 transition-colors"
                            required
                          />
                          <EnvelopeIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                      </div>

                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm bg-red-900/20 p-2 rounded-lg border border-red-800/50"
                        >
                          {error}
                        </motion.p>
                      )}

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-6 bg-gradient-to-r cursor-pointer from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-70 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center group shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Inscription en cours...
                          </>
                        ) : (
                          <>
                            <PaperAirplaneIcon className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                            Rejoindre la newsletter
                          </>
                        )}
                      </button>

                      <p className="text-xs text-gray-500 text-center">
                        En vous abonnant, vous acceptez de recevoir nos communications marketing.
                        <br />
                        Vous pouvez vous désabonner à tout moment.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">

          {/* Section 1 : Essentiels */}
          <div className="text-center lg:text-left">
            <h3 className="text-lg font-semibold mb-6 text-white">Essentiels</h3>
            <ul className="space-y-4">
              <li><a href="/pricing" className="text-gray-400 hover:text-white transition-colors duration-200">Tarifs</a></li>
              <li><a href="/temoignages" className="text-gray-400 hover:text-white transition-colors duration-200">Témoignages client</a></li>
              <li><a href="/apropos" className="text-gray-400 hover:text-white transition-colors duration-200">A propos</a></li>
              <li><a href="/assistance" className="text-gray-400 hover:text-white transition-colors duration-200">Assistance</a></li>
            </ul>
          </div>

          {/* Section 2 : Ressources */}
          <div className="text-center lg:text-left">
            <h3 className="text-lg font-semibold mb-6 text-white">Ressources</h3>
            <ul className="space-y-4">
              <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors duration-200">Fichier email restaurants</a></li>
              <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors duration-200">Fichier email hôtels</a></li>
              <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors duration-200">Fichier email agences immobilières</a></li>
              <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors duration-200">Fichier email coiffeurs</a></li>
              <li><a href="/centre-aide" className="text-gray-400 hover:text-white transition-colors duration-200">Fichier email salons de beauté</a></li>
              <li><a href="/centre-aide" className="text-gray-400 hover:text-white transition-colors duration-200">Centre d'aide</a></li>
            </ul>
          </div>

          {/* Section 3 : Company */}
          <div className="text-center lg:text-left lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center lg:items-start mb-8"
            >
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 mr-3">
                  <Image
                    src="/s-logo.png"
                    alt="Scrapdeouf"
                    width={28}
                    height={28}
                    className="h-7 w-7 drop-shadow-lg filter brightness-0 invert"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">Scrapdeouf</span>

                </div>
              </div>

              <p className="text-gray-400 text-base mb-6 max-w-md text-center lg:text-left">
                Votre partenaire pour des solutions digitales innovantes et performantes.
              </p>

              <div className="mb-6">
                <p className="text-gray-300 mb-4 text-lg font-medium">contact@scrapdeouf.com</p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex justify-center lg:justify-start space-x-3"
                >
                  <a href="#" className="text-gray-400 hover:text-white transition-all duration-200 p-3 bg-gray-800/50 rounded-lg hover:bg-indigo-600/20 hover:scale-110">
                    <span className="sr-only">YouTube</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-all duration-200 p-3 bg-gray-800/50 rounded-lg hover:bg-blue-600/20 hover:scale-110">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-all duration-200 p-3 bg-gray-800/50 rounded-lg hover:bg-pink-600/20 hover:scale-110">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.40s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.40-1.439-1.40z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-all duration-200 p-3 bg-gray-800/50 rounded-lg hover:bg-black/20 hover:scale-110">
                    <span className="sr-only">TikTok</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.50 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  </a>
                </motion.div>
              </div>
            </motion.div>

            {/* Section Paiement */}
            <div className="flex flex-col items-center lg:items-start space-y-4">
              <span className="text-gray-400 text-sm font-medium">Paiements sécurisés</span>
              <div className="flex items-left justify-cente  w-full  max-w-xs">
                <Image
                  src="/card-stripe.png"
                  alt="Paiements sécurisés Stripe"
                  width={180}
                  height={54}
                  className="h-24 w-auto  object-contain"
                  priority
                  loading="eager"
                />
              </div>
              <p className="text-gray-500 text-xs text-center lg:text-left">
                Transactions 100% sécurisées avec Stripe
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <p className="text-gray-400 text-sm text-center lg:text-left">
              © 2025 Scrapdeouf. Tous droits réservés.
            </p>

            <div className="flex space-x-8 text-sm text-gray-400">
              <a href="/cgu" className="hover:text-white transition-colors duration-200">CGU</a>
              <a href="/confidentialite" className="hover:text-white transition-colors duration-200">Confidentialité</a>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}