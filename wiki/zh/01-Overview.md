# 总体介绍 (Overview)

AI Input 是一个专为 Vue 3 生态系统打造的现代化、Notion 风格的 AI 原生输入组件。它集成了富文本编辑、Slash 命令、上下文提及 (@mentions)、语音输入和文件拖拽等高级功能，旨在为 AI 聊天、知识库编辑等场景提供极致的用户体验。

## 核心特性

*   **📝 富文本编辑**: 基于 [Tiptap](https://tiptap.dev/) 强力驱动，提供稳定且可扩展的富文本编辑能力。
*   **🧩 Slash 命令 (/)**: 内置 Slash 命令菜单，支持快速插入模板、执行操作，并支持自定义命令。
*   **@ 提及功能 (Mentions)**: 强大的上下文管理系统，支持通过 @ 符号引用文件、数据或其他上下文项。
*   **📁 全局拖拽 (Drag & Drop)**: 深度集成的文件拖拽体验，支持多文件上传、状态管理和回调处理。
*   **🎙️ 语音输入**: 内置 Web Speech API 支持，提供开箱即用的语音转文字功能。
*   **🎨 Shadcn UI 风格**: 遵循 Shadcn UI 设计规范，完美融入现代化 Vue 应用。
*   **🔌 插件化架构**: 高度模块化的设计，所有功能（如 Context Items）均可扩展和自定义。

## 设计目标

1.  **开箱即用**: 提供默认配置，只需极少代码即可运行。
2.  **高度可定制**: 无论是样式还是逻辑，都提供丰富的 API 供开发者扩展。
3.  **AI Native**: 专为 AI 交互场景设计，强调上下文 (Context) 的管理和输入效率。

## 快速开始

### 安装

确保你的项目已安装 Vue 3 和 Tailwind CSS。

```bash
# 通过 shadcn-vue 方式添加（推荐）
npx shadcn-vue@latest add https://lointain.github.io/ai-input/registry/ai-input.json
```

### 基础使用

```vue
<script setup lang="ts">
import { AIInput, AIInputEditor, AIInputToolbar } from '@/components/ai-input'

const handleSubmit = (content: string, files: any[]) => {
  console.log('Submitted:', content, files)
}
</script>

<template>
  <AIInput 
    placeholder="输入 @ 提及文件，或输入 / 使用命令..." 
    @submit="handleSubmit"
  >
    <AIInputEditor />
    <AIInputToolbar />
  </AIInput>
</template>
```
