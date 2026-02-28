import { SYSTEM_PROMPT } from './system-prompt'
import { z } from 'zod'

export const AssistantContext = z.object({
  SYSTEM_PROMPT: z.string().default(SYSTEM_PROMPT),
  model: z.union([z.literal('gemma3:1b'), z.literal('gpt-4o-mini')]).default('gemma3:1b'),
})
