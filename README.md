# Scrapdeouf — Plateforme de scraping et d'enrichissement

Scrapdeouf est une application Next.js complète pour l'extraction et l'enrichissement de données web (scraping), construite autour de Puppeteer / Playwright, Prisma (MongoDB), un système de proxies, et une file de tâches (BullMQ). Elle inclut une UI pour gérer les extractions, l'intégration Stripe pour la monétisation, et des webhooks pour synchroniser les abonnements.

Ce README couvre l'installation locale, la configuration des variables d'environnement, l'architecture principale et des conseils opérationnels (sécurité, conformité robots.txt, déploiement).

## Table des matières
- Présentation
- Prérequis
- Installation et développement
- Scripts utiles
- Variables d'environnement importantes
- Base de données (Prisma + MongoDB)
- Proxies
- Scraping (Puppeteer / Playwright)
- Webhooks et Stripe
- Déploiement
- Sécurité et conformité
- Débogage & FAQ
- Contribution

## Présentation

Fonctionnalités clés :
- Lancement, suivi et gestion d'extractions (templates : Google Maps, Amazon, TripAdvisor, Airbnb, eBay)
- Enrichissement d'emails et de numéros (site + réseaux sociaux)
- Gestion des utilisateurs et abonnements (Stripe)
- Système de crédits et quotas par plan
- File de tâches et scheduling (BullMQ / Redis)
- Support des proxies configurables

La logique principale se trouve dans `src/lib` et les routes API sont sous `src/app/api/**`.

## Prérequis

- Node.js >= 18
- npm (ou yarn / pnpm)
- MongoDB accessible (URI dans `DATABASE_URL`)
- Redis si vous utilisez BullMQ (optionnel mais recommandé pour la mise en production)
- (Optionnel) accès à des proxies pour le scraping

## Installation et développement

1. Installer les dépendances

```cmd
npm install
```

2. Générer le client Prisma (nécessaire avant `dev` de ce repo)

```cmd
npm run prisma -- generate
```

3. Démarrer en mode développement

```cmd
npm run dev
```

Note : le script `dev` exécute `prisma generate` puis `next dev --turbopack` (voir `package.json`).

Si vous voulez lancer le worker node (utilisé pour du traitement côté serveur) :

```cmd
npm run dev:worker
```

## Scripts utiles

- `npm run dev` — développement (Next.js + turbopack)
- `npm run build` — construction (production)
- `npm run start` — démarrer en production
- `npm run dev:worker` — lancer le worker Node en mode développement

## Variables d'environnement importantes

Créez un fichier `.env` à la racine et définissez au minimum :

- `DATABASE_URL` — URI MongoDB
- `REDIS_URL` — URI Redis (si utilisé)
- `STRIPE_SECRET_KEY` — clé API Stripe
- `STRIPE_WEBHOOK_SECRET` — secret webhook Stripe
- `WHATSAPP_VERIFY_TOKEN` — token de vérification webhook WhatsApp
- `NEXTAUTH_URL` — URL publique de l'app (used by next-auth)
- `GOOGLE_API_KEY` — (optionnel) clé Google si nécessaire pour certains scrapers

Exemple (.env.local) :

```text
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/scrapdeouf?retryWrites=true&w=majority"
REDIS_URL="redis://localhost:6379"
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
WHATSAPP_VERIFY_TOKEN=your_whatsapp_token
NEXTAUTH_URL=http://localhost:3000
```

Attention : ne jamais committer vos clés/API dans le dépôt.

## Base de données (Prisma + MongoDB)

- Le schéma Prisma est dans `prisma/schema.prisma` (MongoDB provider).
- Pour générer le client Prisma : `npx prisma generate`.
- Pour appliquer des migrations (si vous migrez un modèle relationnel) : Prisma + MongoDB nécessite des approches spécifiques — ici nous utilisons surtout le client généré.

Exemples :

```cmd
npx prisma generate
```

## Proxies

Les proxies sont définis dans `src/lib/proxies.ts`. L'application utilise ces configurations pour initialiser Puppeteer (ou Playwright) et pour l'authentification sur le proxy si nécessaire.

- `ProxyConfig` : { host, port, username, password }
- `getProxy()` dans `src/lib/scraper-utils.ts` retourne aléatoirement un proxy configuré.

Assurez-vous que la liste `PROXY_LIST` contient des proxies valides en production (ne pas laisser des credentials en clair dans le repo public).

## Scraping (Puppeteer / Playwright)

- L'app utilise Puppeteer (et certains outils Playwright) pour exécuter le scraping headless.
- Les routes API de scraping sont sous `src/app/api/scrape-*`.
- Pour la robustesse :
	- Respecter `robots.txt` (le code vérifie automatiquement via `checkRobotsTxt`)
	- Introduire des délais aléatoires (`getRandomDelay`) et user-agents aléatoires
	- Utiliser des proxies rotatifs lorsque nécessaire

Conseils :

- Testez localement avec des pages simples avant d'automatiser à grande échelle.
- En production, isolez vos workers (instances séparées) et surveillez la latence et les erreurs 429/403.

## Webhooks et Stripe

- Route webhook Stripe : `src/app/api/stripe/webhook/route.ts` — vérifie la signature et met à jour les abonnements en base.
- Quand un abonnement change, le webhook met à jour `Subscription` et les crédits utilisateur.

Important : configurez `STRIPE_WEBHOOK_SECRET` et le webhook dans votre dashboard Stripe pour pointer vers `/api/stripe/webhook`.

## Sécurité et conformité

- Respecter `robots.txt` est essentiel : le scraper vérifie et abandonne si l'accès est interdit.
- Évitez d'extraire des données personnelles sans consentement — respectez le RGPD et les lois locales.
- Ne commettez jamais des secrets ou proxies credentials dans le dépôt public.

## Débogage & FAQ

- Erreurs TypeScript communes :
	- `Type ... is not a module` — vérifier que les routes exportent bien des handlers (`GET`/`POST`) et que les fichiers ne sont pas vides.
	- Types manquants (ex: `ProxyConfig`) — importer ou définir l'interface dans `src/lib/proxies.ts`.

- Pour tester les webhooks Stripe localement, utilisez `stripe cli` pour forwarder les événements :

```cmd
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Déploiement

- Vous pouvez déployer sur Vercel ou sur tout host supportant Node.js.
- Avant le déploiement :
	- Configurez les variables d'environnement dans votre plateforme
	- Assurez-vous d'avoir un plan pour la gestion des workers (BullMQ + Redis)
	- Si vous utilisez Puppeteer, choisissez une plateforme qui permet l'exécution de Chromium (ou utilisez une image Docker préconfigurée)

## Contribution

Contributions bienvenues. Pour proposer des changements :

1. Fork du repo
2. Créez une branche feature/fix
3. Ouvrez une Pull Request détaillant vos changements

Merci de suivre la convention de commits et d'ajouter des tests pour les modifications critiques.

## Licence

Ajoutez votre licence ici (par ex. MIT) ou conservez les droits réservés selon votre choix.

---

Si vous voulez, je peux :
- générer un `.env.example` avec les variables listées ci-dessus,
- mettre à jour `src/types/ClientExtraction` pour mieux correspondre au schéma Prisma (utile pour éviter les `as any`),
- ou lancer un `npm run build` pour vérifier les erreurs TypeScript et lister les corrections restantes.

Dites-moi ce que vous préférez que je fasse ensuite.
