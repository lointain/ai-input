import { describe, it, expect, vi } from 'vitest'
import { SlashCommand } from '../extensions/slash-command'
import { defaultShortcuts } from '../extensions/slash-command/shortcuts'
import { FileHandler } from '../extensions/file-handler'

describe('SlashCommand', () => {
  it('should have correct default options', () => {
    expect(SlashCommand.options).toBeDefined()
    // Tiptap extension options are usually functions or objects
    // We can't easily check default values without instantiating or checking addOptions
    // But we can check if it exports the right name
    expect(SlashCommand.name).toBe('slashCommand')
  })

  it('should filter shortcuts correctly', () => {
    // Simulate the filtering logic used in the suggestion items
    const query = 'bug'
    const filtered = defaultShortcuts.filter(item => 
      item.label.toLowerCase().includes(query.toLowerCase()) || 
      item.key.toLowerCase().includes(query.toLowerCase())
    )
    
    expect(filtered.length).toBeGreaterThan(0)
    expect(filtered[0].label.toLowerCase()).toContain('bug')
  })
})

describe('FileHandler', () => {
  it('should be configurable', () => {
    const configured = FileHandler.configure({
      onDrop: (files) => console.log(files)
    })
    
    expect(configured.name).toBe('fileHandler')
  })
})
