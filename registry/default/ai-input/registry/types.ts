import type { Component } from 'vue'

export interface ContextItemProps {
  // Tiptap node attributes
  id: string
  label: string
  type: string
  metadata?: Record<string, any>
  
  // Interaction state
  selected: boolean
  
  // Actions
  deleteNode: () => void
  updateAttributes: (attrs: Record<string, any>) => void
}

export type ContextItemComponent = Component<ContextItemProps>

export interface ContextItemRegistry {
  register: (type: string, component: ContextItemComponent) => void
  get: (type: string) => ContextItemComponent | undefined
}

export const CONTEXT_ITEM_REGISTRY_KEY = Symbol('ContextItemRegistry')
