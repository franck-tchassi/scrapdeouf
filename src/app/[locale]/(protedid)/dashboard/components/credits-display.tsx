//(protedid)/dasboard/components/credits-display.tsx

"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CreditCard, Loader2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface CreditsData {
  creditsUsed: number;
  creditsLimit: number;
  plan: string;
  lastCreditReset: string;
}

export function CreditsDisplay() {
  const [credits, setCredits] = useState<CreditsData | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch("/api/user/credits");
        if (!response.ok) {
          if (response.status === 401) {
            // User not authenticated, redirect to login
            router.push("/login");
            return;
          }
          throw new Error("Failed to fetch credits");
        }
        const data: CreditsData = await response.json();
        setCredits(data);

        // Check if user is blocked due to insufficient credits
        if (data.creditsLimit > 0 && data.creditsUsed >= data.creditsLimit) {
          if (!pathname.includes("/subscribe")) { // Avoid redirect loop if already on subscribe page
            toast.error("Vous avez atteint votre limite de crédits. Veuillez mettre à niveau votre plan.");
            router.push("/fr/subscribe");
          }
        } else if (data.creditsLimit === 0 && data.plan === 'FREE') {
          // If on FREE plan and creditsLimit is 0, and they try to use features
          // This check is more for preventing usage, actual blocking happens in run-scrape
          // For now, just ensure they are aware of the free plan limitations
        }

      } catch (error) {
        console.error("Error fetching credits:", error);
        toast.error("Échec du chargement des informations de crédits.");
      } 
    };

    fetchCredits();
    // Refresh credits every 30 seconds
    const interval = setInterval(fetchCredits, 30000); 
    return () => clearInterval(interval);
  }, [router, pathname]);

  

  if (!credits) {
    return null
  }

  const percentageUsed = credits.creditsLimit > 0 ? (credits.creditsUsed / credits.creditsLimit) * 100 : 0;
  const isOverLimit = credits.creditsLimit > 0 && credits.creditsUsed >= credits.creditsLimit;
  const isFreePlan = credits.plan === 'FREE';

  return (
    <Card className="bg-slate-800/50 !border-none text-slate-200 !shadow-none">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-400" />
            <span className="font-semibold text-lg">Vos Crédits</span>
          </div>
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
            {credits.plan}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm font-medium">
            <span>Utilisés: <span className={isOverLimit ? "text-red-400" : "text-white"}>{credits.creditsUsed}</span></span>
            <span>Limite: <span className="text-white">{credits.creditsLimit}</span></span>
          </div>
          <Progress 
            value={percentageUsed} 
            className="h-2 bg-slate-700" 
            indicatorClassName={isOverLimit ? "bg-red-500" : "bg-emerald-500"}
          />
        </div>

        {isOverLimit && (
          <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
            <AlertCircle className="h-4 w-4" />
            <span>Limite de crédits atteinte !</span>
          </div>
        )}

        {isFreePlan && (
          <div className="text-sm text-slate-400">
            Passez à un plan supérieur pour plus de crédits.
          </div>
        )}

        
      </CardContent>
    </Card>
  );
}