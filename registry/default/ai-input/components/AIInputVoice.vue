<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { MicIcon } from 'lucide-vue-next'
import { useVoice } from '../hooks/use-voice'
import { useAIInputContext } from '../core/context'
import { cn } from '@/lib/utils'

const { editor } = useAIInputContext()

const { state, toggle, isSupported } = useVoice((text) => {
  if (editor.value) {
    editor.value
      .chain()
      .focus()
      .insertContent(text + ' ')
      .run()
  }
})
</script>

<template>
  <Button
    v-if="isSupported"
    size="icon"
    variant="ghost"
    :class="
      cn(
        'h-8 w-8 rounded-full transition-all',
        state === 'listening' &&
          'bg-red-100 text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-900/30 dark:text-red-400',
      )
    "
    @click="toggle"
  >
    <MicIcon v-if="state !== 'listening'" class="h-4 w-4" />
    <div v-else class="flex items-center gap-0.5">
      <div class="h-2 w-0.5 animate-bounce bg-current [animation-delay:-0.3s]" />
      <div class="h-3 w-0.5 animate-bounce bg-current [animation-delay:-0.15s]" />
      <div class="h-2 w-0.5 animate-bounce bg-current" />
    </div>
  </Button>
</template>
