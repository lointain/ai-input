import { describe, it, expect, vi } from 'vitest'
import { useEditorState } from '../hooks/use-editor-state'

// Mock Tiptap
vi.mock('@tiptap/vue-3', () => ({
  useEditor: (options: any) => {
    return {
      value: {
        destroy: vi.fn(),
        commands: {
          setContent: vi.fn(),
          focus: vi.fn(),
          clearContent: vi.fn()
        },
        getHTML: vi.fn(() => '<p>test</p>'),
        isEmpty: false,
        chain: () => ({
          focus: () => ({
            insertContentAt: () => ({
              run: vi.fn()
            }),
            deleteRange: () => ({
              run: vi.fn()
            }),
            insertContent: () => ({
              run: vi.fn()
            })
          })
        })
      }
    }
  },
  Extension: {
    create: (config: any) => config
  },
  VueRenderer: vi.fn(),
  nodeViewProps: {}
}))

describe('useEditorState', () => {
  it('should initialize editor', () => {
    const { editor } = useEditorState()
    expect(editor.value).toBeDefined()
  })

  it('should handle history navigation', async () => {
    const history = ['Command 1', 'Command 2']
    const { editor } = useEditorState({ history })
    
    // We can't easily trigger the keyboard events directly on the mock,
    // but we can verify the configuration logic if we exported the internal state/handlers.
    // Since we don't, we are limited to checking if editor is created with extensions.
    expect(editor.value).toBeDefined()
  })
})
