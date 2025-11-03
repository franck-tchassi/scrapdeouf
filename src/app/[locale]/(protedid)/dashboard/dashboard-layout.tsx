//(protedid)/dashboard/dashboard-layout.tsx

"use client";

import { ReactNode } from "react"
import { Toaster } from "@/components/ui/sonner"; // Import du Toaster
import { SafeUser } from "@/types";
import { DesktopSidebarContent } from "./components/sidebar-nav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HeaderNav } from "./components/header-nav";



interface DashboardLayoutProps {
    children: React.ReactNode;
    currentUser: SafeUser; // currentUser ne peut pas être null ici car le layout parent le gère
}

export function DashboardLayout({ children, currentUser }: DashboardLayoutProps) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                {/* Sidebar fixe pour les écrans larges */}
                <aside className="hidden md:block fixed inset-y-0 left-0 z-40 w-[220px] lg:w-[280px] border-r bg-gradient-to-br from-blue-900 via-black to-blue-950 opacity-95 border-sidebar-border">
                    <DesktopSidebarContent currentUser={currentUser} />
                </aside>

                {/* Contenu principal avec marge pour la sidebar */}
                <div className="flex flex-col flex-1 md:ml-[220px] lg:ml-[280px]">
                     <HeaderNav currentUser={currentUser} />
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto pt-20">
                        {children}
                    </main>
                </div>
                <Toaster />
            </div>
        </SidebarProvider>
    );
}