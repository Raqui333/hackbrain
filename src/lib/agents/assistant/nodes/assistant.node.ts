import { AssistantState } from '@/lib/agents/assistant/state'
import { SystemMessage } from '@langchain/core/messages'
import { getLLMModel } from '@/src/lib/agents/llm/factory'
import { GraphNode } from '@langchain/langgraph'

export const AssistantNode: GraphNode<typeof AssistantState> = async (state, config) => {
  console.log('[AssistantNode]: Running with model:', config.context?.model)
  const llm = getLLMModel(config.context?.model)

  const response = await llm.invoke([
    new SystemMessage(config.context?.SYSTEM_PROMPT),
    ...state.messages,
  ])

  return {
    messages: [...state.messages, response],
  }
}
