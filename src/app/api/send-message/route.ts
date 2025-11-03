import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
      const { to, message } = await request.json();
      
      console.log('📤 Tentative envoi WhatsApp:', { to, message });
  
      const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
      const accessToken = process.env.WHATSAPP_TOKEN;
  
      if (!phoneNumberId || !accessToken) {
        return NextResponse.json(
          { success: false, error: 'WhatsApp not configured' },
          { status: 500 }
        );
      }
  
      const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;

      // ESSAYER D'ABORD LE MESSAGE TEXTE
      const textData = {
        messaging_product: 'whatsapp',
        to: to,
        text: { body: `Nouveau message de contact: ${message}` }
      };
  
      console.log('🔗 URL:', url);
      console.log('📝 Data:', JSON.stringify(textData, null, 2));
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(textData),
      });

      // 🔥 CORRECTION : Vérifier si la réponse est du JSON
      const responseText = await response.text();
      console.log('📨 Réponse brute:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        // Si ce n'est pas du JSON, c'est probablement une page HTML d'erreur
        console.error('❌ Réponse non-JSON reçue:', responseText.substring(0, 200));
        return NextResponse.json({
          success: false,
          error: {
            message: 'Meta API returned HTML instead of JSON',
            htmlResponse: responseText.substring(0, 500) // Premier 500 caractères
          }
        }, { status: 500 });
      }
  
      console.log('📨 Réponse WhatsApp API:', responseData);
  
      if (!response.ok) {
        // SI ERREUR RE-ENGAGEMENT, ESSAYER UN TEMPLATE
        if (responseData.error?.code === 131047) {
          console.log('🔄 Tentative avec template...');
          
          const templateData = {
            messaging_product: 'whatsapp',
            to: to,
            type: 'template',
            template: {
              name: 'hello_world',
              language: { code: 'en_US' }
            }
          };
  
          const templateResponse = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(templateData),
          });

          const templateResponseText = await templateResponse.text();
          let templateResult;
          
          try {
            templateResult = JSON.parse(templateResponseText);
          } catch (templateParseError) {
            console.error('❌ Template response non-JSON:', templateResponseText.substring(0, 200));
            return NextResponse.json({
              success: false,
              error: 'Template API returned HTML error'
            }, { status: 500 });
          }
  
          console.log('📨 Réponse Template:', templateResult);
  
          if (!templateResponse.ok) {
            return NextResponse.json(
              { success: false, error: templateResult },
              { status: templateResponse.status }
            );
          }
  
          return NextResponse.json({
            success: true,
            data: templateResult,
            used_template: true
          });
        }
  
        return NextResponse.json(
          { success: false, error: responseData },
          { status: response.status }
        );
      }
  
      return NextResponse.json({
        success: true,
        data: responseData
      });
  
    } catch (error: any) {
      console.error('💥 Erreur générale:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
}