import type { Component, AsyncComponentLoader } from 'vue'

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

export interface RegistryItem {
  component: ContextItemComponent | AsyncComponentLoader
  meta?: {
    label?: string
    icon?: Component
  }
}

export interface ContextItemRegistry {
  register: (type: string, item: ContextItemComponent | RegistryItem) => void
  get: (type: string) => RegistryItem | undefined
  getComponent: (type: string) => ContextItemComponent | AsyncComponentLoader | undefined
}

export const CONTEXT_ITEM_REGISTRY_KEY = Symbol('ContextItemRegistry')
