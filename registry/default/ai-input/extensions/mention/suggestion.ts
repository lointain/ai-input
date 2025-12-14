import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'
import MentionList from './MentionList.vue'

/**
 * Configuration for Tiptap Mention extension suggestion utility.
 * Handles the popup rendering and item filtering.
 */
export default {
  /**
   * Filter items based on query
   */
  items: ({ query }: { query: string }) => {
    // Mock data
    return [
      { id: '1', label: 'App.vue' },
      { id: '2', label: 'main.ts' },
      { id: '3', label: 'utils.ts' },
      { id: '4', label: 'api.ts' },
      { id: '5', label: 'router.ts' },
      { id: '6', label: 'AIInput.vue' },
    ].filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
  },

  /**
   * Execution command when an item is selected
   */
  command: ({ editor, range, props }: any) => {
    // Increase range.to by one when the next node is of type "text"
    // and starts with a space character
    const nodeAfter = editor.view.state.selection.$to.nodeAfter
    const overrideSpace = nodeAfter?.text?.startsWith(' ')

    if (overrideSpace) {
      range.to += 1
    }

    editor
      .chain()
      .focus()
      .insertContentAt(range, [
        {
          type: 'contextItem',
          attrs: {
            id: props.id,
            label: props.label,
            type: 'file', // Default type for now
          },
        },
        {
          type: 'text',
          text: ' ',
        },
      ])
      .run()

    window.getSelection()?.collapseToEnd()
  },

  /**
   * Renderer configuration for the popup
   */
  render: () => {
    let component: VueRenderer
    let popup: any

    return {
      onStart: (props: any) => {
        component = new VueRenderer(MentionList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy(document.body as any, {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element as any,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate: (props: any) => {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown: (props: any) => {
        if (props.event.key === 'Escape') {
          popup[0].hide()
          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit: () => {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}
