//extraction/[id]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prismadb';
import { ExtractionTemplate, ExtractionStatus } from '@prisma/client'; // Import de ExtractionTemplate et ExtractionStatus

// GET
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Utilisation de Promise pour params
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params; // Await params ici

    const extraction = await prisma.extraction.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!extraction) {
      return NextResponse.json({ error: 'Extraction not found' }, { status: 404 });
    }

    return NextResponse.json(extraction, { status: 200 });
  } catch (error) {
    console.error('Error fetching extraction:', error);
    return NextResponse.json({ error: 'Failed to fetch extraction' }, { status: 500 });
  }
}

// PUT - Fusionné pour inclure Google Maps et Amazon
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Utilisation de Promise pour params
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params; // Await params ici
    const body = await req.json();
    const { 
      name, 
      template, 
      status, 
      searchTerm, 
      city, 
      country, 
      maxResults, 
      enrichEmails, 
      enrichPhones,
      googleMapsUrl,
      amazonUrl, // Nouveau champ Amazon
      amazonMaxResults // Nouveau champ Amazon
    } = body;

    // AJOUT DE LOGS POUR DÉBOGUER
    console.log('PUT /api/extractions/[id] - Updating extraction with data:', {
      id,
      name,
      template,
      status,
      searchTerm,
      city,
      country,
      maxResults,
      enrichEmails,
      enrichPhones,
      googleMapsUrl,
      amazonUrl,
      amazonMaxResults
    });

    const updatedExtraction = await prisma.extraction.update({
      where: { id, userId: session.user.id },
      data: { 
        name: name, // Utiliser directement la valeur du body
        template: template as ExtractionTemplate, // Caster vers ExtractionTemplate
        status: status as ExtractionStatus, // Caster vers ExtractionStatus
        searchTerm: searchTerm,
        city: city,
        country: country,
        maxResults: maxResults,
        enrichEmails: enrichEmails,
        enrichPhones: enrichPhones,
        googleMapsUrl: googleMapsUrl,
        amazonUrl: amazonUrl, // Sauvegarde du champ amazonUrl
        amazonMaxResults: amazonMaxResults, // Sauvegarde du champ amazonMaxResults
      },
    });

    console.log('PUT /api/extractions/[id] - Extraction updated successfully:', {
      id: updatedExtraction.id,
      template: updatedExtraction.template,
      googleMapsUrl: updatedExtraction.googleMapsUrl,
      amazonUrl: updatedExtraction.amazonUrl
    });

    return NextResponse.json(updatedExtraction, { status: 200 });
  } catch (error) {
    console.error('Error updating extraction:', error);
    return NextResponse.json({ error: 'Failed to update extraction' }, { status: 500 });
  }
}

// DELETE
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Utilisation de Promise pour params
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params; // Await params ici

    await prisma.extraction.delete({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ message: 'Extraction deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting extraction:', error);
    return NextResponse.json({ error: 'Failed to delete extraction' }, { status: 500 });
  }
}