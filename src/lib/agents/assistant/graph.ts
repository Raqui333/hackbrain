import { StateGraph, START, END } from '@langchain/langgraph'

import { AssistantState } from '@/lib/agents/assistant/state'
import { AssistantContext } from '@/lib/agents/assistant/context'

import { AssistantNode } from '@/src/lib/agents/assistant/nodes/assistant.node'

export function createAssistantGraph() {
  const graph = new StateGraph(AssistantState, AssistantContext)
    .addNode('AssistantNode', AssistantNode)
    .addEdge(START, 'AssistantNode')
    .addEdge('AssistantNode', END)

  return graph.compile()
}
