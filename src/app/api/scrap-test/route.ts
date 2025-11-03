// app/api/scrap-review-google-maps/route.ts


import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

export async function GET() {
  let browser;
  
  try {
    // URL directement intégrée dans le code
    const targetUrl = 'https://www.google.com/maps/place/Yellowstone+National+Park/@44.5857951,-110.5140571,9z/data=!3m1!4b1!4m6!3m5!1s0x5351e55555555555:0xaca8f930348fe1bb!8m2!3d44.5979182!4d-110.561249!16zL20vMDg4NzQ?hl=en-GB&entry=ttu&g_ep=EgoyMDI1MTAyNi.0wIKXMDSoASAFQAw%3D%3D';

    console.log('🎯 URL cible:', targetUrl);

    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });

    console.log('🌐 Navigation vers l\'établissement...');
    
    await page.goto(targetUrl, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    await page.waitForTimeout(5000);

    // Gérer les popups
    try {
      const consentButton = await page.$('button:has-text("Tout accepter"), button:has-text("Accept all"), button:has-text("I agree")');
      if (consentButton) {
        await consentButton.click();
        console.log('✅ Popup acceptée');
        await page.waitForTimeout(3000);
      }
    } catch (error) {
      console.log('ℹ️ Aucun popup trouvé');
    }

    // Attendre le chargement des avis
    await page.waitForTimeout(5000);

    // Extraire uniquement les avis
    const reviews = await page.evaluate(() => {
      const reviews: any[] = [];

      // Essayer différents sélecteurs pour les avis
      const reviewSelectors = [
        '.jftiEf',
        '.gws-localreviews__google-review',
        '[data-review-id]',
        '.WMFC2b'
      ];

      let reviewElements: Element[] = [];
      
      reviewSelectors.forEach(selector => {
        const elements = Array.from(document.querySelectorAll(selector));
        if (elements.length > 0) {
          reviewElements = [...reviewElements, ...elements];
        }
      });

      console.log(`📝 ${reviewElements.length} éléments d'avis trouvés`);

      reviewElements.forEach((reviewElement, index) => {
        if (index >= 15) return; // Limiter à 15 avis

        const review = {
          author: '',
          rating: '',
          date: '',
          content: ''
        };

        // Auteur
        const authorSelectors = ['.d4r55', '.TSUbDb', '.T5p3mf', '.X43Kjb'];
        authorSelectors.forEach(selector => {
          const element = reviewElement.querySelector(selector);
          if (element && !review.author) {
            review.author = element.textContent?.trim() || '';
          }
        });

        // Note
        const ratingSelectors = ['.kvMYJc', '.fzvQIb', '.UepBZb', '.Fam1ne'];
        ratingSelectors.forEach(selector => {
          const element = reviewElement.querySelector(selector);
          if (element && !review.rating) {
            const ariaLabel = element.getAttribute('aria-label');
            review.rating = ariaLabel || element.textContent?.trim() || '';
          }
        });

        // Date
        const dateSelectors = ['.rsqaWe', '.xRkPPb', '.DeY1hd', '.Aqa61b'];
        dateSelectors.forEach(selector => {
          const element = reviewElement.querySelector(selector);
          if (element && !review.date) {
            review.date = element.textContent?.trim() || '';
          }
        });

        // Contenu
        const contentSelectors = ['.MyEned', '.wiI7pd', '.review-text'];
        contentSelectors.forEach(selector => {
          const element = reviewElement.querySelector(selector);
          if (element && !review.content) {
            review.content = element.textContent?.trim() || '';
          }
        });

        // Ne garder que les avis avec du contenu
        if (review.content && review.content.length > 5) {
          reviews.push(review);
        }
      });

      return reviews;
    });

    console.log(`✅ ${reviews.length} avis extraits`);

    await browser.close();

    return NextResponse.json({ 
      success: true,
      data: {
        establishment: "Yellowstone National Park",
        url: targetUrl,
        reviews: reviews,
        count: reviews.length
      },
      message: `📊 ${reviews.length} avis récupérés pour Yellowstone National Park`
    });

  } catch (error: any) {
    if (browser) await browser.close();
    console.error('❌ Erreur:', error);
    return NextResponse.json({ 
      error: error.message,
      details: 'Erreur lors du scraping des avis'
    }, { status: 500 });
  }
}