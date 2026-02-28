import { SYSTEM_PROMPT } from './system-prompt'

import { OLLAMA_MODEL } from '../llm/factory'
import { OPENAI_MODEL } from '../llm/factory'
import { GOOGLE_MODEL } from '../llm/factory'

import { z } from 'zod'

export const AssistantContext = z.object({
  SYSTEM_PROMPT: z.string().default(SYSTEM_PROMPT),
  model: z
    .union([z.literal(OLLAMA_MODEL), z.literal(OPENAI_MODEL), z.literal(GOOGLE_MODEL)])
    .default(OLLAMA_MODEL),
})
