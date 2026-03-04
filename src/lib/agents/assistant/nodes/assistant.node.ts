import { AssistantState } from '@/lib/agents/assistant/state'
import { SystemMessage } from '@langchain/core/messages'
import { getLLMModel } from '@/src/lib/agents/llm/factory'
import { GraphNode } from '@langchain/langgraph'

import { createRetrievalTool } from '../../tools/retrieval.tool'
import { createSearchTool } from '../../tools/search.tool'

const RETRIEVAL_TOOL = createRetrievalTool()
const SEARCH_TOOL = createSearchTool()

export const AssistantNode: GraphNode<typeof AssistantState> = async (state, config) => {
  try {
    console.log('[AssistantNode]: Running with model:', config.context?.model)

    const llm = getLLMModel(config.context?.model)
    const llmWithTools = llm.bindTools([RETRIEVAL_TOOL, SEARCH_TOOL])

    const response = await llmWithTools.invoke([
      new SystemMessage(config.context?.SYSTEM_PROMPT),
      ...state.messages,
    ])

    return {
      messages: [...state.messages, response],
    }
  } catch (error) {
    console.error('[AssistantNode]: Error:', error)

    let errorMessage = 'Ocorreu um erro, desculpa 😔'

    if (error instanceof Error) {
      if (error.message.includes('does not support tools')) {
        errorMessage = 'O modelo que você selecionou não suporta ferramentas, tente outro modelo.'
      }
    }

    return {
      messages: [...state.messages, new SystemMessage(errorMessage)],
    }
  }
}
