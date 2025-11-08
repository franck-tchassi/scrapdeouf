// components/onboarding/TypeformLayout.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface Props {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  title?: string;
}

export function TypeformLayout({ children, currentStep, totalSteps, title }: Props) {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-50 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(var(--onboarding-grid-pattern) 1px, transparent 1px), linear-gradient(90deg, var(--onboarding-grid-pattern) 1px, transparent 1px)`,
        backgroundSize: '30px 30px',
      }}
    >
      {/* Header with Logo and Progress */}
      <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8 
                   flex flex-col items-start sm:flex-row sm:items-center sm:justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group transition-all duration-300 hover:scale-105 mb-4 sm:mb-0">
          <div className="relative">
            <div className="w-10 h-10 bg-blueviolet rounded-xl flex items-center justify-center shadow-lg shadow-blueviolet/25 relative z-10">
              <Image src="/s-logo.png" alt="Scrapdeouf" width={24} height={24} className="h-6 w-6 drop-shadow-lg filter brightness-0 invert" priority />
            </div>
          </div>
          <div className="ml-2 flex flex-col">
            <span className="text-gray-900 text-xl font-bold">Scrapdeouf</span>
          </div>
        </Link>

        {/* Progress Bar */}
        <div className="flex-1 flex flex-col items-center justify-center w-full sm:w-auto sm:mx-4 max-w-md">
          <div className="w-full h-1 bg-gray-200 rounded-full">
            <div className="h-1 bg-blueviolet rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Étape {currentStep} / {totalSteps}
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 w-full max-w-3xl border border-gray-200">
          {title && <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-900">{title}</h1>}
          <div>{children}</div>
        </div>
      </main>
    </div>
  );
}