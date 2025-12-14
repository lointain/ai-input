<script setup lang="ts">
/**
 * DateContextItem.vue
 * 
 * Context item for selecting and displaying a date.
 * Uses a Calendar component in the popover.
 * 
 * @component
 */
import { CalendarIcon } from 'lucide-vue-next'
import { computed } from 'vue'
import type { ContextItemProps } from '../../registry/types'
import ContextItemWrapper from '../ContextItemWrapper.vue'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'

const props = defineProps<ContextItemProps>()

/**
 * Parsed current date from metadata
 * Metadata structure: { date: string (ISO) }
 */
const currentDate = computed(() => {
  return props.metadata?.date ? new Date(props.metadata.date) : undefined
})

/**
 * Formatted label for display
 */
const displayLabel = computed(() => {
  const dateStr = currentDate.value ? format(currentDate.value, 'yyyy-MM-dd') : 'Pick a date'
  return `${props.label}: ${dateStr}`
})

/**
 * Handle date selection from calendar
 * Updates the node attributes with ISO string
 * 
 * @param {Date | undefined} date - The selected date
 */
const handleSelect = (date: Date | undefined) => {
  if (!date) return
  props.updateAttributes({
    metadata: {
      ...props.metadata,
      date: date.toISOString(),
    },
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
        class="rounded-md border"
        @update:model-value="handleSelect"
      />
    </div>
  </ContextItemWrapper>
</template>
