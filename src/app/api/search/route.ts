// app/api/search/route.ts


import { NextResponse } from 'next/server';

// Fonction pour parser l'adresse
function parseAddress(formattedAddress: string) {
  if (!formattedAddress) return { city: '', postalCode: '', country: '' };
  
  const parts = formattedAddress.split(',');
  if (parts.length < 2) return { city: '', postalCode: '', country: '' };

  const country = parts[parts.length - 1].trim();
  const cityPart = parts[parts.length - 2].trim();
  const postalCodeMatch = cityPart.match(/\d{5}/);
  const postalCode = postalCodeMatch ? postalCodeMatch[0] : '';
  const city = cityPart.replace(postalCode, '').trim();
  
  return { city, postalCode, country };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const limit = searchParams.get('limit') || '8';

    if (!query) {
      return NextResponse.json(
        { error: 'Le paramètre "query" est requis' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Configuration serveur manquante' },
        { status: 500 }
      );
    }

    // Recherche textuelle avec limite
    let searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}&language=fr`;
    
    // Limiter le nombre de résultats à 8 maximum
    const resultsLimit = Math.min(parseInt(limit), 20);
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
      console.error('Erreur Google Places:', searchData.status, searchData.error_message);
      return NextResponse.json(
        {
          error: 'Erreur lors de la recherche',
          details: searchData.error_message || searchData.status
        },
        { status: 502 }
      );
    }

    // Limiter à 8 résultats maximum
    const resultsToProcess = searchData.results.slice(0, resultsLimit);

    console.log(`🔍 Recherche: "${query}" - ${resultsToProcess.length} résultats`);

    const formattedResults = await Promise.all(
      resultsToProcess.map(async (place: any) => {
        try {
          // Appel à l'API Details pour obtenir le site web et téléphone
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,website,international_phone_number&key=${apiKey}&language=fr`;
          const detailsResponse = await fetch(detailsUrl);
          const detailsData = await detailsResponse.json();

          const placeDetails = detailsData.result || {};
          const { city, postalCode, country } = parseAddress(placeDetails.formatted_address || place.formatted_address);

          // Retourner uniquement les champs demandés
          return {
            id: place.place_id,
            nom: placeDetails.name || place.name,
            adresse: placeDetails.formatted_address || place.formatted_address,
            ville: city,
            pays: country,
            siteWeb: placeDetails.website || undefined,
            telephone: placeDetails.international_phone_number || undefined,
            lienMaps: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
          };
        } catch (error) {
          console.error(`Erreur détails pour ${place.place_id}:`, error);
          const { city, postalCode, country } = parseAddress(place.formatted_address);
          
          // Fallback avec les données de base
          return {
            id: place.place_id,
            nom: place.name,
            adresse: place.formatted_address,
            ville: city,
            pays: country,
            siteWeb: undefined,
            telephone: undefined,
            lienMaps: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
          };
        }
      })
    );

    return NextResponse.json({
      results: formattedResults,
      totalFound: searchData.results.length,
      returned: formattedResults.length
    });

  } catch (error) {
    console.error('Erreur dans /api/search:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}