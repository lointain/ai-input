import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ContextItemView from './ContextItemView.vue'

/**
 * ContextItem Extension for Tiptap
 * 
 * Defines a custom 'contextItem' node that renders as an inline block.
 * Uses a Vue Node View to render dynamic content based on the item type.
 */
export const ContextItem = Node.create({
  name: 'contextItem',
  group: 'inline',
  inline: true,
  atom: true,

  /**
   * Define attributes for the node
   */
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

  /**
   * Parse HTML definition
   */
  parseHTML() {
    return [
      {
        tag: 'context-item',
      },
    ]
  },

  /**
   * Render HTML definition
   */
  renderHTML({ HTMLAttributes }) {
    return ['context-item', mergeAttributes(HTMLAttributes)]
  },

  /**
   * Attach the Vue Node View
   */
  addNodeView() {
    return VueNodeViewRenderer(ContextItemView)
  },
})
