import { GoogleGenAI } from '@google/genai';

export default async function getEmbedContent(content: string) {
  const ai = new GoogleGenAI({});

  if (!content || content.trim() === '') {
    throw new Error('Conteúdo não fornecido');
  }

  try {
    const response = await ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: content,
    });

    if (!response || !response.embeddings || !response.embeddings[0].values) {
      throw new Error('Error: Embedding não gerado');
    }

    return response.embeddings[0].values;
  } catch (error) {
    console.error('Erro ao gerar embedding:', error);
    throw new Error('Erro ao gerar embedding: ' + error);
  }
}
