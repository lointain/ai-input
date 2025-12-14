<script setup lang="ts">
import { useEditor, EditorContent, Extension } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Mention from '@tiptap/extension-mention'
import { onBeforeUnmount, ref, watch } from 'vue'
import { useAIInputContext } from './context'
import { ContextItem } from './extensions/ContextItem'
import { FileHandler } from './extensions/FileHandler'
import { HistoryNavigation } from './extensions/HistoryNavigation'
import mentionSuggestion from './extensions/mentionSuggestion'
import { SlashCommand } from './extensions/SlashCommand'

const { setEditor, submit, isDisabled, addFiles, history } = useAIInputContext()

const historyIndex = ref(-1)
const draft = ref('')

// Define SubmitShortcut extension locally to handle Enter key with correct priority
const SubmitShortcut = Extension.create({
  name: 'submitShortcut',
  priority: 0, // Low priority to let other extensions (like SlashCommand) handle keys first
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        // Safety check: Do not submit if any Tippy popup (suggestion menu) is open
        // This acts as a fallback if the suggestion plugin failed to trap the key
        if (document.querySelector('.tippy-box[data-state="visible"]')) {
          return false // Let default behavior happen (or nothing)
        }

        submit()
        return true // Prevent default behavior (newline)
      }
    }
  }
})

const editor = useEditor({
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: 'Ask AI anything... (Type @ for mention, / for templates)',
      emptyEditorClass: 'is-editor-empty',
    }),
    ContextItem,
    FileHandler.configure({
      onDrop: (files, pos) => {
        addFiles(files)
      },
      onPaste: (files) => {
        addFiles(files)
      },
      onReferenceDrop: (refData, pos) => {
        // Handle internal reference drop
        editor.value?.chain().focus().insertContentAt(pos, {
            type: 'contextItem',
            attrs: {
                id: refData.id,
                label: refData.name,
                type: 'file',
                metadata: { originalType: refData.type }
            }
        }).run()
      }
    }),
    HistoryNavigation.configure({
      onUp: () => {
        if (!history.value.length)
          return false

        if (historyIndex.value === -1) {
          draft.value = editor.value?.getHTML() || ''
        }

        const nextIndex = historyIndex.value + 1
        if (nextIndex < history.value.length) {
          historyIndex.value = nextIndex
          const item = history.value[history.value.length - 1 - nextIndex]
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

          if (nextIndex === -1) {
            editor.value?.commands.setContent(draft.value)
          }
          else {
            const item = history.value[history.value.length - 1 - nextIndex]
            editor.value?.commands.setContent(item)
          }
          editor.value?.commands.focus('end')
          return true
        }
        return false
      },
    }),
    Mention.configure({
      HTMLAttributes: {
        class: 'mention',
      },
      suggestion: {
        ...mentionSuggestion,
        command: ({ editor, range, props }) => {
          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                type: 'contextItem',
                attrs: {
                  id: props.id,
                  label: props.label,
                  type: 'file',
                },
              },
            ])
            .run()
        },
      },
    }),
    SlashCommand.configure({
      priority: 100, // Ensure high priority
    }),
    SubmitShortcut, // Add our new extension
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[60px] p-3 max-h-[400px] overflow-y-auto',
    },
  },
  onUpdate: () => {
    //
  },
})

watch(editor, (val) => {
  if (val) setEditor(val)
}, { immediate: true })

// Update editable state
watch(isDisabled, (val) => {
  editor.value?.setEditable(!val)
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div class="relative w-full">
    <EditorContent :editor="editor" />
  </div>
</template>

<style>
/* Placeholder styles */
.ProseMirror p.is-editor-empty:first-child::before {
  color: hsl(var(--muted-foreground));
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
