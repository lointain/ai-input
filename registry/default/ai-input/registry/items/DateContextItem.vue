<script setup lang="ts">
import { CalendarIcon } from 'lucide-vue-next'
import { computed } from 'vue'
import type { ContextItemProps } from '../types'
import ContextItemWrapper from '../ContextItemWrapper.vue'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'

const props = defineProps<ContextItemProps>()

// Metadata structure: { date: string (ISO) }
const currentDate = computed(() => {
  return props.metadata?.date ? new Date(props.metadata.date) : undefined
})

const displayLabel = computed(() => {
  const dateStr = currentDate.value ? format(currentDate.value, 'yyyy-MM-dd') : 'Pick a date'
  return `${props.label}: ${dateStr}`
})

const handleSelect = (date: Date | undefined) => {
  if (!date) return
  props.updateAttributes({
    metadata: {
      ...props.metadata,
      date: date.toISOString()
    }
  })
}
</script>

<template>
  <ContextItemWrapper
    :id="id"
    :label="displayLabel"
    :type="type"
    :icon="CalendarIcon"
    :metadata="metadata"
    :selected="selected"
    :on-remove="deleteNode"
  >
    <div class="p-2">
      <Calendar
        mode="single"
        :model-value="currentDate"
        @update:model-value="handleSelect"
        class="rounded-md border"
      />
    </div>
  </ContextItemWrapper>
</template>
