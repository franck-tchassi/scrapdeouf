//(protedid)/dashboard/composants/sidebar-nav.tsx

"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, CreditCard, Settings, Menu, Clock, Plus, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import React from "react";
import Image from "next/image";

import { SafeUser } from "@/types"; // Import SafeUser type
import { CreditsDisplay } from "./credits-display";
import { UserNav } from "./user-nav";

interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
}

// Liens de navigation principaux
const navItems: NavItem[] = [
    {
        title: "Tableau de bord",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Nouvelle extraction", 
        href: "/dashboard/new-extraction",
        icon: Plus,
        badge: "New",
    },
    {
        title: "Horaires", 
        href: "/dashboard/schedules",
        icon: Clock,
    },
];

// Liens de pied de page
const footerNavItems: NavItem[] = [
    {
        title: "Abonnements",
        href: "/dashboard/subscriptions",
        icon: CreditCard,
    },
    {
        title: "Paramètres",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

const MobileNavLinks = ({ items, onItemClick }: { items: NavItem[]; onItemClick?: () => void }) => {
    const pathname = usePathname();

    return (
        <nav className="grid gap-2">
            {items.map((item) => {
                const localeMatch = pathname.match(/^\/([a-z]{2})\//);
                const currentLocale = localeMatch ? localeMatch[1] : "fr";

                const localizedHref = item.href.startsWith('/dashboard') 
                    ? `/${currentLocale}${item.href}` 
                    : item.href;

                const isActive = pathname === localizedHref;
                
                return (
                    <SheetClose asChild key={item.href}>
                        <Link
                            href={localizedHref}
                            onClick={onItemClick}
                            className={cn(
                                "group flex items-center gap-4  p-4 transition-all duration-300",
                                "bg-gradient-to-r hover:from-emerald-500/20 hover:to-cyan-500/20 hover:scale-105",
                                isActive 
                                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white  scale-105" 
                                    : "bg-slate-800/50 text-slate-200",
                                ""
                            )}
                        >
                            <div className={cn(
                                "flex items-center justify-center rounded-xl transition-all duration-300",
                                isActive 
                                    ? "bg-white text-emerald-600 scale-110" 
                                    : "bg-slate-700 text-slate-300 group-hover:bg-slate-600 group-hover:text-white",
                                "w-12 h-12"
                            )}>
                                <item.icon className="h-6 w-6" />
                            </div>
                            
                            <div className="flex-1 flex items-center justify-between">
                                <span className="font-semibold text-lg">{item.title}</span>
                                {item.badge && (
                                    <span className={cn(
                                        "px-2 py-1 rounded-full text-xs font-bold",
                                        isActive 
                                            ? "bg-white text-emerald-600" 
                                            : "bg-emerald-500 text-white"
                                    )}>
                                        {item.badge}
                                    </span>
                                )}
                            </div>

                            <div className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                isActive ? "bg-white scale-125" : "bg-transparent"
                            )} />
                        </Link>
                    </SheetClose>
                );
            })}
        </nav>
    );
};

export function DesktopSidebarContent({ currentUser }: { currentUser: SafeUser }) {
    const pathname = usePathname();
    const localeMatch = pathname.match(/^\/([a-z]{2})\//);
    const locale = localeMatch ? localeMatch[1] : "fr";

    return (
        <div className="flex h-full flex-col gap-2">
            <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[80px] lg:px-6">
                <Link 
                    href={`/${locale}/dashboard`}
                    className="flex items-center font-semibold text-sidebar-foreground hover:text-sidebar-accent-foreground transition-all duration-300 group"
                >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Image
                            src="/s-logo.png"
                            alt="Scrapdeouf"
                            width={20}
                            height={20}
                            className="h-9 w-9 brightness-0 invert"
                        />
                    </div>
                    <span className="text-4xl text-white font-bold">crapdeouf</span>
                </Link>
            </div>
            <div className="flex-1 py-4 overflow-y-auto">
                <NavLinks items={navItems} />
            </div>
            <div className="mt-auto  py-4 border-t border-sidebar-border">
                <div className=" mb-2">
                    <CreditsDisplay />
                </div>
                <NavLinks items={footerNavItems} />
                <div className="mt-4 flex items-center ">
                   <UserNav currentUser={currentUser} /> 
                </div>
            </div>
            
        </div>
    );
}

// Composant NavLinks pour le desktop (conservé de votre version originale)
const NavLinks = ({ items }: { items: NavItem[] }) => {
    const pathname = usePathname();

    return (
        <nav className="grid items-start px-2 text-base font-medium lg:px-4 gap-y-2"> 
            {items.map((item) => {
                const localeMatch = pathname.match(/^\/([a-z]{2})\//);
                const currentLocale = localeMatch ? localeMatch[1] : "fr";

                const localizedHref = item.href.startsWith('/dashboard') 
                    ? `/${currentLocale}${item.href}` 
                    : item.href;

                const isActive = pathname === localizedHref;
                return (
                    <Link
                        key={item.href}
                        href={localizedHref}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-4 py-3 text-white transition-all",
                            "bg-gradient-to-r hover:from-indigo-600/55 hover:to-purple-600/55 hover:text-white",
                            isActive && "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg",
                            "transition-colors duration-200 ease-in-out"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.title}
                    </Link>
                );
            })}
        </nav>
    );
};

export function MobileSidebarTrigger({ currentUser }: { currentUser: SafeUser }) {
    const pathname = usePathname();
    const localeMatch = pathname.match(/^\/([a-z]{2})\//);
    const locale = localeMatch ? localeMatch[1] : "fr";

    const handleItemClick = () => {
        // Fermer le sheet après un délai pour une meilleure UX
        setTimeout(() => {
            const closeButton = document.querySelector('[data-sheet-close="true"]') as HTMLElement;
            if (closeButton) closeButton.click();
        }, 150);
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="shrink-0 md:hidden bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-all duration-300 shadow-lg"
                >
                    <Menu className="h-6 w-6 text-white" />
                    <span className="sr-only">Ouvrir le menu de navigation</span>
                </Button>
            </SheetTrigger>
            <SheetContent 
                side="left" 
                className="flex flex-col w-80 p-0 overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 border-slate-700/50 shadow-2xl"
            >
                {/* Header élégant avec bouton de fermeture */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-800/50">
                    <Link
                        href={`/${locale}/dashboard`}
                        className="flex items-center font-semibold text-sidebar-foreground hover:text-sidebar-accent-foreground transition-all duration-300 group"
                        onClick={handleItemClick}
                    >
                        
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Image
                                src="/s-logo.png"
                                alt="Scrapdeouf"
                                width={20}
                                height={20}
                                className="h-9 w-9 brightness-0 invert"
                            />
                        </div>
                        <span className="text-2xl text-white font-bold">crapdeouf</span>   
                        
                    </Link>
                    
                    <SheetClose asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-xl bg-slate-700/50 hover:bg-slate-600 border border-slate-600/50 transition-all duration-300"
                            data-sheet-close="true"
                        >
                            <X className="h-5 w-5 text-slate-300" />
                            <span className="sr-only">Fermer le menu</span>
                        </Button>
                    </SheetClose>
                </div>

                
                {/* Navigation principale */}
                <div className="flex-1 py-6 px-4 overflow-y-auto">
                    <div className="space-y-3">
                        
                        <NavLinks items={navItems}  />
                    </div>
                </div>

                {/* Footer avec séparation visuelle */}
                <div className="mt-auto border-t border-slate-700/50 bg-slate-800/30">
                    <div className="p-4 space-y-3">
                        
                        <CreditsDisplay />
                        <MobileNavLinks items={footerNavItems} onItemClick={handleItemClick} />
                        
                        {/* Bouton de déconnexion */}
                        <SheetClose asChild>
                            <button 
                                className="w-full flex items-center gap-4 p-4  text-slate-300 hover:text-white bg-slate-800/50 hover:bg-red-500/20 transition-all duration-300 group"
                                onClick={handleItemClick}
                            >
                                <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center group-hover:bg-red-500/30 transition-all duration-300">
                                    <LogOut className="h-6 w-6" />
                                </div>
                                <span className="font-semibold text-lg">Déconnexion</span>
                            </button>
                        </SheetClose>
                    </div>

                   
                </div>
            </SheetContent>
        </Sheet>
    );
}