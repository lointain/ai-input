import { describe, it, expect } from 'vitest'
import { createContextItemRegistry } from '../extensions/context-item/registry/index'
import DefaultContextItem from '../extensions/context-item/components/DefaultContextItem.vue'
import { defineComponent, markRaw } from 'vue'

describe('ContextItemRegistry', () => {
  it('should register and retrieve components', () => {
    const registry = createContextItemRegistry()
    const TestComponent = defineComponent({ name: 'Test' })
    
    registry.register('test', TestComponent)
    
    const item = registry.get('test')
    expect(item).toBeDefined()
    expect(item?.component).toStrictEqual(TestComponent)
  })

  it('should return default component for unknown types', () => {
    const registry = createContextItemRegistry()
    const item = registry.get('unknown-type')
    
    expect(item).toBeDefined()
    // It should return the default item wrapper
    expect(item?.component).toStrictEqual(DefaultContextItem)
  })

  it('should handle getComponent helper', () => {
    const registry = createContextItemRegistry()
    const TestComponent = defineComponent({ name: 'Test' })
    
    registry.register('test', { component: TestComponent })
    
    const component = registry.getComponent('test')
    expect(component).toStrictEqual(TestComponent)
  })
})
