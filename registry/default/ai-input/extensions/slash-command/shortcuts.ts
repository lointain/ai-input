import { BugIcon, DatabaseIcon, CodeIcon, SparklesIcon } from 'lucide-vue-next'
import type { PromptShortcut } from './types'

export const defaultShortcuts: PromptShortcut[] = [
  {
    key: 'bug',
    label: 'Bug Analysis',
    description: 'Analyze code for potential bugs and security issues',
    icon: BugIcon,
    template: {
      type: 'doc',
      content: [
        { type: 'text', text: 'Please analyze the following code for bugs: ' },
        { type: 'hardBreak' },
        { 
          type: 'contextItem', 
          attrs: { 
            type: 'input', 
            label: 'Paste Code Here',
            metadata: { placeholder: 'Code snippet...' } 
          } 
        },
        { type: 'hardBreak' },
        { type: 'text', text: 'Focus on: ' },
        { 
          type: 'contextItem', 
          attrs: { 
            type: 'select', 
            label: 'Focus Area',
            metadata: { 
              value: 'security',
              options: [
                { label: 'Security', value: 'security' },
                { label: 'Performance', value: 'performance' },
                { label: 'Logic', value: 'logic' }
              ]
            } 
          } 
        },
        { type: 'text', text: ' ' }
      ]
    }
  },
  {
    key: 'sql',
    label: 'SQL Generator',
    description: 'Generate SQL queries for specific databases',
    icon: DatabaseIcon,
    template: {
      type: 'doc',
      content: [
        { type: 'text', text: 'Generate a SQL query for ' },
        { 
          type: 'contextItem', 
          attrs: { 
            type: 'select', 
            label: 'Database',
            metadata: { 
              value: 'postgresql',
              options: [
                { label: 'PostgreSQL', value: 'postgresql' },
                { label: 'MySQL', value: 'mysql' },
                { label: 'Oracle', value: 'oracle' }
              ]
            } 
          } 
        },
        { type: 'text', text: ' to: ' },
        { type: 'hardBreak' },
        { 
          type: 'contextItem', 
          attrs: { 
            type: 'input', 
            label: 'Requirement',
            metadata: { placeholder: 'Describe what you need...' } 
          } 
        },
        { type: 'text', text: ' ' }
      ]
    }
  },
  {
    key: 'refactor',
    label: 'Refactor Code',
    description: 'Improve code quality and readability',
    icon: SparklesIcon,
    template: {
      type: 'doc',
      content: [
        { type: 'text', text: 'Refactor this code to be more ' },
        { 
          type: 'contextItem', 
          attrs: { 
            type: 'select', 
            label: 'Goal',
            metadata: { 
              value: 'readable',
              options: [
                { label: 'Readable', value: 'readable' },
                { label: 'Efficient', value: 'efficient' },
                { label: 'Modern', value: 'modern' }
              ]
            } 
          } 
        },
        { type: 'text', text: ':' },
        { type: 'hardBreak' },
        { 
          type: 'contextItem', 
          attrs: { 
            type: 'input', 
            label: 'Code',
            metadata: { placeholder: 'Code...' } 
          } 
        },
        { type: 'text', text: ' ' }
      ]
    }
  },
  {
    key: 'explain',
    label: 'Explain Code',
    description: 'Explain what a piece of code does',
    icon: CodeIcon,
    template: {
      type: 'doc',
      content: [
        { type: 'text', text: 'Explain what this code does in ' },
        { 
          type: 'contextItem', 
          attrs: { 
            type: 'select', 
            label: 'Language',
            metadata: { 
              value: 'english',
              options: [
                { label: 'English', value: 'english' },
                { label: 'Chinese', value: 'chinese' },
                { label: 'Japanese', value: 'japanese' }
              ]
            } 
          } 
        },
        { type: 'text', text: ':' },
        { type: 'hardBreak' },
        { 
          type: 'contextItem', 
          attrs: { 
            type: 'input', 
            label: 'Code',
            metadata: { placeholder: 'Paste code...' } 
          } 
        },
        { type: 'text', text: ' ' }
      ]
    }
  }
]
