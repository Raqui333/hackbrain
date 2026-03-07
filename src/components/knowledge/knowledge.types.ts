export interface UploadedFile {
  id: string
  name: string
  size: number
  status: 'uploading' | 'done' | 'error'
  file: File
  objectUrl: string
}
