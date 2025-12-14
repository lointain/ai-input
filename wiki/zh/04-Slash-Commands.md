# Slash Commands (指令系统)

Slash Commands 允许用户通过输入 `/` 字符唤起一个命令菜单，快速插入内容、执行操作或改变编辑器状态。这与 Notion 或 Slack 的交互方式类似。

## 功能定义

*   **触发**: 输入 `/`。
*   **过滤**: 根据用户输入的关键词过滤命令列表。
*   **执行**: 选中命令后，执行定义好的 `command` 回调（如插入文本、节点或执行函数）。

## 默认指令

组件内置了 `defaultShortcuts`，包含基础操作。你可以通过配置覆盖或扩展它们。

```typescript
// 默认指令示例
[
  {
    label: 'Text',
    key: 'text',
    icon: TextIcon,
    template: '<p></p>' // 插入段落
  },
  {
    label: 'Heading 1',
    key: 'h1',
    template: '<h1></h1>'
  }
]
```

## 自定义指令

你可以通过修改 `SlashCommand` 扩展的配置来添加自定义指令。目前 `AIInput` 组件内部封装了扩展加载，若需深度定制，建议修改 `extensions/slash-command/shortcuts.ts` 或通过 props 传递（需组件支持扩展注入，当前版本主要通过修改源码文件实现配置）。

### 指令数据结构

```typescript
interface PromptShortcut {
  label: string;          // 显示名称
  key: string;            // 唯一键
  icon?: Component;       // 图标组件 (Vue组件)
  description?: string;   // 描述文本
  // template 可以是 HTML 字符串、JSON 节点或返回它们的函数
  template: string | object | (() => string | object); 
}
```

## 菜单渲染 (CommandList)

菜单通过 `tippy.js` 渲染在光标位置。
`extensions/slash-command/index.ts` 定义了渲染逻辑：

1.  **Suggestion Utility**: 使用 Tiptap 的 `Suggestion` 插件监听 `/` 输入。
2.  **VueRenderer**: 使用 `CommandList.vue` 组件渲染菜单项。
3.  **Tippy.js**: 负责定位和弹出层管理。

### 自定义菜单样式

若要修改菜单样式，请编辑 `registry/default/ai-input/extensions/slash-command/CommandList.vue`。该组件接收 `items` (过滤后的指令列表) 和 `command` (执行函数) 作为 props。

## 高级用法：动态模板

`template` 属性支持函数，这允许你动态生成内容。例如插入当前日期：

```typescript
{
  label: 'Current Date',
  key: 'date',
  template: () => `<p>${new Date().toLocaleDateString()}</p>`
}
```