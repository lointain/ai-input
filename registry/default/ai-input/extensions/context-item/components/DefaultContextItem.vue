<script setup lang="ts">
/**
 * DefaultContextItem.vue
 * 
 * Fallback component for context items that don't have a specific renderer.
 * Displays basic metadata like size and mime type.
 * 
 * @component
 */
import { FileIcon, HashIcon } from 'lucide-vue-next'
import { computed } from 'vue'
import type { ContextItemProps } from '../registry/types'
import ContextItemWrapper from './ContextItemWrapper.vue'

const props = defineProps<ContextItemProps>()

/**
 * Determine icon based on type
 */
const icon = computed(() => {
  if (props.type === 'variable') return HashIcon
  return FileIcon
})
</script>

<template>
  <ContextItemWrapper
    :id="id"
    :label="label"
    :type="type"
    :icon="icon"
    :metadata="metadata"
    :selected="selected"
    :on-remove="deleteNode"
  >
    <!-- Default content just shows basic info -->
    <div class="space-y-2 text-sm">
      <div class="grid grid-cols-[3rem_1fr] gap-2 items-center">
        <span class="text-muted-foreground">Label</span>
        <span class="font-medium truncate">{{ label }}</span>
      </div>
      <div v-if="metadata?.size" class="grid grid-cols-[3rem_1fr] gap-2 items-center">
        <span class="text-muted-foreground">Size</span>
        <span>{{ (metadata.size / 1024).toFixed(1) }} KB</span>
      </div>
      <div v-if="metadata?.mimeType" class="grid grid-cols-[3rem_1fr] gap-2 items-center">
        <span class="text-muted-foreground">Type</span>
        <span class="font-mono text-xs">{{ metadata.mimeType }}</span>
      </div>
    </div>
  </ContextItemWrapper>
</template>
