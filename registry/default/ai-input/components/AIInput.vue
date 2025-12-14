<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useAIInputProvider, type AIInputProps } from '../core/context'
import AIInputAttachments from './AIInputAttachments.vue'

interface Props extends AIInputProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const { fileInputRef, addFiles } = useAIInputProvider(props)

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files) {
    addFiles(input.files)
  }
  input.value = ''
}

function handleDragOver(e: DragEvent) {
  if (e.dataTransfer?.types?.includes('Files')) {
    e.preventDefault()
  }
}

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
    :class="cn(
      'relative flex w-full flex-col overflow-hidden rounded-xl border bg-background focus-within:ring-1 focus-within:ring-ring',
      props.class,
    )"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <input
      ref="fileInputRef"
      type="file"
      class="hidden"
      multiple
      @change="onFileChange"
    >
    <AIInputAttachments />
    <slot />
  </div>
</template>
