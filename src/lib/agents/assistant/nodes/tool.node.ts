import { AssistantState } from '../state'
import { AIMessage, ToolMessage } from '@langchain/core/messages'
import { GraphNode } from '@langchain/langgraph'

import { createRetrievalTool } from '../../tools/retrieval.tool'
import { createSearchTool } from '../../tools/search.tool'

const RETRIEVAL_TOOL = createRetrievalTool()
const SEARCH_TOOL = createSearchTool()

const toolsByName: Record<string, any> = {
  retrieval_tool: RETRIEVAL_TOOL,
  tavily_search: SEARCH_TOOL,
}

export const ToolNode: GraphNode<typeof AssistantState> = async (state) => {
  const lastMessage = state.messages.at(-1)

  if (lastMessage == null || !AIMessage.isInstance(lastMessage)) {
    return { messages: [] }
  }

  const result: ToolMessage[] = []

  for (const toolCall of lastMessage.tool_calls ?? []) {
    console.log(toolCall.name)
    const tool = toolsByName[toolCall.name]
    const observation = await tool.invoke(toolCall)
    result.push(observation)
  }

  return { messages: result }
}
