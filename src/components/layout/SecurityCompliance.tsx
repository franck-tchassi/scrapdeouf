import Image from "next/image";
import { Shield, Database, FileCheck } from "lucide-react";

export default function SecurityCompliance() {
  const features = [
    {
      
      title: "Certification ISO 27001",
      description: "Notre infrastructure est certifiée ISO 27001, le standard international pour la sécurité des systèmes d'information. Nous maintenons des processus stricts de gestion des risques et de continuité d'activité.",
      image: "/certificated/iso-certif.png",
    },
    {
      
      title: "Base de Données MongoDB Sécurisée",
      description: "Vos données sont hébergées sur MongoDB Atlas avec chiffrement AES-256, sauvegardes automatiques et réplication multi-régions. Accès strictement contrôlé et audités.",
      image: "/certificated/mongodb.png", 
    },
    {
      
      title: "Conformité RGPD Complète",
      description: "Respect strict du Règlement Général sur la Protection des Données. Gestion des consentements, droit à l'oubli, portabilité des données et registre des traitements intégrés.",
      image: "/certificated/rgpd.png",
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* En-tête */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
            Infrastructure 100% Sécurisée
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Nous garantissons la protection de vos données avec les certifications les plus exigeantes 
            et une infrastructure cloud de niveau entreprise.
          </p>
        </div>

        {/* Grille des 3 fonctionnalités principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 sm:p-8    flex flex-col"
            >
              {/* Conteneur d'image responsive */}
              <div className="relative h-40 sm:h-48 mb-4 sm:mb-6  overflow-hidden  flex items-center justify-center p-4">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={200}
                  height={120}
                  className="object-contain rounded-4xl"
                  style={{ 
                    width: 'auto', 
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                  priority={index === 0}
                />
              </div>

              {/* titre */}
              <div className="flex items-start mb-3 sm:mb-4">
                
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                  {feature.title}
                </h3>
              </div>
              
              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base flex-grow">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bandeau MongoDB responsive */}
        <div className="mt-12 lg:mt-16 bg-gray-900 rounded-xl lg:rounded-2xl p-6 lg:p-8 text-center">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            <div className="text-center lg:text-left text-white">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Powered by MongoDB Atlas</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Base de données cloud sécurisée avec chiffrement natif et haute disponibilité
              </p>
            </div>
            <div className="flex items-center space-x-6 sm:space-x-8 text-white">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-400">AES-256</div>
                <div className="text-gray-400 text-xs sm:text-sm">Chiffrement</div>
              </div>
             
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}