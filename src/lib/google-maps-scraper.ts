// lib/google-maps-scraper.ts

import { chromium, Browser, Page } from 'playwright';
import { ProxyConfig, PROXY_LIST } from './proxies';
import {
  extractEmailsAdvanced,
  detectSocialNetworks,
  scrapeFacebookForEmails,
  scrapeWebsiteDetails,
} from './web-scraper-utils'; // Import des fonctions utilitaires

// Fonction pour obtenir un proxy aléatoire
export function getRandomProxy(): ProxyConfig | undefined {
  if (PROXY_LIST.length === 0) {
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * PROXY_LIST.length);
  return PROXY_LIST[randomIndex];
}

// Fonction pour lancer un navigateur avec ou sans proxy
export async function launchBrowser(proxyConfig?: ProxyConfig): Promise<Browser> {
  const args = ['--no-sandbox', '--disable-setuid-sandbox'];
  const proxy = proxyConfig ? {
    server: `${proxyConfig.host}:${proxyConfig.port}`,
    username: proxyConfig.username,
    password: proxyConfig.password,
  } : undefined;

  return chromium.launch({
    headless: true,
    args,
    proxy,
  });
}

// Fonction pour scraper les détails d'un établissement (accepte maintenant l'instance du navigateur et les drapeaux d'enrichissement)
export async function scrapeRestaurantDetails(browser: Browser, url: string, enrichEmails: boolean, enrichPhones: boolean, pagesVisitedCounter: { count: number }): Promise<any> {
  let page: Page | undefined;
  
  try {
    page = await browser.newPage(); // Créer une nouvelle page à partir du navigateur existant
    await page.setViewportSize({ width: 1280, height: 800 });
    // CORRECTION : Utiliser addInitScript pour définir le User-Agent
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'userAgent', {
        get: () => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      });
    });

    console.log(`🌐 Navigation vers: ${url}`);
    
    await page.goto(url, { 
      waitUntil: 'networkidle', // Revert to networkidle for potentially better loading of all elements
      timeout: 30000 
    });
    pagesVisitedCounter.count++;

    await page.waitForTimeout(3000); // Délai réduit

    // Gérer les popups
    try {
      const consentButton = await page.$('button:has-text("Tout accepter"), button:has-text("Tout refuser")');
      if (consentButton) {
        await consentButton.click();
        console.log('✅ Popup fermée');
        await page.waitForTimeout(2000); // Délai réduit
      }
    } catch (error) {
      console.log('ℹ️ Pas de popup ou déjà fermée');
    }

    await page.waitForTimeout(2000); // Délai réduit

    const restaurantData: any = await page.evaluate(() => {
      const getTextByXPath = (xpath: string) => {
        try {
          const result = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          );
          return result.singleNodeValue?.textContent?.trim() || '';
        } catch (error) {
          return '';
        }
      };

      const formatWebsite = (websiteText: string) => {
        if (!websiteText) return null; // Retourne null si non disponible
        
        let formatted = websiteText.trim();
        formatted = formatted.replace(/\s+/g, '');
        
        if (formatted.startsWith('http://') || formatted.startsWith('https://')) {
          return formatted;
        }
        
        if (!formatted.includes('.')) {
          return null; // Retourne null si ce n'est pas un domaine valide
        }
        
        const domainParts = formatted.split('.');
        if (domainParts.length === 2) {
          return `https://www.${formatted}`;
        } else if (domainParts.length > 2 && !formatted.startsWith('www.')) {
          return `https://${formatted}`;
        }
        
        return `https://${formatted}`;
      };

      const getWebsiteDomain = (websiteUrl: string | null) => {
        if (!websiteUrl) return null;
        try {
          const url = new URL(websiteUrl);
          return url.hostname.replace(/^www\./, '');
        } catch {
          return null;
        }
      };

      const countPhotos = () => {
        try {
          const photoCountXPath = '/html/body/div[1]/div[3]/div[9]/div[9]/div/div/div[1]/div[2]/div/div[1]/div/div/div[5]/div[1]/div[1]/div/a';
          const photoElement = getTextByXPath(photoCountXPath);
          
          if (photoElement) {
            const photoMatch = photoElement.match(/([\d,\.\s]+)\s*photos?/i);
            if (photoMatch) {
              return parseInt(photoMatch[1].trim().replace(/[\s,.]/g, '')) || 0;
            }
            const numberMatch = photoElement.match(/(\d+)/);
            if (numberMatch) {
              return parseInt(numberMatch[1]) || 0;
            }
            return 0;
          }
          return 0;
        } catch (error) {
          return 0;
        }
      };

      const getPhone = () => {
        const phoneXPaths = [
          '/html/body/div[1]/div[3]/div[9]/div[9]/div/div/div[1]/div[2]/div/div[1]/div/div/div[9]/div[9]/button/div/div[2]/div[1]',
          '//button[contains(@data-item-id, "phone")]//div[contains(@class, "fontBodyMedium")]',
          '//button[contains(@aria-label, "téléphone")]',
        ];

        for (const xpath of phoneXPaths) {
          const phone = getTextByXPath(xpath);
          if (phone && phone.length > 5 && /[\d\s\+\(\)]/.test(phone)) {
            return phone;
          }
        }
        return null;
      };

      const getAddressDetails = (fullAddress: string) => {
        const parts = fullAddress.split(',').map(p => p.trim());
        let city = null;
        let postalCode = null;
        let country = null;

        // Simple heuristic: last part is often country, second to last is city/postal code
        if (parts.length > 0) {
          country = parts[parts.length - 1];
          if (parts.length > 1) {
            const cityPostal = parts[parts.length - 2];
            const postalMatch = cityPostal.match(/(\d{5,})/); // Basic postal code regex
            if (postalMatch) {
              postalCode = postalMatch[1];
              city = cityPostal.replace(postalMatch[0], '').trim();
            } else {
              city = cityPostal;
            }
          }
        }
        return { city, postalCode, country };
      };

      const getAddress = () => {
        const addressXPaths = [
          '/html/body/div[1]/div[3]/div[9]/div[9]/div/div/div[1]/div[2]/div/div[1]/div/div/div[9]/div[3]/button/div/div[2]/div[1]',
          '//button[contains(@data-item-id, "address")]//div[contains(@class, "fontBodyMedium")]',
        ];

        for (const xpath of addressXPaths) {
          const address = getTextByXPath(xpath);
          if (address && address.length > 10) {
            return address;
          }
        }
        return null;
      };

      const getWebsite = () => {
        const websiteXPaths = [
          '/html/body/div[1]/div[3]/div[9]/div[9]/div/div/div[1]/div[2]/div/div[1]/div/div/div[9]/div[8]/a/div/div[2]/div[1]',
          '//a[contains(@data-item-id, "authority")]//div[contains(@class, "fontBodyMedium")]',
        ];

        for (const xpath of websiteXPaths) {
          const website = getTextByXPath(xpath);
          if (website && website.length > 3) {
            return formatWebsite(website);
          }
        }
        return null;
      };

      const name = getTextByXPath('/html/body/div[1]/div[3]/div[9]/div[9]/div/div/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div[1]/div[1]/h1');
      const ratingRaw = getTextByXPath('/html/body/div[1]/div[3]/div[9]/div[9]/div/div/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div[1]/div[2]/div/div[1]/div[2]/span[1]/span[1]');
      const reviewCountRaw = getTextByXPath('/html/body/div[1]/div[3]/div[9]/div[9]/div/div/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div[1]/div[2]/div/div[1]/div[2]/span[2]/span/span');
      const priceRaw = getTextByXPath('/html/body/div[1]/div[3]/div[9]/div[9]/div/div/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div[1]/div[2]/div/div[1]/span/span/span/span[2]/span/span');
      const categoryRaw = getTextByXPath('/html/body/div[1]/div[3]/div[9]/div[9]/div/div/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div[2]/span[1]/span/button');
      
      const rating = ratingRaw ? parseFloat(ratingRaw.replace(',', '.')) : null;
      const reviewCount = reviewCountRaw ? parseInt(reviewCountRaw.replace(/[(),\s]/g, '')) : null;
      const priceLevel = priceRaw ? priceRaw.length : null; // Simple mapping: €, €€, €€€ -> 1, 2, 3
      const category = categoryRaw || null;

      const phoneFull = getPhone();
      const address = getAddress();
      const { city, postalCode, country } = getAddressDetails(address || '');
      const website = getWebsite();
      const websiteDomain = getWebsiteDomain(website);
      const photosCount = countPhotos();
      const googleMapsUrl = window.location.href;

      return {
        id: googleMapsUrl, // Utiliser l'URL comme ID unique
        name: name && !name.includes('Avant d') ? name : 'Non disponible',
        address: address || 'Non disponible',
        city: city || 'Non disponible',
        postalCode: postalCode || 'Non disponible',
        country: country || 'Non disponible',
        rating: rating,
        reviewCount: reviewCount,
        priceLevel: priceLevel,
        phoneFull: phoneFull,
        website: website,
        websiteDomain: websiteDomain,
        emailsDetected: [],
        phonesDetected: [],
        contactPagesCount: 0,
        socialNetworks: [],
        googleMapsUrl: googleMapsUrl,
        photosCount: photosCount,
        category: category, // Ajout de la catégorie
      };
    });

    console.log(`[SCRAPER] Détails initiaux extraits pour ${restaurantData.name}:`, {
      name: restaurantData.name,
      address: restaurantData.address,
      rating: restaurantData.rating,
      reviewCount: restaurantData.reviewCount,
      website: restaurantData.website,
      phoneFull: restaurantData.phoneFull,
      photosCount: restaurantData.photosCount,
      category: restaurantData.category, // Ajout de la catégorie au log
    });

    let allEmails: string[] = [];
    let socialNetworksFromWebsite: { type: string; url: string }[] = [];
    let phonesFromWebsite: string[] = []; // Pour collecter les téléphones du site web

    // SCRAPING DU SITE WEB (si demandé)
    if ((enrichEmails || enrichPhones) && restaurantData.website && restaurantData.website !== 'Non disponible') {
      try {
        console.log(`🌐 Navigation vers le site web pour enrichissement: ${restaurantData.website}`);
        
        // Réutiliser l'instance du navigateur, mais créer une nouvelle page
        const websiteDetails = await scrapeWebsiteDetails(browser, restaurantData.website, enrichEmails, enrichPhones, pagesVisitedCounter);
        allEmails.push(...websiteDetails.emails);
        phonesFromWebsite.push(...websiteDetails.phones);
        socialNetworksFromWebsite.push(...websiteDetails.socialNetworks); // Correction ici

      } catch (error) {
        console.log('❌ Erreur lors de la visite du site web:', error);
      }
    }

    // SCRAPING FACEBOOK POUR EMAILS (si demandé et lien Facebook trouvé)
    if (enrichEmails) { // Scraper Facebook pour les emails uniquement si enrichEmails est vrai
      const facebookSocial = socialNetworksFromWebsite.find(social => social.type === 'facebook');
      if (facebookSocial) {
        try {
          console.log(`🔍 Scraping Facebook pour emails: ${facebookSocial.url}`);
          const emailsFromFacebook = await scrapeFacebookForEmails(browser as Browser, facebookSocial.url, pagesVisitedCounter); // Passer l'instance du navigateur
          if (emailsFromFacebook.length > 0) {
            allEmails.push(...emailsFromFacebook);
          }
        } catch (error) {
          console.log('❌ Erreur scraping Facebook:', error);
        }
      }
    }

    // Supprimer les doublons et garder TOUS les emails
    const uniqueEmails = Array.from(new Set(allEmails));
    
    // Mettre à jour les données de restaurantData avec les tableaux collectés
    restaurantData.emailsDetected = uniqueEmails;
    restaurantData.phonesDetected = Array.from(new Set(phonesFromWebsite)); // Assigner les téléphones collectés uniques
    restaurantData.socialNetworks = Array.from(new Set(socialNetworksFromWebsite.map(s => JSON.stringify(s)))).map(s => JSON.parse(s)); // Assurer des réseaux sociaux uniques

    return restaurantData;

  } catch (error: any) {
    console.error(`❌ Erreur scraping ${url}:`, error.message);
    return null;
  } finally {
    if (page) await page.close(); // Fermer la page, pas le navigateur
  }
}

