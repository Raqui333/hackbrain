import { AssistantState } from '../../state'
import { AIMessage } from '@langchain/core/messages'
import { ConditionalEdgeRouter, END } from '@langchain/langgraph'

export const shouldContinue: ConditionalEdgeRouter<
typeof AssistantState,
  Record<'ToolNode', any>
> = (state) => {
  const lastMessage = state.messages.at(-1)

  // Check if it's an AIMessage before accessing tool_calls
  if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
    return END
  }

  // If the LLM makes a tool call, then perform an action
  if (lastMessage.tool_calls?.length) {
    return 'ToolNode'
  }

  // Otherwise, we stop (reply to the user)
  return END
}
