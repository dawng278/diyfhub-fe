import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Dùng gói cũ theo hướng dẫn
import tailwindcss from '@tailwindcss/vite' 

// https://vitejs.dev/config/
export default defineConfig({
  base: import.meta.env.MODE === 'production' ? '/diyfhub-fe/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Cần cho local dev
        changeOrigin: true,
      }
    }
  },
  // Environment variables should be accessed via import.meta.env in Vite
  // They need to be prefixed with VITE_ to be exposed to your Vite-processed code
})