export async function scrapeGoogleMapsSearch(googleMapsUrl: string, maxResults: number, proxyConfig: ProxyConfig | undefined, enrichEmails: boolean, enrichPhones: boolean): Promise<{
  results: any[];
  durationMs: number;
  pagesVisited: number;
  successfulScrapes: number;
  failedScrapes: number;
  proxyUsed: boolean;
  proxyHost?: string;
}> {
  const startTime = Date.now();
  let browser: Browser | undefined;
  let page: Page | undefined; // Page pour la recherche initiale Google Maps
  let pagesVisitedCounter = { count: 0 };
  let successfulScrapes = 0;
  let failedScrapes = 0;

  try {
    console.log(`🔍 Démarrage du scraping Google Maps avec URL: "${googleMapsUrl}" - Max résultats: ${maxResults}`);

    browser = await launchBrowser(proxyConfig); // Lancer le navigateur une seule fois
    page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });
    // CORRECTION : Utiliser addInitScript pour définir le User-Agent
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'userAgent', {
        get: () => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      });
    });

    console.log(`🌐 Navigation vers: ${googleMapsUrl}`);
    
    await page.goto(googleMapsUrl, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    pagesVisitedCounter.count++;

    await page.waitForTimeout(3000); // Délai réduit

    // Gérer les popups
    try {
      const consentButton = await page.$('button:has-text("Tout accepter")');
      if (consentButton) {
        await consentButton.click();
        await page.waitForTimeout(2000); // Délai réduit
      }
    } catch (error) {
      // Ignorer
    }

    // Récupérer les URLs des établissements avec scroll
    const restaurantUrls: string[] = await page.evaluate(async (maxResults) => {
      const urls = new Set<string>();
      
      // Updated panel selectors for better robustness
      const panel = document.querySelector('[role="feed"]') || 
                    document.querySelector('div[aria-label*="Résultats de la recherche"]') || // French
                    document.querySelector('div[aria-label*="Search results"]') || // English
                    document.querySelector('div[aria-label*="Results for"]') || // Another common English variant
                    document.querySelector('div[aria-label*="Résultats pour"]') || // Another common French variant
                    document.querySelector('.m6QErb[aria-label]') ||
                    document.querySelector('.m6QErb.DxyBCb') ||
                    document.querySelector('div[jsaction*="mouseover:pane.mouseover"]') || // Another common pattern
                    document.querySelector('div[data-h="GhN2T"]') ||
                    // More generic approach: find a scrollable div that contains place links
                    document.querySelector('div[tabindex="-1"][style*="overflow: auto"]') ||
                    document.querySelector('div[tabindex="0"][style*="overflow: auto"]') ||
                    document.querySelector('div[aria-label*="scrolling results"]'); // Yet another common pattern for scrollable results
    
      if (!panel) {
        console.log('❌ Aucun panneau trouvé');
        return [];
      }
    
      let scrollCount = 0;
      const maxScrolls = 10; // Revert to user's working value
      let lastCount = 0;
      let noNewResultsCount = 0;
    
      while (urls.size < maxResults && urls.size < 200 && scrollCount < maxScrolls && noNewResultsCount < 3) { // Revert to user's working value
        // Récupérer tous les liens href
        const links = panel.querySelectorAll('a[href*="/place/"]');
        
        links.forEach(link => {
          const href = link.getAttribute('href');
          if (href && href.includes('/place/') && !href.includes('search')) {
            const fullUrl = href.startsWith('http') ? href : `https://www.google.com${href}`;
            urls.add(fullUrl);
          }
        });
    
        console.log(`🔄 Scroll ${scrollCount + 1}: ${urls.size} URLs`);
    
        // Vérifier si on a de nouveaux résultats
        if (urls.size === lastCount) {
          noNewResultsCount++;
        } else {
          noNewResultsCount = 0;
        }
        lastCount = urls.size;
    
        // Scroller vers le bas
        panel.scrollTop = panel.scrollHeight;
        
        // Attendre le chargement des nouveaux éléments
        await new Promise(resolve => setTimeout(resolve, 1000)); // Revert to user's working value
        
        scrollCount++;
      }
    
      return Array.from(urls).slice(0, maxResults);
    }, maxResults);

    console.log(`✅ ${restaurantUrls.length} URLs récupérées après scroll`);

    // Scraper les détails de chaque établissement en parallèle
    console.log(`🔍 Début du scraping des détails pour ${restaurantUrls.length} établissements en parallèle...`);
    
    const CONCURRENCY_LIMIT = 5; // Limite les opérations de page concurrentes
    const restaurantDetails: any[] = [];

    const processInBatches = async (urls: string[]) => {
      const results: any[] = [];
      for (let i = 0; i < urls.length; i += CONCURRENCY_LIMIT) {
        const batch = urls.slice(i, i + CONCURRENCY_LIMIT);
        const batchPromises = batch.map(async (url) => {
          console.log(`\n📋 Scraping (batch): ${url}`);
          // Passer enrichEmails et enrichPhones à scrapeRestaurantDetails
          const details = await scrapeRestaurantDetails(browser as Browser, url, enrichEmails, enrichPhones, pagesVisitedCounter);
          if (details) {
            console.log(`✅ Détails récupérés pour: ${details.name}`);
            successfulScrapes++;
            return details;
          } else {
            console.log(`❌ Échec du scraping pour: ${url}`);
            failedScrapes++;
            return null;
          }
        });
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults.filter(Boolean)); // Filtrer les nulls
        await new Promise(resolve => setTimeout(resolve, 1000)); // Petite pause entre les lots
      }
      return results;
    };

    const scrapedDetails = await processInBatches(restaurantUrls);
    restaurantDetails.push(...scrapedDetails);

    const endTime = Date.now();
    const durationMs = endTime - startTime;

    return {
      results: restaurantDetails,
      durationMs,
      pagesVisited: pagesVisitedCounter.count,
      successfulScrapes,
      failedScrapes,
      proxyUsed: !!proxyConfig,
      proxyHost: proxyConfig?.host,
    };

  } catch (error: any) {
    console.error('❌ Erreur globale dans scrapeGoogleMapsSearch:', error.message);
    const endTime = Date.now();
    const durationMs = endTime - startTime;
    throw {
      error: error.message,
      durationMs,
      pagesVisited: pagesVisitedCounter.count,
      successfulScrapes,
      failedScrapes,
      proxyUsed: !!proxyConfig,
      proxyHost: proxyConfig?.host,
    };
  } finally {
    if (page) await page.close(); // Fermer la page de recherche initiale
    if (browser) await browser.close(); // Fermer l'instance du navigateur
  }
}