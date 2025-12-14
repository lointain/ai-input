import { ref, computed } from 'vue'
import { nanoid } from 'nanoid'
import type { AttachmentFile, UploadHandler } from '../types'

/**
 * Options for the file upload hook
 */
export interface UseFileUploadOptions {
  /** Custom upload handler function */
  handler?: UploadHandler
  /** Max file size in bytes */
  maxSize?: number
  /** Max number of files allowed */
  maxFiles?: number
  /** Accepted file types string */
  accept?: string
}

/**
 * Hook to manage file uploads and attachment state.
 * Handles adding files, processing uploads via handler, and tracking progress.
 * 
 * @param {UseFileUploadOptions} options - Configuration options
 * @returns {Object} File state and management methods
 */
export function useFileUpload(options: UseFileUploadOptions = {}) {
  const files = ref<AttachmentFile[]>([])

  const isUploading = computed(() => files.value.some((f) => f.status === 'uploading'))

  /**
   * Process a single file upload
   * @param {AttachmentFile} attachment - The attachment object to process
   */
  const processFile = async (attachment: AttachmentFile) => {
    if (!options.handler || !attachment.file) {
      // If no handler, mark as done immediately (local mode)
      attachment.status = 'done'
      attachment.progress = 100
      return
    }

    attachment.status = 'uploading'
    attachment.progress = 0
    attachment.error = undefined

    try {
      const result = await options.handler(attachment.file, (progress) => {
        attachment.progress = progress
      })
      attachment.status = 'done'
      attachment.serverData = result
      attachment.progress = 100
    } catch (err) {
      console.error('Upload failed', err)
      attachment.status = 'error'
      attachment.error = err instanceof Error ? err : new Error('Upload failed')
    }
  }

  /**
   * Add new files to the list and start upload
   * @param {File[] | FileList} newFiles - Files to add
   */
  const addFiles = async (newFiles: File[] | FileList) => {
    const fileArray = Array.from(newFiles)

    // TODO: Add validation logic here (maxSize, accept, maxFiles)

    const newAttachments: AttachmentFile[] = fileArray.map((file) => ({
      id: nanoid(),
      file,
      name: file.name,
      type: file.type,
      status: 'pending',
      progress: 0,
    }))

    files.value = [...files.value, ...newAttachments]

    // Start uploads
    await Promise.all(newAttachments.map(processFile))
  }

  /**
   * Retry a failed upload
   * @param {string} id - ID of the file to retry
   */
  const retryUpload = (id: string) => {
    const file = files.value.find((f) => f.id === id)
    if (file) {
      processFile(file)
    }
  }

  /**
   * Remove a file from the list
   * @param {string} id - ID of the file to remove
   */
  const removeFile = (id: string) => {
    files.value = files.value.filter((f) => f.id !== id)
  }

  /**
   * Clear all files
   */
  const clearFiles = () => {
    files.value = []
  }

  return {
    files,
    isUploading,
    addFiles,
    retryUpload,
    removeFile,
    clearFiles,
  }
}
