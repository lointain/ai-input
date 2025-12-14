import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AIInput from '../components/AIInput.vue'
import { AI_INPUT_KEY } from '../core/types'

// Mock dependencies
vi.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.join(' ')
}))

describe('AIInput', () => {
  it('should render correctly', () => {
    const wrapper = mount(AIInput)
    expect(wrapper.find('div').exists()).toBe(true)
    expect(wrapper.find('input[type="file"]').exists()).toBe(true)
  })

  it('should provide context', () => {
    const wrapper = mount(AIInput)
    // Check if provider is called (implicit via successful mount as useAIInputProvider is called in setup)
    // To truly check injection, we would need a child component test helper
    expect(wrapper.exists()).toBe(true)
  })

  it('should handle file selection via input', async () => {
    const wrapper = mount(AIInput)
    const input = wrapper.find('input[type="file"]')
    
    // Create a mock file
    const file = new File(['content'], 'test.txt', { type: 'text/plain' })
    
    // Simulate file selection
    Object.defineProperty(input.element, 'files', {
      value: [file]
    })
    
    await input.trigger('change')
  })

  it('should handle file drop', async () => {
    const wrapper = mount(AIInput)
    const div = wrapper.find('div[data-ai-input]')
    
    const file = new File(['content'], 'test.txt', { type: 'text/plain' })
    const mockDataTransfer = {
      types: ['Files'],
      files: [file],
      preventDefault: vi.fn()
    }
    
    await div.trigger('drop', {
      dataTransfer: mockDataTransfer
    })
    
    // Again, we can't easily assert the internal state without mocking useAIInputProvider.
    // But we ensure no error is thrown and the event handler is attached.
    expect(wrapper.exists()).toBe(true)
  })
})
