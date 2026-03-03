import { AssistantState } from '../state'
import { AIMessage, ToolMessage } from '@langchain/core/messages'
import { GraphNode } from '@langchain/langgraph'
import { createRetrievalTool } from '../../tools/retrieval.tool'

const RETRIEVAL_TOOL = createRetrievalTool()

export const ToolNode: GraphNode<typeof AssistantState> = async (state) => {
  const lastMessage = state.messages.at(-1)

  if (lastMessage == null || !AIMessage.isInstance(lastMessage)) {
    return { messages: [] }
  }

  const result: ToolMessage[] = []

  for (const toolCall of lastMessage.tool_calls ?? []) {
    const tool = RETRIEVAL_TOOL
    const observation = await tool.invoke(toolCall)
    result.push(observation)
  }

  return { messages: result }
}
