import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const confidenceThreshold = parseFloat(url.searchParams.get('confidenceThreshold') || '0.6');

  try {
    const texts = await prisma.medicalText.findMany({
      where: { confidence: { lte: confidenceThreshold } },
      orderBy: { confidence: 'asc' },
    });
    return NextResponse.json(texts);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { text, annotateTime, confidence } = await req.json();

    const updatedText = await prisma.medicalText.update({
      where: { id },
      data: { text, annotateTime, confidence },
    });

    return NextResponse.json(updatedText);
  } catch (error) {
    console.error('Error updating medical text:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}