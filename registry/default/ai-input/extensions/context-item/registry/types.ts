import type { Component, AsyncComponentLoader } from 'vue'

/**
 * Props passed to a Context Item component
 */
export interface ContextItemProps {
  /** Unique identifier for the item */
  id: string
  /** Display label for the item */
  label: string
  /** Type of the context item (e.g. 'file', 'date') */
  type: string
  /** Additional metadata for the item */
  metadata?: Record<string, any>

  /** Whether the item is currently selected in the editor */
  selected: boolean

  /** Function to delete this node from the editor */
  deleteNode: () => void
  /** Function to update the node's attributes */
  updateAttributes: (attrs: Record<string, any>) => void
}

/**
 * Definition of a Context Item Vue component
 */
export type ContextItemComponent = Component<ContextItemProps>

/**
 * Registry item entry definition
 */
export interface RegistryItem {
  /** The Vue component to render */
  component: ContextItemComponent | AsyncComponentLoader
  /** Optional metadata for the registry item */
  meta?: {
    label?: string
    icon?: Component
  }
}

/**
 * Interface for the Context Item Registry
 */
export interface ContextItemRegistry {
  /** Register a new context item type */
  register: (type: string, item: ContextItemComponent | RegistryItem) => void
  /** Get a registry item by type */
  get: (type: string) => RegistryItem | undefined
  /** Get the component for a specific type */
  getComponent: (type: string) => ContextItemComponent | AsyncComponentLoader | undefined
}

/** Injection key for the Context Item Registry */
export const CONTEXT_ITEM_REGISTRY_KEY = Symbol('CONTEXT_ITEM_REGISTRY_KEY')
