//(protedid)/dashboard/components/header-nav.tsx

"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { Package2 } from "lucide-react";
import { UserNav } from "./user-nav";
import { MobileSidebarTrigger } from "./sidebar-nav";
import { SafeUser } from "@/types"; // Import SafeUser

interface HeaderNavProps {
  currentUser: SafeUser | null; // Add currentUser prop
}

export function HeaderNav({ currentUser }: HeaderNavProps) { // Accept currentUser
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0  z-30 flex h-20  items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      {isMobile  && currentUser && ( // Ajout de la vérification currentUser
        <MobileSidebarTrigger currentUser={currentUser} /> // Correction ici
      ) }
      
    </header>
  );
}