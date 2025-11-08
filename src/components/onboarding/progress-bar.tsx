//components/onboarding/progress-bar.tsx

"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils"; // Import cn for conditional class merging

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">Étape {currentStep} sur {totalSteps}</span>
      </div>
      <div className="relative h-6 w-full rounded-full bg-muted">
        <Progress
          value={progressValue}
          className="h-full [&>*]:bg-primary"
          indicatorClassName="rounded-full" // Ensure the indicator is also rounded
        />
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center text-xs font-semibold",
            progressValue > 50 ? "text-primary-foreground" : "text-primary" // Adjust text color based on progress for better contrast
          )}
        >
          {Math.round(progressValue)}%
        </span>
      </div>
    </div>
  );
}