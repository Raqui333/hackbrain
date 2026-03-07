'use client'

import { CheckCircle, Loader2, Download, Eye, Trash2, ArchiveX } from 'lucide-react'
import { useState } from 'react'
import { Logo } from '../Logo'
import { cn } from '@/lib/utils'

import type { UploadedFile } from './knowledge.types'
import { DropZone } from './drop-zone'

export function KnowledgePage() {
  const [files, setFiles] = useState<UploadedFile[]>([])

  const uploadDocument = async (local_files: UploadedFile[]) => {
    setFiles((prev) => [...prev, ...local_files])

    const formData = new FormData()
    local_files.forEach((file) => {
      formData.append('files', file.file)
    })

    const response = await fetch('/api/embed', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      local_files.forEach((file) => {
        setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, status: 'error' } : f)))
      })
      return
    }

    local_files.forEach((file) => {
      setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, status: 'done' } : f)))
    })
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase()
    return ext === 'pdf' ? 'PDF' : ext === 'txt' ? 'TXT' : ext === 'md' ? 'MD' : 'FILE'
  }

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id)
      if (target) URL.revokeObjectURL(target.objectUrl)
      return prev.filter((f) => f.id !== id)
    })
  }

  const downloadFile = (file: UploadedFile) => {
    const a = document.createElement('a')
    a.href = file.objectUrl
    a.download = file.name
    a.click()
  }

  const viewFile = (file: UploadedFile) => {
    window.open(file.objectUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="flex justify-center mt-20 h-screen">
      <div className="w-full max-w-2xl flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <Logo variant="large" />
        </div>

        <p className="text-muted-foreground text-sm -mt-4">Base de Conhecimento</p>

        {/* Drop Zone */}
        <DropZone uploadDocument={uploadDocument} />

        {/* File List */}
        <div className="w-full flex flex-col gap-2">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 px-1">
            Documentos carregados
          </p>
          {files.length > 0 ? (
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[380px]">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 bg-[#141420] border border-[#1e1e2e] rounded-lg px-4 py-3 group mr-2.5"
                >
                  {/* File type badge */}
                  <div className="w-10 h-10 rounded-md bg-[#1a2a4a] flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-[#3b82f6] tracking-wide">
                      {getFileIcon(file.name)}
                    </span>
                  </div>

                  {/* Name + size */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate font-medium">{file.name}</p>
                    <p className="text-xs text-[#5a5a6e]">{formatSize(file.size)}</p>
                  </div>

                  {/* Status indicator */}
                  <div className="shrink-0 mr-1">
                    {file.status === 'uploading' ? (
                      <Loader2 className="w-4 h-4 text-[#3b82f6] animate-spin" />
                    ) : file.status === 'done' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <span className="text-red-500 text-xs font-medium">Erro</span>
                    )}
                  </div>

                  {/* Action buttons — visible on hover or when done */}
                  <div
                    className={cn(
                      'flex items-center gap-1 transition-opacity',
                      file.status === 'done'
                        ? 'opacity-100 md:opacity-0 md:group-hover:opacity-100'
                        : 'opacity-0 pointer-events-none',
                    )}
                  >
                    {/* View */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        viewFile(file)
                      }}
                      title="Visualizar"
                      aria-label="Visualizar arquivo"
                      className="w-8 h-8 flex items-center justify-center rounded-md text-[#5a5a6e] hover:text-[#3b82f6] hover:bg-[#1a2a4a] transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Download */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        downloadFile(file)
                      }}
                      title="Baixar"
                      aria-label="Baixar arquivo"
                      className="w-8 h-8 flex items-center justify-center rounded-md text-[#5a5a6e] hover:text-[#3b82f6] hover:bg-[#1a2a4a] transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    {/* Remove */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(file.id)
                      }}
                      title="Remover"
                      aria-label="Remover arquivo"
                      className="w-8 h-8 flex items-center justify-center rounded-md text-[#5a5a6e] hover:text-red-500 hover:bg-[#2a1a1a] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-20 text-muted-foreground rounded-lg p-20 gap-2">
              <span>
                <ArchiveX />
              </span>
              Nenhum arquivo encontrado
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
