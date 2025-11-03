// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nProviderClient } from '@/locales/client';
import { SessionProvider } from "next-auth/react";
import React, { PropsWithChildren, useState } from 'react';

const Providers = (props: PropsWithChildren<{ locale: string }>) => {
  // Création d'une instance de QueryClient avec useState pour éviter les recréations inutiles
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: false, // Désactive les tentatives automatiques
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <I18nProviderClient locale={props.locale}>
          {props.children}
        </I18nProviderClient>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Providers;