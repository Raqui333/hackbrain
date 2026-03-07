'use client'

import { useState, useRef, useCallback } from 'react'
import {
  Brain,
  UploadCloud,
  FileText,
  X,
  CheckCircle,
  Loader2,
  Download,
  Eye,
  Trash2,
  ArchiveX,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '../Logo'

interface UploadedFile {
  id: string
  name: string
  size: number
  status: 'uploading' | 'done' | 'error'
  file: File
  objectUrl: string
}

export function KnowledgePage() {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase()
    return ext === 'pdf'
      ? 'PDF'
      : ext === 'docx' || ext === 'doc'
        ? 'DOC'
        : ext === 'txt'
          ? 'TXT'
          : ext === 'md'
            ? 'MD'
            : 'FILE'
  }

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles)
    const mapped: UploadedFile[] = arr.map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      name: f.name,
      size: f.size,
      status: 'uploading',
      file: f,
      objectUrl: URL.createObjectURL(f),
    }))
    setFiles((prev) => [...prev, ...mapped])
    mapped.forEach((file) => {
      setTimeout(
        () => {
          setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, status: 'done' } : f)))
        },
        1500 + Math.random() * 1000,
      )
    })
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
            <p className="text-white font-medium text-base">
              Escolha um arquivo e arrate e solte aqui
            </p>
          </div>
          <p className="text-muted-foreground text-xs">PDF, DOCX, TXT or MD, até 50 MB</p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.txt,.md"
            className="hidden"
            onChange={(e) => e.target.files && addFiles(e.target.files)}
          />
        </div>

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
