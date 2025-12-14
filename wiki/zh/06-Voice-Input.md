# Voice Input (语音输入)

语音输入功能利用浏览器的 Web Speech API 实现语音转文字 (Speech-to-Text)，让用户可以通过麦克风直接输入内容。

## 核心 Hook: `useVoice`

逻辑封装在 `hooks/use-voice.ts` 中。

```typescript
const { 
  isSupported, // 浏览器是否支持
  isListening, // 是否正在录音
  start,       // 开始录音
  stop         // 停止录音
} = useVoice((text) => {
  // 当识别到文本时的回调
  editor.chain().focus().insertContent(text + ' ').run()
})
```

## 浏览器兼容性

*   **Chrome / Edge**: 支持良好 (`webkitSpeechRecognition`)。
*   **Firefox**: 默认不支持，需配置。
*   **Safari**: 部分支持。

Hook 内部会自动检测 `window.SpeechRecognition` 或 `window.webkitSpeechRecognition`，并通过 `isSupported` 标志位告知 UI 是否显示语音按钮。

## 使用流程

1.  用户点击工具栏上的麦克风图标 (`AIInputVoice.vue`)。
2.  浏览器请求麦克风权限（首次）。
3.  状态变为 `listening`，图标高亮/变色。
4.  用户说话，浏览器实时识别。
5.  识别结果 (`finalTranscript`) 通过回调插入到编辑器光标处。
6.  再次点击图标或静默一段时间后，录音停止。

## 代码集成

在 `AIInputToolbar.vue` 中集成：

```vue
<script setup>
import { useVoice } from '../hooks/use-voice'

// 注入编辑器实例
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

## 注意事项

*   Web Speech API 依赖网络连接（在某些浏览器实现中）。
*   必须在 HTTPS 环境下（或 localhost）才能调用麦克风。