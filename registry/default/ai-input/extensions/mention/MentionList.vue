<script setup lang="ts">
import { ref, watch } from 'vue'
import { cn } from '@/lib/utils'
import { FileIcon } from 'lucide-vue-next'

interface Item {
  id: string
  label: string
}

interface Props {
  items: Item[]
  command: (props: any) => void
}

const props = defineProps<Props>()

const selectedIndex = ref(0)

watch(() => props.items, () => {
  selectedIndex.value = 0
})

const selectItem = (index: number) => {
  const item = props.items[index]
  if (item) {
    props.command({ id: item.id, label: item.label })
  }
}

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

  return false
}

defineExpose({
  onKeyDown,
})
</script>

<template>
  <div class="z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
    <div
      v-for="(item, index) in items"
      :key="index"
      :class="cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
        index === selectedIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
      )"
      @click="selectItem(index)"
    >
      <FileIcon class="mr-2 h-4 w-4 text-muted-foreground" />
      <span>{{ item.label }}</span>
    </div>
    <div v-if="items.length === 0" class="p-2 text-sm text-muted-foreground">
      No results
    </div>
  </div>
</template>
