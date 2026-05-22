import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Next-Gen Native Compiler Core Engine Configuration
export default defineConfig({
  plugins: [
    react(),
    tailwindcss() // ✨ This compiles utility configurations directly inside Vite memory blocks
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});