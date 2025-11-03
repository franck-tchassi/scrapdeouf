// app/api/scrap-google-maps/route.ts

import { NextResponse } from 'next/server';
import { scrapeGoogleMapsSearch } from '@/lib/google-maps-scraper';
import { getRandomProxy } from '@/lib/google-maps-scraper'; // Importez getRandomProxy

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const googleMapsUrl = searchParams.get('url'); // Utilise 'url' au lieu de 'query'
    const maxResults = parseInt(searchParams.get('limit') || '5'); // Utilise 'limit' au lieu de 'maxResults'
    const enrichEmails = searchParams.get('enrichEmails') === 'true'; // Nouveau paramètre
    const enrichPhones = searchParams.get('enrichPhones') === 'true'; // Nouveau paramètre
    
    if (!googleMapsUrl) {
      return NextResponse.json({ error: 'Google Maps URL is required' }, { status: 400 });
    }

    const proxyConfig = getRandomProxy();
    if (proxyConfig) {
      console.log(`Using proxy: ${proxyConfig.host}:${proxyConfig.port}`);
    } else {
      console.log('No proxy available, proceeding without proxy.');
    }

    // Passer les drapeaux d'enrichissement à scrapeGoogleMapsSearch
    const scrapeResult = await scrapeGoogleMapsSearch(googleMapsUrl, maxResults, proxyConfig, enrichEmails, enrichPhones);

    return NextResponse.json({ 
      success: true,
      results: scrapeResult.results, // Accéder à la propriété 'results'
      message: `🎯 ${scrapeResult.results.length} établissements scrapés avec succès.`, // Accéder à la propriété 'results.length'
      monitoring: { // Inclure les données de monitoring dans la réponse
        durationMs: scrapeResult.durationMs,
        pagesVisited: scrapeResult.pagesVisited,
        successfulScrapes: scrapeResult.successfulScrapes,
        failedScrapes: scrapeResult.failedScrapes,
        proxyUsed: scrapeResult.proxyUsed,
        proxyHost: scrapeResult.proxyHost,
      }
    });

  } catch (error: any) {
    console.error('❌ Erreur globale dans /api/scrap-google-maps:', error.message);
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}