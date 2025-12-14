<script setup lang="ts">
import { cn } from '@/lib/utils'
import { FileIcon, XIcon, RefreshCwIcon, AlertCircleIcon } from 'lucide-vue-next'
import { useAIInputContext } from './context'
import { computed } from 'vue'

const props = defineProps<{
  class?: string
}>()

const { files, removeFile, retryUpload } = useAIInputContext()

const hasFiles = computed(() => files.value.length > 0)
</script>

<template>
  <div
    v-if="hasFiles"
    :class="cn('flex flex-wrap items-center gap-2 p-3 w-full border-b bg-muted/30', props.class)"
  >
    <div
      v-for="file in files"
      :key="file.id"
      class="group relative flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm shadow-sm transition-all hover:shadow-md"
    >
      <!-- Icon based on status -->
      <div class="relative flex h-8 w-8 items-center justify-center rounded bg-muted">
        <AlertCircleIcon v-if="file.status === 'error'" class="h-4 w-4 text-destructive" />
        <FileIcon v-else class="h-4 w-4 text-muted-foreground" />
        
        <!-- Progress Overlay -->
        <div 
          v-if="file.status === 'uploading'"
          class="absolute inset-0 bg-background/50 flex items-center justify-center"
        >
          <div 
            class="h-full w-full bg-primary/20 absolute bottom-0 left-0"
            :style="{ height: `${file.progress}%` }"
          />
        </div>
      </div>

      <div class="flex flex-col max-w-[150px]">
        <span class="truncate font-medium text-xs">{{ file.name }}</span>
        <span class="text-[10px] text-muted-foreground flex items-center gap-1">
          <template v-if="file.status === 'uploading'">
            Uploading {{ file.progress }}%
          </template>
          <template v-else-if="file.status === 'error'">
            Failed
          </template>
          <template v-else>
            {{ (file.file?.size ? (file.file.size / 1024).toFixed(1) + ' KB' : '') }}
          </template>
        </span>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1">
        <button
          v-if="file.status === 'error'"
          type="button"
          class="rounded-full p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
          @click="retryUpload(file.id)"
        >
          <RefreshCwIcon class="h-3 w-3" />
        </button>
        
        <button
          type="button"
          class="rounded-full p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
          @click="removeFile(file.id)"
        >
          <XIcon class="h-3 w-3" />
        </button>
      </div>

      <!-- Progress Bar (Bottom Line) -->
      <div 
        v-if="file.status === 'uploading'"
        class="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300"
        :style="{ width: `${file.progress}%` }"
      />
    </div>
  </div>
</template>
