import { QueryResponse, RecordMetadata } from '@pinecone-database/pinecone'
import { EmbeddingService } from '@/src/service/embedding.service'
import { tool } from '@langchain/core/tools'
import { z } from 'zod'

export function createRetrievalTool() {
  return tool(
    async (input) => {
      console.log('[RetrievalTool] Running retrieval tool')
      const { query } = input
      const embeddingService = new EmbeddingService()
      const results = await embeddingService.queryPinecone(query, 5)
      return formatResult(results)
    },
    {
      name: 'retrieval_tool',
      description: 'A tool to retrieve relevant information from a knowledge base.',
      schema: z.object({
        query: z.string().describe('The search query to retrieve relevant information.'),
      }),
    },
  )
}

function formatResult(result: QueryResponse<RecordMetadata>) {
  return result.matches
    .map(
      (match) => `
SCORE: ${match.score}
${match.metadata?.content}
    `,
    )
    .flat()
    .join('\n---\n')
}
