import { ref, computed, onBeforeUnmount } from 'vue'
import { useEditor, Extension } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Mention from '@tiptap/extension-mention'
import { ContextItem } from '../extensions/context-item'
import { FileHandler } from '../extensions/file-handler'
import { HistoryNavigation } from '../extensions/history'
import mentionSuggestion from '../extensions/mention/suggestion'
import { SlashCommand } from '../extensions/slash-command'
import type { AnyExtension } from '@tiptap/core'

/**
 * Localization options for the editor
 */
export interface Locale {
  placeholder: string
}

/**
 * Default localization settings
 */
export const defaultLocale: Locale = {
  placeholder: 'Ask AI anything... (Type @ for mention, / for templates)',
}

/**
 * Options for initializing the editor state
 */
export interface UseEditorStateOptions {
  /** Command history for navigation */
  history?: string[]
  /** Placeholder text */
  placeholder?: string
  /** Localization overrides */
  locale?: Partial<Locale>
  /** Callback on submit (Enter key) */
  onSubmit?: () => void
  /** Callback when files are added (paste/drop) */
  onAddFiles?: (files: File[]) => void
  /** Custom extension configuration */
  extensions?: (defaultExtensions: AnyExtension[]) => AnyExtension[]
}

/**
 * Hook to manage Tiptap editor instance and configuration.
 * Sets up all extensions including Mentions, Slash Commands, File Handling, etc.
 * 
 * @param {UseEditorStateOptions} options - Configuration options
 * @returns {Object} Object containing the editor instance
 */
export function useEditorState(options: UseEditorStateOptions = {}) {
  const historyIndex = ref(-1)
  const draft = ref('')

  const locale = computed(() => ({
    ...defaultLocale,
    ...options.locale,
  }))

  // Define SubmitShortcut extension locally
  /**
   * Custom extension to handle Enter key submission
   */
  const SubmitShortcut = Extension.create({
    name: 'submitShortcut',
    priority: 0,
    addKeyboardShortcuts() {
      return {
        Enter: () => {
          if (document.querySelector('.tippy-box[data-state="visible"]')) {
            return false
          }
          options.onSubmit?.()
          return true
        },
      }
    },
  })

  /**
   * Configure default extensions
   */
  const getDefaultExtensions = () => [
    StarterKit,
    Placeholder.configure({
      placeholder: options.placeholder || locale.value.placeholder,
      emptyEditorClass: 'is-editor-empty',
    }),
    ContextItem,
    FileHandler.configure({
      onDrop: (files: File[]) => {
        options.onAddFiles?.(files)
      },
      onPaste: (files: File[]) => {
        options.onAddFiles?.(files)
      },
      onReferenceDrop: (refData: any, pos: number) => {
        editor.value
          ?.chain()
          .focus()
          .insertContentAt(pos, {
            type: 'contextItem',
            attrs: {
              id: refData.id,
              label: refData.name,
              type: 'file',
              metadata: { originalType: refData.type },
            },
          })
          .run()
      },
    }),
    HistoryNavigation.configure({
      onUp: () => {
        const history = options.history || []
        if (!history.length) return false

        if (historyIndex.value === -1) {
          draft.value = editor.value?.getHTML() || ''
        }

        const nextIndex = historyIndex.value + 1
        if (nextIndex < history.length) {
          historyIndex.value = nextIndex
          const item = history[history.length - 1 - nextIndex]
          editor.value?.commands.setContent(item)
          editor.value?.commands.focus('end')
          return true
        }
        return false
      },
      onDown: () => {
        if (historyIndex.value > -1) {
          const nextIndex = historyIndex.value - 1
          historyIndex.value = nextIndex

          const history = options.history || []

          if (nextIndex === -1) {
            editor.value?.commands.setContent(draft.value)
          } else {
            const item = history[history.length - 1 - nextIndex]
            editor.value?.commands.setContent(item)
          }
          editor.value?.commands.focus('end')
          return true
        }
        return false
      },
    }),
    SlashCommand,
    Mention.configure({
      HTMLAttributes: {
        class: 'mention',
      },
      suggestion: mentionSuggestion,
    }),
    SubmitShortcut,
  ]

  const extensions = computed(() => {
    const defaults = getDefaultExtensions() as AnyExtension[]
    return options.extensions ? options.extensions(defaults) : defaults
  })

  const editor = useEditor({
    extensions: extensions.value,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[60px] max-h-[200px] overflow-y-auto px-4 py-3',
      },
    },
  })

  // Cleanup
  onBeforeUnmount(() => {
    editor.value?.destroy()
  })

  return {
    editor,
  }
}
