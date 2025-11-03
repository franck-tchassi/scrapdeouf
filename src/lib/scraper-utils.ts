import { URL } from 'url';
import robotsParser from 'robots-parser';
import { PROXY_LIST, ProxyConfig } from '@/lib/proxies'; // Importation de la liste de proxies

// Liste de User-Agents courants pour simuler différents navigateurs
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/120.0.0.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
];

/**
 * Retourne un User-Agent aléatoire de la liste.
 */
export function getRandomUserAgent(): string {
  const randomIndex = Math.floor(Math.random() * USER_AGENTS.length);
  return USER_AGENTS[randomIndex];
}

/**
 * Retourne un délai aléatoire en millisecondes entre min et max.
 * @param min Le délai minimum en ms.
 * @param max Le délai maximum en ms.
 */
export function getRandomDelay(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Vérifie si une URL est autorisée à être scrapée selon le fichier robots.txt du site.
 * @param url L'URL à vérifier.
 * @param userAgent Le User-Agent à utiliser pour la vérification.
 * @returns True si l'URL est autorisée, False sinon.
 */
export async function checkRobotsTxt(url: string, userAgent: string): Promise<boolean> {
  try {
    const parsedUrl = new URL(url);
    const robotsTxtUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}/robots.txt`;
    
    console.log(`Checking robots.txt for: ${robotsTxtUrl}`);
    const response = await fetch(robotsTxtUrl);
    
    let robotsTxtContent = '';
    if (response.ok) {
      robotsTxtContent = await response.text();
    } else {
      console.warn(`No robots.txt found or error fetching for ${parsedUrl.hostname}. Assuming full access.`);
      return true; // Si pas de robots.txt, on assume que tout est permis
    }

    const robots = robotsParser(robotsTxtUrl, robotsTxtContent);
    const isAllowed = robots.isAllowed(url, userAgent) ?? false;
    console.log(`URL ${url} is ${isAllowed ? 'allowed' : 'DISALLOWED'} by robots.txt for User-Agent: ${userAgent}`);
    return isAllowed;

  } catch (error) {
    console.error(`Error checking robots.txt for ${url}:`, error);
    return true; // En cas d'erreur, on assume que c'est autorisé pour ne pas bloquer le scraping
  }
}

/**
 * Récupère un objet de configuration de proxy aléatoire de la liste.
 * @returns Un objet ProxyConfig ou null si aucun proxy n'est configuré.
 */
export function getProxy(): ProxyConfig | null {
  if (PROXY_LIST.length === 0) {
    console.warn("No proxies configured in PROXY_LIST. All requests will originate from the server's IP.");
    return null;
  }

  const randomIndex = Math.floor(Math.random() * PROXY_LIST.length);
  const selectedProxy: ProxyConfig = PROXY_LIST[randomIndex];

  console.log(`Using proxy: ${selectedProxy.host}:${selectedProxy.port}`);
  return selectedProxy; // Retourne l'objet complet
}