import { useState, useRef, useCallback } from 'react'
import { UploadCloud } from 'lucide-react'
import { cn } from '@/lib/utils'

import type { UploadedFile } from './knowledge.types'

interface DropZoneProps {
  uploadDocument: (files: UploadedFile[]) => void
}

export function DropZone({ uploadDocument }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles)

    const mapped: UploadedFile[] = arr.map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      status: 'uploading',
      file: f,
      objectUrl: URL.createObjectURL(f),
    }))

    uploadDocument(mapped)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
    },
    [addFiles],
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)
  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      className={cn(
        'w-full rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 py-12 px-8',
        isDragging
          ? 'border-[#3b82f6] bg-[#1a2a4a]/40'
          : 'border-[#2a2a3e] hover:border-[#3b82f6]/50 hover:bg-[#141428]',
      )}
    >
      <div className="w-14 h-14 rounded-full bg-[#1a2a4a] flex items-center justify-center">
        <UploadCloud className="w-7 h-7 text-[#3b82f6]" />
      </div>
      <div className="text-center">
        <p className="text-white font-medium text-base">Escolha um arquivo e arrate e solte aqui</p>
      </div>
      <p className="text-muted-foreground text-xs">PDF, TXT or MD, até 50 MB</p>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.txt,.md"
        className="hidden"
        onChange={(e) => e.target.files && addFiles(e.target.files)}
      />
    </div>
  )
}
