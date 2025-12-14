import { reactive, defineAsyncComponent } from 'vue'
import type { ContextItemRegistry, ContextItemComponent, RegistryItem } from './types'
import DefaultContextItem from '../components/DefaultContextItem.vue'
import NumberContextItem from '../components/items/NumberContextItem.vue'
import SelectContextItem from '../components/items/SelectContextItem.vue'
import DateContextItem from '../components/items/DateContextItem.vue'

export function createContextItemRegistry(): ContextItemRegistry {
  const items = reactive<Record<string, RegistryItem>>({
    'default': { component: DefaultContextItem },
    'number': { component: NumberContextItem },
    'select': { component: SelectContextItem },
    'date': { component: DateContextItem }
  })

  const register = (type: string, item: ContextItemComponent | RegistryItem) => {
    if ('component' in (item as any)) {
      items[type] = item as RegistryItem
    } else {
      items[type] = { component: item as ContextItemComponent }
    }
  }

  const get = (type: string) => {
    return items[type] || items['default']
  }
  
  const getComponent = (type: string) => {
    const item = get(type)
    if (!item) return undefined
    
    // Check if it's an async component loader (function)
    if (typeof item.component === 'function' && !('render' in item.component)) {
       return defineAsyncComponent(item.component as any)
    }
    
    return item.component
  }

  return {
    register,
    get,
    getComponent
  }
}
