import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/GhReadmeStats/dashboard/',
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, '../src'),
    },
  },
  build: { outDir: 'dist' },
})
