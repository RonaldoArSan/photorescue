import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ error: 'URL não fornecida' }, { status: 400 });
    }

    console.log('🔄 Proxy: Buscando imagem de:', imageUrl);

    // Busca a imagem da URL externa
    const response = await fetch(imageUrl);

    if (!response.ok) {
      console.error('❌ Erro ao buscar imagem:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Falha ao buscar imagem', details: response.statusText },
        { status: response.status }
      );
    }

    // Obtém o blob da imagem
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('✅ Imagem obtida com sucesso, tamanho:', buffer.length, 'bytes');

    // Retorna a imagem com os headers corretos
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    console.error('❌ Erro no proxy de imagem:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: 'Erro ao processar imagem via proxy', details: errorMessage },
      { status: 500 }
    );
  }
}
