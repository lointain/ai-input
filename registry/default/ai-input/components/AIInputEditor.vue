<script setup lang="ts">
/**
 * AIInputEditor.vue
 * 
 * Wrapper around Tiptap EditorContent.
 * Handles the editor instance injection and editable state synchronization.
 * 
 * @component
 */
import { EditorContent } from '@tiptap/vue-3'
import { watch } from 'vue'
import { useAIInputContext } from '../core/context'

const { editor, isDisabled } = useAIInputContext()

// Update editable state
watch(isDisabled, (val) => {
  editor.value?.setEditable(!val)
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
