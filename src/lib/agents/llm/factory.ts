import { ChatOllama } from '@langchain/ollama'
import { ChatOpenAI } from '@langchain/openai'

export function getLLMModel(modelName: string) {
  if (modelName === 'gemma3:1b') {
    return new ChatOllama({
      model: 'gemma3:1b',
      temperature: 0,
      maxRetries: 2,
    })
  }

  if (modelName === 'gpt-4o-mini') {
    return new ChatOpenAI({
      model: 'gpt-4o-mini',
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
