'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Search, Loader2, MapPin, Building, Globe, Filter } from 'lucide-react'
import { SearchResultsTable } from './search-results-table'
import { toast } from 'sonner'

interface SearchFormData {
    activity: string
    city: string
    country: string
}

interface SearchResult {
    id: string;
    nom: string;
    adresse: string;
    ville: string;
    pays: string;
    siteWeb?: string;
    emailsDetectes: string[];
    nombrePagesContact: number;
    reseauxSociaux: { type: string; url: string }[];
    lienMaps: string;
    telephone?: string;
    note?: number;
    nombreAvis?: number;
    ouvertMaintenant?: boolean;
}

// Données par défaut pour démonstration
const DEFAULT_RESULTS: SearchResult[] = [
    {
        id: "1",
        nom: "Les Parisiens Restaurant by Thibault Sombardier",
        adresse: "1 Rue du Pré aux Clercs, 75007 Paris",
        ville: "Paris",
        pays: "France",
        siteWeb: "https://www.pavillon-faubourg-saint-germain.com",
        emailsDetectes: [" lesparisiens@pfsg.fr"],
        nombrePagesContact: 1,
        reseauxSociaux: [
            { type: "instagram", url: "https://www.instagram.com/pavillon_fbg_saint_germain" }
        ],
        lienMaps: "https://www.google.com/maps/place/Les+Parisiens+Restaurant+by+Thibault+Sombardier/@48.8566609,2.3303688,17z/data=!3m1!4b1!4m6!3m5!1s0x47e66f5ff049ca43:0xe4e95005e5d5f1ca!8m2!3d48.8566609!4d2.3303688!16s%2Fg%2F11pz08jz2z?entry=ttu&g_ep=EgoyMDI1MTAwNy4wIKXMDSoASAFQAw%3D%3D",
        telephone: "+33 14****33"
    },
    {
        id: "2",
        nom: "Bouillon République",
        adresse: "39 Bd du Temple, 75003 Paris",
        ville: "Paris",
        pays: "France",
        siteWeb: "https://bouillonlesite.com/",
        emailsDetectes: ["groupes@bouillonlesite.com"],
        nombrePagesContact: 2,
        reseauxSociaux: [
            { type: "instagram", url: "https://www.instagram.com/bouillonlinsta" },
            { type: "facebook", url: "https://www.facebook.com/BouillonPigalle"}
        ],
        lienMaps: "https://www.google.com/maps/place/Bouillon+R%C3%A9publique/@48.8660129,2.3647516,17z/data=!3m1!4b1!4m6!3m5!1s0x47e66f338799b643:0xe4cda273461ce9da!8m2!3d48.8660129!4d2.3647516!16s%2Fg%2F11pbv9fqgb?entry=ttu&g_ep=EgoyMDI1MTAwNy4wIKXMDSoASAFQAw%3D%3D",
        telephone: "+33 15****71"
    },
    {
        id: "3",
        nom: "Chouchou",
        adresse: "23 Boulevard de Sebastopol 75001 Paris, France",
        ville: "Paris",
        pays: "France",
        siteWeb: "http://www.restaurantchouchouparis.fr/",
        emailsDetectes: ["restauchouchou@gmail.com"],
        nombrePagesContact: 2,
        reseauxSociaux: [
            { type: "facebook", url: "https://www.facebook.com/restaurantchouchouparis" },
            { type: "twitter", url: "https://www.instagram.com/restaurant_chouchou_paris/?igsh=MXdlbWxsYm9iYzI5dA%3D%3D&utm_source=qr#" }
        ],
        lienMaps: "https://www.google.com/maps/place/Chouchou/@48.8599744,2.3487234,17z/data=!3m1!4b1!4m6!3m5!1s0x47e66f92a9e30c1f:0xa168c03346f62a0a!8m2!3d48.8599744!4d2.3487234!16s%2Fg%2F11fnwdtrzh?entry=ttu&g_ep=EgoyMDI1MTAwNy4wIKXMDSoASAFQAw%3D%3D",
        telephone: "+33 14*****03"
    },
    {
        id: "4",
        nom: "La Scène par Stéphanie Le Quellec",
        adresse: "32 Av. Matignon, 75008 Paris",
        ville: "Paris",
        pays: "France",
        siteWeb: "https://www.la-scene.paris/",
        emailsDetectes: ["contact@la-scene.paris"],
        nombrePagesContact: 2,
        reseauxSociaux: [
            { type: "facebook", url:"https://www.facebook.com/lasceneparstephanielequellec"}
        ],
        lienMaps: "https://www.google.com/maps/place/La+Sc%C3%A8ne+par+St%C3%A9phanie+Le+Quellec/@48.8720634,2.3145637,17z/data=!3m1!4b1!4m6!3m5!1s0x47e66f8ebe4bcd17:0x5a53b697014b80df!8m2!3d48.8720634!4d2.3145637!16s%2Fg%2F11h41xmfzy?entry=ttu&g_ep=EgoyMDI1MTAwNy4wIKXMDSoASAFQAw%3D%3D",
        telephone: "+33 14*****61"
    },
    {
        id: "5",
        nom: "Le Colimaçon marais",
        adresse: "44 Rue Vieille du Temple, 75004 Paris",
        ville: "Paris",
        pays: "France",
        siteWeb: "https://le-colimacon.fr/",
        emailsDetectes: ["info@restaurantlemarais.com"],
        nombrePagesContact: 1,
        reseauxSociaux: [
            { type: "facebook", url: "https://www.facebook.com/lecolimaconmarais" },
        ],
        lienMaps: "https://www.google.com/maps/place/Le+Colima%C3%A7on+marais/@48.8580009,2.3579904,16z/data=!3m1!4b1!4m6!3m5!1s0x47e66e02fb1790d3:0x2c3aa6eb209360fb!8m2!3d48.8580009!4d2.3579904!16s%2Fg%2F1tqnky4m?entry=ttu&g_ep=EgoyMDI1MTAwNy4wIKXMDSoASAFQAw%3D%3D",
        telephone: "+33 14*****01"
    },
    {
        id: "6",
        nom: "ASPIC",
        adresse: "24 Rue Louise-Émilie de la Tour d'Auvergne, 75009 Paris",
        ville: "Paris",
        pays: "France",
        siteWeb: "http://www.aspic-restaurant.fr/",
        emailsDetectes: ["contact@aspic-restaurant.fr"],
        nombrePagesContact: 1,
        reseauxSociaux: [
            {type: "facebook", url: "https://www.facebook.com/aspicparis" }
        ],
        lienMaps: "https://www.google.com/maps/place/ASPIC/@48.8791961,2.3437259,16z/data=!3m1!4b1!4m6!3m5!1s0x47e66e41a98517e3:0x43511b4f98f55266!8m2!3d48.8791961!4d2.3437259!16s%2Fg%2F11bxgz03_r?entry=ttu&g_ep=EgoyMDI1MTAwNy4wIKXMDSoASAFQAw%3D%3D",
        telephone: "+33 98*****98"
    },
    {
        id: "7",
        nom: "Restaurant H",
        adresse: "13 Rue Jean Beausire, 75004 Paris",
        ville: "Paris",
        pays: "France",
        siteWeb: "https://lejardinsecret-paris.com",
        emailsDetectes: ["contact@restauranth.com"],
        nombrePagesContact: 1,
        reseauxSociaux: [],
        lienMaps: "https://www.google.com/maps/place/Restaurant+H/@48.8545233,2.368052,17z/data=!3m1!4b1!4m6!3m5!1s0x47e672001579e543:0x6840c63de8dddf45!8m2!3d48.8545233!4d2.368052!16s%2Fg%2F11cjp74jst?entry=ttu&g_ep=EgoyMDI1MTAwNy4wIKXMDSoASAFQAw%3D%3D",
        telephone: "+33 14*****96"
    },
    {
        id: "8",
        nom: "Epicure",
        adresse: "112 Rue du Faubourg Saint-Honoré, 75008 Paris",
        ville: "Paris",
        pays: "France",
        siteWeb: "https://www.oetkerhotels.com",
        emailsDetectes: ["reservations.lebristolparis@oetkercollection.com"],
        nombrePagesContact: 1,
        reseauxSociaux: [
            { type: "facebook", url: "https://www.facebook.com/lebristolparis/" }
        ],
        lienMaps: "https://www.google.com/maps/place/Epicure/@48.8717373,2.3148528,16z/data=!3m1!5s0x47e66fced51dd481:0x72d5c121065c4c95!4m7!3m6!1s0x47e66feaaa07e555:0xd52e77609ee2730c!8m2!3d48.8717373!4d2.3148528!10e1!16s%2Fg%2F1hc1y7l4w?entry=ttu&g_ep=EgoyMDI1MTAwNy4wIKXMDSoASAFQAw%3D%3D",
        telephone: "+33 14*****43"
    },
];

