import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Traitement des messages WhatsApp ici
        console.log('Message WhatsApp reçu:', body);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erreur WhatsApp:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        // Gérer la vérification du webhook WhatsApp
        const { searchParams } = new URL(req.url);
        const mode = searchParams.get('hub.mode');
        const token = searchParams.get('hub.verify_token');
        const challenge = searchParams.get('hub.challenge');

        // Vérifier le token (à définir dans vos variables d'environnement)
        if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
            return new Response(challenge, {
                status: 200,
                headers: { 'Content-Type': 'text/plain' }
            });
        }

        return new Response('Forbidden', { status: 403 });
    } catch (error) {
        console.error('Erreur de vérification WhatsApp:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}