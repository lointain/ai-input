# Voice Input

Voice Input utilizes the browser's Web Speech API to implement Speech-to-Text, enabling users to input content directly via microphone.

## Core Hook: `useVoice`

Logic encapsulated in `hooks/use-voice.ts`.

```typescript
const { 
  isSupported, // Browser support status
  isListening, // Recording status
  start,       // Start recording
  stop         // Stop recording
} = useVoice((text) => {
  // Callback when text is transcribed
  editor.chain().focus().insertContent(text + ' ').run()
})
```

## Browser Compatibility

*   **Chrome / Edge**: Good support (`webkitSpeechRecognition`).
*   **Firefox**: Not supported by default, requires config.
*   **Safari**: Partial support.

The Hook automatically detects `window.SpeechRecognition` or `window.webkitSpeechRecognition` and informs the UI via the `isSupported` flag.

## Usage Flow

1.  User clicks the microphone icon on the toolbar (`AIInputVoice.vue`).
2.  Browser requests microphone permission (first time).
3.  State becomes `listening`, icon highlights/changes color.
4.  User speaks, browser transcribes in real-time.
5.  Result (`finalTranscript`) is inserted at cursor via callback.
6.  Clicking icon again or silence stops the recording.

## Code Integration

Integrated in `AIInputToolbar.vue`:

```vue
<script setup>
import { useVoice } from '../hooks/use-voice'

// Inject editor instance
const { editor } = useAIInputContext()

const onSpeechResult = (text) => {
  if (editor.value) {
    editor.value.chain().focus().insertContent(text).run()
  }
}

const { isListening, toggleListening, isSupported } = useVoice(onSpeechResult)
</script>

<template>
  <button v-if="isSupported" @click="toggleListening">
    <MicIcon :class="{ 'text-red-500': isListening }" />
  </button>
</template>
```

## Notes

*   Web Speech API relies on network connectivity (in some browser implementations).
*   Must be used in an HTTPS environment (or localhost) to access the microphone.