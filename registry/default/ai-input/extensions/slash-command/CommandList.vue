<script setup lang="ts">
/**
 * CommandList.vue
 * 
 * Component to display the list of available slash commands.
 * Handles keyboard navigation and selection.
 * 
 * @component
 */
import { ref, watch } from 'vue'
import { cn } from '@/lib/utils'
import type { PromptShortcut } from './types'

const props = defineProps<{
  /** List of filtered shortcuts */
  items: PromptShortcut[]
  /** Command execution callback */
  command: (item: PromptShortcut) => void
}>()

const selectedIndex = ref(0)

watch(
  () => props.items,
  () => {
    selectedIndex.value = 0
  },
)

/**
 * Handle keyboard navigation events from Tiptap
 */
const onKeyDown = ({ event }: { event: KeyboardEvent }) => {
  if (event.key === 'ArrowUp') {
    selectedIndex.value = (selectedIndex.value + props.items.length - 1) % props.items.length
    return true
  }

  if (event.key === 'ArrowDown') {
    selectedIndex.value = (selectedIndex.value + 1) % props.items.length
    return true
  }

  if (event.key === 'Enter') {
    selectItem(selectedIndex.value)
    return true
  }

  if (event.key === 'Tab') {
    event.preventDefault()
    event.stopPropagation()
    selectItem(selectedIndex.value)
    return true
  }

  return false
}

const selectItem = (index: number) => {
  const item = props.items[index]
  if (item) {
    props.command(item)
  }
}

defineExpose({
  onKeyDown,
})
</script>

<template>
  <div
    class="z-50 min-w-[300px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
  >
    <div v-if="items.length === 0" class="p-2 text-sm text-muted-foreground text-center">
      No commands found
    </div>

    <div
      v-for="(item, index) in items"
      :key="index"
      :class="
        cn(
          'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
          index === selectedIndex ? 'bg-accent text-accent-foreground' : '',
        )
      "
      @click="selectItem(index)"
      @mouseenter="selectedIndex = index"
    >
      <component :is="item.icon" v-if="item.icon" class="mr-2 h-4 w-4" />
      <div class="flex flex-col flex-1 gap-0.5">
        <span class="font-medium">{{ item.label }}</span>
        <span v-if="item.description" class="text-xs text-muted-foreground/80 truncate">
          {{ item.description }}
        </span>
      </div>
      <kbd
        v-if="index === selectedIndex"
        class="ml-auto text-[10px] text-muted-foreground font-mono bg-muted px-1 rounded"
      >
        ↵
      </kbd>
    </div>
  </div>
</template>
