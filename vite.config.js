import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Dùng gói cũ theo hướng dẫn
import tailwindcss from '@tailwindcss/vite' 

// https://vitejs.dev/config/
export default defineConfig({
  // Đăng ký plugin Tailwind cũ vào mảng plugins
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Cần cho local dev
        changeOrigin: true,
      }
    }
  }
})
