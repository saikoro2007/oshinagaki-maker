import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Supports GitHub Pages repository subpaths
  plugins: [
    vue(),
    tailwindcss(),
  ],
  server: {
    host: true,
    port: 5173,
  },
})
