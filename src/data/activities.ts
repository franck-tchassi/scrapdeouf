// data/activities.ts
export interface Activity {
    name: string;
    category: string;
    keywords: string[];
  }
  
  export const activities: Activity[] = [
    // Restauration - Restaurants
    {
      name: "Restaurant français",
      category: "Restauration",
      keywords: ["restaurant", "français", "gastronomique", "cuisine française", "bistrot", "brasserie", "resto", "diner", "repas"]
    },
    {
      name: "Restaurant italien",
      category: "Restauration",
      keywords: ["restaurant", "italien", "pizza", "pasta", "trattoria", "ristorante", "pizzeria", "spaghetti", "lasagne"]
    },
    {
      name: "Restaurant asiatique",
      category: "Restauration",
      keywords: ["restaurant", "asiatique", "chinois", "japonais", "sushi", "thaï", "vietnamien", "wok", "riz cantonais", "nems"]
    },
    {
      name: "Restaurant indien",
      category: "Restauration",
      keywords: ["restaurant", "indien", "curry", "tandoori", "naan", "biriyani", "pakora", "samosa"]
    },
    {
      name: "Restaurant libanais",
      category: "Restauration",
      keywords: ["restaurant", "libanais", "mezze", "chawarma", "falafel", "houmous", "taboulé"]
    },
    {
      name: "Restaurant mexicain",
      category: "Restauration",
      keywords: ["restaurant", "mexicain", "tacos", "burrito", "fajitas", "guacamole", "quesadilla"]
    },
    {
      name: "Restaurant végétarien",
      category: "Restauration",
      keywords: ["restaurant", "végétarien", "vegan", "sans viande", "bio", "healthy", "salade"]
    },
  
    // Restauration - Fast-food & Snacks
    {
      name: "Fast-food",
      category: "Restauration",
      keywords: ["fast-food", "burger", "frites", "sandwich", "restauration rapide", "mcdo", "kfc", "quick"]
    },
    {
      name: "Boulangerie",
      category: "Restauration",
      keywords: ["boulangerie", "boulanger", "pain", "pâtisserie", "viennoiserie", "sandwich", "croissant", "baguette"]
    },
    {
      name: "Café",
      category: "Restauration",
      keywords: ["café", "coffee", "thé", "pâtisserie", "salon de thé", "petit-déjeuner", "espresso", "cappuccino"]
    },
    {
      name: "Crêperie",
      category: "Restauration",
      keywords: ["crêperie", "crêpe", "galette", "breton", "sarrasin", "caramel", "chocolat"]
    },
    {
      name: "Pâtisserie",
      category: "Restauration",
      keywords: ["pâtisserie", "gâteau", "dessert", "chocolatier", "macaron", "éclair", "tarte"]
    },
    {
      name: "Glacier",
      category: "Restauration",
      keywords: ["glacier", "glace", "sorbet", "cornet", "sundae", "milkshake"]
    },
    {
      name: "Charcuterie",
      category: "Restauration",
      keywords: ["charcuterie", "charcuter", "traiteur", "jambon", "saucisson", "pâté", "rillettes"]
    },
    {
      name: "Fromagerie",
      category: "Restauration",
      keywords: ["fromagerie", "fromage", "cheese", "affineur", "lait", "fermier"]
    },
  
    // Hébergement
    {
      name: "Hôtel",
      category: "Hébergement",
      keywords: ["hôtel", "hébergement", "chambre", "réception", "room service", "hotel", "reservation"]
    },
    {
      name: "Hôtel de luxe",
      category: "Hébergement",
      keywords: ["hôtel", "luxe", "5 étoiles", "spa", "concierge", "suite", "palace", "premium"]
    },
    {
      name: "Auberge",
      category: "Hébergement",
      keywords: ["auberge", "chambre d'hôtes", "bed and breakfast", "gîte", "campagne", "authentique"]
    },
    {
      name: "Motel",
      category: "Hébergement",
      keywords: ["motel", "étape", "autoroute", "économique", "nuitée"]
    },
    {
      name: "Auberge de jeunesse",
      category: "Hébergement",
      keywords: ["auberge de jeunesse", "hostel", "backpacker", "dortoir", "voyageur", "budget"]
    },
    {
      name: "Location vacances",
      category: "Hébergement",
      keywords: ["location", "vacances", "appartement", "maison", "gîte", "airbnb", "location saisonnière"]
    },
    {
      name: "Camping",
      category: "Hébergement",
      keywords: ["camping", "caravaning", "mobile home", "tente", "plein air", "nature"]
    },
  
    // Loisirs & Culture
    {
      name: "Musée",
      category: "Culture",
      keywords: ["musée", "art", "exposition", "culture", "galerie", "histoire", "peinture", "sculpture"]
    },
    {
      name: "Cinéma",
      category: "Loisirs",
      keywords: ["cinéma", "film", "séance", "blockbuster", "salle obscure", "movie", "projection", "popcorn"]
    },
    {
      name: "Théâtre",
      category: "Culture",
      keywords: ["théâtre", "spectacle", "pièce", "comédie", "drame", "acteur", "scène", "costume"]
    },
    {
      name: "Opéra",
      category: "Culture",
      keywords: ["opéra", "lyrique", "ballet", "concert", "symphonie", "orchestre"]
    },
    {
      name: "Parc",
      category: "Loisirs",
      keywords: ["parc", "jardin", "espace vert", "promenade", "aire de jeux", "verdure", "pelouse"]
    },
    {
      name: "Parc d'attractions",
      category: "Loisirs",
      keywords: ["parc d'attractions", "manèges", "montagnes russes", "loisirs", "famille", "divertissement"]
    },
    {
      name: "Zoo",
      category: "Loisirs",
      keywords: ["zoo", "animalier", "safari", "animaux", "conservation", "faune"]
    },
    {
      name: "Aquarium",
      category: "Loisirs",
      keywords: ["aquarium", "poissons", "marin", "océan", "bassin", "requin"]
    },
    {
      name: "Bibliothèque",
      category: "Culture",
      keywords: ["bibliothèque", "livre", "étude", "lecture", "document", "médiathèque", "prêt"]
    },
    {
      name: "Ludothèque",
      category: "Loisirs",
      keywords: ["ludothèque", "jeux", "jouets", "enfant", "famille", "divertissement"]
    },
  
    // Shopping
    {
      name: "Centre commercial",
      category: "Shopping",
      keywords: ["centre commercial", "shopping", "magasins", "boutiques", "galerie marchande", "mall", "emplettes"]
    },
    {
      name: "Grande surface",
      category: "Shopping",
      keywords: ["grande surface", "hypermarché", "supermarché", "courses", "alimentation", "épicerie", "carrefour", "auchan"]
    },
    {
      name: "Magasin de vêtements",
      category: "Shopping",
      keywords: ["magasin de vêtements", "prêt-à-porter", "fashion", "mode", "boutique", "habillement", "vetement"]
    },
    {
      name: "Magasin de chaussures",
      category: "Shopping",
      keywords: ["magasin de chaussures", "chaussure", "basket", "souliers", "talons", "bottes"]
    },
    {
      name: "Bijouterie",
      category: "Shopping",
      keywords: ["bijouterie", "bijoux", "or", "argent", "diamant", "collier", "bague", "bracelet"]
    },
    {
      name: "Parfumerie",
      category: "Shopping",
      keywords: ["parfumerie", "parfum", "cosmétique", "beauté", "maquillage", "soin"]
    },
    {
      name: "Librairie",
      category: "Shopping",
      keywords: ["librairie", "livre", "papeterie", "roman", "bd", "manga", "presse"]
    },
    {
      name: "Magasin de sport",
      category: "Shopping",
      keywords: ["magasin de sport", "équipement sportif", "chaussures de sport", "tenue", "décathlon"]
    },
    {
      name: "Joaillerie",
      category: "Shopping",
      keywords: ["joaillerie", "bijoux de luxe", "haute joaillerie", "pierre précieuse", "creation"]
    },
    {
      name: "Fleuriste",
      category: "Shopping",
      keywords: ["fleuriste", "fleurs", "bouquet", "composition", "plantes", "horticulture"]
    },
  
    // Services
    {
      name: "Banque",
      category: "Services",
      keywords: ["banque", "guichet", "retrait", "dépôt", "compte", "crédit", "finance", "argent"]
    },
    {
      name: "Pharmacie",
      category: "Santé",
      keywords: ["pharmacie", "médicament", "ordonnance", "parapharmacie", "santé", "soin", "prescription"]
    },
    {
      name: "Hôpital",
      category: "Santé",
      keywords: ["hôpital", "urgence", "médecin", "soins", "clinique", "santé", "maladie"]
    },
    {
      name: "Clinique",
      category: "Santé",
      keywords: ["clinique", "médecin", "spécialiste", "consultation", "soin", "santé"]
    },
    {
      name: "Station essence",
      category: "Transport",
      keywords: ["station essence", "carburant", "diesel", "sans plomb", "station service", "pompiste", "essence"]
    },
    {
      name: "Supermarket",
      category: "Shopping",
      keywords: ["supermarket", "supermarché", "courses", "alimentation", "épicerie", "nourriture", "produits"]
    },
    {
      name: "Laverie",
      category: "Services",
      keywords: ["laverie", "lavomatic", "lessive", "nettoyage", "linge", "séchoir"]
    },
    {
      name: "Coiffeur",
      category: "Services",
      keywords: ["coiffeur", "salon", "coupe", "coiffure", "beauté", "styliste", "coiffure homme", "coiffure femme"]
    },
    {
      name: "Institut de beauté",
      category: "Services",
      keywords: ["institut de beauté", "esthétique", "soin visage", "massage", "manucure", "pédicure"]
    },
    {
      name: "Garage auto",
      category: "Services",
      keywords: ["garage", "mécanique", "réparation", "voiture", "entretien", "vidange", "pneu", "carrosserie"]
    },
    {
      name: "Poste",
      category: "Services",
      keywords: ["poste", "courrier", "colis", "timbre", "lettre", "envoi", "recommandé"]
    },
    {
      name: "Agence immobilière",
      category: "Services",
      keywords: ["agence immobilière", "immobilier", "appartement", "maison", "location", "vente", "bien"]
    },
    {
      name: "Notaire",
      category: "Services",
      keywords: ["notaire", "acte", "succession", "achat", "vente", "immobilier", "juridique"]
    },
    {
      name: "Avocat",
      category: "Services",
      keywords: ["avocat", "droit", "justice", "conseil", "procès", "juridique"]
    },
  
    // Transport
    {
      name: "Aéroport",
      category: "Transport",
      keywords: ["aéroport", "vol", "compagnie aérienne", "terminal", "départ", "arrivée", "avion"]
    },
    {
      name: "Gare",
      category: "Transport",
      keywords: ["gare", "train", "SNCF", "TER", "TGV", "quai", "rail", "voyage"]
    },
    {
      name: "Gare routière",
      category: "Transport",
      keywords: ["gare routière", "bus", "autocar", "cars", "ligne", "transport"]
    },
    {
      name: "Station métro",
      category: "Transport",
      keywords: ["métro", "station", "RATP", "ligne", "correspondance", "souterrain"]
    },
    {
      name: "Station tramway",
      category: "Transport",
      keywords: ["tramway", "tram", "station", "ligne", "transport urbain"]
    },
    {
      name: "Location de voiture",
      category: "Transport",
      keywords: ["location de voiture", "voiture", "rental", "agence", "automobile", "citroen", "renault", "peugeot"]
    },
    {
      name: "Taxi",
      category: "Transport",
      keywords: ["taxi", "course", "chauffeur", "transport", "véhicule", "depot"]
    },
    {
      name: "Parking",
      category: "Transport",
      keywords: ["parking", "stationnement", "voiture", "garage", "souterrain", "payant"]
    },
  
    // Sport & Fitness
    {
      name: "Salle de sport",
      category: "Sport",
      keywords: ["salle de sport", "fitness", "gym", "musculation", "cardio", "entraînement", "forme"]
    },
    {
      name: "Piscine",
      category: "Sport",
      keywords: ["piscine", "natation", "bassin", "nager", "aquatique", "crawl", "brasse"]
    },
    {
      name: "Stade",
      category: "Sport",
      keywords: ["stade", "football", "rugby", "athlétisme", "match", "sport", "terrain"]
    },
    {
      name: "Court de tennis",
      category: "Sport",
      keywords: ["court de tennis", "tennis", "raquette", "balle", "tournoi", "clay", "hard"]
    },
    {
      name: "Terrain de golf",
      category: "Sport",
      keywords: ["terrain de golf", "golf", "club", "parcours", "green", "trou", "drive"]
    },
    {
      name: "Salle d'escalade",
      category: "Sport",
      keywords: ["salle d'escalade", "escalade", "bloc", "mur", "grimpe", "varappe"]
    },
    {
      name: "Bowling",
      category: "Sport",
      keywords: ["bowling", "quilles", "boules", "piste", "loisir", "famille"]
    },
    {
      name: "Patinoire",
      category: "Sport",
      keywords: ["patinoire", "glace", "patin", "hockey", "hiver", "sport glace"]
    },
  
    // Divertissement nocturne
    {
      name: "Bar",
      category: "Divertissement",
      keywords: ["bar", "pub", "cocktail", "bière", "vin", "soirée", "alcool", "boisson"]
    },
    {
      name: "Boîte de nuit",
      category: "Divertissement",
      keywords: ["boîte de nuit", "club", "discothèque", "DJ", "danse", "musique", "fête", "nightclub"]
    },
    {
      name: "Casino",
      category: "Divertissement",
      keywords: ["casino", "jeu", "poker", "machine à sous", "blackjack", "roulette", "gambling"]
    },
    {
      name: "Salle de concert",
      category: "Divertissement",
      keywords: ["salle de concert", "concert", "musique", "groupe", "artiste", "live", "spectacle"]
    },
    {
      name: "Karaoké",
      category: "Divertissement",
      keywords: ["karaoké", "chanson", "micro", "chant", "loisir", "divertissement"]
    },
  
    // Éducation
    {
      name: "Université",
      category: "Éducation",
      keywords: ["université", "campus", "faculté", "étudiant", "amphithéâtre", "cours", "diplôme"]
    },
    {
      name: "École",
      category: "Éducation",
      keywords: ["école", "collège", "lycée", "primaire", "cours", "élève", "professeur"]
    },
    {
      name: "École maternelle",
      category: "Éducation",
      keywords: ["école maternelle", "maternelle", "enfant", "petite section", "jardin d'enfants"]
    },
    {
      name: "Centre de formation",
      category: "Éducation",
      keywords: ["centre de formation", "formation", "professionnel", "stage", "compétence", "métier"]
    },
  
    // Autres
    {
      name: "Mairie",
      category: "Administration",
      keywords: ["mairie", "municipalité", "administration", "état civil", "carte d'identité", "passeport"]
    },
    {
      name: "Préfecture",
      category: "Administration",
      keywords: ["préfecture", "administration", "titre de séjour", "permis", "département"]
    },
    {
      name: "Commissariat",
      category: "Sécurité",
      keywords: ["commissariat", "police", "gendarmerie", "sécurité", "plainte", "agent"]
    },
    {
      name: "Pompier",
      category: "Sécurité",
      keywords: ["pompier", "caserne", "incendie", "secours", "urgence", "sapeur"]
    },
    {
      name: "Église",
      category: "Religion",
      keywords: ["église", "catholique", "messe", "prière", "culte", "religion"]
    },
    {
      name: "Mosquée",
      category: "Religion",
      keywords: ["mosquée", "islam", "prière", "culte", "minaret", "musulman"]
    },
    {
      name: "Temple",
      category: "Religion",
      keywords: ["temple", "bouddhiste", "protestant", "culte", "religion", "prière"]
    },
    {
      name: "Cimetière",
      category: "Services",
      keywords: ["cimetière", "sépulture", "tombe", "funéraire", "défunt", "mémoire"]
    },
    {
      name: "Animalerie",
      category: "Services",
      keywords: ["animalerie", "animal", "chien", "chat", "nourriture", "accessoire", "vétérinaire"]
    },
    {
      name: "Quincaillerie",
      category: "Shopping",
      keywords: ["quincaillerie", "outil", "bricolage", "matériel", "vis", "clou", "marteau"]
    },
    {
      name: "Magasin de bricolage",
      category: "Shopping",
      keywords: ["magasin de bricolage", "bricolage", "outillage", "matériaux", "peinture", "leroy merlin", "castorama"]
    },
    {
      name: "Magasin de décoration",
      category: "Shopping",
      keywords: ["magasin de décoration", "décoration", "ameublement", "meuble", "intérieur", "maison"]
    },
    {
      name: "Magasin d'électroménager",
      category: "Shopping",
      keywords: ["magasin d'électroménager", "électroménager", "appareil", "cuisine", "frigo", "lave-linge", "darty", "boulanger"]
    },
    {
      name: "Magasin High-Tech",
      category: "Shopping",
      keywords: ["magasin high-tech", "électronique", "informatique", "téléphone", "ordinateur", "tablette", "fnac"]
    }
  ];
  
  // Liste plate pour la recherche rapide
  export const allActivities = activities.flatMap(activity => 
    [activity.name, ...activity.keywords]
  ).filter((value, index, self) => self.indexOf(value) === index);
  
  // Activités populaires (pour les suggestions)
  export const popularActivities = [
    "Restaurant français",
    "Restaurant italien", 
    "Fast-food",
    "Café",
    "Hôtel",
    "Musée",
    "Cinéma",
    "Parc",
    "Centre commercial",
    "Banque",
    "Pharmacie",
    "Supermarket",
    "Aéroport",
    "Gare",
    "Salle de sport",
    "Bar"
  ];