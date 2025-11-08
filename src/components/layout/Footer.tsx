// src/components/layout/Footer.tsx

'use client';

import { Youtube, Linkedin, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/3 rounded-full blur-3xl"></div>
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: `linear-gradient(var(--grid-pattern) 1px, transparent 1px), linear-gradient(90deg, var(--grid-pattern) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex flex-col items-start mb-6">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-blueviolet rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 mr-4">
                  <Image
                    src="/s-logo.png"
                    alt="Scrapdeouf"
                    width={32}
                    height={32}
                    className="h-8 w-8 drop-shadow-lg filter brightness-0 invert"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                    Scrapdeouf
                  </span>
                  <span className="text-sm text-gray-400 mt-1">
                    Solutions Digitales Innovantes
                  </span>
                </div>
              </div>

              <p className="text-gray-300 text-lg mb-6 max-w-md leading-relaxed">
                Votre partenaire pour des solutions digitales innovantes qui transforment votre business.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span className="text-lg font-medium">contact@scrapdeouf.com</span>
                </div>
                
              </div>

              {/* Social Media */}
              <div className="flex gap-3">
                <a 
                  href="#" 
                  className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-blue-500/20 hover:border-blue-500/30 hover:scale-105 transition-all duration-200 group"
                >
                  <Youtube className="h-5 w-5 text-gray-400 group-hover:text-white" />
                </a>
                <a 
                  href="#" 
                  className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-blue-600/20 hover:border-blue-600/30 hover:scale-105 transition-all duration-200 group"
                >
                  <Linkedin className="h-5 w-5 text-gray-400 group-hover:text-white" />
                </a>
                <a 
                  href="#" 
                  className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-pink-500/20 hover:border-pink-500/30 hover:scale-105 transition-all duration-200 group"
                >
                  <Instagram className="h-5 w-5 text-gray-400 group-hover:text-white" />
                </a>
                <a 
                  href="#" 
                  className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-black/20 hover:border-gray-600 hover:scale-105 transition-all duration-200 group"
                >
                  <svg className="h-5 w-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.50 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Essentiels */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Essentiels
            </h3>
            <ul className="space-y-4">
              {['Tarifs', 'Témoignages client', 'A propos', 'Assistance'].map((item) => (
                <li key={item}>
                  <a 
                    href={`/${item.toLowerCase().replace(' ', '-')}`} 
                    className="text-gray-400 hover:text-blue-400 transition-all duration-200 hover:translate-x-1 inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Fichiers Email
            </h3>
            <ul className="space-y-4">
              {[
                'Restaurants',
                'Hôtels',
                'Agences immobilières',
                'Coiffeurs',
                'Salons de beauté',
                'Centre d aide'
              ].map((item) => (
                <li key={item}>
                  <a 
                    href={`/fichier-email-${item.toLowerCase().replace(' ', '-').replace('è', 'e')}`} 
                    className="text-gray-400 hover:text-purple-400 transition-all duration-200 hover:translate-x-1 inline-block text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Paiement & Sécurité */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Sécurité
            </h3>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex justify-center mb-3">
                  <Image
                    src="/card-stripe.png"
                    alt="Paiements sécurisés Stripe"
                    width={140}
                    height={42}
                    className="h-12 w-auto object-contain"
                    priority
                  />
                </div>
                <p className="text-gray-400 text-xs text-center">
                  Transactions 100% sécurisées avec chiffrement SSL
                </p>
              </div>
              
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-400">
              <span>© 2025 Scrapdeouf. Tous droits réservés.</span>
              <div className="flex gap-6">
                <a 
                  href="/cgu" 
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  CGU
                </a>
                <a 
                  href="/confidentialite" 
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Confidentialité
                </a>
                <a 
                  href="/cookies" 
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Cookies
                </a>
              </div>
            </div>

            {/* Note supplémentaire pour remplir l'espace */}
            <div className="text-gray-500 text-sm">
              Made with ❤️ in France
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}