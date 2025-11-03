// locales/i18n.ts
export type Locale = 'en' | 'fr' | 'de' | 'it' | 'pt' | 'es';

export type Messages = {
  language: {
    Language: string;
    Currency: string;
    Cerrency_price: string;
  };
  currentLanguage: string;
  // Ajoute ici tous les autres messages traduits utilisés dans le projet
};
