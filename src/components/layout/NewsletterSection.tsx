// NewsletterSection.tsx

"use client";

import { useState } from 'react';
import { Mail, Send, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[A-Z]{2,4}$/i.test(email); // Regex plus robuste
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Veuillez entrer une adresse email valide');
      toast.error('Veuillez entrer une adresse email valide.');
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
        toast.success('Votre inscription à la newsletter est confirmée !');
      } else {
        setError(data.error || "Une erreur s'est produite");
        toast.error(data.error || "Une erreur s'est produite lors de l'abonnement.");
      }

    } catch (err) {
      setError("Erreur de connexion. Veuillez réessayer.");
      toast.error("Erreur de connexion. Veuillez réessayer.");
      console.error('Erreur newsletter:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative bg-blueviolet-50 py-20 sm:py-28 overflow-hidden"> {/* Changement du fond */}
      {/* Background simple */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blueviolet-100/50 rounded-full blur-2xl"></div> {/* Ajustement couleur */}
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blueviolet-100/50 rounded-full blur-2xl"></div> {/* Ajustement couleur */}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texte côté gauche */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 leading-tight"> {/* Changement couleur texte */}
              Restez informé des
              <span className="block bg-blueviolet bg-clip-text text-transparent">
                dernières tendances
              </span>
            </h3>
            <p className="text-gray-700 text-lg sm:text-xl mb-6 max-w-md"> {/* Changement couleur texte */}
              Recevez nos conseils experts et les dernières tendances du marketing digital directement dans votre boîte mail.
            </p>

          </motion.div>

          {/* Formulaire côté droit */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-0.5 bg-blueviolet rounded-xl blur opacity-30"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-6"> {/* Ajustement couleurs */}
              <AnimatePresence mode="wait">
                {isSubscribed ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-4"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1"> {/* Changement couleur texte */}
                      Félicitations !
                    </h4>
                    <p className="text-blueviolet-700 text-sm"> {/* Changement couleur texte */}
                      Votre inscription est confirmée.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <label htmlFor="newsletter-email" className="block text-sm font-medium text-gray-700 mb-2"> {/* Changement couleur texte */}
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
                          placeholder="email@entreprise.com"
                          className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-blueviolet-500 focus:ring-2 focus:ring-blueviolet-500/20 transition-colors"
                          required
                        />
                        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" /> {/* Ajustement couleur */}
                      </div>
                    </div>

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-sm bg-red-100 p-2 rounded border border-red-300"
                      >
                        {error}
                      </motion.p>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-blueviolet cursor-pointer hover:bg-blueviolet/80 disabled:opacity-50 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center group shadow-lg shadow-blue-500/20"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Inscription...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                          S'inscrire gratuitement
                        </>
                      )}
                    </button>

                
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}