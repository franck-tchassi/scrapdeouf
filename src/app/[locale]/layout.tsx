// app/[locale]/layout.tsx
import Providers from "./providers";
import React from 'react'

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  
  return (
    <Providers locale={locale}>
      {children}
    </Providers>
  )
}

export default LocaleLayout

