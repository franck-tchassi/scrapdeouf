"use client";

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";
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
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { SafeUser } from "@/types";

interface UserNavProps {
  currentUser: SafeUser | null;
}

export function UserNav({ currentUser }: UserNavProps) {
  const router = useRouter();

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
    return <div className="h-12 w-12"></div>;
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
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger className="!border-none !bg-none !shadow-none" asChild>
            <SidebarMenuButton
              size="lg"
              className="!bg-none data-[state=open]:text-sidebar-accent-foreground hover:bg-transparent border-transparent hover:bg-none !hover:bg-transparent !hover:bg-none"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={currentUser.image ?? undefined} alt={currentUser.name || "Avatar"} />
                <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-white font-medium">{currentUser.name || "Utilisateur"}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {currentUser.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto text-white size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={currentUser.image ?? undefined} alt={currentUser.name || "Avatar"} />
                  <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{currentUser.name || "Utilisateur"}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {currentUser.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:!text-red-700">
              <IconLogout className="mr-2 size-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}