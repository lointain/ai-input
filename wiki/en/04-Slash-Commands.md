# Slash Commands

Slash Commands allow users to invoke a command menu by typing the `/` character, enabling quick content insertion, actions, or editor state changes. This interaction style is similar to Notion or Slack.

## Definition

*   **Trigger**: Typing `/`.
*   **Filter**: Filters the command list based on user input keywords.
*   **Execute**: Upon selection, executes the defined `command` callback (e.g., insert text, node, or run a function).

## Default Commands

The component comes with `defaultShortcuts` covering basic operations. You can override or extend them via configuration.

```typescript
// Default command example
[
  {
    label: 'Text',
    key: 'text',
    icon: TextIcon,
    template: '<p></p>' // Insert paragraph
  },
  {
    label: 'Heading 1',
    key: 'h1',
    template: '<h1></h1>'
  }
]
```

## Custom Commands

You can add custom commands by modifying the `SlashCommand` extension configuration. `AIInput` encapsulates extension loading; for deep customization, it's recommended to modify `extensions/slash-command/shortcuts.ts` or pass via props (if supported by your version).

### Command Data Structure

```typescript
interface PromptShortcut {
  label: string;          // Display name
  key: string;            // Unique key
  icon?: Component;       // Icon component (Vue component)
  description?: string;   // Description text
  // template can be HTML string, JSON node, or a function returning them
  template: string | object | (() => string | object); 
}
```

## Menu Rendering (CommandList)

The menu is rendered at the cursor position via `tippy.js`.
`extensions/slash-command/index.ts` defines the logic:

1.  **Suggestion Utility**: Uses Tiptap's `Suggestion` plugin to listen for `/`.
2.  **VueRenderer**: Renders the menu items using `CommandList.vue`.
3.  **Tippy.js**: Handles positioning and popup management.

### Custom Menu Styling

To modify menu styles, edit `registry/default/ai-input/extensions/slash-command/CommandList.vue`. This component receives `items` (filtered list) and `command` (execute function) as props.

## Advanced Usage: Dynamic Templates

The `template` property supports functions, allowing dynamic content generation. For example, inserting the current date:

```typescript
{
  label: 'Current Date',
  key: 'date',
  template: () => `<p>${new Date().toLocaleDateString()}</p>`
}
```