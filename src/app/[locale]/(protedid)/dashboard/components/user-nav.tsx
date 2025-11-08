"use client";

import { useEffect } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { SafeUser } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile"; // Importation du hook useIsMobile
import { User, CreditCard, Bell, LogOut, MoreVertical } from "lucide-react"; // Icônes Lucide React

interface UserNavProps {
  currentUser: SafeUser | null;
}

export function UserNav({ currentUser }: UserNavProps) {
  const router = useRouter();
  const isMobile = useIsMobile(); // Utilisation du hook useIsMobile

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false
      });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  if (!currentUser) {
    return <div className="h-12 w-12"></div>; // Placeholder si aucun utilisateur
  }

  const userInitials = currentUser.name
    ? currentUser.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
    : currentUser.email
      ? currentUser.email[0].toUpperCase()
      : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex w-full items-center gap-3 rounded-lg p-3 transition-all duration-200 
                     text-white hover:bg-gray-800 hover:text-blueviolet group" // Style du bouton déclencheur
        >
          <Avatar className="h-9 w-9 rounded-full border border-gray-700"> {/* Avatar plus grand et arrondi */}
            <AvatarImage src={currentUser.image ?? undefined} alt={currentUser.name || "Avatar"} />
            <AvatarFallback className="rounded-full bg-blueviolet/20 text-blueviolet-foreground font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate text-white font-medium">{currentUser.name || "Utilisateur"}</span>
            <span className="text-gray-400 truncate text-xs">
              {currentUser.email}
            </span>
          </div>
          <MoreVertical className="ml-auto text-gray-400 size-4 group-hover:text-blueviolet" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-lg bg-gray-800 border-gray-700 text-white shadow-lg" // Contenu du menu déroulant plus sombre
        side={isMobile ? "top" : "right"} // Positionnement pour mobile vs desktop
        align="end"
        sideOffset={8} // Décalage augmenté pour un meilleur espacement
      >
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex items-center gap-2 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-full border border-gray-600">
              <AvatarImage src={currentUser.image ?? undefined} alt={currentUser.name || "Avatar"} />
              <AvatarFallback className="rounded-full bg-blueviolet/20 text-blueviolet-foreground font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{currentUser.name || "Utilisateur"}</span>
              <span className="text-gray-400 truncate text-xs">
                {currentUser.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/dashboard/profile")} className="hover:bg-gray-700 cursor-pointer">
            <User className="mr-2 size-4 text-gray-400" />
            Profil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard/subscriptions")} className="hover:bg-gray-700 cursor-pointer">
            <CreditCard className="mr-2 size-4 text-gray-400" />
            Abonnement
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard/notifications")} className="hover:bg-gray-700 cursor-pointer">
            <Bell className="mr-2 size-4 text-gray-400" />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:!bg-red-500/20 hover:!text-red-400 cursor-pointer">
          <LogOut className="mr-2 size-4" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}