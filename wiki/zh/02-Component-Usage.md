# 组件用法详解 (Component Usage)

`AIInput` 采用复合组件模式（Compound Components），提供了灵活的布局和配置能力。

## 组件结构

一个标准的 AIInput 实现通常包含以下部分：

*   `AIInput`: 根容器，管理状态（文件、编辑器实例、配置）。
*   `AIInputEditor`: 编辑器核心区域。
*   `AIInputToolbar`: 底部工具栏，包含附件按钮、语音按钮和发送按钮。
*   `AIInputAttachments`: （自动包含在 AIInput 中）用于展示已上传的文件列表。

## API 参考

### AIInput Props

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `placeholder` | `string` | `undefined` | 编辑器的占位符文本。 |
| `minHeight` | `string` | `'60px'` | 编辑器的最小高度。 |
| `maxHeight` | `string` | `'400px'` | 编辑器的最大高度，超过后出现滚动条。 |
| `disabled` | `boolean` | `false` | 是否禁用输入和交互。 |
| `loading` | `boolean` | `false` | 是否处于加载/发送状态（禁用提交）。 |
| `uploadHandler` | `Function` | `undefined` | 自定义文件上传处理函数（见 Global Drag & Drop 章节）。 |
| `accept` | `string` | `undefined` | 允许上传的文件类型（如 `image/*`）。 |
| `maxSize` | `number` | `undefined` | 单个文件最大字节数。 |
| `maxFiles` | `number` | `undefined` | 最大允许上传的文件数量。 |
| `history` | `string[]` | `[]` | 命令历史记录，支持上下键回溯。 |

### AIInput Events

| 事件名 | 参数 | 说明 |
| :--- | :--- | :--- |
| `submit` | `(content: string, files: AttachmentFile[])` | 当用户按下回车（非 Shift+Enter）或点击发送按钮时触发。 |

### Slots

*   `default`: 用于放置 `AIInputEditor`, `AIInputToolbar` 等子组件。

## 完整示例

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
  // 模拟上传
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
    console.log('发送内容:', content)
    console.log('附件:', files)
    // 模拟 API 请求
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

## 样式定制

组件根元素带有 `data-ai-input` 属性，你可以通过 CSS 或 Tailwind 类名轻松覆盖样式。`AIInput` 组件也接收 `class` 属性，会合并到根容器上。