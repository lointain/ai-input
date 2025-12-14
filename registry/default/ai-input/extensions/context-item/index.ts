import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ContextItemView from './ContextItemView.vue'

export const ContextItem = Node.create({
  name: 'contextItem',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
      },
      type: {
        default: 'file',
      },
      label: {
        default: 'Context Item',
      },
      metadata: {
        default: {},
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'context-item',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['context-item', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(ContextItemView)
  },
})
