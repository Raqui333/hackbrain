import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

import CodeBlock from '../CustomMarkdownElements/codeblock'
import React from 'react'

function StreamingMessage({ message }: { message: string }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6 text-foreground break-words CustomMarkdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{ code: CodeBlock }}
      >
        {message}
      </ReactMarkdown>
    </div>
  )
}

export default React.memo(StreamingMessage)
