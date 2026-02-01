import { useCallback, useEffect, useRef } from 'react'

import ChatTextArea from './ChatTextArea'
import ChatMessageInput from './ChatMessageInput'
import Logo from './Logo'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

export default function Chat() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastScrollTimeRef = useRef(0)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/agent',
    }),
    experimental_throttle: 100,
  })

  useEffect(() => {
    if (status === 'streaming' || status === 'submitted') {
      scrollToBottom()
    }
  }, [status, messages])

  const onSubmit = (input: string) => {
    sendMessage({ text: input })
  }

  const scrollToBottom = useCallback(() => {
    const now = Date.now()

    if (now - lastScrollTimeRef.current < 30) {
      return
    }

    lastScrollTimeRef.current = now

    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  if (status === 'ready') {
    console.log(messages)
  }

  const disabled = status === 'streaming' || status === 'submitted'

  return (
    <div className="flex-1 flex flex-col justify-center h-screen overflow-hidden">
      {messages.length > 0 ? (
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto CustomScrollbar transition-opacity duration-300 ease-in-out"
        >
          <ChatTextArea messages={messages} status={status} />
        </div>
      ) : (
        <div className="flex items-center justify-center my-5">
          <Logo variant="large" />
        </div>
      )}

      <div className={disabled ? 'pointer-events-none opacity-50' : ''}>
        <ChatMessageInput onSubmit={onSubmit} />
      </div>
    </div>
  )
}
