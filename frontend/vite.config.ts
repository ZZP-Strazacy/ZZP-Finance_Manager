import { defineConfig } from 'vitest/config' // Zmienione z 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    globals: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', 
        changeOrigin: true,
      }
    }
  }
})