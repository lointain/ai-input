import type { Editor } from '@tiptap/vue-3'
import type { Ref } from 'vue'

export interface UploadResult {
  id: string
  url?: string
  name: string
  type: string
  // Extendable for other metadata
}

export type UploadHandler = (
  file: File, 
  onProgress?: (progress: number) => void
) => Promise<UploadResult>

export interface AttachmentFile {
  id: string
  file?: File
  type?: string
  name?: string
  
  // Upload status
  status: 'pending' | 'uploading' | 'done' | 'error'
  progress: number
  error?: Error
  
  // Server data after upload
  serverData?: UploadResult
}

export interface AIInputContext {
  editor: Ref<Editor | undefined>
  files: Ref<AttachmentFile[]>
  isLoading: Ref<boolean>
  isDisabled: Ref<boolean>
  fileInputRef: Ref<HTMLInputElement | null>
  
  // Actions
  setEditor: (instance: Editor) => void
  addFiles: (files: File[] | FileList) => Promise<void>
  removeFile: (id: string) => void
  submit: () => void
  focus: () => void
  retryUpload: (id: string) => void
  
  // Helpers
  isEmpty: Ref<boolean>
  history: Ref<string[]>
  isUploading: Ref<boolean>
}

export const AI_INPUT_KEY = Symbol('AIInputContext')