export function MapsSearch() {
    const [formData, setFormData] = useState<SearchFormData>({
        activity: 'Restaurant',
        city: 'Paris',
        country: 'France'
    })

    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchError, setSearchError] = useState<string | null>(null)
    const [currentSearchQuery, setCurrentSearchQuery] = useState<string | null>(null)
    const [isFirstLoad, setIsFirstLoad] = useState(true)

    // Afficher les données par défaut au chargement
    useEffect(() => {
        setSearchResults(DEFAULT_RESULTS)
        setCurrentSearchQuery('Restaurants à Paris')
        console.log('🎯 Données de démonstration chargées')
        
        // Marquer que le premier chargement est terminé
        const timer = setTimeout(() => {
            setIsFirstLoad(false)
        }, 1000)
        
        return () => clearTimeout(timer)
    }, [])

    const handleInputChange = (field: keyof SearchFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const performSearch = async (isUserSearch: boolean = false) => {
        if (!formData.activity.trim() || !formData.city.trim() || !formData.country.trim()) {
            toast.error('Veuillez remplir tous les champs')
            return
        }

        setIsLoading(true)
        setSearchError(null)

        try {
            const query = `${formData.activity} ${formData.city}, ${formData.country}`
            console.log('🔍 Recherche avec query:', query)
            
            // Si c'est la recherche par défaut (premier chargement), on utilise les données de démo
            if (!isUserSearch && isFirstLoad) {
                console.log('🔄 Utilisation des données de démonstration')
                setSearchResults(DEFAULT_RESULTS)
                setCurrentSearchQuery('Restaurants à Paris')
                toast.success(`${DEFAULT_RESULTS.length} établissements trouvés`)
                return
            }
            
            // Sinon, on appelle l'API pour une recherche réelle
            const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
            
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || `Erreur HTTP: ${response.status}`)
            }
            
            const data = await response.json()
            console.log('✅ Résultats API:', data.results)
            
            // Transformer les données de l'API vers le format attendu
            const formattedResults: SearchResult[] = data.results.map((result: any) => ({
                id: result.id || result.placeId,
                nom: result.nom,
                adresse: result.adresse,
                ville: result.ville,
                pays: result.pays,
                siteWeb: result.siteWeb || result.website,
                emailsDetectes: [], // Toujours vide comme demandé
                nombrePagesContact: 0,
                reseauxSociaux: [],
                lienMaps: result.lienMaps,
                telephone: result.telephone,
                note: result.note || result.rating,
                nombreAvis: result.nombreAvis || result.user_ratings_total,
                ouvertMaintenant: result.ouvertMaintenant || result.opening_hours?.open_now
            }))

            setSearchResults(formattedResults)
            setCurrentSearchQuery(query)
            
            toast.success(`${formattedResults.length} établissements trouvés`)
            
        } catch (error: any) {
            console.error('💥 Erreur de recherche:', error)
            const errorMessage = error.message || 'Échec de la recherche'
            setSearchError(errorMessage)
            
            // En cas d'erreur, on garde les données de démonstration pour la première recherche utilisateur
            if (isUserSearch) {
                setSearchResults([])
                setCurrentSearchQuery(null)
                
                // Messages d'erreur plus spécifiques
                if (errorMessage.includes('API_KEY') || errorMessage.includes('clé')) {
                    toast.error('Erreur de configuration API')
                } else if (errorMessage.includes('quota')) {
                    toast.error('Quota API dépassé')
                } else {
                    toast.error('Erreur lors de la recherche')
                }
            }
        } finally {
            setIsLoading(false)
            // Après la première recherche utilisateur, on n'est plus en "first load"
            if (isUserSearch) {
                setIsFirstLoad(false)
            }
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        performSearch(true) // true = recherche utilisateur
    }

    return (
        <div className="flex flex-col items-center w-full space-y-8">
            
            {/* Formulaire de recherche */}
            {/* Formulaire de recherche */}
<form onSubmit={handleSubmit} className="w-full max-w-6xl">
    <div className="p-2">
        <div className="flex flex-col space-y-6">
            {/* Ligne des inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Activité */}
                <div className="space-y-2">
                    <label className="hidden md:flex items-center gap-2 text-sm font-medium text-white">
                        <Building className="h-4 w-4" />
                        Type d'activité
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={formData.activity}
                            onChange={(e) => handleInputChange('activity', e.target.value)}
                            placeholder="Ex: Restaurant, Hôtel, Salon..."
                            className="w-full pl-4 pr-4 py-3 text-gray-700 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base font-medium hover:bg-white"
                        />
                    </div>
                </div>

                {/* Ville */}
                <div className="space-y-2">
                    <label className="hidden md:flex items-center gap-2 text-sm font-medium text-white">
                        <MapPin className="h-4 w-4" />
                        Ville
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            placeholder="Ex: Paris, Lyon, Marseille..."
                            className="w-full pl-4 pr-4 py-3 text-gray-700 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base font-medium hover:bg-white"
                        />
                    </div>
                </div>

                {/* Pays */}
                <div className="space-y-2">
                    <label className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-200">
                        <Globe className="h-4 w-4" />
                        Pays
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={formData.country}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                            placeholder="Ex: France, Belgique, Suisse..."
                            className="w-full pl-4 pr-4 py-3 text-gray-700 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base font-medium hover:bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Bouton de recherche */}
            <div className="flex justify-center ">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full md:w-2xl cursor-pointer bg-gradient-to-r  from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 h-12 md:h-14 flex items-center justify-center gap-2 md:gap-3 font-semibold text-base md:text-lg group"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                            <span>Recherche...</span>
                        </>
                    ) : (
                        <>
                            <Search className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:scale-110" />
                            <span>Lancer la recherche</span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    </div>
</form>

            {/* Résultats */}
            <div className="w-full max-w-7xl">
                <SearchResultsTable
                    results={searchResults}
                    isLoading={isLoading}
                    error={searchError}
                    searchQuery={currentSearchQuery}
                />
            </div>
        </div>
    )
}