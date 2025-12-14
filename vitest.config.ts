import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    alias: {
      '@': path.resolve(__dirname, './apps/web/src'),
      // Fix for tiptap vue resolution in tests if needed
      '@tiptap/vue-3': path.resolve(__dirname, 'node_modules/@tiptap/vue-3')
    }
  }
})
