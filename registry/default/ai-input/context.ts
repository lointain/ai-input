import { inject, provide, ref, computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { AI_INPUT_KEY, type AIInputContext, type AttachmentFile, type UploadHandler, type UploadResult } from './types'
import { createContextItemRegistry } from './registry'
import { CONTEXT_ITEM_REGISTRY_KEY } from './registry/types'
import { useFileUpload } from './hooks/use-file-upload'

export interface AIInputProps {
  disabled?: boolean
  loading?: boolean
  history?: string[]
  uploadHandler?: UploadHandler
  // accept, maxFiles etc. can be added here if needed for global drag validation
  accept?: string
  maxSize?: number
  maxFiles?: number
  onSubmit?: (content: string, files: AttachmentFile[]) => void
}

export function useAIInputProvider(props: AIInputProps) {
  const editor = ref<Editor>()
  const fileInputRef = ref<HTMLInputElement | null>(null)
  
  // Use the extracted hook for file management
  const { 
    files, 
    isUploading: isFileUploading, 
    addFiles, 
    retryUpload, 
    removeFile, 
    clearFiles 
  } = useFileUpload({
    handler: props.uploadHandler,
    maxSize: props.maxSize,
    maxFiles: props.maxFiles,
    accept: props.accept
  })
  
  const isLoading = computed(() => props.loading ?? false)
  // Disable input if parent is loading or if we are currently uploading
  const isUploading = computed(() => isFileUploading.value)
  const isDisabled = computed(() => props.disabled || isLoading.value)
  const isEmpty = computed(() => editor.value?.isEmpty ?? true)
  const history = computed(() => props.history || [])

  // Initialize Registry
  const registry = createContextItemRegistry()
  provide(CONTEXT_ITEM_REGISTRY_KEY, registry)

  const setEditor = (instance: Editor) => {
    editor.value = instance
  }

  const submit = () => {
    if (isDisabled.value || isEmpty.value || isUploading.value) return
    
    // Check if any files failed
    if (files.value.some(f => f.status === 'error')) {
      // Maybe show toast? For now just return
      return 
    }

    const content = editor.value?.getHTML() || ''
    props.onSubmit?.(content, files.value)
    
    // Clear editor
    editor.value?.commands.clearContent()
    // Clear files
    clearFiles()
  }

  const context: AIInputContext = {
    editor,
    files,
    isUploading,
    isDisabled,
    isEmpty,
    history,
    fileInputRef,
    setEditor,
    addFiles,
    retryUpload,
    removeFile,
    submit
  }

  provide(AI_INPUT_KEY, context)

  return context
}

export function useAIInputContext() {
  const context = inject<AIInputContext>(AI_INPUT_KEY)
  if (!context) {
    throw new Error('useAIInputContext must be used within AIInput')
  }
  return context
}
