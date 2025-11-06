// src/app/[locale]/(landing)/layout.tsx

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import React from 'react'


type Props = {
  children: React.ReactNode;
}

const LandingLayout = ({children}: Props) => {
  return (
    <div>
      <Header />
      <main className="min-h-screen bg-background">
        {children}
      </main>
      <Footer /> 
      
    </div>
  )
}

export default LandingLayout