import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/fess-frontend/',  // important for GitHub Pages
  assetsInclude: ['**/*.PNG', '**/*.JPG', '**/*.JPEG']
})
