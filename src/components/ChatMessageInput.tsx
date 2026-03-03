import { ArrowUp } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Textarea } from './ui/textarea'
import { RefObject, useRef, useState } from 'react'

interface ChatInputProps {
  onSubmit: (input: string) => void
  streaming: boolean
  stopStreaming: () => void
}

export default function ChatMessageInput({ onSubmit, streaming, stopStreaming }: ChatInputProps) {
  const [input, setInput] = useState('')

  const sendButtonRef = useRef<HTMLButtonElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async () => {
    if (!input.trim()) return
    textAreaRef.current?.blur()
    onSubmit(input)
    setInput('')
  }

  return (
    <Card className="bg-white/4 border-white/10 w-full max-w-4xl mx-auto mb-2 p-4 gap-0">
      <CardContent className="p-0">
        <div className="flex items-center gap-2">
          <Textarea
            ref={textAreaRef}
            placeholder="Digite sua pergunta ou peça uma explicação..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={streaming}
            className="resize-none border-0 !bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/70 CustomScrollbar p-0"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendButtonRef.current?.click()
              }
            }}
          />
          {streaming ? (
            <Button
              className="h-8 w-8 text-gray-700 bg-white/4 hover:bg-white/10 border border-white/15"
              title="Stop"
              onClick={stopStreaming}
            >
              <div className="w-2 h-2 bg-white rounded-xs p-1.5" />
            </Button>
          ) : (
            <Button
              ref={sendButtonRef}
              disabled={!input.trim()}
              className="h-8 w-8 text-gray-700 bg-white hover:bg-white/80 disabled:bg-white/20 disabled:border-1 border-white/20 disabled:text-white/50"
              onClick={handleSubmit}
              title="Send"
            >
              <ArrowUp />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
