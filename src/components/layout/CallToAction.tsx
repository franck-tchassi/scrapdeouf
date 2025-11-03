"use client";

import Link from "next/link";
import HighlightText from "./HighlightText";
import SocialProof from "./SocialProof"; // 👈 import du composant

export function CallToAction() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center">

          {/* ✅ Social Proof au-dessus du titre */}
          <div className="flex justify-center mb-8">
            <SocialProof />
          </div>

          {/* Titre principal */}
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Prêt à transformer vos données en{" "}
            <HighlightText
              variant="fancy-slant"
              color="secondary"
            >
              avantage compétitif
            </HighlightText>{" "}
            ?
          </h2>

          {/* Sous-titre */}
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Rejoignez les centaines de professionnels qui utilisent déjà notre
            plateforme pour accélérer leur croissance et prendre de meilleures
            décisions.
          </p>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href={"/login"}>
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 cursor-pointer text-white px-10 py-5 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-[0_20px_50px_rgba(99,102,241,0.3)] hover:scale-105">
                Commencer gratuitement
              </button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
