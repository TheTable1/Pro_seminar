import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    hmr: {
      host: "coffeebeanfusion-com.onrender.com",
      protocol: "wss",
    },
  },
});

