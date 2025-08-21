import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { v4 as uuidv4 } from 'uuid';
import getEmbedContent from '@/lib/embeddings';

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' });
const index = pc.Index(process.env.PINECONE_INDEX_NAME || 'brainhack');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || !body.content || body.content.trim() === '') {
      return new NextResponse('Erro: Conteúdo não fornecido ou vazio', {
        status: 400,
      });
    }

    const vector: number[] = await getEmbedContent(body.content);

    await index.upsert([
      {
        id: uuidv4(),
        values: vector,
        metadata: { text: body.content },
      },
    ]);

    return new NextResponse('Embedding gerado com sucesso!', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse('Erro ao processar a requisição', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
