# Mentions (@ 提及功能)

提及功能允许用户通过输入 `@` 符号来引用特定的上下文项（Context Items）。这在 AI 场景中非常有用，例如引用文件、数据库记录或特定的知识库文章作为 AI 的上下文。

## 工作原理

基于 Tiptap 的 `@tiptap/extension-mention` 扩展构建。

1.  **触发**: 用户输入 `@`。
2.  **数据源**: `suggestion.ts` 中的 `items` 函数负责返回匹配的数据。
3.  **渲染**: 弹出一个下拉列表（`MentionList.vue`）供用户选择。
4.  **插入**: 选中后，插入一个自定义节点 `contextItem`。

## 配置数据源

目前数据源在 `extensions/mention/suggestion.ts` 中是 Mock 数据。在实际应用中，你应当将其替换为真实的 API 调用或 Props 传入的数据。

```typescript
// extensions/mention/suggestion.ts

items: async ({ query }) => {
  // 示例：从 API 获取文件列表
  const response = await fetch(`/api/files?q=${query}`)
  const files = await response.json()
  return files.map(f => ({ id: f.id, label: f.name, type: 'file' }))
}
```

## Context Item 节点

当用户选中一个提及项时，编辑器中并不会插入普通的 `@text`，而是插入一个 `contextItem` 节点。这个节点是富交互的，可以包含图标、删除按钮等。

节点结构定义在 `extensions/context-item/index.ts`。

## 交互流程

1.  输入 `@` -> 触发 `Suggestion`。
2.  列表展示 -> `MentionList.vue`。
3.  选择项目 -> 触发 `command` 回调。
4.  编辑器插入 -> `type: 'contextItem', attrs: { id, label, type }`。

## 最佳实践

*   **异步加载**: 建议在 `items` 函数中实现防抖 (debounce) 和异步加载，以支持大规模数据集。
*   **类型区分**: 为不同类型的数据（如文件、人员、日期）设置不同的 `type` 属性，以便 `ContextItem` 组件渲染不同的图标或样式。