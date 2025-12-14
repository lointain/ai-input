import { inject, provide, ref, computed, watch } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { AI_INPUT_KEY, type AIInputContext, type AttachmentFile, type UploadHandler, type UploadResult } from './types'
import { createContextItemRegistry } from '../extensions/context-item/registry'
import { CONTEXT_ITEM_REGISTRY_KEY } from '../extensions/context-item/registry/types'
import { useFileUpload } from '../hooks/use-file-upload'
import { useEditorState } from '../hooks/use-editor-state'

export interface AIInputProps {
  disabled?: boolean
  loading?: boolean
  history?: string[]
  uploadHandler?: UploadHandler
  // accept, maxFiles etc. can be added here if needed for global drag validation
  accept?: string
  maxSize?: number
  maxFiles?: number
  placeholder?: string
  onSubmit?: (content: string, files: AttachmentFile[]) => void
}

export function useAIInputProvider(props: AIInputProps) {
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
  const isUploading = computed(() => isFileUploading.value)
  const isDisabled = computed(() => props.disabled || isLoading.value)
  
  // Internal submit handler
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
    onAddFiles: addFiles
  })

  const isEmpty = computed(() => editor.value?.isEmpty ?? true)
  const history = computed(() => props.history || [])

  // Initialize Registry
  const registry = createContextItemRegistry()
  provide(CONTEXT_ITEM_REGISTRY_KEY, registry)

  // setEditor is no longer needed to be exposed publicly as we manage it internally,
  // but we keep it in context if we want to allow external control (though useEditorState handles it).
  // However, AIInputEditor.vue currently uses useEditor internally. 
  // Wait, AIInputEditor.vue previously CREATED the editor. 
  // Now we moved creation to useEditorState. 
  // So AIInputEditor.vue needs to become a wrapper that just renders <EditorContent :editor="editor" />.
  
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
    }
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
