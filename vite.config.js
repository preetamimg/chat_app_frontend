import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'


const manifest = {
  name: 'Hivein',
  short_name: 'Hivein',
  description: 'A real-time chat application with private and group messaging features',
  icons: [
    {
      src: "./assets/img/favicon-16x16.png",
      sizes: "16x16",
      type: "image/x-icon"
    },
    {
      src: "./assets/img/favicon-32x32.png",
      sizes: "64x64 32x32 24x24",
      type: "image/x-icon"
    },
    {
      src: "./assets/img/android-chrome-192x192.png",
      type: "image/png",
      sizes: "192x192"
    },
    {
      src: "./assets/img/android-chrome-512x512.png",
      type: "image/png",
      sizes: "512x512"
    }
  ],
  start_url: '/',
  display: 'standalone',
  theme_color: '#2B04A6',
  background_color: '#ffffff'
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({ manifest })
  ],
  server: {
    host: true, // Allows access from local network
  }
})
