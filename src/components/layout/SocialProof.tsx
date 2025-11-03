import Image from "next/image";
import { Star } from "lucide-react";

export default function SocialProof() {
  const avatars = [
    "/fille1.jpg",
    "/fille3.jpg",
    "/fille2.jpg",
    "/garcon1.jpg",
    "/papouu.jpg",
  ];

  return (
    <div className="relative">
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 lg:p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-4 lg:gap-6">
          
          {/* Section Avatars - Responsive */}
          <div className="flex items-center justify-center lg:justify-start">
            <div className="relative flex -space-x-2 lg:-space-x-3">
              {avatars.map((src, i) => (
                <div
                  key={i}
                  className="relative"
                  style={{ zIndex: avatars.length - i }}
                >
                  <Image
                    src={src}
                    alt=""
                    width={48}
                    height={48}
                    quality={100}
                    className="rounded-full border-2 border-white/20 shadow-lg object-cover w-10 h-10 lg:w-12 lg:h-12"
                    priority={i < 2} // Priorité sur les 2 premières images
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Séparateur - Desktop seulement */}
          <div className="hidden lg:block w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

          {/* Section Étoiles - Responsive */}
          <div className="flex flex-col sm:flex-row items-center gap-3 lg:gap-4 text-center sm:text-left">
            <div className="flex items-center justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="text-yellow-400 fill-yellow-400 w-4 h-4 lg:w-5 lg:h-5"
                />
              ))}
            </div>
            <div>
              <p className="text-white font-semibold text-sm lg:text-lg whitespace-nowrap">
                250+ équipes sales satisfaites
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}