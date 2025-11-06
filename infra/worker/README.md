# Déployer le worker Playwright (scraping)

Ce dossier contient des instructions et des fichiers utiles pour déployer le worker qui exécute la logique de scraping (Playwright/Chromium) hors de Vercel.

Pourquoi ?
- Les fonctions serverless (Vercel) ne disposent pas toujours des binaires Chromium nécessaires à Playwright et ont des limites d'exécution — exécuter Playwright dans Vercel peut provoquer des erreurs comme : "Executable doesn't exist...".

Résumé des fichiers
- `../worker.Dockerfile` : Dockerfile basé sur l'image Playwright officielle. Installe les dépendances et démarre le worker.
- `../../docker-compose.worker.yml` : compose pour lancer un Redis et le worker localement.
- `.dockerignore` : ignore fichiers inutiles pour le build.

Variables d'environnement requises
- `DATABASE_URL` : chaîne de connexion MongoDB
- `REDIS_URL` : URL Redis (ex: `redis://redis:6379` en local)
- `NODE_ENV` : `production`
- Optionnel : `ALLOW_DIRECT_SCRAPE=1` pour autoriser les runs directs (non recommandé sur Vercel)

Exécution locale (Docker)

1. Copier un fichier `.env` ou exporter `DATABASE_URL` localement.
2. Démarrer :

```bash
docker compose -f docker-compose.worker.yml up --build
```

Le service `worker` va builder l'image (installe npm, Playwright binaire inclus dans l'image), se connecter à Redis et écouter la queue BullMQ pour traiter les jobs.

Déploiement (Render / Railway / DigitalOcean / autre)

1. Déployer en utilisant le `worker.Dockerfile` comme image Docker.
2. Définir les variables d'environnement dans la plateforme (DATABASE_URL, REDIS_URL, etc.).
3. Procéder au déploiement ; le service lancera le worker et traitera les jobs.

Notes et bonnes pratiques
- Préférez exécuter les jobs de scraping sur un worker dédié plutôt que dans les fonctions serverless.
- Si vous utilisez Playwright Cloud ou un service tiers de navigateur (ex: browserless), adaptez `lib/google-maps-scraper.ts` et `lib/amazon-scraper.ts` pour se connecter à ce service plutôt que d'appeler `chromium.launch()`.
- Si vous voulez compiler les sources TypeScript et exécuter le JS compilé, remplacez la commande de démarrage dans le Dockerfile par le fichier compilé (après `npm run build` si vous ajoutez un script build pour le worker).

Contact / aide
Si vous voulez, je peux :
- Ajouter un `Dockerfile` alternatif qui compile d'abord le code TypeScript puis exécute le JS compilé.
- Générer des instructions spécifiques pour Render/Railway (exemples d'options), ou un `systemd` unit pour une VM.
