import { Bot, Loader2 } from 'lucide-react'

export function GenericToolFeedback({
  toolName,
  description,
}: {
  toolName: string
  description?: string
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#080808] hover:bg-[#0f0f0f] border border-[#333333]">
      <div className="flex items-center justify-center w-6 h-6 rounded-lg">
        <Bot className="w-10 h-10 text-blue-500" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{toolName}</p>
        {description && (
          <p className="text-xs text-white/60 mt-0.5 line-clamp-1">{description}</p>
        )}
      </div>
    </div>
  )
}
