import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // production build uses the repo name as base path for GitHub Pages
  base: mode === 'production' ? '/family-calendar/' : '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        macbook: resolve(__dirname, 'macbook.html'),
      },
    },
  },
}))
