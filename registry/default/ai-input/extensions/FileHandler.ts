import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export interface FileHandlerOptions {
  onDrop?: (files: File[], pos: number) => void
  onPaste?: (files: File[]) => void
  onReferenceDrop?: (data: any, pos: number) => void
}

export const FileHandler = Extension.create<FileHandlerOptions>({
  name: 'fileHandler',

  addOptions() {
    return {
      onDrop: undefined,
      onPaste: undefined,
      onReferenceDrop: undefined,
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('fileHandler'),
        props: {
          handleDrop: (view, event, _slice, moved) => {
            if (moved) return false

            const dataTransfer = event.dataTransfer
            if (!dataTransfer) return false

            // 1. Check for Internal Reference Drop (Custom MIME type)
            // We use 'application/x-ai-ref' to identify our own draggable items
            const refData = dataTransfer.getData('application/x-ai-ref')
            if (refData) {
              event.preventDefault()
              try {
                const parsed = JSON.parse(refData)
                const coords = { left: event.clientX, top: event.clientY }
                const pos = view.posAtCoords(coords)?.pos || view.state.selection.from
                
                if (this.options.onReferenceDrop) {
                  this.options.onReferenceDrop(parsed, pos)
                }
                return true
              } catch (e) {
                console.error('Failed to parse reference drop data', e)
              }
            }

            // 2. Check for Files
            const hasFiles = dataTransfer.files?.length
            if (hasFiles) {
              event.preventDefault()
              const files = Array.from(dataTransfer.files)
              const coords = { left: event.clientX, top: event.clientY }
              const pos = view.posAtCoords(coords)?.pos || view.state.selection.from
              
              if (this.options.onDrop) {
                this.options.onDrop(files, pos)
              }
              return true
            }

            return false
          },
          handlePaste: (view, event) => {
             const items = event.clipboardData?.items
             if (!items) return false
             
             const files: File[] = []
             for (const item of Array.from(items)) {
               if (item.kind === 'file') {
                 const file = item.getAsFile()
                 if (file) files.push(file)
               }
             }
             
             if (files.length > 0) {
                event.preventDefault()
                if (this.options.onPaste) {
                    this.options.onPaste(files)
                }
                return true
             }
             return false
          }
        },
      }),
    ]
  },
})
