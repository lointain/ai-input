import { describe, it, expect } from 'vitest'
import { createContextItemRegistry } from '../extensions/context-item/registry/index'
import DefaultContextItem from '../extensions/context-item/components/DefaultContextItem.vue'
import { defineComponent } from 'vue'

describe('ContextItemRegistry', () => {
  it('should register and retrieve components', () => {
    const registry = createContextItemRegistry()
    const TestComponent = defineComponent({
       name: 'TestComponent',
       props: {
         id: { type: String, required: true },
         label: { type: String, required: true },
         type: { type: String, required: true },
         metadata: { type: Object },
         selected: { type: Boolean, required: true },
         deleteNode: { type: Function, required: true },
         updateAttributes: { type: Function, required: true },
       },
       template: '<div>Test</div>',
     })
 
     registry.register('test', TestComponent as any)

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
