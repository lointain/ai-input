# Mentions (@ Mentions)

The Mention feature allows users to reference specific context items (files, data, etc.) by typing the `@` symbol. This is highly useful in AI scenarios for citing files, database records, or specific knowledge base articles as context.

## How It Works

Built on top of Tiptap's `@tiptap/extension-mention`.

1.  **Trigger**: User types `@`.
2.  **Data Source**: The `items` function in `suggestion.ts` returns matching data.
3.  **Render**: A dropdown list (`MentionList.vue`) appears for selection.
4.  **Insert**: Upon selection, a custom node `contextItem` is inserted.

## Configuring Data Source

Currently, the data source in `extensions/mention/suggestion.ts` uses mock data. In a real application, replace this with real API calls or data passed via Props.

```typescript
// extensions/mention/suggestion.ts

items: async ({ query }) => {
  // Example: Fetch files from API
  const response = await fetch(`/api/files?q=${query}`)
  const files = await response.json()
  return files.map(f => ({ id: f.id, label: f.name, type: 'file' }))
}
```

## Context Item Node

When a user selects a mention, the editor inserts a `contextItem` node instead of plain `@text`. This node is rich and interactive, capable of containing icons, delete buttons, etc.

Node definition is in `extensions/context-item/index.ts`.

## Interaction Flow

1.  Type `@` -> Trigger `Suggestion`.
2.  List Display -> `MentionList.vue`.
3.  Select Item -> Trigger `command` callback.
4.  Editor Insert -> `type: 'contextItem', attrs: { id, label, type }`.

## Best Practices

*   **Async Loading**: Implement debounce and async loading in the `items` function to support large datasets.
*   **Type Differentiation**: Set different `type` attributes for different data (files, people, dates) so the `ContextItem` component can render distinct icons or styles.