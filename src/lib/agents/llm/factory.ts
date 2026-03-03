import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { ChatOllama, OllamaEmbeddings } from '@langchain/ollama'
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'

// Models
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma3:1b'
export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'
export const GOOGLE_MODEL = process.env.GOOGLE_MODEL || 'gemini-2.5-flash'

const TEMPERATURE = 0.7

// Embeddings
export const OLLAMA_EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || 'embeddinggemma'
export const OPENAI_EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small'

const EMBEDDING_DIMENSIONS = 1024

export function getLLMModel(modelName: string) {
  // OLLAMA
  if (modelName === OLLAMA_MODEL) {
    return new ChatOllama({
      model: OLLAMA_MODEL,
      temperature: TEMPERATURE,
      maxRetries: 2,
    })
  }

  // OPENAI
  if (modelName === OPENAI_MODEL) {
    return new ChatOpenAI({
      model: OPENAI_MODEL,
      temperature: TEMPERATURE,
      maxRetries: 2,
    })
  }

  // GOOGLE
  if (modelName === GOOGLE_MODEL) {
    return new ChatGoogleGenerativeAI({
      model: GOOGLE_MODEL,
      temperature: TEMPERATURE,
      maxRetries: 2,
    })
  }

  // Default to OLLAMA if no match
  return new ChatOllama({
    model: OLLAMA_MODEL,
    temperature: TEMPERATURE,
    maxRetries: 2,
  })
}

export function getEmbeddingModel(modelName: string) {
  if (modelName === OLLAMA_EMBEDDING_MODEL) {
    return new OllamaEmbeddings({
      model: OLLAMA_EMBEDDING_MODEL,
      dimensions: EMBEDDING_DIMENSIONS,
      maxRetries: 2,
    })
  }

  if (modelName === OPENAI_EMBEDDING_MODEL) {
    return new OpenAIEmbeddings({
      model: OPENAI_EMBEDDING_MODEL,
      dimensions: EMBEDDING_DIMENSIONS,
      maxRetries: 2,
    })
  }

  // Default to Ollama if no match
  return new OllamaEmbeddings({
    model: OLLAMA_EMBEDDING_MODEL,
    dimensions: EMBEDDING_DIMENSIONS,
    maxRetries: 2,
  })
}
