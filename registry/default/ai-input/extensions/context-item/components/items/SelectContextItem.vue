<script setup lang="ts">
/**
 * SelectContextItem.vue
 * 
 * Context item for selecting a value from a predefined list.
 * Uses a Command component (combobox style) for selection.
 * 
 * @component
 */
import { ListIcon, CheckIcon } from 'lucide-vue-next'
import { computed } from 'vue'
import type { ContextItemProps } from '../../registry/types'
import ContextItemWrapper from '../ContextItemWrapper.vue'
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'

const props = defineProps<ContextItemProps>()

// Metadata structure: { value: string, options: { label: string, value: string }[] }
/** Available options for selection */
const options = computed(() => props.metadata?.options || [])
/** Current selected value */
const currentValue = computed(() => props.metadata?.value)

/**
 * Find the full option object for the current value
 */
const selectedOption = computed(() =>
  options.value.find((opt: any) => opt.value === currentValue.value),
)

/**
 * Formatted label for display
 */
const displayLabel = computed(() => {
  return `${props.label}: ${selectedOption.value?.label || currentValue.value || 'Select...'}`
})

/**
 * Handle option selection
 * @param {string} val - The value of the selected option
 */
const handleSelect = (val: string) => {
  props.updateAttributes({
    metadata: {
      ...props.metadata,
      value: val,
    },
  })
}
</script>

<template>
  <ContextItemWrapper
    :id="id"
    :label="displayLabel"
    :type="type"
    :icon="ListIcon"
    :metadata="metadata"
    :selected="selected"
    :on-remove="deleteNode"
  >
    <Command class="w-full">
      <CommandInput placeholder="Search options..." class="h-8" />
      <CommandList>
        <CommandEmpty>No option found.</CommandEmpty>
        <CommandGroup>
          <CommandItem
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            @select="handleSelect(option.value)"
          >
            <CheckIcon
              :class="
                cn('mr-2 h-4 w-4', currentValue === option.value ? 'opacity-100' : 'opacity-0')
              "
            />
            {{ option.label }}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </ContextItemWrapper>
</template>
