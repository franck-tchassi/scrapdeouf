//lib/amazon-scraper.ts

import { Browser, Page } from 'playwright';
import { ProxyConfig } from './proxies';
import { getRandomProxy, launchBrowser } from './google-maps-scraper'; // Import des fonctions partagées

// Type pour une ligne de résultat d'extraction Amazon
export type AmazonProductRow = {
  asin: string;
  title: string;
  price: string;
  rating: string;
  reviews: string;
  brand: string;
  description: string | boolean;
  category: string;
  monthlySales: string;
  inStock: string;
  imageUrl: string;
  productUrl: string;
};

// Fonction pour scraper les détails complets d'un produit Amazon
async function scrapeAmazonProductDetails(browser: Browser, productUrl: string, pagesVisitedCounter: { count: number }): Promise<AmazonProductRow> {
  let page: Page | undefined;
  try {
    page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });
    
    // CORRECTION : Utiliser addInitScript pour définir le User-Agent
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'userAgent', {
        get: () => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      });
    });

    console.log(`🔍 Accès direct à: ${productUrl}`);

    // Nettoyer l'URL pour enlever les paramètres inutiles
    const cleanUrl = productUrl.split('?')[0];
    
    await page.goto(cleanUrl, { 
      waitUntil: "domcontentloaded", 
      timeout: 30000 
    });
    pagesVisitedCounter.count++;

    console.log("✅ Page produit chargée avec succès");

    // FAIRE DÉFILER vers le bas pour charger la description
    console.log("📜 Défilement pour charger la description...");
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Attendre que le contenu se charge après défilement
    await page.waitForTimeout(3000);

    const productDetails = await page.evaluate(() => {
      // Fonction pour récupérer le texte avec XPath
      const getTextByXPath = (xpath: string): string => {
        try {
          const result = document.evaluate(
            xpath, 
            document, 
            null, 
            XPathResult.FIRST_ORDERED_NODE_TYPE, 
            null
          );
          return result.singleNodeValue?.textContent?.trim() || "N/A";
        } catch (error) {
          return "N/A";
        }
      };

      // Fonction pour récupérer un attribut
      const getAttribute = (selector: string, attr: string): string => {
        const el = document.querySelector(selector);
        return el?.getAttribute(attr) || "N/A";
      };

      // Fonction pour récupérer le texte avec CSS selector
      const getText = (selector: string): string => {
        const el = document.querySelector(selector);
        return el?.textContent?.trim() || "N/A";
      };

      // Extraction de l'ASIN depuis l'URL
      const currentUrl = window.location.href;
      const asinMatch = currentUrl.match(/\/dp\/([A-Z0-9]{10})/);
      const asin = asinMatch ? asinMatch[1] : "N/A";

      // 1. NOM/TITRE - Essayer plusieurs méthodes
      let title = getText("#productTitle") || 
                 getText("h1.a-size-large") ||
                 getTextByXPath("/html/body/div[1]/div[1]/div[2]/div[4]/div[4]/div[1]/div/h1/span") || 
                 "N/A";

      // 2. PRIX - Essayer plusieurs méthodes
      let price = getText(".a-price .a-offscreen") ||
                 getText(".a-price-whole") ||
                 getText("#priceblock_dealprice") ||
                 getText("#priceblock_ourprice") ||
                 getTextByXPath("/html/body/div[1]/div[1]/div[2]/div[4]/div[1]/div[7]/div/div[1]/div/div/div/form/div/div/div/div/div[3]/div/div[1]/div/div/span[1]/span[1]") || 
                 "N/A";

      // 3. RATING
      const ratingElement = document.querySelector(".a-icon-alt");
      const ratingText = ratingElement?.textContent?.trim() || "";
      const ratingMatch = ratingText.match(/(\d+(?:[.,]\d+)?)/);
      const rating = ratingMatch ? ratingMatch[1].replace(',', '.') : "N/A";

      // 4. NOMBRE D'AVIS - Essayer plusieurs méthodes
      let reviews = getText("#acrCustomerReviewText") ||
                   getText("span[data-hook='total-review-count']") ||
                   getTextByXPath("/html/body/div[1]/div[1]/div[2]/div[4]/div[4]/div[3]/div/span[3]/a/span") || 
                   "N/A";

      // 5. MARQUE - Essayer plusieurs méthodes
      let brand = getText(".po-brand .po-break-word") ||
                 getText("#bylineInfo") ||
                 getText("a#bylineInfo") ||
                 getTextByXPath("/html/body/div[1]/div[1]/div[2]/div[4]/div[4]/div[44]/div/table/tbody/tr[1]/td[2]/span") || 
                 "N/A";

      // Nettoyer la marque
      if (brand !== "N/A") {
        brand = brand.replace(/^Marque:\s*/i, "")
                    .replace(/^Visit the\s*/i, "")
                    .replace(/^Brand:\s*/i, "")
                    .trim();
      }

      // 6. DESCRIPTION - Essayer plusieurs XPath
      let description = "N/A";
      const descriptionXPaths = [
        "//div[contains(@id, 'productDescription')]//p",
        "//div[contains(@class, 'product-description')]//span",
        "/html/body/div[1]/div[1]/div[2]/div[25]/div/div/div[2]/p[1]/span",
        "/html/body/div[1]/div[1]/div[2]/div[24]/div/div/div[2]/p/span",
        "/html/body/div[1]/div[1]/div[2]/div[26]/div/div/div[2]/p[1]/span",
        "/html/body/div[1]/div[1]/div[2]/div[23]/div/div/div[2]/p/span"
      ];

      // Tester chaque XPath jusqu'à trouver une description valide
      for (const xpath of descriptionXPaths) {
        const desc = getTextByXPath(xpath);
        if (desc !== "N/A" && desc.length > 10) {
          description = desc;
          break;
        }
      }

      // 7. CATÉGORIE
      const category = getTextByXPath("/html/body/div[1]/div[1]/div[2]/div[1]/div[4]/div/div/div") || "N/A";

      // 8. VENTES MENSUELLES (monthlySales)
      const monthlySales = getTextByXPath("/html/body/div[1]/div[1]/div[2]/div[4]/div[4]/div[11]/div/div/span") || "N/A";

      // 9. DISPONIBILITÉ (inStock)
      const inStock = getText("#availability .a-color-success") || 
                     getText("#availability .a-color-price") ||
                     getTextByXPath("/html/body/div[1]/div[1]/div[2]/div[4]/div[1]/div[6]/div/div[1]/div/div/div/form/div/div/div/div/div[4]/div/div[8]/div/div[1]/span") || 
                     "N/A";

      // 10. IMAGE
      const imageUrl = getAttribute("#landingImage", "src") ||
                      getAttribute("img[data-old-hires]", "src") ||
                      "N/A";

      return {
        asin,
        title,
        price,
        rating,
        reviews,
        brand,
        description: description !== "N/A" && description,
        category,
        monthlySales,
        inStock,
        imageUrl,
        productUrl: currentUrl
      };
    });

    console.log(`✅ Détails récupérés pour: ${productDetails.title}`);
    console.log(`✅ Catégorie: ${productDetails.category}`);
    console.log(`✅ Ventes mensuelles: ${productDetails.monthlySales}`);
    console.log(`✅ Stock: ${productDetails.inStock}`);
    
    return productDetails;

  } catch (error) {
    console.error(`❌ Erreur lors du scraping de ${productUrl}:`, error);
    
    // Retourner un objet avec des valeurs par défaut en cas d'erreur
    const asinMatch = productUrl.match(/\/dp\/([A-Z0-9]{10})/);
    const asin = asinMatch ? asinMatch[1] : "N/A";
    
    return {
      asin,
      title: "N/A",
      price: "N/A",
      rating: "N/A",
      reviews: "N/A",
      brand: "N/A",
      description: "N/A",
      category: "N/A",
      monthlySales: "N/A",
      inStock: "N/A",
      imageUrl: "N/A",
      productUrl
    };
  } finally {
    if (page) await page.close();
  }
}

