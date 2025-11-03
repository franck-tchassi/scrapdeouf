// locales/server.ts
import { createI18nServer } from 'next-international/server'
 
export const { getI18n, getScopedI18n, getStaticParams } = createI18nServer({
  en: () => import('./en'),
  fr: () => import('./fr'),
  de: () => import('./de'),
  it: () => import('./it'),
  pt: () => import('./pt'),
  es: () => import('./es')
})