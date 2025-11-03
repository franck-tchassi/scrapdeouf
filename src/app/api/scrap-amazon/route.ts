// app/api/scrap-amazon/route.ts
import { NextRequest, NextResponse } from "next/server";
import puppeteer, { Browser } from "puppeteer";

// GET handler : scrap via query param
export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url") || "https://www.amazon.com/s?k=gel+de+douche&crid=1ICS79NTP01D&sprefix=gel+de+douche%2Caps%2C311&ref=nb_sb_noss_1";
  const nbr = parseInt(searchParams.get("nbr") || "5");

  if (!url) {
    return NextResponse.json({ error: "Paramètre 'url' manquant" }, { status: 400 });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const products = await scrapeAmazonProducts(browser, url, nbr);
    await browser.close();

    return NextResponse.json({ amazonProducts: products });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

// Fonction pour scraper les détails complets d'un produit
const scrapeAmazonProductDetails = async (browser: Browser, productUrl: string) => {
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  console.log(`🔍 Accès direct à: ${productUrl}`);

  try {
    // Nettoyer l'URL pour enlever les paramètres inutiles
    const cleanUrl = productUrl.split('?')[0];
    
    await page.goto(cleanUrl, { 
      waitUntil: "domcontentloaded", 
      timeout: 30000 
    });

    console.log("✅ Page produit chargée avec succès");

    // FAIRE DÉFILER vers le bas pour charger la description
    console.log("📜 Défilement pour charger la description...");
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Attendre que le contenu se charge après défilement
    await new Promise(resolve => setTimeout(resolve, 3000));

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
      let title = getTextByXPath("/html/body/div[1]/div[1]/div[2]/div[4]/div[4]/div[1]/div/h1/span") || 
                 getText("#productTitle") ||
                 getText("h1.a-size-large") ||
                 "N/A";

      // 2. PRIX - Essayer plusieurs méthodes
      let price = getTextByXPath("/html/body/div[1]/div[1]/div[2]/div[4]/div[1]/div[7]/div/div[1]/div/div/div/form/div/div/div/div/div[3]/div/div[1]/div/div/span[1]/span[1]") || 
                 getText(".a-price .a-offscreen") ||
                 getText(".a-price-whole") ||
                 getText("#priceblock_dealprice") ||
                 getText("#priceblock_ourprice") ||
                 "N/A";

      // 3. RATING
      const ratingElement = document.querySelector(".a-icon-alt");
      const ratingText = ratingElement?.textContent?.trim() || "";
      const ratingMatch = ratingText.match(/(\d+(?:[.,]\d+)?)/);
      const rating = ratingMatch ? ratingMatch[1].replace(',', '.') : "N/A";

      // 4. NOMBRE D'AVIS - Essayer plusieurs méthodes
      let reviews = getTextByXPath("/html/body/div[1]/div[1]/div[2]/div[4]/div[4]/div[3]/div/span[3]/a/span") || 
                   getText("#acrCustomerReviewText") ||
                   getText("span[data-hook='total-review-count']") ||
                   "N/A";

      // 5. MARQUE - Essayer plusieurs méthodes
      let brand = getTextByXPath("/html/body/div[1]/div[1]/div[2]/div[4]/div[4]/div[44]/div/table/tbody/tr[1]/td[2]/span") || 
                 getText(".po-brand .po-break-word") ||
                 getText("#bylineInfo") ||
                 getText("a#bylineInfo") ||
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
        "/html/body/div[1]/div[1]/div[2]/div[25]/div/div/div[2]/p[1]/span",
        "/html/body/div[1]/div[1]/div[2]/div[24]/div/div/div[2]/p/span",
        "/html/body/div[1]/div[1]/div[2]/div[26]/div/div/div[2]/p[1]/span",
        "/html/body/div[1]/div[1]/div[2]/div[23]/div/div/div[2]/p/span",
        "//div[contains(@class, 'product-description')]//span",
        "//div[contains(@id, 'productDescription')]//p"
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
      const inStock = getTextByXPath("/html/body/div[1]/div[1]/div[2]/div[4]/div[1]/div[6]/div/div[1]/div/div/div/form/div/div/div/div/div[4]/div/div[8]/div/div[1]/span") || 
                     getText("#availability .a-color-success") ||
                     getText("#availability .a-color-price") ||
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
    
    await page.close();
    return productDetails;

  } catch (error) {
    console.error(`❌ Erreur lors du scraping de ${productUrl}:`, error);
    await page.close();
    
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
  }
};

// Fonction de scraping principale pour les listes de produits
const scrapeAmazonProducts = async (browser: Browser, url: string, nbr: number) => {
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  console.log(`🌐 Accès à la liste de produits: ${url}`);
  
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

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
      
      const avis = item.querySelector(".a-size-base.s-underline-text")?.textContent || "N/A";
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
        avis,
        imageUrl,
        productUrl
      };
    });
  }, baseUrl);

  await page.close();

  // Limiter le nombre de produits
  const selected = products.filter(p => p.asin !== "N/A").slice(0, nbr);
  console.log(`📦 ${selected.length} produits trouvés, récupération des détails...`);

  // Récupérer les détails complets pour chaque produit
  const detailedProducts = [];
  for (const product of selected) {
    try {
      console.log(`🔍 Récupération des détails pour: ${product.title.substring(0, 50)}...`);
      const productDetails = await scrapeAmazonProductDetails(browser, product.productUrl);
      
      // Fusionner les données (priorité aux données détaillées)
      detailedProducts.push({
        ...product,
        ...productDetails,
        // Garder l'avis de la liste si les détails n'ont pas d'avis
        reviews: productDetails.reviews !== "N/A" ? productDetails.reviews : product.avis
      });
      
      console.log(`✅ Détails récupérés - Titre: ${productDetails.title}`);
    } catch (err) {
      console.warn(`❌ Détails non chargés pour: ${product.productUrl}`, err);
      // Garder le produit de base même si les détails échouent
      detailedProducts.push({
        ...product,
        brand: "N/A",
        category: "N/A",
        description: "N/A",
        monthlySales: "N/A",
        inStock: "N/A",
        reviews: product.avis
      });
    }
  }

  console.log(`🎉 Scraping terminé: ${detailedProducts.length} produits récupérés`);
  return detailedProducts;
};