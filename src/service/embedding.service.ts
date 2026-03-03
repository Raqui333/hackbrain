import { OllamaEmbeddings } from '@langchain/ollama'
import { OpenAIEmbeddings } from '@langchain/openai'
import { Pinecone } from '@pinecone-database/pinecone'
import { getEmbeddingModel } from '../lib/agents/llm/factory'

const DEFAULT_EMBEDDING_MODEL = process.env.DEFAULT_EMBEDDING_MODEL || 'text-embedding-3-small'

export class EmbeddingService {
  model: OllamaEmbeddings | OpenAIEmbeddings
  pinecone: Pinecone

  constructor() {
    this.model = getEmbeddingModel(DEFAULT_EMBEDDING_MODEL)
    this.pinecone = new Pinecone()
  }

  async generateEmbedding(content: string): Promise<number[]> {
    if (!content || content.trim() === '') {
      throw new Error('Please provide valid content to generate embeddings.')
    }

    // Generate the embedding vectors
    const vectors = await this.model.embedQuery(content)

    return vectors || []
  }

  async upsertContentToPinecone(id: string, content: string, vector: number[]): Promise<void> {
    const index = this.pinecone.Index(process.env.PINECONE_INDEX_NAME || 'hackbrain')

    index.upsert([
      {
        id,
        values: vector,
        metadata: {
          content,
        },
      },
    ])
  }

  async queryPinecone(query: string, topK: number = 5) {
    const index = this.pinecone.Index(process.env.PINECONE_INDEX_NAME || 'hackbrain')
    const vector = await this.generateEmbedding(query)

    return index.query({
      vector,
      topK,
      includeValues: false,
      includeMetadata: true,
    })
  }
}
