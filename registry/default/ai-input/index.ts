/**
 * AI Input Library
 * 
 * A Notion-style AI input component with drag & drop, slash commands, and mentions.
 * 
 * @module ai-input
 */

// Components
export { default as AIInput } from './components/AIInput.vue'
export { default as AIInputEditor } from './components/AIInputEditor.vue'
export { default as AIInputToolbar } from './components/AIInputToolbar.vue'
export { default as AIInputVoice } from './components/AIInputVoice.vue'
export { default as AIInputAttachButton } from './components/AIInputAttachButton.vue'

// Core Context & Types
export * from './core/context'
export * from './core/types'

// Extensions
export { default as ContextItemView } from './extensions/context-item/ContextItemView.vue'
export { ContextItem } from './extensions/context-item'
export { FileHandler } from './extensions/file-handler'
export { HistoryNavigation } from './extensions/history'

// Hooks
export { useVoice } from './hooks/use-voice'
