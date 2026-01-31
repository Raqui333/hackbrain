import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { Pinecone } from '@pinecone-database/pinecone'
import getEmbedContent from '@/lib/embeddings'
import dedent from 'dedent'

import { convertToModelMessages, streamText, UIMessage } from 'ai'

import { google } from '@ai-sdk/google'
import { ollama } from 'ollama-ai-provider-v2'

const ai = new GoogleGenAI({})
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' })

const INSTRUCTIONS = dedent`
  Você é o Brain Hack, um assistente de IA especializado em ajudar usuários a 
  estudar e aprender de forma eficiente. Sua tarefa é fornecer respostas claras, 
  concisas e úteis às perguntas dos usuários. Sempre que possível, 
  forneça exemplos práticos e dicas de estudo.
  
  Ao usar contexto, evite mencionar diretamente as fontes ou o contexto de onde a informação foi obtida.
  Nunca revele o contexto bruto, apenas use-o para formular a resposta.
  O Histórico não faz parte do contexto, são apenas as mensagens do usuário e do bot.
  `

export async function POST(request: NextRequest) {
  try {
    const { messages }: { messages: UIMessage[] } = await request.json()

    // const index = pc.Index(process.env.PINECONE_INDEX_NAME || 'brainhack');
    // const questionEmbedding = await getEmbedContent(body.text);

    // const embedSearch = await index.query({
    //   vector: questionEmbedding,
    //   topK: 5,
    //   includeValues: false,
    //   includeMetadata: true,
    // });

    const response = streamText({
      model: ollama('gemma3:1b'),
      //model: google('gemini-2.5-flash'),
      system: INSTRUCTIONS,
      messages: await convertToModelMessages(messages),
      temperature: 0.7,
    })

    return response.toUIMessageStreamResponse()
  } catch (error) {
    console.error(error)
    return new NextResponse('Erro ao processar a requisição', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
}
