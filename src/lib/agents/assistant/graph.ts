import { StateGraph, START, END } from '@langchain/langgraph'

import { AssistantState } from '@/lib/agents/assistant/state'
import { AssistantContext } from '@/lib/agents/assistant/context'

import { AssistantNode } from '@/src/lib/agents/assistant/nodes/assistant.node'
import { ToolNode } from '@/src/lib/agents/assistant/nodes/tool.node'

import { shouldContinue } from '@/src/lib/agents/assistant/nodes/routers/should-continue.router'

export function createAssistantGraph() {
  const graph = new StateGraph(AssistantState, AssistantContext)
    .addNode('AssistantNode', AssistantNode)
    .addNode('ToolNode', ToolNode)
    .addEdge(START, 'AssistantNode')
    .addConditionalEdges("AssistantNode", shouldContinue as any, ["ToolNode", END])
    .addEdge('ToolNode', 'AssistantNode')

  return graph.compile()
}
