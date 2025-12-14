import { reactive } from 'vue'
import type { ContextItemRegistry, ContextItemComponent } from './types'
import DefaultContextItem from './DefaultContextItem.vue'
import NumberContextItem from './items/NumberContextItem.vue'
import SelectContextItem from './items/SelectContextItem.vue'
import DateContextItem from './items/DateContextItem.vue'

export function createContextItemRegistry(): ContextItemRegistry {
  const components = reactive<Record<string, ContextItemComponent>>({
    'default': DefaultContextItem,
    'number': NumberContextItem,
    'select': SelectContextItem,
    'date': DateContextItem
  })

  const register = (type: string, component: ContextItemComponent) => {
    components[type] = component
  }

  const get = (type: string) => {
    return components[type] || components['default']
  }

  return {
    register,
    get
  }
}
