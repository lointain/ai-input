import type { Component } from 'vue'
import type { JSONContent } from '@tiptap/core'

export interface PromptShortcut {
  // Trigger key (e.g. 'bug', 'sql')
  key: string
  // Display label in menu
  label: string
  // Description in menu
  description?: string
  // Icon component
  icon?: Component 
  
  // The content to insert
  template: JSONContent | ((args?: any) => JSONContent)
}

export interface SlashCommandOptions {
  char: string
  shortcuts: PromptShortcut[]
  component?: Component
}
