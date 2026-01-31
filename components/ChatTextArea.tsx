import { Brain, Circle, CircleX } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

import { UIMessage, ChatStatus } from 'ai'

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

interface CodeProps {
  node?: any
  className?: string
  children?: React.ReactNode
  [key: string]: any
}

// Custom code block component for rendering code snippets in React Markdown
function CodeBlock({ node, className, children, ...props }: CodeProps) {
  const match = /language-(\w+)/.exec(className || '')
  const lang = match?.[1] || 'plaintext'

  const isBlock = node?.children[0].position === undefined

  if (isBlock) {
    return (
      <div className="overflow-hidden rounded-lg bg-white/10 text-gray-100 my-4">
        <div className="flex items-center justify-between px-3 py-1.5 bg-white/10 text-xs text-gray-400 font-mono">
          <span>{lang}</span>
        </div>
        <pre className="overflow-x-auto text-sm p-2">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    )
  }

  return <code className="bg-white/20 rounded px-1.5 py-0.5 font-mono text-sm">{children}</code>
}
