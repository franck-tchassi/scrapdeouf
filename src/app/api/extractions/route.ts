//api/extraction/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prismadb';
import { ExtractionTemplate } from '@prisma/client'; // Import de ExtractionTemplate

// POST
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
        template: template as ExtractionTemplate, // Caster le template
        status: 'draft',
      },
    });

    return NextResponse.json(newExtraction, { status: 201 });
  } catch (error) {
    console.error('Error creating extraction:', error);
    return NextResponse.json({ error: 'Failed to create extraction' }, { status: 500 });
  }
}

// GET (pour récupérer toutes les extractions de l'utilisateur)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const extractions = await prisma.extraction.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(extractions, { status: 200 });
  } catch (error) {
    console.error('Error fetching extractions:', error);
    return NextResponse.json({ error: 'Failed to fetch extractions' }, { status: 500 });
  }
}   