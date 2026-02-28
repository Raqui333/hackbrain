import { NextRequest, NextResponse } from 'next/server'
import { SYSTEM_PROMPT } from '@/src/lib/agents/assistant/system-prompt'
import { HumanMessage } from '@langchain/core/messages'
import { createAssistantGraph } from '@/src/lib/agents/assistant/graph'

const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'gemma3:1b'

export async function POST(request: NextRequest) {
  try {
    const { history, message } = await request.json()

    if (!message || !history) {
      return new NextResponse('Message and history are required', { status: 400 })
    }

    const graph = createAssistantGraph()

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()

        const eventStream = await graph.stream(
          { messages: [...history, new HumanMessage(message)] },
          {
            streamMode: ['messages', 'values'],
            context: {
              SYSTEM_PROMPT,
              model: DEFAULT_MODEL,
            },
          },
        )

        for await (const [type, data] of eventStream) {
          switch (type) {
            case 'messages': {
              const chunk = data[0].content
              if (chunk) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`),
                )
              }
              break
            }
            case 'values': {
              const messages = data.messages ?? []
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'history', messages })}\n\n`),
              )
              break
            }
            default:
              break
          }
        }

        controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream' },
    })
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
