<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { computed, inject } from 'vue'
import { CONTEXT_ITEM_REGISTRY_KEY } from './registry/types'

const props = defineProps(nodeViewProps)

const registry = inject(CONTEXT_ITEM_REGISTRY_KEY) as any
const type = computed(() => props.node.attrs.type)

// Fallback safely if registry is missing (e.g. usage outside of AIInputProvider)
const TargetComponent = computed(() => {
  if (!registry) return null
  return registry.getComponent(type.value)
})
</script>

<template>
  <NodeViewWrapper as="span" class="inline-block align-middle mx-1 select-none">
    <component
      :is="TargetComponent"
      v-if="TargetComponent"
      :id="node.attrs.id"
      :type="type"
      :label="node.attrs.label"
      :metadata="node.attrs.metadata"
      :selected="selected"
      :delete-node="deleteNode"
      :update-attributes="updateAttributes"
    />
    <span v-else class="text-destructive text-xs border border-destructive px-1 rounded"
      >[Unknown: {{ type }}]</span
    >
  </NodeViewWrapper>
</template>
