// src/components/layout/Header.tsx

"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogPanel,
} from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import LocaleSelectLanguage from '@/app/[locale]/LocaleSelectLanguage';
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from 'next/image';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Removed scrolled state and useEffect as per example

  // Liens de navigation pour le desktop et le mobile
  const navigationLinks = [
    { name: 'Tarifs', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <header className="absolute inset-x-0 top-0 z-50 bg-gray-900">
      {/* Removed "Effet de brillance subtile" and "Effet de bordure animée" divs */}

      <nav aria-label="Global" className="relative z-10 flex items-center justify-between p-3 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link
            href="/"
            className="flex items-center group transition-all duration-300 hover:scale-105"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-indigo-600 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 relative z-10">
                <Image
                  src="/s-logo.png"
                  alt="Scrapdeouf"
                  width={28}
                  height={28}
                  className="h-7 w-7 drop-shadow-lg filter brightness-0 invert"
                  priority
                />
              </div>
              <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 rounded-xl blur-sm group-hover:blur-md transition-all duration-500" />
            </div>
            <div className="ml-3 flex flex-col">
              <span className="text-white text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Scrapdeouf
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Desktop (liens centrés, incluant langue et connexion) */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:items-center lg:gap-x-12">
          {navigationLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-gray-300 hover:text-blueviolet transition-colors duration-300 px-2 py-2.5"
            >
              {item.name}
            </Link>
          ))}
          {/* LocaleSelectLanguage et Connexion déplacés ici */}
          <div className="text-sm font-medium text-gray-300 hover:text-blueviolet transition-colors duration-300 px-2 py-2.5">
            <LocaleSelectLanguage />
          </div>
          <Link
            href="/login"
            className="text-sm font-semibold text-gray-300 hover:text-blueviolet transition-colors duration-300 px-4 py-2.5 flex items-center gap-1"
          >
            Connexion
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* Actions de droite (Desktop) - uniquement le bouton Démo gratuite */}
        <div className="flex items-center gap-3 lg:flex-1 lg:justify-end">
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <Link
              href="/demo"
              className="rounded-xl bg-blueviolet px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blueviolet/25 hover:shadow-blueviolet/40 hover:bg-blueviolet/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blueviolet transition-all duration-300 transform hover:scale-105 flex items-center gap-2 group"
            >
              <span>Démo gratuite</span>
              <ChevronRightIcon className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Bouton menu mobile */}
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400 lg:hidden hover:text-white hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10 group"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Ouvrir le menu principal</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-gray-900/95 backdrop-blur-sm p-6 ring-1 ring-gray-100/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center" onClick={() => setMobileMenuOpen(false)}>
              {/* Modification ici : Ajout du div avec le dégradé de fond */}
              <div className="relative">
                <div className="w-12 h-12 bg-indigo-600 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 relative z-10">
                  <Image
                    src="/s-logo.png"
                    alt="Scrapdeouf"
                    width={28}
                    height={28}
                    className="h-7 w-7 drop-shadow-lg filter brightness-0 invert"
                    priority
                  />
                </div>
              </div>
              <span className="ml-3 text-white text-lg font-bold">Scrapdeouf</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-200"
            >
              <span className="sr-only">Fermer le menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-white/10">
              <div className="space-y-2 py-6">
                {navigationLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block px-3 py-2 text-base/7 font-semibold text-white hover:text-blueviolet transition-colors duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6 space-y-2">
                <div className="-mx-3 block px-3 py-2 text-white hover:text-blueviolet transition-colors duration-300">
                  <LocaleSelectLanguage />
                </div>
                <Link
                  href="/login"
                  className="-mx-3 block px-3 py-2.5 text-base/7 font-semibold text-white hover:text-blueviolet transition-colors duration-300 text-center flex items-center justify-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Se connecter
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
                <Link
                  href="/demo"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white bg-blueviolet hover:bg-blueviolet/80 text-center transition-all duration-200 shadow-lg shadow-blueviolet/25 flex items-center justify-center gap-2 group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Démo gratuite</span>
                  <ChevronRightIcon className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}