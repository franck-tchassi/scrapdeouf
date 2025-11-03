import { NextRequest, NextResponse } from 'next/server';

// GET pour la vérification du webhook
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.VERIFY_TOKEN;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('Webhook vérifié avec succès');
    return new NextResponse(challenge, { status: 200 });
  } else {
    return new NextResponse('Forbidden', { status: 403 });
  }
}

// POST pour recevoir les messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Webhook reçu:', JSON.stringify(body, null, 2));

    // Vérifier que c'est un message WhatsApp
    if (body.object === 'whatsapp_business_account') {
      // Traiter les entrées
      if (body.entry && Array.isArray(body.entry)) {
        for (const entry of body.entry) {
          if (entry.changes && Array.isArray(entry.changes)) {
            for (const change of entry.changes) {
              if (change.field === 'messages' && change.value.messages) {
                for (const message of change.value.messages) {
                  await handleIncomingMessage(message);
                }
              }
            }
          }
        }
      }

      return NextResponse.json({ status: 'ok' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid object' }, { status: 400 });
  } catch (error) {
    console.error('Erreur webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Fonction pour gérer les messages entrants
async function handleIncomingMessage(message: any) {
  const userMessage = message.text?.body;
  const from = message.from;

  if (!userMessage) return;

  console.log(`Message de ${from}: ${userMessage}`);

  // Logique de réponse automatique
  let response = "Désolé, je n'ai pas compris votre message.";

  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut')) {
    response = "👋 Bonjour ! Comment puis-je vous aider aujourd'hui ?";
  } else if (lowerMessage.includes('prix')) {
    response = "Nos prix varient selon les services. Pouvez-vous me préciser ce dont vous avez besoin ?";
  } else if (lowerMessage.includes('contact')) {
    response = "Vous pouvez nous contacter au 01 23 45 67 89 ou par email : contact@scrapdeouf.com";
  } else if (lowerMessage.includes('heure')) {
    response = "Nous sommes ouverts du lundi au vendredi de 9h à 18h.";
  } else if (lowerMessage.includes('service') || lowerMessage.includes('prestation')) {
    response = "Nous proposons :\n• Service 1\n• Service 2\n• Service 3\n\nLequel vous intéresse ?";
  }

  // Envoyer la réponse
  await sendWhatsAppMessage(from, response);
}

// Fonction pour envoyer des messages via WhatsApp API
async function sendWhatsAppMessage(to: string, message: string) {
  try {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_TOKEN;

    if (!phoneNumberId || !accessToken) {
      throw new Error('WhatsApp credentials missing');
    }

    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

    const data = {
      messaging_product: 'whatsapp',
      to: to,
      text: { body: message }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`WhatsApp API error: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    console.log('Message WhatsApp envoyé:', result);
    
    return result;
  } catch (error) {
    console.error('Erreur envoi message WhatsApp:', error);
    throw error;
  }
}