// Fonction de scraping principale pour les listes de produits Amazon
export async function scrapeAmazonProducts(url: string, maxResults: number, proxyConfig?: ProxyConfig): Promise<{
  results: AmazonProductRow[];
  durationMs: number;
  pagesVisited: number;
  successfulScrapes: number;
  failedScrapes: number;
  proxyUsed: boolean;
  proxyHost?: string;
}> {
  const startTime = Date.now();
  let browser: Browser | undefined;
  let page: Page | undefined;
  let pagesVisitedCounter = { count: 0 };
  let successfulScrapes = 0;
  let failedScrapes = 0;

  try {
    browser = await launchBrowser(proxyConfig); // Lancer le navigateur une seule fois
    page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });
    
    // CORRECTION : Utiliser addInitScript pour définir le User-Agent
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'userAgent', {
        get: () => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      });
    });

    console.log(`🌐 Accès à la liste de produits Amazon: ${url}`);
    
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    pagesVisitedCounter.count++;

    const baseUrl = new URL(url).origin;

    const products = await page.evaluate((baseUrl) => {
      // Fonction pour nettoyer l'URL produit
      const cleanProductUrl = (href: string, asin: string, baseUrl: string): string => {
        if (asin && asin !== "N/A") {
          return `${baseUrl}/dp/${asin}`;
        }
        
        if (href) {
          const asinMatch = href.match(/\/dp\/([A-Z0-9]{10})/);
          if (asinMatch) {
            return `${baseUrl}/dp/${asinMatch[1]}`;
          }
          return href.startsWith("http") ? href : `${baseUrl}${href}`;
        }
        
        return "N/A";
      };

      // Fonction pour extraire le rating
      const extractRating = (ratingText: string | null): string => {
        if (!ratingText) return "N/A";
        const ratingMatch = ratingText.match(/(\d+(?:[.,]\d+)?)/);
        return ratingMatch ? ratingMatch[1].replace(',', '.') : "N/A";
      };

      return Array.from(document.querySelectorAll('div[data-component-type="s-search-result"]')).map(item => {
        const title = item.querySelector("h2")?.textContent?.trim() || "N/A";
        const asin = item.getAttribute("data-asin") || "N/A";
        const price = item.querySelector(".a-price .a-offscreen")?.textContent?.trim() || "N/A";
        
        // Extraction du rating
        const ratingElement = item.querySelector(".a-icon-alt");
        const ratingText = ratingElement?.textContent?.trim() || "";
        const rating = extractRating(ratingText);
        
        const reviews = item.querySelector(".a-size-base.s-underline-text")?.textContent || "N/A";
        const imageUrl = item.querySelector("img")?.getAttribute("src") || "N/A";
        
        // Sélection spécifique du lien produit
        const href = item.querySelector("h2 a.a-link-normal")?.getAttribute("href") || 
                     item.querySelector("a.a-link-normal.a-text-normal")?.getAttribute("href") || "";
        
        const productUrl = cleanProductUrl(href, asin, baseUrl);

        return {
          title,
          asin,
          price,
          rating,
          reviews,
          imageUrl,
          productUrl,
          brand: "N/A", // Default values for detailed fields
          description: "N/A",
          category: "N/A",
          monthlySales: "N/A",
          inStock: "N/A",
        };
      });
    }, baseUrl);

    // Limiter le nombre de produits
    const selectedProducts = products.filter(p => p.asin !== "N/A").slice(0, maxResults);
    console.log(`📦 ${selectedProducts.length} produits trouvés, récupération des détails...`);

    // Récupérer les détails complets pour chaque produit en parallèle
    const CONCURRENCY_LIMIT = 5;
    const detailedProducts: AmazonProductRow[] = [];

    for (let i = 0; i < selectedProducts.length; i += CONCURRENCY_LIMIT) {
      const batch = selectedProducts.slice(i, i + CONCURRENCY_LIMIT);
      const batchPromises = batch.map(async (product) => {
        try {
          console.log(`🔍 Récupération des détails pour: ${product.title.substring(0, 50)}...`);
          const productDetails = await scrapeAmazonProductDetails(browser as Browser, product.productUrl, pagesVisitedCounter);
          successfulScrapes++;
          return {
            ...product,
            ...productDetails,
            reviews: productDetails.reviews !== "N/A" ? productDetails.reviews : product.reviews
          };
        } catch (err) {
          console.warn(`❌ Détails non chargés pour: ${product.productUrl}`, err);
          failedScrapes++;
          return {
            ...product,
            brand: "N/A",
            category: "N/A",
            description: "N/A",
            monthlySales: "N/A",
            inStock: "N/A",
          };
        }
      });
      const batchResults = await Promise.all(batchPromises);
      detailedProducts.push(...batchResults);
      await page.waitForTimeout(1500); // Petite pause entre les lots
    }

    console.log(`🎉 Scraping terminé: ${detailedProducts.length} produits récupérés`);
    
    const endTime = Date.now();
    const durationMs = endTime - startTime;

    return {
      results: detailedProducts,
      durationMs,
      pagesVisited: pagesVisitedCounter.count,
      successfulScrapes,
      failedScrapes,
      proxyUsed: !!proxyConfig, // Indique si un proxy a été utilisé
      proxyHost: proxyConfig?.host, // L'hôte du proxy si utilisé
    };

  } catch (error: any) {
    console.error('❌ Erreur globale dans scrapeAmazonProducts:', error.message);
    const endTime = Date.now();
    const durationMs = endTime - startTime;
    throw {
      error: error.message,
      durationMs,
      pagesVisited: pagesVisitedCounter.count,
      successfulScrapes,
      failedScrapes,
      proxyUsed: !!proxyConfig, // Indique si un proxy a été utilisé même en cas d'erreur
      proxyHost: proxyConfig?.host, // L'hôte du proxy si utilisé
    };
  } finally {
    if (page) await page.close();
    if (browser) await browser.close(); // Fermer l'instance du navigateur
  }
}