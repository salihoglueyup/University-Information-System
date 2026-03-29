import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const proxyTarget = process.env.VITE_DEV_PROXY_TARGET || 'http://localhost:5000'

export default defineConfig(({ command }) => {
  const plugins = [react()]

  if (command === 'build') {
    plugins.push(
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'İstanbul Aydın Üniversitesi UBIS',
          short_name: 'IAÜ UBIS',
          description: 'Öğrenci Bilgi Sistemi Portalı',
          theme_color: '#1e3a8a',
          icons: [
            {
              src: '/vite.svg',
              sizes: '192x192',
              type: 'image/svg+xml'
            },
            {
              src: '/vite.svg',
              sizes: '512x512',
              type: 'image/svg+xml'
            }
          ]
        }
      })
    )
  }

  return {
    plugins,
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true
        },
        '/socket.io': {
          target: proxyTarget,
          ws: true,
          changeOrigin: true
        }
      }
    }
  }
})
