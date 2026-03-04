import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

import CodeBlock from './CustomMarkdownElements/codeblock'
import React from 'react'

import { Message } from '../hooks/use-chat'
import { GenericToolFeedback } from './CustomToolElements/GenericToolFeedback'
import { SearchToolResult } from './CustomToolElements/SearchToolResult'

interface ChatTextAreaProps {
  history: Message[]
}

function ChatHistory({ history }: ChatTextAreaProps) {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {history.map((message) => {
          return (
            <div key={message.id}>
              {message.type === 'Human' && (
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-br-sm ml-auto w-fit">
                  <p className="text-foreground text-right">{message.content}</p>
                </div>
              )}

              {message.type === 'Tool' && message.tool_name === 'tavily_search' && (
                <SearchToolResult data={message.content} />
              )}

              {message.type === 'Tool' && message.tool_name === 'retrieval_tool' && (
                <GenericToolFeedback toolName="Consulta Interna Realizada" description="A IA realizou uma busca de informações nos documentos enviados pelo usuário." />
              )}

              {message.type === 'System' && (
                <div className="text-foreground break-words CustomMarkdown">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{ code: CodeBlock }}
                  >
                    {message.content}
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
