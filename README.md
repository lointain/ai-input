# AI Input for Vue

A Notion-style, AI-native input component for Vue 3 applications. Built on top of Tiptap and shadcn-vue.

[中文文档](./README.zh-CN.md)

## Features

- 📝 **Rich Text Editing**: Powered by Tiptap.
- 🧩 **Slash Commands**: Type `/` to trigger templates or actions.
- @ **Mentions**: Support for @mentioning context items or files.
- 📁 **Drag & Drop**: Handle file uploads with drag and drop support.
- 🎙️ **Voice Input**: Built-in voice recognition support.
- 🎨 **Shadcn UI Compatible**: Designed to fit perfectly with shadcn-vue.

## Installation

This component is distributed via a registry, similar to shadcn-vue.

### Prerequisites

- Vue 3
- Tailwind CSS
- shadcn-vue configured

### Add to your project

```bash
npx shadcn-vue@latest add https://ai-input.vercel.app/registry/ai-input.json
```

(Note: Replace the URL with your actual deployment URL)

## Development

This repository is a monorepo containing the component source and a demo documentation site.

```bash
pnpm install
pnpm dev
```

## License

MIT
