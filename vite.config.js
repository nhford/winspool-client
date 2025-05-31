import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vercel from 'vite-plugin-vercel';
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // server: {
  //   port: import.meta.env.PORT,
  // },
  plugins: [react(),vercel(), tailwindcss()],
  vercel: {},
})