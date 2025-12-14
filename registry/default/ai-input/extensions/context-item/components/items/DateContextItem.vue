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
import { type DateValue, getLocalTimeZone, CalendarDate } from '@internationalized/date'

const props = defineProps<ContextItemProps>()

/**
 * Parsed current date from metadata
 * Metadata structure: { date: string (ISO) }
 */
const currentDate = computed(() => {
  if (!props.metadata?.date) return undefined
  const d = new Date(props.metadata.date)
  // Simple conversion for demo - in production use correct timezone handling
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  return new CalendarDate(year, month, day)
})

/**
 * Formatted label for display
 */
const displayLabel = computed(() => {
  return props.metadata?.date 
    ? `${props.label}: ${new Date(props.metadata.date).toLocaleDateString()}`
    : `${props.label}: Pick a date`
})

/**
 * Handle date selection from calendar
 * Updates the node attributes with ISO string
 * 
 * @param {DateValue | undefined} dateValue - The selected date
 */
const handleSelect = (dateValue: DateValue | undefined) => {
  if (!dateValue) return
  const date = dateValue.toDate(getLocalTimeZone())
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
