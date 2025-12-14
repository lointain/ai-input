import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: [
            {
                find: '@/components/ai-input',
                replacement: path.resolve(__dirname, '../../registry/default/ai-input')
            },
            {
                find: '@',
                replacement: path.resolve(__dirname, './src')
            }
        ],
    },
});
