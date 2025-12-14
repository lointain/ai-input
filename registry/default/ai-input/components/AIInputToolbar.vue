<script setup lang="ts">
/**
 * AIInputToolbar.vue
 * 
 * The bottom toolbar component containing action buttons and slots for extensions.
 * Provides 'left' and 'right' slots for customizing the toolbar layout.
 * 
 * @component
 * @example
 * <AIInputToolbar>
 *   <template #left><AIInputAttachButton /></template>
 *   <template #right><AIInputVoice /></template>
 * </AIInputToolbar>
 * 
 * @slot left - Slot for left-aligned content (e.g. attachments, formatting)
 * @slot right - Slot for right-aligned content (e.g. voice, extra actions)
 */
import { Button } from '@/components/ui/button'
import { ArrowUpIcon, SquareIcon } from 'lucide-vue-next'
import { useAIInputContext } from '../core/context'
import { cn } from '@/lib/utils'

const { submit, isLoading, isEmpty } = useAIInputContext()
</script>

<template>
  <div class="flex items-center justify-between p-2">
    <div class="flex items-center gap-2">
      <!-- Left slots (attachments, voice, etc.) -->
      <slot name="left" />
    </div>

    <div class="flex items-center gap-2">
      <!-- Right slots -->
      <slot name="right" />

      <Button
        size="icon"
        :variant="isLoading ? 'outline' : 'default'"
        :disabled="isEmpty && !isLoading"
        :class="cn('h-8 w-8 rounded-full transition-all', isLoading && 'animate-pulse')"
        @click="submit"
      >
        <SquareIcon v-if="isLoading" class="h-4 w-4 fill-current" />
        <ArrowUpIcon v-else class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
