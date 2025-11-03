// components/lottie-avatar.tsx (version avec fallback image)
"use client";

import Lottie from 'lottie-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LottieAvatarProps {
  animationData: any;
  userImage?: string | null;
  className?: string;
  fallback?: string;
}

export function LottieAvatar({ 
  animationData, 
  userImage, 
  className = "", 
  fallback = "U" 
}: LottieAvatarProps) {
  
  // Si l'utilisateur a une image personnalisée, on l'utilise
  if (userImage) {
    return (
      <Avatar className={className}>
        <AvatarImage src={userImage} alt="User avatar" />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
    );
  }

  // Sinon, on utilise l'animation Lottie
  return (
    <Avatar className={className}>
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        className="h-full w-full"
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice'
        }}
      />
      
    </Avatar>
  );
}