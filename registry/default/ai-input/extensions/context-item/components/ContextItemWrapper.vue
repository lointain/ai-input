<script setup lang="ts">
/**
 * ContextItemWrapper.vue
 * 
 * Common UI wrapper for all context items.
 * Provides the pill-shaped container, icon, label, popover functionality,
 * and removal actions.
 * 
 * @component
 * @slot default - Content to be displayed in the popover body
 * @slot trigger - Custom content for the trigger button (replaces default label)
 */
import { cn } from '@/lib/utils'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { TrashIcon, ExternalLinkIcon } from 'lucide-vue-next'
import type { Component } from 'vue'

const props = defineProps<{
  /** Unique ID of the item */
  id: string
  /** Label text to display */
  label: string
  /** Icon component to display */
  icon?: Component
  /** Type string for display in header */
  type?: string
  /** Metadata object (used for debug/links) */
  metadata?: Record<string, any>
  /** Whether the item is selected */
  selected?: boolean
  /** Whether the item can be closed/removed */
  closable?: boolean

  /** Callback when remove button is clicked */
  onRemove?: () => void
  /** Callback when popover is opened */
  onOpen?: () => void
}>()
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <span
        :class="
          cn(
            'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium transition-colors cursor-pointer select-none',
            'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
            props.selected && 'ring-2 ring-ring',
          )
        "
      >
        <component :is="icon" v-if="icon" class="h-3 w-3 opacity-70" />

        <!-- Main Label Slot or Default -->
        <slot name="trigger">
          <span class="max-w-[150px] truncate">{{ label }}</span>
        </slot>

        <!-- Quick Remove Button (visible on hover or always) -->
        <button
          v-if="onRemove"
          class="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20 focus:outline-none opacity-50 hover:opacity-100"
          contenteditable="false"
          type="button"
          @click.stop="onRemove"
        >
          <TrashIcon class="h-3 w-3" />
        </button>
      </span>
    </PopoverTrigger>

    <PopoverContent class="w-72 p-0" align="start">
      <!-- Header -->
      <div class="flex items-center justify-between border-b px-3 py-2 bg-muted/30">
        <div class="flex items-center gap-2">
          <component :is="icon" v-if="icon" class="h-3 w-3 text-muted-foreground" />
          <span class="font-medium text-xs">{{ type || 'Item' }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Button
            v-if="onRemove"
            variant="ghost"
            size="icon"
            class="h-6 w-6 text-muted-foreground hover:text-destructive"
            @click="onRemove"
          >
            <TrashIcon class="h-3 w-3" />
          </Button>
        </div>
      </div>

      <!-- Body -->
      <div class="p-3">
        <slot />
      </div>

      <!-- Footer (Metadata Debug or Extra Actions) -->
      <div
        v-if="metadata?.url || id"
        class="border-t px-3 py-1.5 bg-muted/10 text-[10px] text-muted-foreground flex justify-between items-center"
      >
        <span class="font-mono opacity-50">ID: {{ id.slice(0, 6) }}...</span>
        <a
          v-if="metadata?.url"
          :href="metadata.url"
          target="_blank"
          class="flex items-center gap-1 hover:underline hover:text-primary"
        >
          Open Link <ExternalLinkIcon class="h-3 w-3" />
        </a>
      </div>
    </PopoverContent>
  </Popover>
</template>
