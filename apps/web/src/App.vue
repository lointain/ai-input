<script setup lang="ts">
import { ref } from 'vue'
import { AIInput, AIInputEditor, AIInputToolbar, AIInputAttachButton, AIInputVoice } from '@/components/ai-input'
import type { AttachmentFile } from '@/components/ai-input/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { FileIcon, FolderIcon, GripVerticalIcon } from 'lucide-vue-next'

interface Message {
  role: 'user' | 'assistant'
  content: string
  files?: any[]
  timestamp: Date
}

const messages = ref<Message[]>([])

// Knowledge Base Items for Drag & Drop Demo
const knowledgeBaseItems = [
  { id: 'kb-1', name: 'Product Requirements.pdf', type: 'PDF' },
  { id: 'kb-2', name: 'Database Schema.sql', type: 'SQL' },
  { id: 'kb-3', name: 'API Documentation', type: 'Folder' },
  { id: 'kb-4', name: 'User Interviews 2024', type: 'Folder' },
]

const handleDragStart = (event: DragEvent, item: any) => {
  if (event.dataTransfer) {
    // Set custom data for our FileHandler to detect
    event.dataTransfer.setData('application/x-ai-ref', JSON.stringify(item))
    event.dataTransfer.effectAllowed = 'copy'
  }
}

