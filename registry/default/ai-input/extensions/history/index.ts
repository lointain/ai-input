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
      ArrowUp: () => {
        // Trigger if editor is empty or cursor is at start
        const { selection, doc } = this.editor.state
        const isAtStart = selection.$anchor.pos === 1
        const isEmpty = this.editor.isEmpty

        if ((isEmpty || isAtStart) && this.options.onUp) {
          return this.options.onUp()
        }
        return false
      },
      ArrowDown: () => {
        // Trigger if editor is empty or cursor is at end
        const { selection, doc } = this.editor.state
        const isAtEnd = selection.$anchor.pos === doc.content.size - 1
        const isEmpty = this.editor.isEmpty

        if ((isEmpty || isAtEnd) && this.options.onDown) {
          return this.options.onDown()
        }
        return false
      },
    }
  },
})
