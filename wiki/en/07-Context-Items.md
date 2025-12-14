# Context Items

Context Items are the most extensible part of the AI Input component. They are used not only to display `@mention` results but also to embed arbitrary structured data blocks (like date pickers, dropdowns, file previews, etc.) into the editor.

## Architecture

Context Items are designed using the **Registry Pattern**. This means you can dynamically register new component types without modifying the core editor code.

*   **Registry**: `extensions/context-item/registry/index.ts`
*   **Wrapper**: `extensions/context-item/components/ContextItemWrapper.vue`
*   **Node View**: `extensions/context-item/ContextItemView.vue`

## Built-in Types

The library provides some basic types by default:

*   **file**: File reference (default).
*   **date**: Date picker (`DateContextItem.vue`).
*   **number**: Number input (`NumberContextItem.vue`).
*   **select**: Dropdown select (`SelectContextItem.vue`).

## Registering Custom Items

Suppose you want to add a "JIRA Ticket" type context item.

### 1. Create Component `JiraContextItem.vue`

The component must accept `ContextItemProps`.

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

### 2. Register Component

In your app initialization logic (or before using `AIInput`):

```typescript
import { contextItemRegistry } from '@/registry/default/ai-input/extensions/context-item/registry'
import JiraContextItem from './JiraContextItem.vue'

contextItemRegistry.register('jira-ticket', JiraContextItem)
```

### 3. Usage

When inserting a node via API or Slash Command, specify `type: 'jira-ticket'`:

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

The editor will automatically look up the Vue component for `jira-ticket` in the registry and render it.

## Interactivity

Context Items are not just static displays. Since they are Vue components, you can:

*   Add click events (e.g., open details modal).
*   Use `tippy.js` for hover cards.
*   Update node data via `updateAttributes` prop (enabling two-way binding within the editor).

```typescript
// Update self attributes within component
props.updateAttributes({
  metadata: { ...props.metadata, status: 'Done' }
})
```