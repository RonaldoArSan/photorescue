import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ error: 'URL da imagem é obrigatória' }, { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar imagem: ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Erro no proxy de imagem:', error);
    return NextResponse.json({ error: 'Erro ao processar imagem' }, { status: 500 });
  }
}