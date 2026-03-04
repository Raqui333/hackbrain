'use client'

import { ChevronDown, ExternalLink, Globe } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { cn } from '@/src/lib/utils'

interface SearchToolResultProps {
  data: string
  initialVisible?: number
}

export function SearchToolResult({ data, initialVisible = 3 }: SearchToolResultProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { results } = JSON.parse(data)

  const visibleResults = isExpanded ? results : results.slice(0, initialVisible)
  const hasMore = results.length > initialVisible

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="flex justify-center items-center bg-blue-500/20 border border-blue-500/20 w-6 h-6 rounded-full text-xs text-blue-300">
          {results.length}
        </div>
        <p className="font-medium">Resultados da Busca</p>
      </div>
      <div className={cn('flex gap-3 w-full', isExpanded && 'flex-col')}>
        {visibleResults.map((result: { url: string; title: string; content: string }) => (
          <div key={result.url} className="flex-1 min-w-0">
            <WebCard url={result.url} title={result.title} description={result.content} />
          </div>
        ))}
      </div>

      {hasMore && (
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center gap-2 w-full px-4 rounded-lg text-xs text-[#999999] hover:text-blue-500 hover:cursor-pointer bg-transparent hover:bg-transparent"
        >
          {isExpanded ? 'Ver menos' : `Ver mais ${results.length - initialVisible} resultados`}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </Button>
      )}
    </div>
  )
}

interface WebCardProps {
  url: string
  title: string
  description?: string
}

function WebCard({ url, title, description }: WebCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col group bg-[#0f0f0f] hover:bg-[#181818] border border-[#222222] gap-2 p-3 rounded-lg transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-blue-500 transition-colors line-clamp-1">
          {title}
        </h3>
        <ExternalLink className="w-4 h-4 flex-shrink-0 mt-0.5" />
      </div>
      <div className="flex items-center gap-1">
        <Globe className="w-3 h-3 text-muted-foreground flex-shrink-0" />
        <p className="text-xs text-muted-foreground truncate">{url}</p>
      </div>
      {description && <p className="text-xs text-muted-foreground line-clamp-3">{description}</p>}
    </a>
  )
}
