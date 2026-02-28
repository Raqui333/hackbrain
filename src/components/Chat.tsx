'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import Logo from './Logo'
import ChatHistory from './ChatHistory'
import StreamingMessage from './StreamingMessage'
import ChatMessageInput from './ChatMessageInput'

import { fetchEventSource } from '@microsoft/fetch-event-source'

export default function Chat() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastScrollTimeRef = useRef(0)

  const [history, setHistory] = useState<any[]>([])
  const [currentMessage, setCurrentMessage] = useState<string>('')

  const sendMessage = async (input: string) => {
    setCurrentMessage('')

    await fetchEventSource('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history: history,
        message: input,
      }),
      onmessage(event) {
        if (event.data === '[DONE]') return

        const data = JSON.parse(event.data)

        if (data.type === 'chunk') {
          setCurrentMessage((prev) => prev + data.content)
        }

        if (data.type === 'history') {
          setHistory(data.messages)
          setCurrentMessage('')
        }
      },
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentMessage])

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

  return (
    <div className="flex-1 flex flex-col justify-center h-screen overflow-hidden">
      {history.length > 0 || currentMessage.length > 0 ? (
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto CustomScrollbar transition-opacity duration-300 ease-in-out"
        >
          {/* Chat History */}
          <ChatHistory history={history} />

          {/* Streaming Message */}
          {currentMessage.length > 0 && <StreamingMessage message={currentMessage} />}
        </div>
      ) : (
        <div className="flex items-center justify-center my-5">
          <Logo variant="large" />
        </div>
      )}

      {/* Input */}
      <div className={false ? 'pointer-events-none opacity-50' : ''}>
        <ChatMessageInput onSubmit={sendMessage} />
      </div>
    </div>
  )
}
