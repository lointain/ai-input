<script setup lang="ts">
/**
 * AIInputAttachButton.vue
 * 
 * A button component that triggers the file input dialog.
 * Uses context from AIInput to interact with the hidden file input.
 * 
 * @component
 * @example
 * <AIInputAttachButton />
 */
import { Button } from '@/components/ui/button'
import { PaperclipIcon } from 'lucide-vue-next'
import { useAIInputContext } from '../core/context'

const { fileInputRef } = useAIInputContext()

/**
 * Handle click event to trigger file input
 * 
 * @description Triggers a click on the hidden file input element referenced in the context
 */
const onClick = () => {
  fileInputRef.value?.click()
}
</script>

<template>
  <Button variant="ghost" size="icon" class="h-8 w-8 rounded-full" @click="onClick">
    <PaperclipIcon class="h-4 w-4" />
  </Button>
</template>
