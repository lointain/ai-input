import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'
import CommandList from './CommandList.vue'
import type { SlashCommandOptions, PromptShortcut } from './types'
import { defaultShortcuts } from './shortcuts'
import { PluginKey } from '@tiptap/pm/state'

export const SlashCommand = Extension.create<SlashCommandOptions>({
  name: 'slashCommand',

  addOptions() {
    return {
      char: '/',
      shortcuts: defaultShortcuts,
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: this.options.char,
        pluginKey: new PluginKey('slashCommand'), // Explicit key to separate from Mentions

        items: ({ query }) => {
          return this.options.shortcuts
            .filter(
              (item) =>
                item.label.toLowerCase().includes(query.toLowerCase()) ||
                item.key.toLowerCase().includes(query.toLowerCase()),
            )
            .slice(0, 10)
        },

        command: ({ editor, range, props }) => {
          const item = props as PromptShortcut

          // Delete the slash command text
          editor.chain().focus().deleteRange(range).run()

          // Insert the template content
          // If template is a function, call it (future proofing for dynamic templates)
          const content = typeof item.template === 'function' ? item.template() : item.template

          // We need to unwrap the 'doc' if it exists, as insertContent expects nodes/array
          const nodesToInsert =
            content.type === 'doc' && content.content ? content.content : content

          editor.chain().insertContent(nodesToInsert).run()
        },

        render: () => {
          let component: VueRenderer
          let popup: any

          return {
            onStart: (props) => {
              component = new VueRenderer(this.options.component || CommandList, {
                props,
                editor: props.editor,
              })

              if (!props.clientRect) {
                return
              }

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect as any,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
                zIndex: 9999, // Ensure it's above other elements
              })
            },

            onUpdate: (props) => {
              component.updateProps(props)

              if (!props.clientRect) {
                return
              }

              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              })
            },

            onKeyDown: (props) => {
              if (props.event.key === 'Escape') {
                popup[0].hide()
                return true
              }
              // @ts-ignore
              return component.ref?.onKeyDown(props)
            },

            onExit: () => {
              popup[0].destroy()
              component.destroy()
            },
          }
        },
      }),
    ]
  },
})
