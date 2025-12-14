import { Extension } from '@tiptap/core'

export interface HistoryNavigationOptions {
  onUp?: () => boolean
  onDown?: () => boolean
}

export const HistoryNavigation = Extension.create<HistoryNavigationOptions>({
  name: 'historyNavigation',

  addOptions() {
    return {
      onUp: undefined,
      onDown: undefined,
    }
  },

  addKeyboardShortcuts() {
    return {
      // ArrowUp: ({ editor }) => { ... }
      // We moved this logic to useEditorState options for better Reactivity
    }
  },
})
