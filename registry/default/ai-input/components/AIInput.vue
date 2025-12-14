<script setup lang="ts">
/**
 * AIInput.vue
 * 
 * Main container component for the AI Input system.
 * Handles file drag-and-drop, file input management, and provides context to child components.
 * 
 * @component
 * @example
 * <AIInput 
 *   :upload-handler="myUploadHandler"
 *   placeholder="Type something..."
 *   @submit="handleSubmit"
 * >
 *   <AIInputEditor />
 *   <AIInputToolbar />
 * </AIInput>
 * 
 * @slot default - The content to be rendered inside the input container (usually Editor, Toolbar, etc.)
 */
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useAIInputProvider, type AIInputProps } from '../core/context'
import AIInputAttachments from './AIInputAttachments.vue'

/**
 * Props interface for AIInput component
 * Extends AIInputProps from context
 */
interface Props extends AIInputProps {
  /** Optional CSS class for the root element */
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const { fileInputRef, addFiles } = useAIInputProvider(props)

/**
 * Handle file selection from the hidden file input
 * 
 * @param {Event} e - The change event from file input
 */
function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files) {
    addFiles(input.files)
  }
  input.value = ''
}

/**
 * Handle drag over event to allow dropping files
 * Prevents default behavior if dragged items are files
 * 
 * @param {DragEvent} e - The dragover event
 */
function handleDragOver(e: DragEvent) {
  if (e.dataTransfer?.types?.includes('Files')) {
    e.preventDefault()
  }
}

/**
 * Handle drop event for files
 * Adds dropped files to the context
 * 
 * @param {DragEvent} e - The drop event
 */
function handleDrop(e: DragEvent) {
  if (e.dataTransfer?.types?.includes('Files')) {
    e.preventDefault()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files)
    }
  }
}
</script>

<template>
  <div
    data-ai-input
    :class="
      cn(
        'relative flex w-full flex-col overflow-hidden rounded-xl border bg-background focus-within:ring-1 focus-within:ring-ring',
        props.class,
      )
    "
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <input ref="fileInputRef" type="file" class="hidden" multiple @change="onFileChange" />
    <AIInputAttachments />
    <slot />
  </div>
</template>
