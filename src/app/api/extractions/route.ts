//api/extraction/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prismadb';
import { ExtractionTemplate } from '@prisma/client';

export async function GET(req: Request) {
  try {
    console.log('[API Extractions] Début de la récupération des extractions');
    
    const session = await getServerSession(authOptions);
    console.log('[API Extractions] Session:', session);

    if (!session || !session.user || !session.user.id) {
      console.log('[API Extractions] Non autorisé');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[API Extractions] Récupération des extractions pour user:', session.user.id);
    
    const extractions = await prisma.extraction.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('[API Extractions] Extractions trouvées:', extractions.length);
    
    return NextResponse.json(extractions, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
  } catch (error) {
    console.error('[API Extractions] Erreur détaillée:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch extractions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, template } = await req.json();

    if (!name || !template) {
      return NextResponse.json({ error: 'Name and template are required' }, { status: 400 });
    }

    const newExtraction = await prisma.extraction.create({
      data: {
        userId: session.user.id,
        name,
        template: template as ExtractionTemplate,
        status: 'draft',
      },
    });

    return NextResponse.json(newExtraction, { status: 201 });
  } catch (error) {
    console.error('Error creating extraction:', error);
    return NextResponse.json({ 
      error: 'Failed to create extraction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}