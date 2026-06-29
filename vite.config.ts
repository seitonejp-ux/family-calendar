import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // production build uses the repo name as base path for GitHub Pages
  base: mode === 'production' ? '/family-calendar/' : '/',
}))
