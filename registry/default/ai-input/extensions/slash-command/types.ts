import type { Component } from 'vue'
import type { JSONContent } from '@tiptap/core'

/**
 * Definition of a Slash Command shortcut
 */
export interface PromptShortcut {
  /** Trigger key (e.g. 'bug', 'sql') */
  key: string
  /** Display label in menu */
  label: string
  /** Description in menu */
  description?: string
  /** Icon component */
  icon?: Component

  /**
   * The content to insert when the command is selected.
   * Can be a JSONContent object or a function that returns one.
   */
  template: JSONContent | ((args?: any) => JSONContent)
}

/**
 * Options for Slash Command extension
 */
export interface SlashCommandOptions {
  /** Trigger character (default: '/') */
  char: string
  /** List of available shortcuts */
  shortcuts: PromptShortcut[]
  /** Custom component for the command list menu */
  component?: Component
}