// app/api/scrap-product/route.ts
import { NextRequest, NextResponse } from "next/server";
import puppeteer, { Browser } from "puppeteer";

export const GET = async (req: NextRequest) => {
  const productUrl = "https://www.amazon.com/dp/B07YYYSHVB";

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const productDetails = await scrapeAmazonProductDetails(browser, productUrl);
    await browser.close();

    return NextResponse.json({ product: productDetails });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

// Fonction pour scraper CE PRODUIT SPECIFIQUE
const scrapeAmazonProductDetails = async (browser: Browser, productUrl: string) => {
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  console.log(`🔍 Accès direct à: ${productUrl}`);

  try {
    // ICI: page.goto() avec VOTRE URL SPECIFIQUE
    await page.goto("https://www.amazon.com/dp/B07YYYSHVB", { 
      waitUntil: "domcontentloaded", 
      timeout: 30000 
    });

    console.log("✅ Page chargée avec succès");

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

      // 1. NOM/TITRE
      const title = getTextByXPath("/html/body/div[1]/div[1]/div[2]/div[4]/div[4]/div[1]/div/h1/span") || "N/A";

      // 2. PRIX
      const price = getTextByXPath("/html/body/div[1]/div[1]/div[2]/div[4]/div[1]/div[7]/div/div[1]/div/div/div/form/div/div/div/div/div[3]/div/div[1]/div/div/span[1]/span[1]") || "N/A";

      // 3. RATING
      const ratingElement = document.querySelector(".a-icon-alt");
      const ratingText = ratingElement?.textContent?.trim() || "";
      const ratingMatch = ratingText.match(/(\d+(?:[.,]\d+)?)/);
      const rating = ratingMatch ? ratingMatch[1].replace(',', '.') : "N/A";

      // 4. NOMBRE D'AVIS
      const reviews = getTextByXPath("/html/body/div[1]/div[1]/div[2]/div[4]/div[4]/div[3]/div/span[3]/a/span") || "N/A";

      // 5. MARQUE
      let brand = getTextByXPath("/html/body/div[1]/div[1]/div[2]/div[4]/div[4]/div[44]/div/table/tbody/tr[1]/td[2]/span") || "N/A";

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
        "//div[contains(@id, 'productDescription')]//p",
        
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

      // 8. IMAGE
      const imageUrl = getAttribute("#landingImage", "src") ||
                      getAttribute("img[data-old-hires]", "src") ||
                      "N/A";

      return {
        asin: "B07YYYSHVB",
        title,
        price,
        rating,
        reviews,
        brand,
        description: description !== "N/A" && description,
        category,
        imageUrl,
        productUrl: "https://www.amazon.com/dp/B07YYYSHVB"
      };
    });

    console.log(`✅ Données extraites: ${productDetails.title}`);
    
    console.log(`✅ Catégorie: ${productDetails.category}`);
    return productDetails;

  } catch (error) {
    console.error(`❌ Erreur:`, error);
    throw new Error(`Impossible de récupérer le produit: ${error}`);
  } finally {
    await page.close();
  }
};