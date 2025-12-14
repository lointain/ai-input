# AI Input for Vue

一个为 Vue 3 应用打造的 Notion 风格 AI 输入组件。基于 Tiptap 和 shadcn-vue 构建。

## 特性

- 📝 **富文本编辑**: 基于 Tiptap 强力驱动。
- 🧩 **Slash 命令**: 输入 `/` 快速触发模板或操作。
- @ **提及功能**: 支持 @ 提及上下文项或文件。
- 📁 **拖拽上传**: 支持文件拖拽上传交互。
- 🎙️ **语音输入**: 内置语音识别支持。
- 🎨 **Shadcn UI 兼容**: 专为 shadcn-vue和ai-element-vue 生态设计。

## 安装

本组件采用 Registry 方式分发，类似 shadcn-vue 的安装方式。

### 前置要求

- Vue 3
- Tailwind CSS
- 项目已配置 shadcn-vue

### 添加到项目

```bash
npx shadcn-vue@latest add https://ai-input.vercel.app/registry/ai-input.json
```

(注意: 请将 URL 替换为实际部署后的地址)

## 开发

本项目采用 Monorepo 结构，包含组件源码和演示文档站点。

```bash
pnpm install
pnpm dev
```

## 许可证

MIT
