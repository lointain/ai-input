# Component Usage

`AIInput` adopts the Compound Components pattern, offering flexible layout and configuration capabilities.

## Component Structure

A standard AIInput implementation typically includes the following parts:

*   `AIInput`: The root container managing state (files, editor instance, configuration).
*   `AIInputEditor`: The core editor area.
*   `AIInputToolbar`: The bottom toolbar containing attachment, voice, and submit buttons.
*   `AIInputAttachments`: (Automatically included in AIInput) Displays the list of uploaded files.

## API Reference

### AIInput Props

| Prop Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `placeholder` | `string` | `undefined` | Placeholder text for the editor. |
| `minHeight` | `string` | `'60px'` | Minimum height of the editor. |
| `maxHeight` | `string` | `'400px'` | Maximum height of the editor, scrolls if exceeded. |
| `disabled` | `boolean` | `false` | Whether to disable input and interaction. |
| `loading` | `boolean` | `false` | Whether in loading/sending state (disables submission). |
| `uploadHandler` | `Function` | `undefined` | Custom file upload handler function (see Global Drag & Drop section). |
| `accept` | `string` | `undefined` | Allowed file types (e.g., `image/*`). |
| `maxSize` | `number` | `undefined` | Max size per file in bytes. |
| `maxFiles` | `number` | `undefined` | Max number of files allowed. |
| `history` | `string[]` | `[]` | Command history supporting up/down navigation. |

### AIInput Events

| Event Name | Arguments | Description |
| :--- | :--- | :--- |
| `submit` | `(content: string, files: AttachmentFile[])` | Triggered when user presses Enter (without Shift) or clicks the submit button. |

### Slots

*   `default`: For placing child components like `AIInputEditor`, `AIInputToolbar`.

## Complete Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { 
  AIInput, 
  AIInputEditor, 
  AIInputToolbar 
} from '@/components/ai-input'

const isLoading = ref(false)

const handleUpload = async (file: File, onProgress: (p: number) => void) => {
  // Simulate upload
  return new Promise((resolve) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      onProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        resolve({ url: 'https://example.com/file' })
      }
    }, 200)
  })
}

const handleSubmit = async (content: string, files: any[]) => {
  isLoading.value = true
  try {
    console.log('Content:', content)
    console.log('Attachments:', files)
    // Simulate API request
    await new Promise(r => setTimeout(r, 1000))
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="p-4 max-w-2xl mx-auto">
    <AIInput
      placeholder="Ask AI anything..."
      :loading="isLoading"
      :upload-handler="handleUpload"
      accept="image/*,.pdf"
      @submit="handleSubmit"
    >
      <AIInputEditor />
      <div class="flex justify-between items-center p-2">
        <AIInputToolbar />
      </div>
    </AIInput>
  </div>
</template>
```

## Styling Customization

The component root element has a `data-ai-input` attribute. You can easily override styles using CSS or Tailwind classes. The `AIInput` component also accepts a `class` prop, which merges with the root container.