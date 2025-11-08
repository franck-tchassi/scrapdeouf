//(protedid)/dashboard/composants/sidebar-nav.tsx

"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CreditCard, Settings, Menu, Clock, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import React from "react";
import Image from "next/image";

import { SafeUser } from "@/types";
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

// Composant NavLinks pour le mobile
const MobileNavLinks = ({ items, onItemClick }: { items: NavItem[]; onItemClick?: () => void }) => {
    const pathname = usePathname();

    return (
        <nav className="grid gap-1">
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
                                "flex items-center gap-4 p-3 rounded-lg transition-all duration-200",
                                isActive 
                                    ? "bg-blueviolet text-white shadow-md" 
                                    : "text-gray-300 hover:bg-gray-800 hover:text-white",
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 transition-colors duration-200",
                                isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                            )} />
                            
                            <span className="font-medium text-base">{item.title}</span>
                            {item.badge && (
                                <span className={cn(
                                    "ml-auto px-2 py-0.5 rounded-full text-xs font-bold",
                                    isActive 
                                        ? "bg-white text-blueviolet" 
                                        : "bg-blueviolet text-white"
                                )}>
                                    {item.badge}
                                </span>
                            )}
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
        <div className="flex h-full flex-col gap-2 bg-gray-900 text-white">
            <div className="flex h-16 items-center border-b border-gray-800 px-4 lg:h-[80px] lg:px-6">
                <Link 
                    href={`/${locale}/dashboard`}
                    className="flex items-center font-semibold text-white hover:text-blueviolet transition-all duration-300 group"
                >
                    <div className="w-10 h-10 rounded-xl flex bg-blueviolet items-center justify-center group-hover:scale-105 transition-transform mr-2">
                        <Image
                            src="/s-logo.png"
                            alt="Scrapdeouf"
                            width={28}
                            height={28}
                            className="h-7 w-7 drop-shadow-lg filter brightness-0 invert" // Ajout de 'drop-shadow-lg filter'
                            priority
                        />
                    </div>
                    <span className="text-2xl font-bold">Scrapdeouf</span>
                </Link>
            </div>
            <div className="flex-1 py-4 overflow-y-auto">
                <NavLinks items={navItems} />
            </div>
            <div className="mt-auto py-4 border-t border-gray-800 px-4">
                <div className="mb-4">
                    <CreditsDisplay />
                </div>
                <NavLinks items={footerNavItems} />
                <div className="mt-4">
                   <UserNav currentUser={currentUser} /> 
                </div>
            </div>
        </div>
    );
}

// Composant NavLinks pour le desktop
const NavLinks = ({ items }: { items: NavItem[] }) => {
    const pathname = usePathname();

    return (
        <nav className="grid items-start px-2 text-base font-medium lg:px-4 gap-y-1"> 
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
                            "flex items-center gap-3 rounded-lg px-4 py-2.5 text-white transition-all duration-200",
                            isActive 
                                ? "bg-blueviolet shadow-md" 
                                : "hover:bg-gray-800 hover:text-blueviolet",
                        )}
                    >
                        <item.icon className={cn(
                            "h-5 w-5 transition-colors duration-200",
                            isActive ? "text-white" : "text-gray-400 group-hover:text-blueviolet"
                        )} />
                        {item.title}
                        {item.badge && (
                            <span className={cn(
                                "ml-auto px-2 py-0.5 rounded-full text-xs font-bold",
                                isActive 
                                    ? "bg-white text-blueviolet" 
                                    : "bg-blueviolet text-white"
                            )}>
                                {item.badge}
                            </span>
                        )}
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
                    className="shrink-0 md:hidden bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600 transition-all duration-300 shadow-lg"
                >
                    <Menu className="h-6 w-6 text-white" />
                    <span className="sr-only">Ouvrir le menu de navigation</span>
                </Button>
            </SheetTrigger>
            <SheetContent 
                side="left" 
                className="flex flex-col w-80 p-0 overflow-hidden bg-gray-900 border-gray-700/50 shadow-2xl [&>button]:hidden"
            >
                {/* Header élégant avec bouton de fermeture */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
                    <Link
                        href={`/${locale}/dashboard`}
                        className="flex items-center font-semibold text-white hover:text-blueviolet transition-all duration-300 group"
                        onClick={handleItemClick}
                    >
                        <div className="w-10 h-10 bg-blueviolet rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform mr-2">
                            <Image
                                src="/s-logo.png"
                                alt="Scrapdeouf"
                                width={28}
                                height={28}
                                className="h-7 w-7 drop-shadow-lg filter brightness-0 invert" // Ajout de 'drop-shadow-lg filter'
                                priority
                            />
                        </div>
                        <span className="text-xl font-bold">Scrapdeouf</span>   
                    </Link>
                    
                    <SheetClose asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all duration-300"
                            data-sheet-close="true"
                        >
                            <X className="h-5 w-5 text-gray-300" />
                            <span className="sr-only">Fermer le menu</span>
                        </Button>
                    </SheetClose>
                </div>

                {/* Navigation principale */}
                <div className="flex-1 py-6 px-4 overflow-y-auto">
                    <div className="space-y-3">
                        <MobileNavLinks items={navItems} onItemClick={handleItemClick} />
                    </div>
                </div>

                {/* Footer avec séparation visuelle */}
                <div className="mt-auto border-t border-gray-800 bg-gray-900 p-4">
                    <div className="space-y-3">
                        <CreditsDisplay />
                        <MobileNavLinks items={footerNavItems} onItemClick={handleItemClick} />
                        
                        {/* Intégration du UserNav pour mobile */}
                        <UserNav currentUser={currentUser} />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}