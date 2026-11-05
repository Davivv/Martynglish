import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Hosting w podkatalogu: VITE_BASE=/Martynglish/ npm run build (docs/DECISIONS.md, D8)
  base: process.env.VITE_BASE ?? '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Manifest jest utrzymywany ręcznie w public/manifest.json (SPEC §2)
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,woff2,png,webp,svg}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
  test: {
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.mjs'],
    passWithNoTests: true,
  },
})
