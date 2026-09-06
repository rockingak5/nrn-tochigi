import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Served at /admin on the unified production server, but keep the local
  // dev server rooted at / so `npm run dev` still behaves as before.
  base: command === 'build' ? '/admin/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 4000,
  },
}))
