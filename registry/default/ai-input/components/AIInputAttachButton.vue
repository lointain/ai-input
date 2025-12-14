<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { PaperclipIcon } from 'lucide-vue-next'
import { useAIInputContext } from '../core/context'

const { fileInputRef } = useAIInputContext()

const onClick = () => {
  fileInputRef.value?.click()
}
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    class="h-8 w-8 rounded-full"
    @click="onClick"
  >
    <PaperclipIcon class="h-4 w-4" />
  </Button>
</template>
