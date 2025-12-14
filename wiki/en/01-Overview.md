# Overview

AI Input is a modern, Notion-style AI-native input component built for the Vue 3 ecosystem. It integrates rich text editing, slash commands, context mentions (@mentions), voice input, and drag-and-drop file handling to provide an ultimate user experience for AI chat and knowledge base editing scenarios.

## Key Features

*   **📝 Rich Text Editing**: Powered by [Tiptap](https://tiptap.dev/), providing stable and extensible rich text capabilities.
*   **🧩 Slash Commands (/)**: Built-in slash command menu supporting quick template insertion, actions, and custom commands.
*   **@ Mentions**: A powerful context management system supporting references to files, data, or other context items via the @ symbol.
*   **📁 Global Drag & Drop**: Deeply integrated file drag-and-drop experience supporting multi-file uploads, state management, and callbacks.
*   **🎙️ Voice Input**: Built-in Web Speech API support providing out-of-the-box speech-to-text functionality.
*   **🎨 Shadcn UI Style**: Follows Shadcn UI design specifications, fitting perfectly into modern Vue applications.
*   **🔌 Plugin Architecture**: Highly modular design where all features (like Context Items) can be extended and customized.

## Design Goals

1.  **Out of the Box**: Provides default configurations to run with minimal code.
2.  **Highly Customizable**: Offers rich APIs for developers to extend both styles and logic.
3.  **AI Native**: Designed specifically for AI interaction scenarios, emphasizing context management and input efficiency.

## Quick Start

### Installation

Ensure your project has Vue 3 and Tailwind CSS installed.

```bash
# Add via shadcn-vue (Recommended)
npx shadcn-vue@latest add https://lointain.github.io/ai-input/registry/ai-input.json
```

### Basic Usage

```vue
<script setup lang="ts">
import { AIInput, AIInputEditor, AIInputToolbar } from '@/components/ai-input'

const handleSubmit = (content: string, files: any[]) => {
  console.log('Submitted:', content, files)
}
</script>

<template>
  <AIInput 
    placeholder="Type @ to mention files, or / for commands..." 
    @submit="handleSubmit"
  >
    <AIInputEditor />
    <AIInputToolbar />
  </AIInput>
</template>
```