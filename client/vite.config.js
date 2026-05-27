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
    appType: 'spa',
    plugins,
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-ui': ['framer-motion', 'lucide-react', 'clsx', 'tailwind-merge'],
            'vendor-charts': ['recharts'],
            'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
            'vendor-map': ['leaflet', 'react-leaflet'],
            'vendor-i18n': ['i18next', 'react-i18next'],
          }
        }
      },
      chunkSizeWarningLimit: 500,
    },
    optimizeDeps: {
      entries: ['src/main.jsx']
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      watch: {
        usePolling: true,
        interval: 1000,
        ignored: [
          '**/static-data/**',
          '**/node_modules/**',
          '**/.git/**'
        ]
      },
      hmr: {
        clientPort: 5173,
        host: 'localhost',
      },
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