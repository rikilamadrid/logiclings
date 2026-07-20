// Loads `.env` into process.env so the API handlers mounted by `apiDevServer`
// can read DATABASE_URL / BETTER_AUTH_* during local development.
import 'dotenv/config'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { apiDevServer } from './vite/apiDevServer.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    apiDevServer(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: [
        'icons/favicon.svg',
        'icons/apple-touch-icon.png',
        'icons/mascot.svg',
      ],
      manifest: {
        name: 'Logiclings',
        short_name: 'Logiclings',
        description: 'Tiny games. Big developer instincts.',
        theme_color: '#7c3aed',
        background_color: '#faf9f7',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/maskable-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/icons/maskable-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Never let the shell precache/runtime-cache reach into `/api/*` —
        // progress, profile, and streak reads must always hit the network.
        navigateFallbackDenylist: [/\/api\//],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkOnly',
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
})
