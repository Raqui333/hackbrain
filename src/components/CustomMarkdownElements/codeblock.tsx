interface CodeProps {
  node?: any
  className?: string
  children?: React.ReactNode
  [key: string]: any
}

// Custom code block component for rendering code snippets in React Markdown
export default function CodeBlock({ node, className, children, ...props }: CodeProps) {
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
