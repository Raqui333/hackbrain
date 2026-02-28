import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { ChatOllama } from '@langchain/ollama'
import { ChatOpenAI } from '@langchain/openai'

export const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma3:1b'
export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'
export const GOOGLE_MODEL = process.env.GOOGLE_MODEL || 'gemini-2.5-flash'

export function getLLMModel(modelName: string) {
  // OLLAMA
  if (modelName === OLLAMA_MODEL) {
    return new ChatOllama({
      model: OLLAMA_MODEL,
      temperature: 0,
      maxRetries: 2,
    })
  }

  // OPENAI
  if (modelName === OPENAI_MODEL) {
    return new ChatOpenAI({
      model: OPENAI_MODEL,
      temperature: 0,
      maxRetries: 2,
    })
  }

  // GOOGLE
  if (modelName === GOOGLE_MODEL) {
    return new ChatGoogleGenerativeAI({
      model: GOOGLE_MODEL,
      temperature: 0,
      maxRetries: 2,
    })
  }

  // Default to gemma3:1b if no match
  return new ChatOllama({
    model: 'gemma3:1b',
    temperature: 0,
    maxRetries: 2,
  })
}
