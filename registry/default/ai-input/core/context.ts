import { inject, provide, ref, computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { AI_INPUT_KEY, type AIInputContext, type AttachmentFile, type UploadHandler } from './types'
import { createContextItemRegistry } from '../extensions/context-item/registry'
import { CONTEXT_ITEM_REGISTRY_KEY } from '../extensions/context-item/registry/types'
import { useFileUpload } from '../hooks/use-file-upload'
import { useEditorState } from '../hooks/use-editor-state'

/**
 * Props for the AIInput component
 */
export interface AIInputProps {
  /**
   * Disable interaction with the input
   */
  disabled?: boolean
  /**
   * Set loading state (disables submission)
   */
  loading?: boolean
  /**
   * Command history for up/down navigation
   */
  history?: string[]
  /**
   * Custom handler for file uploads
   */
  uploadHandler?: UploadHandler
  /**
   * File types to accept (e.g. "image/*,application/pdf")
   */
  accept?: string
  /**
   * Max file size in bytes
   */
  maxSize?: number
  /**
   * Max number of files allowed
   */
  maxFiles?: number
  /**
   * Editor placeholder text
   */
  placeholder?: string
  /**
   * Callback when user submits (Enter or button click)
   */
  onSubmit?: (content: string, files: AttachmentFile[]) => void
}

/**
 * Main provider hook for AIInput system.
 * Initializes state, editor, and file handling logic.
 * 
 * @param {AIInputProps} props - Component props
 * @returns {AIInputContext} The provided context object
 */
export function useAIInputProvider(props: AIInputProps) {
  const fileInputRef = ref<HTMLInputElement | null>(null)

  // Use the extracted hook for file management
  const {
    files,
    isUploading: isFileUploading,
    addFiles,
    retryUpload,
    removeFile,
    clearFiles,
  } = useFileUpload({
    handler: props.uploadHandler,
    maxSize: props.maxSize,
    maxFiles: props.maxFiles,
    accept: props.accept,
  })

  const isLoading = computed(() => props.loading ?? false)
  const isUploading = computed(() => isFileUploading.value)
  const isDisabled = computed(() => props.disabled || isLoading.value)

  // Internal submit handler
  /**
   * Handles the submission of the input.
   * Checks for errors, empty content, and active uploads before calling onSubmit.
   */
  const handleSubmit = () => {
    if (isDisabled.value || isUploading.value) return

    if (files.value.some((f: any) => f.status === 'error')) {
      return
    }

    // Editor instance comes from the hook now
    const content = editor.value?.getHTML() || ''
    if (!content && files.value.length === 0) return

    props.onSubmit?.(content, files.value)

    editor.value?.commands.clearContent()
    clearFiles()
  }

  // Use the extracted hook for editor state
  const { editor } = useEditorState({
    history: props.history,
    placeholder: props.placeholder,
    onSubmit: handleSubmit,
    onAddFiles: addFiles,
  })

  const isEmpty = computed(() => editor.value?.isEmpty ?? true)
  const history = computed(() => props.history || [])

  // Initialize Registry
  const registry = createContextItemRegistry()
  provide(CONTEXT_ITEM_REGISTRY_KEY, registry)

  /**
   * Manually set the editor instance (internal use)
   * @param {Editor} instance - The Tiptap editor instance
   */
  const setEditor = (instance: Editor) => {
    // This might be deprecated if we move full control to useEditorState
    editor.value = instance
  }

  const context: AIInputContext = {
    editor,
    files,
    isUploading,
    isDisabled,
    isEmpty,
    history,
    isLoading,
    fileInputRef,
    setEditor,
    addFiles,
    retryUpload,
    removeFile,
    submit: handleSubmit,
    focus: () => {
      editor.value?.commands.focus()
    },
  }

  provide(AI_INPUT_KEY, context)

  return context
}

/**
 * Hook to access the AIInput context
 * Must be used within an AIInput component tree
 * 
 * @throws {Error} If used outside of AIInput context
 * @returns {AIInputContext} The context object
 */
export function useAIInputContext() {
  const context = inject<AIInputContext>(AI_INPUT_KEY)
  if (!context) {
    throw new Error('useAIInputContext must be used within AIInput')
  }
  return context
}
