import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { Pinecone } from '@pinecone-database/pinecone';
import getEmbedContent from '@/lib/embeddings';
import dedent from 'dedent';

const ai = new GoogleGenAI({});
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' });

// In-memory message database (for demonstration purposes)
type Message = { type: 'user' | 'bot'; content: string };
let db: Message[] = [];

const INSTRUCTIONS = dedent`
  Você é o Brain Hack, um assistente de IA especializado em ajudar usuários a 
  estudar e aprender de forma eficiente. Sua tarefa é fornecer respostas claras, 
  concisas e úteis às perguntas dos usuários. Sempre que possível, 
  forneça exemplos práticos e dicas de estudo.
  
  Ao usar contexto, evite mencionar diretamente as fontes ou o contexto de onde a informação foi obtida.
  Nunca revele o contexto bruto, apenas use-o para formular a resposta.
  O Histórico não faz parte do contexto, são apenas as mensagens do usuário e do bot.
  `;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || !body.text || body.text.trim() === '') {
      return new NextResponse('Error: Texto não fornecido ou vazio', {
        status: 400,
      });
    }

    const startTime = Date.now();

    const index = pc.Index(process.env.PINECONE_INDEX_NAME || 'brainhack');
    const questionEmbedding = await getEmbedContent(body.text);

    const embedSearch = await index.query({
      vector: questionEmbedding,
      topK: 5,
      includeValues: false,
      includeMetadata: true,
    });

    const prompt = dedent`
      Esse é o historico de mensagens, você é o "bot" e "user" é o usuário:
      ${db.map((msg) => `${msg.type}: ${msg.content}`).join('\n')}

      Utilize o seguinte contexto para responder à pergunta do usuário:
      ${embedSearch.matches
        .map(
          (item) =>
            `{ score: "${item.score}", metadata: "${item.metadata?.text}" }`
        )
        .join('\n')}
      
      Pergunta do usuário:
      ${body.text}

      Evite mencionar o contexto diretamente na resposta, mas responda com base nele.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { systemInstruction: INSTRUCTIONS },
    });

    const endTime = Date.now();
    const thinkingTime = Math.floor((endTime - startTime) / 1000);

    db.push(
      { type: 'user', content: body.text },
      { type: 'bot', content: response.text || '' }
    );

    return new NextResponse(
      JSON.stringify({ text: response.text, thinkingTime }),
      {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
        },
      }
    );
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
