import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replace(/\\/g, '/');
          if (normalized.includes('node_modules')) {
            if (normalized.includes('/firebase/')) {
              return 'vendor-firebase';
            }
            if (normalized.includes('/react/') || normalized.includes('/react-dom/')) {
              return 'vendor-react';
            }
            if (normalized.includes('/lucide-react/')) {
              return 'vendor-icons';
            }
            if (normalized.includes('/canvas-confetti/')) {
              return 'vendor-confetti';
            }
            return 'vendor-libs';
          }
        }
      }
    }
  }
})
