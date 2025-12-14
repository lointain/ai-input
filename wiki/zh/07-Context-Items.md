# Context Items (上下文项目)

Context Items 是 AI Input 组件中最具扩展性的部分。它不仅用于展示 `@提及` 的结果，还支持在编辑器中嵌入任意结构化的数据块（如日期选择器、下拉菜单、文件预览等）。

## 架构设计

Context Items 采用 **Registry (注册表)** 模式设计。这意味着你可以动态注册新的组件类型，而无需修改编辑器核心代码。

*   **Registry**: `extensions/context-item/registry/index.ts`
*   **Wrapper**: `extensions/context-item/components/ContextItemWrapper.vue`
*   **Node View**: `extensions/context-item/ContextItemView.vue`

## 内置类型

组件库默认提供了一些基础类型：

*   **file**: 文件引用（默认）。
*   **date**: 日期选择器（`DateContextItem.vue`）。
*   **number**: 数字输入（`NumberContextItem.vue`）。
*   **select**: 下拉选择（`SelectContextItem.vue`）。

## 如何注册自定义项

假设你要添加一个 "JIRA Ticket" 类型的上下文项。

### 1. 创建组件 `JiraContextItem.vue`

组件必须接收 `ContextItemProps`。

```vue
<script setup lang="ts">
import type { ContextItemProps } from '../../registry/types'

defineProps<ContextItemProps>()
</script>

<template>
  <div class="flex items-center gap-2 bg-blue-100 px-2 py-1 rounded">
    <span class="font-bold">{{ label }}</span>
    <span class="text-xs text-gray-500">{{ metadata.status }}</span>
  </div>
</template>
```

### 2. 注册组件

在你的应用初始化逻辑中（或在使用 `AIInput` 之前）：

```typescript
import { contextItemRegistry } from '@/registry/default/ai-input/extensions/context-item/registry'
import JiraContextItem from './JiraContextItem.vue'

contextItemRegistry.register('jira-ticket', JiraContextItem)
```

### 3. 使用

当你通过 API 或 Slash Command 插入一个节点时，指定 `type: 'jira-ticket'`：

```typescript
editor.chain().insertContent({
  type: 'contextItem',
  attrs: {
    type: 'jira-ticket',
    label: 'PROJ-123',
    metadata: { status: 'In Progress' }
  }
}).run()
```

编辑器会自动查找注册表中 `jira-ticket` 对应的 Vue 组件并渲染它。

## 交互能力

Context Items 不仅仅是静态展示。因为它们是 Vue 组件，你可以：

*   添加点击事件（如点击打开详情弹窗）。
*   使用 `tippy.js` 添加悬浮卡片。
*   通过 `updateAttributes` prop 更新节点数据（实现编辑器内的双向绑定）。

```typescript
// 在组件内更新自身属性
props.updateAttributes({
  metadata: { ...props.metadata, status: 'Done' }
})
```