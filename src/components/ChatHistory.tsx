import { Circle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

import CodeBlock from './CustomMarkdownElements/codeblock'
import React from 'react'

interface ChatTextAreaProps {
  history: any[]
}

function ChatHistory({ history }: ChatTextAreaProps) {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {history.map((message) => {
          return (
            <div key={message.kwargs.id} className="whitespace-pre-wrap">
              {message.id.includes('HumanMessage') && (
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-br-sm ml-auto w-fit">
                  <p className="text-foreground text-right">{message.kwargs.content}</p>
                </div>
              )}

              {message.id.some((part: string) => part.includes('AIMessage')) && (
                <div className="text-foreground break-words">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{ code: CodeBlock }}
                  >
                    {message.kwargs.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default React.memo(ChatHistory)
