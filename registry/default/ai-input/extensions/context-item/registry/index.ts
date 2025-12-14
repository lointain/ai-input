import { reactive, defineAsyncComponent, type AsyncComponentLoader } from 'vue'
import type { ContextItemRegistry, ContextItemComponent, RegistryItem } from './types'
import DefaultContextItem from '../components/DefaultContextItem.vue'
import NumberContextItem from '../components/items/NumberContextItem.vue'
import SelectContextItem from '../components/items/SelectContextItem.vue'
import DateContextItem from '../components/items/DateContextItem.vue'

/**
 * Creates and initializes the Context Item Registry.
 * Registers default item types (default, number, select, date).
 * 
 * @returns {ContextItemRegistry} The initialized registry instance
 */
export function createContextItemRegistry(): ContextItemRegistry {
  const items = reactive<Record<string, RegistryItem>>({
    default: { component: DefaultContextItem },
    number: { component: NumberContextItem },
    select: { component: SelectContextItem },
    date: { component: DateContextItem },
  })

  /**
   * Register a new component for a specific type
   * @param {string} type - The unique type identifier
   * @param {ContextItemComponent | RegistryItem} item - The component or registry item
   */
  const register = (type: string, item: ContextItemComponent | RegistryItem) => {
    if ('component' in (item as any)) {
      items[type] = item as RegistryItem
    } else {
      items[type] = { component: item as ContextItemComponent }
    }
  }

  /**
   * Retrieve a registry item by type
   * @param {string} type - The type to look up
   * @returns {RegistryItem | undefined} The registry item or default if not found
   */
  const get = (type: string) => {
    return items[type] || items['default']
  }

  /**
   * Get the Vue component for a specific type
   * Handles async component loading automatically
   * 
   * @param {string} type - The type to look up
   * @returns {ContextItemComponent | AsyncComponentLoader | undefined} The Vue component
   */
  const getComponent = (type: string): ContextItemComponent | AsyncComponentLoader | undefined => {
    const item = get(type)
    if (!item) return undefined

    // Check if it's an async component loader (function)
    if (typeof item.component === 'function' && !('render' in item.component)) {
      return defineAsyncComponent(item.component as any) as unknown as AsyncComponentLoader
    }

    return item.component as ContextItemComponent
  }

  return {
    register,
    get,
    getComponent,
  }
}
