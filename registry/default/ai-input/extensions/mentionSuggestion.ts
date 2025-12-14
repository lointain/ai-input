import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'
import MentionList from './MentionList.vue'

export default {
  items: ({ query }: { query: string }) => {
    // Mock data
    return [
      { id: '1', label: 'App.vue' },
      { id: '2', label: 'main.ts' },
      { id: '3', label: 'utils.ts' },
      { id: '4', label: 'api.ts' },
      { id: '5', label: 'router.ts' },
      { id: '6', label: 'AIInput.vue' },
    ].filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
  },

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

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
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