const handleUpload = async (file: File, onProgress: (p: number) => void) => {
  console.log('Starting upload for:', file.name)
  
  // Mock upload process
  const total = 100
  for (let i = 0; i <= total; i += 10) {
    onProgress(i)
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return {
    id: Math.random().toString(36).substring(7),
    name: file.name,
    type: file.type,
    url: URL.createObjectURL(file) 
  }
}

const handleSubmit = (content: string, files: AttachmentFile[]) => {
  messages.value.push({
    role: 'user',
    content,
    files: files.map(f => f.serverData || { name: f.name }),
    timestamp: new Date()
  })

  // Mock AI response
  setTimeout(() => {
    messages.value.push({
      role: 'assistant',
      content: 'I received your message! This is a mock response.',
      timestamp: new Date()
    })
  }, 1000)
}
</script>

<template>
  <div class="min-h-screen bg-background p-8 font-sans">
    <div class="max-w-6xl mx-auto space-y-8">
      
      <!-- Header Section -->
      <div class="space-y-4">
        <h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl">
          AI Input Component
        </h1>
        <p class="text-xl text-muted-foreground">
          A powerful, Notion-style input interface for AI applications.
        </p>
        
        <div class="flex flex-wrap gap-2">
          <Badge variant="secondary">Global Drag & Drop</Badge>
          <Badge variant="secondary">Slash Commands (/)</Badge>
          <Badge variant="secondary">Mentions (@)</Badge>
          <Badge variant="secondary">Voice Input</Badge>
          <Badge variant="secondary">Context Items</Badge>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Chat Area -->
        <div class="lg:col-span-2 space-y-6">
          <Card class="min-h-[400px] flex flex-col">
            <CardHeader>
              <CardTitle>Chat Session</CardTitle>
              <CardDescription>
                Try typing <kbd class="bg-muted px-1 rounded">/</kbd> for templates or <kbd class="bg-muted px-1 rounded">@</kbd> for mentions.
              </CardDescription>
            </CardHeader>
            <CardContent class="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[600px] p-4">
              <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-muted-foreground gap-2 py-10">
                <div class="text-4xl">👋</div>
                <p>No messages yet.</p>
                <p class="text-sm">Try dragging a file here or typing a command.</p>
              </div>
              
              <div 
                v-for="(msg, i) in messages" 
                :key="i" 
                class="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
                :class="msg.role === 'user' ? 'flex-row-reverse' : ''"
              >
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  :class="msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'"
                >
                  {{ msg.role === 'user' ? 'U' : 'AI' }}
                </div>
                
                <div 
                  class="flex flex-col gap-2 max-w-[80%]"
                  :class="msg.role === 'user' ? 'items-end' : 'items-start'"
                >
                  <div 
                    class="rounded-lg p-3 text-sm shadow-sm border"
                    :class="msg.role === 'user' ? 'bg-primary/5 text-primary-foreground-inverse' : 'bg-card'"
                  >
                    <!-- Render HTML content from Tiptap -->
                    <div 
                      class="prose prose-sm dark:prose-invert max-w-none break-words"
                      v-html="msg.content" 
                    />
                  </div>
                  
                  <!-- Attachments Display -->
                  <div v-if="msg.files?.length" class="flex flex-wrap gap-2">
                    <Badge 
                      v-for="(f, idx) in msg.files" 
                      :key="idx" 
                      variant="outline"
                      class="gap-1 pl-1 pr-2 py-1 h-auto"
                    >
                      <span class="bg-muted w-5 h-5 rounded flex items-center justify-center text-[10px]">📎</span>
                      <span class="truncate max-w-[100px]">{{ f.name }}</span>
                    </Badge>
                  </div>
                  
                  <span class="text-[10px] text-muted-foreground">
                    {{ msg.timestamp.toLocaleTimeString() }}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- The Component -->
          <div class="sticky bottom-8 z-10">
            <AIInput 
              :upload-handler="handleUpload"
              placeholder="Ask anything..."
              @submit="handleSubmit"
              class="shadow-xl"
            >
              <AIInputEditor />
              <AIInputToolbar>
                <template #left>
                  <AIInputAttachButton />
                  <AIInputVoice />
                </template>
                <template #right>
                  <div class="text-[10px] text-muted-foreground mr-2 hidden sm:block">
                    CMD + Enter to send
                  </div>
                </template>
              </AIInputToolbar>
            </AIInput>
          </div>
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
          <!-- Draggable Knowledge Base -->
          <Card>
            <CardHeader>
              <CardTitle class="text-base flex items-center gap-2">
                <FolderIcon class="w-4 h-4" />
                Knowledge Base
              </CardTitle>
              <CardDescription>Drag these items into the input box!</CardDescription>
            </CardHeader>
            <CardContent class="space-y-2">
              <div 
                v-for="item in knowledgeBaseItems" 
                :key="item.id"
                draggable="true"
                @dragstart="(e) => handleDragStart(e, item)"
                class="flex items-center gap-3 p-3 rounded-md border bg-card hover:bg-accent/50 cursor-grab active:cursor-grabbing transition-colors group"
              >
                <GripVerticalIcon class="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <FileIcon v-if="item.type !== 'Folder'" class="w-4 h-4 text-muted-foreground" />
                  <FolderIcon v-else class="w-4 h-4 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium truncate">{{ item.name }}</div>
                  <div class="text-xs text-muted-foreground">{{ item.type }}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle class="text-base">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent class="text-sm space-y-4">
              <div>
                <h4 class="font-semibold mb-1">Slash Commands</h4>
                <p class="text-muted-foreground mb-2">Type <kbd>/</kbd> to open the menu.</p>
                <ul class="list-disc list-inside text-muted-foreground">
                  <li><code>/bug</code> - Bug Analysis Template</li>
                  <li><code>/sql</code> - SQL Generator</li>
                  <li><code>/explain</code> - Explain Code</li>
                </ul>
              </div>
              <Separator />
              <div>
                <h4 class="font-semibold mb-1">Context Items</h4>
                <p class="text-muted-foreground">
                  Try the templates above! They insert interactive chips:
                </p>
                <div class="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">Input Field</Badge>
                  <Badge variant="secondary">Dropdown</Badge>
                  <Badge variant="secondary">Date Picker</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom prose styles for context items in chat history */
:deep(.prose) {
  /* Ensure context items look good in history */
  context-item {
    display: inline-block;
    vertical-align: middle;
  }
}
</style>

