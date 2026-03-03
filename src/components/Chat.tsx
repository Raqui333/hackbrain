'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import Logo from './Logo'
import ChatHistory from './ChatHistory'
import StreamingMessage from './StreamingMessage'
import ChatMessageInput from './ChatMessageInput'

import { cn } from '../lib/utils'
import { ArrowDown } from 'lucide-react'
import { useChat } from '../hooks/use-chat'

export default function Chat() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const lastScrollTimeRef = useRef(0)

  const [isAtBottom, setIsAtBottom] = useState<boolean>(true)

  const { history, currentMessage, sendMessage, isStreaming, stopStreaming } = useChat()

  useEffect(() => {
    const scrollContainer = scrollRef.current
    const bottomElement = bottomRef.current

    if (!bottomElement || !scrollContainer) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtBottom(entry.isIntersecting)
      },
      {
        root: scrollContainer,
        threshold: 1.0,
      },
    )

    observer.observe(bottomElement)

    return () => observer.disconnect()
  }, [scrollRef.current])

  const scrollToBottom = useCallback(() => {
    const now = Date.now()

    if (now - lastScrollTimeRef.current < 30) {
      return
    }

    lastScrollTimeRef.current = now

    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [])

  const sendMessageWrapper = useCallback(
    (input: string) => {
      scrollToBottom()
      sendMessage(input)
    },
    [sendMessage, scrollToBottom],
  )

  return (
    <div className="flex-1 flex flex-col justify-center h-screen overflow-hidden">
      {history.length > 0 || currentMessage.length > 0 ? (
        <div
          ref={scrollRef}
          className={cn(
            'flex-1 overflow-y-auto CustomScrollbar transition-opacity duration-300 ease-in-out pb-50',
          )}
        >
          {/* Chat History */}
          <ChatHistory history={history} />

          {/* Streaming Message */}
          {currentMessage.length > 0 && <StreamingMessage message={currentMessage} />}

          {/* Bottom Ref */}
          <div ref={bottomRef} />
        </div>
      ) : (
        <div className="flex items-center justify-center my-5">
          <Logo variant="large" />
        </div>
      )}

      {/* Input */}
      <div className={'relative flex flex-col justify-center items-center mb-1'}>
        {!isAtBottom && (
          <div
            className="absolute -top-15 bg-[#0f0f0f] hover:bg-[#181818] border border-[#333333] p-1 rounded-full animate-bounce"
            onClick={scrollToBottom}
          >
            <ArrowDown className="w-6 h-6" />
          </div>
        )}
        <ChatMessageInput
          onSubmit={sendMessageWrapper}
          streaming={isStreaming}
          stopStreaming={stopStreaming}
        />
        {history.length > 0 && (
          <span className="text-[12px]">Hack Brain can make mistakes. Check Important info.</span>
        )}
      </div>
    </div>
  )
}
