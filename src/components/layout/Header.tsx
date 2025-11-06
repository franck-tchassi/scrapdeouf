"use client";

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
  InformationCircleIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import LocaleSelectLanguage from '@/app/[locale]/LocaleSelectLanguage';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from 'next/image';



const ListItem = ({ className, title, children, ...props }: any) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            "block select-none space-y-2 rounded-lg p-4 leading-none no-underline outline-none transition-colors hover:bg-accent/20 hover:text-accent-foreground focus:bg-accent/20 focus:text-accent-foreground",
            "text-base",
            className
          )}
          {...props}
        >
          <div className="text-base font-semibold">{title}</div>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      "bg-gray-900/95 backdrop-blur-sm fixed top-4 left-1/2 transform -translate-x-1/2 w-[95vw] max-w-7xl z-50 rounded-2xl border transition-all duration-300 shadow-2xl",
      scrolled
        ? "border-gray-600/50 shadow-xl scale-105"
        : "border-gray-700/50 shadow-2xl scale-100"
    )}>
      {/* Effet de brillance subtile */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl pointer-events-none" />

      {/* Effet de bordure animée */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <nav aria-label="Global" className="relative z-10">
        <div className="mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo amélioré */}
            <div className="flex-shrink-0 flex items-center">
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
                  {/* Effet de halo animé (masqué en mobile pour laisser le gradient visible) */}
                  <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 rounded-xl blur-sm group-hover:blur-md transition-all duration-500" />
                </div>
                <div className="ml-3 flex flex-col">
                  <span className="text-white text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    Scrapdeouf
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation centrale améliorée  */}
            <div className="hidden lg:flex lg:items-center lg:justify-center lg:flex-1 lg:gap-4 lg:mx-8">

              <Link
                href="/apropos"
                className="text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/5 rounded-xl px-2 py-2.5 border border-transparent hover:border-white/10"
              >
                À propos
              </Link>

              <Link
                href="/pricing"
                className="text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/5 rounded-xl px-2 py-2.5 border border-transparent hover:border-white/10"
              >
                Tarifs
              </Link>

              <Link
                href="/blog"
                className="text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/5 rounded-xl px-2 py-2.5 border border-transparent hover:border-white/10"
              >
                Blog
              </Link>


            </div>

            {/* Actions de droite améliorées */}
            <div className="flex items-center gap-3">
              {/* Sélecteur de langue */}
              <div className="hidden sm:block">
                <LocaleSelectLanguage />
              </div>

              {/* Liens desktop */}
              <div className="hidden lg:flex lg:items-center lg:gap-3">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/5 rounded-xl px-4 py-2.5 border border-transparent hover:border-white/10 flex items-center gap-1"
                >
                  Connexion
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
                <Link
                  href="/demo"
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 group"
                >
                  <span>Démo gratuite</span>
                  <ChevronRightIcon className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Bouton menu mobile amélioré */}
              <button
                type="button"
                className="lg:hidden inline-flex items-center justify-center rounded-xl p-2.5 text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10 group"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Ouvrir le menu principal</span>
                <Bars3Icon className="h-6 w-6 group-hover:scale-110 transition-transform" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu mobile amélioré */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <DialogPanel className="fixed inset-0 z-50 w-full h-full overflow-y-auto bg-gray-900/95 backdrop-blur-sm border-0 rounded-none shadow-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-900/80 to-gray-800/60">
            <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
              <div className="w-10 h-10 bg-indigo-600 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20 relative z-10">
                <Image
                  src="/s-logo.png"
                  alt="Scrapdeouf"
                  width={20}
                  height={20}
                  className="h-5 w-5 drop-shadow-lg filter brightness-0 invert"
                />
              </div>
              <div className="ml-3 flex flex-col">
                <span className="text-white text-lg font-bold">Scrapdeouf</span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl p-2.5 text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
            >
              <span className="sr-only">Fermer le menu</span>
              <XMarkIcon aria-hidden="true" className="size-5" />
            </button>
          </div>

          <div className="px-5 py-4">
            <div className="flow-root">
              <div className="-my-4 divide-y divide-gray-800/60">
                {/* Navigation mobile */}
                <div className="space-y-2 py-4">

                  {/* Liens simples mobile */}
                  {[
                    { href: '/pricing', label: 'Tarifs' },
                    { href: '/apropos', label: 'À propos' },
                    { href: '/blog', label: 'Blog' }
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="-mx-2 block rounded-lg px-3 py-3 text-lg font-semibold text-white hover:bg-white/5 transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Actions mobile */}
                <div className="space-y-4 py-4">
                  {/* Sélecteur de langue mobile */}
                  <div className="px-2 sm:hidden">
                    <LocaleSelectLanguage />
                  </div>

                  <Link
                    href="/login"
                    className="-mx-2 block rounded-lg px-3 py-3 text-lg font-semibold text-white hover:bg-white/5 transition-all duration-200 text-center flex items-center justify-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Se connecter
                    <ChevronRightIcon className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/demo"
                    className="-mx-2 block rounded-lg px-3 py-3 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-center transition-all duration-200 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Démo gratuite</span>
                    <ChevronRightIcon className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}