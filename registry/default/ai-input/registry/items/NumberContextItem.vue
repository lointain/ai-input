<script setup lang="ts">
import { RulerIcon } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import type { ContextItemProps } from '../types'
import ContextItemWrapper from '../ContextItemWrapper.vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

const props = defineProps<ContextItemProps>()

// Metadata structure: { value: number, unit: string, min?: number, max?: number, step?: number }
const unit = computed(() => props.metadata?.unit || '')
const min = computed(() => props.metadata?.min ?? 0)
const max = computed(() => props.metadata?.max ?? 100)
const step = computed(() => props.metadata?.step ?? 1)

// Local state for editing
const currentValue = ref(props.metadata?.value ?? 0)

// Sync from props
watch(() => props.metadata?.value, (val) => {
  if (val !== undefined) currentValue.value = val
}, { immediate: true })

// Sync to props
const updateValue = (val: number) => {
  currentValue.value = val
  props.updateAttributes({
    metadata: {
      ...props.metadata,
      value: val
    }
  })
}

const displayLabel = computed(() => {
  return `${props.label}: ${currentValue.value}${unit.value ? ' ' + unit.value : ''}`
})
</script>

<template>
  <ContextItemWrapper
    :id="id"
    :label="displayLabel"
    :type="type"
    :icon="RulerIcon"
    :metadata="metadata"
    :selected="selected"
    :on-remove="deleteNode"
  >
    <div class="space-y-4 py-2">
      <div class="space-y-1">
        <Label class="text-xs">{{ label }} ({{ unit }})</Label>
        <div class="flex items-center gap-2">
          <Input 
            type="number" 
            :model-value="currentValue"
            @update:model-value="(v) => updateValue(Number(v))"
            :min="min"
            :max="max"
            :step="step"
            class="h-8"
          />
        </div>
      </div>
      
      <Slider
        :model-value="[currentValue]"
        :min="min"
        :max="max"
        :step="step"
        @update:model-value="(v) => updateValue(v[0])"
      />
    </div>
  </ContextItemWrapper>
</template>
