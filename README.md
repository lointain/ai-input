# AI Input for Vue

A Notion-style, AI-native input component for Vue 3 applications. Built on top of Tiptap and shadcn-vue.

[中文文档](./README.zh-CN.md)

## Features

- 📝 **Rich Text Editing**: Powered by Tiptap.
- 🧩 **Slash Commands**: Type `/` to trigger templates or actions.
- @ **Mentions**: Support for @mentioning context items or files.
- 📁 **Drag & Drop**: Handle file uploads with drag and drop support.
- 🎙️ **Voice Input**: Built-in voice recognition support.
- 🎨 **Shadcn UI Compatible**: Designed to fit perfectly with shadcn-vue and ai-element-vue.

## Installation

This component is distributed via a registry, similar to shadcn-vue.

### Prerequisites

- Vue 3
- Tailwind CSS
- shadcn-vue configured

### Add to your project

```bash
npx shadcn-vue@latest add https://lointain.github.io/ai-input/registry/ai-input.json
```

## Documentation

Detailed documentation is available in the [wiki](./wiki) folder:

- [01 Overview](./wiki/en/01-Overview.md)
- [02 Component Usage](./wiki/en/02-Component-Usage.md)
- [03 Global Drag & Drop](./wiki/en/03-Global-Drag-Drop.md)
- [04 Slash Commands](./wiki/en/04-Slash-Commands.md)
- [05 Mentions](./wiki/en/05-Mentions.md)
- [06 Voice Input](./wiki/en/06-Voice-Input.md)
- [07 Context Items](./wiki/en/07-Context-Items.md)

## Development

This repository is a monorepo containing the component source and a demo documentation site.

```bash
pnpm install
pnpm dev
```

## License

MIT
