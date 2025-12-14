import type { Editor } from '@tiptap/vue-3'
import type { Ref } from 'vue'

/**
 * Result object returned after a successful file upload
 */
export interface UploadResult {
  /** Unique identifier from server */
  id: string
  /** URL to the uploaded file */
  url?: string
  /** File name */
  name: string
  /** MIME type */
  type: string
  // Extendable for other metadata
}

/**
 * Function signature for handling file uploads
 * @param {File} file - The file to upload
 * @param {function} onProgress - Callback to report upload progress (0-100)
 * @returns {Promise<UploadResult>} The result of the upload
 */
export type UploadHandler = (
  file: File,
  onProgress?: (progress: number) => void,
) => Promise<UploadResult>

/**
 * Represents a file attachment in the input
 */
export interface AttachmentFile {
  /** Unique local ID */
  id: string
  /** The original File object (if local) */
  file?: File
  /** MIME type */
  type?: string
  /** File name */
  name?: string

  // Upload status
  /** Current status of the file upload */
  status: 'pending' | 'uploading' | 'done' | 'error'
  /** Upload progress percentage (0-100) */
  progress: number
  /** Error object if status is 'error' */
  error?: Error

  // Server data after upload
  /** Data returned from the server after upload */
  serverData?: UploadResult
}

/**
 * Context object provided by AIInput
 */
export interface AIInputContext {
  /** The Tiptap editor instance */
  editor: Ref<Editor | undefined>
  /** List of attached files */
  files: Ref<AttachmentFile[]>
  /** Whether the input is currently loading/submitting */
  isLoading: Ref<boolean>
  /** Whether the input is disabled */
  isDisabled: Ref<boolean>
  /** Reference to the hidden file input element */
  fileInputRef: Ref<HTMLInputElement | null>

  // Actions
  /** Manually set the editor instance */
  setEditor: (instance: Editor) => void
  /** Add files to the input */
  addFiles: (files: File[] | FileList) => Promise<void>
  /** Remove a file by ID */
  removeFile: (id: string) => void
  /** Submit the input content */
  submit: () => void
  /** Focus the editor */
  focus: () => void
  /** Retry a failed upload */
  retryUpload: (id: string) => void

  // Helpers
  /** Whether the editor content is empty */
  isEmpty: Ref<boolean>
  /** Command history */
  history: Ref<string[]>
  /** Whether any files are currently uploading */
  isUploading: Ref<boolean>
}

/** Injection key for AIInputContext */
export const AI_INPUT_KEY = Symbol('AIInputContext')
