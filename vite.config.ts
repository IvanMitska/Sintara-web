import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          animations: ['framer-motion'],
          icons: ['react-icons'],
          ui: ['styled-components'],
          // Three.js + r3f + drei isolated so non-3D pages don't pay
          // for ~900KB of WebGL code. Loaded only when SintaraLogo3D
          // mounts (Navigation overlay or ServicesTeaser watermark).
          three: ['three', '@react-three/fiber', '@react-three/drei'],
        }
      }
    },
    chunkSizeWarningLimit: 1200
  },
  server: {
    host: '0.0.0.0',
    port: 5178,
    strictPort: false,
    open: false
  },
  preview: {
    host: true,
    port: 4173
  }
})
