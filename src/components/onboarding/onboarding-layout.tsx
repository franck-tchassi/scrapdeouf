"use client";

import React from "react";
import { ProgressBar } from "./progress-bar";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
}

export function OnboardingLayout({ children, currentStep, totalSteps }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen  py-12 px-4 flex flex-col items-center">
      <div className="max-w-4xl mx-auto w-full">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <div className="bg-gray-50 rounded-4xl shadow-xl p-8 sm:p-10 md:p-12 w-full">
          {children}
        </div>
      </div>
    </div>
  );
}