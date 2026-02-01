import { Circle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

import { UIMessage, ChatStatus } from 'ai'
import CodeBlock from './CustomMarkdownElements/codeblock'

interface ChatTextAreaProps {
  messages: UIMessage[]
  status: ChatStatus
}

export default function ChatTextArea({ messages, status }: ChatTextAreaProps) {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message) => {
          const assistantMarkdown = message.parts
            .filter((part) => part.type === 'text')
            .map((part) => part.text)
            .join(' ')

          return (
            <div key={message.id} className="whitespace-pre-wrap">
              {message.role === 'user' && (
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-br-sm ml-auto w-fit">
                  <p className="text-foreground text-right">
                    {message.parts.map((part) => (part.type === 'text' ? part.text : ''))}
                  </p>
                </div>
              )}

              {message.role === 'assistant' && (
                <div className="text-foreground break-words">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{ code: CodeBlock }}
                  >
                    {assistantMarkdown}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          )
        })}

        {/* Loading Indicator */}
        <Circle size={20} className={status === 'submitted' ? 'animate-pulse text-blue-500' : 'opacity-0'} />
      </div>
    </div>
  )
}
