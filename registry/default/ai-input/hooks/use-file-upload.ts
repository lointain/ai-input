import { ref, computed } from 'vue'
import { nanoid } from 'nanoid'
import type { AttachmentFile, UploadHandler } from '../types'

export interface UseFileUploadOptions {
  handler?: UploadHandler
  maxSize?: number
  maxFiles?: number
  accept?: string
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const files = ref<AttachmentFile[]>([])

  const isUploading = computed(() => files.value.some((f) => f.status === 'uploading'))

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

  const retryUpload = (id: string) => {
    const file = files.value.find((f) => f.id === id)
    if (file) {
      processFile(file)
    }
  }

  const removeFile = (id: string) => {
    files.value = files.value.filter((f) => f.id !== id)
  }

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
