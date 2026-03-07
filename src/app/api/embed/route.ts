import { EmbeddingService } from '@/src/service/embedding.service'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { NextRequest, NextResponse } from 'next/server'

// Lazy implementation
export async function POST(request: NextRequest) {
  try {
    const embeddingService = new EmbeddingService()

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 })

    const docs = []
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const loader = new PDFLoader(new Blob([buffer]))
      const loadedDocs = await loader.load()
      docs.push(...loadedDocs)
    }

    const chunks = await splitter.splitDocuments(docs)

    for (const chunk of chunks) {
      const formmattedContent = formatChunkForEmbedding(chunk)

      const vector = await embeddingService.generateEmbedding(formmattedContent)
      const id = crypto.randomUUID()

      await embeddingService.upsertContentToPinecone(id, formmattedContent, vector)
      console.log('[Embedding] Embedding document:', chunk.metadata.source)
    }

    return new NextResponse('All files embedded successfully', {
      status: 200,
    })
  } catch (error) {
    console.error(error)
    return new NextResponse('Error while embedding your files', {
      status: 500,
    })
  }
}

function formatChunkForEmbedding(chunk: any) {
  return `
Source: ${chunk.metadata.source}
Page: ${chunk.metadata.loc.pageNumber} of ${chunk.metadata.pdf.totalPages}

Content:
${chunk.pageContent}
`
}
