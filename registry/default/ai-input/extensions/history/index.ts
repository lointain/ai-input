import { Extension } from '@tiptap/core'

/**
 * Options for History Navigation extension
 */
export interface HistoryNavigationOptions {
  /** Handler for Up arrow key */
  onUp?: () => boolean
  /** Handler for Down arrow key */
  onDown?: () => boolean
}

/**
 * HistoryNavigation Extension
 * 
 * Manages keyboard shortcuts for navigating through command history (Up/Down arrows).
 * Logic is delegated to the provided callbacks.
 */
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
