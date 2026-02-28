import { StateSchema, MessagesValue } from '@langchain/langgraph'

export const AssistantState = new StateSchema({
  messages: MessagesValue,
})
