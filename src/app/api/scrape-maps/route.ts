import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  const defaultSearchUrl = 'https://www.google.com/maps/search/restaurants+paris/@48.8737698,2.3126895,14z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D';
  const targetUrl = url || defaultSearchUrl;

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();
    
    // Configurer un viewport réaliste
    await page.setViewport({ width: 1280, height: 800 });
    
    // Ajouter des headers pour paraître plus comme un vrai navigateur
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    console.log('Navigation vers:', targetUrl);
    await page.goto(targetUrl, { 
      waitUntil: 'networkidle2', 
      timeout: 60000 
    });

    // Attendre que la page soit chargée avec plusieurs sélecteurs possibles
    console.log('En attente du chargement des résultats...');
    
    // Essayer différents sélecteurs pour le panneau de résultats
    const possibleSelectors = [
      'div[role="feed"]',
      'div[aria-label*="résultats"]',
      'div[aria-label*="results"]',
      '.m6QErb[aria-label]',
      '.m6QErb',
      '.searchapp',
      '[jsaction*="pane"]'
    ];

    let resultsPanel = null;
    for (const selector of possibleSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
        resultsPanel = selector;
        console.log(`Sélecteur trouvé: ${selector}`);
        break;
      } catch (e) {
        console.log(`Sélecteur ${selector} non trouvé`);
      }
    }

    if (!resultsPanel) {
      // Prendre une capture d'écran pour debugger
      await page.screenshot({ path: 'debug-screenshot.png' });
      throw new Error('Aucun sélecteur de résultats trouvé');
    }

    // Attendre un peu pour que le contenu se charge - CORRECTION ICI
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Faire défiler pour charger plus de résultats
    console.log('Défilement pour charger plus de résultats...');
    await page.evaluate(async () => {
      const scrollableElement = document.querySelector('.m6QErb') || 
                               document.querySelector('div[role="feed"]') ||
                               document.querySelector('.searchapp') ||
                               document.documentElement;

      let previousHeight = 0;
      let scrollAttempts = 0;
      const maxScrollAttempts = 5;

      while (scrollAttempts < maxScrollAttempts) {
        scrollableElement.scrollTop = scrollableElement.scrollHeight;
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const newHeight = scrollableElement.scrollHeight;
        if (newHeight === previousHeight) {
          break;
        }
        previousHeight = newHeight;
        scrollAttempts++;
      }
    });

    // Extraire les liens des établissements avec plusieurs sélecteurs possibles
    console.log('Extraction des liens...');
    const establishmentLinks = await page.evaluate(() => {
      // Essayer différents sélecteurs pour les liens
      const linkSelectors = [
        'a[href*="/maps/place/"]',
        'a[href*="/maps/place/"]',
        '[jsaction*="pane"] a',
        '.hfpxzc', // Nouveau sélecteur pour les cartes Google Maps
      ];

      let allLinks: string[] = [];
      
      for (const selector of linkSelectors) {
        const links = Array.from(document.querySelectorAll(selector))
          .map(a => (a as HTMLAnchorElement).href)
          .filter(href => href && href.includes('/maps/place/'));
        
        if (links.length > 0) {
          allLinks = [...allLinks, ...links];
        }
      }

      // Dédupliquer et limiter
      return [...new Set(allLinks)].slice(0, 5);
    });

    console.log(`Liens trouvés: ${establishmentLinks.length}`);

    if (establishmentLinks.length === 0) {
      // Prendre une capture d'écran pour debugger
      await page.screenshot({ path: 'no-links-screenshot.png' });
      throw new Error('Aucun lien d\'établissement trouvé');
    }

    const scrapedData = [];

    for (const link of establishmentLinks) {
      console.log(`Scraping: ${link}`);
      const detailPage = await browser.newPage();
      
      try {
        await detailPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await detailPage.goto(link, { 
          waitUntil: 'networkidle2', 
          timeout: 30000 
        });

        // Attendre que la page de détails se charge - CORRECTION ICI
        await new Promise(resolve => setTimeout(resolve, 3000));

        const data = await detailPage.evaluate(() => {
          // Fonction helper pour extraire le texte en toute sécurité
          const getText = (selector: string) => {
            const element = document.querySelector(selector);
            return element ? element.textContent?.trim() : null;
          };

          const getAttribute = (selector: string, attribute: string) => {
            const element = document.querySelector(selector);
            return element ? element.getAttribute(attribute) : null;
          };

          // Essayer différents sélecteurs pour le nom
          const name = getText('h1.DUwDvf') || 
                      getText('h1.fontHeadlineLarge') ||
                      getText('h1');

          // Essayer différents sélecteurs pour l'adresse
          const address = getText('button[data-item-id="address"]') ||
                         getText('[data-tooltip="Copier l\'adresse"]') ||
                         getText('.Io6Ycb.fontBodyMedium.kR99db');

          // Site web
          const website = getAttribute('a[data-tooltip="Ouvrir le site web"]', 'href') ||
                         getAttribute('a[data-tooltip-id="website"]', 'href') ||
                         getAttribute('a[aria-label*="site web"]', 'href');

          // Téléphone
          const phone = getText('button[data-tooltip="Copier le numéro de téléphone"]') ||
                       getText('button[data-item-id="phone"]') ||
                       getAttribute('button[data-tooltip-id="phone"]', 'aria-label');

          // Notes et avis
          const reviewsCountElement = document.querySelector('span.UY7F9b') ||
                                     document.querySelector('div.fontBodyMedium > span');
          
          const ratingElement = document.querySelector('div.F7nice > span[aria-label]') ||
                               document.querySelector('[aria-label*="étoiles"]') ||
                               document.querySelector('[aria-label*="stars"]');

          const extractNumber = (text: string | null) => {
            if (!text) return null;
            const match = text.match(/\d+/);
            return match ? parseInt(match[0], 10) : null;
          };

          return {
            name,
            address,
            website,
            phone: phone ? phone.replace(/Téléphone:?\s*/i, '').trim() : null,
            reviewsCount: reviewsCountElement ? extractNumber(reviewsCountElement.textContent) : null,
            averageRating: ratingElement ? parseFloat(
              ratingElement.getAttribute('aria-label')
                ?.replace(/[^\d,.]/g, '')
                .replace(',', '.') || '0'
            ) : null,
          };
        });

        scrapedData.push(data);
        console.log(`Données extraites pour: ${data.name}`);

      } catch (error) {
        console.error(`Erreur sur la page ${link}:`, error);
        scrapedData.push({ 
          error: `Échec du scraping pour ${link}`,
          link 
        });
      } finally {
        await detailPage.close();
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: scrapedData,
      total: scrapedData.length 
    });

  } catch (error: any) {
    console.error('Erreur de scraping:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      suggestion: "L'interface de Google Maps a peut-être changé. Vérifiez les sélecteurs CSS."
    }, { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}