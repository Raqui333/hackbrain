import { useCallback, useRef, useState } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source'

export type Message = {
  id: string
  type: 'Human' | 'System'
  content: string
}

export function useChat() {
  const abortControllerRef = useRef<AbortController | null>(null)

  const [internalHistory, setInternalHistory] = useState<any[]>([])
  const [history, setHistory] = useState<Message[]>([])

  const [currentMessage, setCurrentMessage] = useState<string>('')
  const [isStreaming, setIsStreaming] = useState<boolean>(false)

  const sendMessage = useCallback(async (input: string) => {
    abortControllerRef.current?.abort()

    const controller = new AbortController()
    abortControllerRef.current = controller

    setCurrentMessage('')
    setIsStreaming(true)

    setHistory((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: 'Human',
        content: input,
      },
    ])

    await fetchEventSource('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history: internalHistory,
        message: input,
      }),
      openWhenHidden: true, // prevent the connection to close on focus lost
      signal: controller.signal,
      onerror: (err) => {
        setIsStreaming(false)
        throw err /* prevent retry loop */
      },
      onmessage(event) {
        if (event.data === '[DONE]') {
          setIsStreaming(false)
          return
        }

        const data = JSON.parse(event.data)

        if (data.type === 'chunk') {
          setCurrentMessage((prev) => prev + data.content)
        }

        if (data.type === 'history') {
          setInternalHistory(data.messages)

          const mappedHistoryData = data.messages.map((message: any) => ({
            id: message.kwargs.id,
            type: message.id.includes('HumanMessage') ? 'Human' : 'System',
            content: message.kwargs.content,
          }))

          setHistory(mappedHistoryData)
          setCurrentMessage('')
        }
      },
    })
  }, [internalHistory])

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort()
    setIsStreaming(false)
  }, [abortControllerRef])

  return {
    history,
    currentMessage,
    isStreaming,
    sendMessage,
    stopStreaming,
  }
}
