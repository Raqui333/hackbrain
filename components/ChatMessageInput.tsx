import { ArrowUp } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Textarea } from './ui/textarea'
import { useRef, useState } from 'react'

import { ChatStatus } from 'ai'

interface ChatInputProps {
  onSubmit: (input: string) => void
  status: ChatStatus
}

export default function ChatMessageInput({ onSubmit, status }: ChatInputProps) {
  const [input, setInput] = useState('')

  const sendButtonRef = useRef<HTMLButtonElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async () => {
    if (!input.trim()) return
    textAreaRef.current?.blur()
    onSubmit(input)
    setInput('')
  }

  const disabled = status === 'streaming' || status === 'submitted'

  return (
    <Card className="bg-white/4 border-white/10 w-full max-w-4xl mx-auto my-10 p-4 gap-0">
      <CardContent className="p-0">
        <div className="flex items-center gap-2">
          <Textarea
            disabled={disabled}
            ref={textAreaRef}
            placeholder="Digite sua pergunta ou peça uma explicação..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="resize-none border-0 !bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/70 CustomScrollbar p-0"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendButtonRef.current?.click()
              }
            }}
          />
          <Button
            ref={sendButtonRef}
            disabled={!input.trim() || disabled}
            className="h-8 w-8 text-gray-700 bg-white hover:bg-white/80 disabled:bg-white/20 disabled:border-1 border-white/20 disabled:text-white/50"
            onClick={handleSubmit}
          >
            <ArrowUp />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
