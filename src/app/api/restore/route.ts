import { NextResponse } from 'next/server';
import Replicate from 'replicate';

// Inicializa o cliente Replicate de forma segura no servidor
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Função para converter um stream de dados em Buffer
async function streamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const chunks: Buffer[] = [];
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({ 
        error: 'API do Replicate não configurada.', 
        details: 'Configure a variável REPLICATE_API_TOKEN no arquivo .env.local' 
      }, { status: 500 });
    }

    console.log('🚀 Iniciando restauração com Replicate (modelo especializado em restauração de fotos)...');

    // Converte o arquivo para base64
    const buffer = await streamToBuffer(file.stream());
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Usa o modelo GFPGAN para restauração de rostos e fotos antigas
    // Este modelo foi treinado especificamente para restaurar fotos danificadas
    const output = await replicate.run(
      "tencentarc/gfpgan:9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
      {
        input: {
          img: base64Image,
          version: "v1.4",
          scale: 2
        }
      }
    );

    console.log('📦 Resposta do Replicate:', typeof output, output);

    // O output do GFPGAN pode ser:
    // - Uma string (URL direta)
    // - Um array com URLs
    // - Um objeto com a propriedade output
    let restoredUrl: string;

    if (typeof output === 'string') {
      restoredUrl = output;
    } else if (Array.isArray(output) && output.length > 0) {
      restoredUrl = output[0];
    } else if (output && typeof output === 'object') {
      // Tenta extrair de várias formas possíveis
      restoredUrl = (output as any).output || (output as any).url || (output as any)[0];
    } else {
      console.error('❌ Formato de resposta inesperado:', output);
      throw new Error('Formato de resposta do modelo não reconhecido');
    }

    if (!restoredUrl || typeof restoredUrl !== 'string') {
      console.error('❌ URL inválida extraída:', restoredUrl);
      throw new Error('Modelo não retornou uma URL válida');
    }

    console.log('✅ Restauração com Replicate concluída! URL:', restoredUrl);

    return NextResponse.json({
      restored_image_url: restoredUrl,
      analysis: 'Imagem restaurada usando GFPGAN, um modelo de IA especializado em restauração de fotos antigas. O modelo corrigiu danos, melhorou a qualidade facial, ajustou cores e aumentou a resolução.',
      suggestions: ['ai-restoration', 'face-enhancement', 'upscaling'],
    });

  } catch (error) {
    console.error('❌ Erro na API de restauração:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no servidor';
    return NextResponse.json({ 
      error: 'Falha ao restaurar a imagem com IA.', 
      details: errorMessage 
    }, { status: 500 });
  }
}
