import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AIInputToolbar from '../components/AIInputToolbar.vue'
import { AI_INPUT_KEY } from '../core/types'
import { ref } from 'vue'

// Mock dependencies
vi.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.join(' '),
}))

vi.mock('@/components/ui/button', () => ({
  Button: {
    name: 'Button',
    template: '<button :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
    props: ['disabled', 'variant', 'size'],
  },
}))

vi.mock('lucide-vue-next', () => ({
  ArrowUpIcon: { template: '<svg class="arrow-up" />' },
  SquareIcon: { template: '<svg class="square" />' },
  BugIcon: { template: '<svg />' },
  CodeIcon: { template: '<svg />' },
  TextIcon: { template: '<svg />' },
  SmileIcon: { template: '<svg />' },
  CalendarIcon: { template: '<svg />' },
  HashIcon: { template: '<svg />' },
  DatabaseIcon: { template: '<svg />' },
  TestTubeIcon: { template: '<svg />' },
  PaletteIcon: { template: '<svg />' },
  SparklesIcon: { template: '<svg />' },
}))

describe('AIInputToolbar', () => {
  const createWrapper = (contextOverrides = {}) => {
    return mount(AIInputToolbar, {
      global: {
        provide: {
          [AI_INPUT_KEY]: {
            submit: vi.fn(),
            isLoading: ref(false),
            isEmpty: ref(false),
            ...contextOverrides,
          },
        },
      },
    })
  }

  it('should render submit button', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('.arrow-up').exists()).toBe(true)
  })

  it('should disable button when empty', () => {
    const wrapper = createWrapper({ isEmpty: ref(true) })
    // Since we mocked Button with a simple template, we need to find it by element or class if name lookup fails,
    // or ensure the mock component has a name.
    // The previous error "Cannot call props on an empty VueWrapper" means findComponent({ name: 'Button' }) failed.
    // Let's try finding by the button tag which our mock renders.
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    // Or if we want to check the prop passed to the mock:
    // We need to ensure the mock is registered/found correctly.
    // Since we imported Button from '@/components/ui/button', let's check how we mocked it.
  })

  it('should show loading state', () => {
    const wrapper = createWrapper({ isLoading: ref(true) })
    expect(wrapper.find('.square').exists()).toBe(true)
    expect(wrapper.find('.arrow-up').exists()).toBe(false)
  })

  it('should call submit on click', async () => {
    const submit = vi.fn()
    const wrapper = createWrapper({ submit })

    await wrapper.find('button').trigger('click')
    expect(submit).toHaveBeenCalled()
  })
})
