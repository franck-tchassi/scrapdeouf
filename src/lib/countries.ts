// Interface pour un pays
export interface Country {
    value: string;
    label: string;
    disabled?: boolean;
  }
  
  // Liste des pays les plus courants + France en premier
  export const COUNTRIES: Country[] = [
    { value: "FR", label: "France" },
    { value: "BE", label: "Belgique" },
    { value: "CH", label: "Suisse" },
    { value: "CA", label: "Canada" },
    { value: "US", label: "États-Unis" },
    { value: "GB", label: "Royaume-Uni" },
    { value: "DE", label: "Allemagne" },
    { value: "ES", label: "Espagne" },
    { value: "IT", label: "Italie" },
    { value: "PT", label: "Portugal" },
    { value: "NL", label: "Pays-Bas" },
    { value: "LU", label: "Luxembourg" },
    // Séparateur pour les autres pays
    { value: "separator", label: "---", disabled: true },
    { value: "DZ", label: "Algérie" },
    { value: "AU", label: "Australie" },
    { value: "BR", label: "Brésil" },
    { value: "CN", label: "Chine" },
    { value: "JP", label: "Japon" },
    { value: "MA", label: "Maroc" },
    { value: "TN", label: "Tunisie" },
    { value: "SN", label: "Sénégal" },
    { value: "CI", label: "Côte d'Ivoire" },
  ];
  
  // Type pour les codes de pays (sans le séparateur)
  export type CountryCode = Exclude<typeof COUNTRIES[number]['value'], 'separator'>;
  
  // Fonction utilitaire pour obtenir le nom d'un pays par son code
  export function getCountryName(code: string): string {
    const country = COUNTRIES.find(c => c.value === code);
    return country?.label || code;
  }
  
  // Fonction pour obtenir les pays sans le séparateur
  export function getCountriesWithoutSeparator(): Country[] {
    return COUNTRIES.filter(country => country.value !== "separator");
  }
  
  // Fonction pour obtenir uniquement les pays valides (sans séparateur et non désactivés)
  export function getValidCountries(): Country[] {
    return COUNTRIES.filter(country => country.value !== "separator" && !country.disabled);
  }