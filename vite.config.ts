import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Only affects the build-time prerender bundle (vite build --ssr), never the
  // client build. Vite leaves dependencies external in SSR builds, which loads
  // them through Node's CJS interop — and styled-components then arrives as a
  // namespace object where `styled.button` is undefined. Bundling these two in
  // keeps their ESM builds intact.
  ssr: {
    noExternal: ['styled-components', 'framer-motion'],
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Pin Vite's __vitePreload helper (and any shared runtime helpers)
          // to `vendor`, which the entry already loads + preloads eagerly.
          // Otherwise Rollup co-locates the helper inside the on-demand `webgl`
          // chunk; the entry then has to statically import it, dragging the
          // 1 MB WebGL bundle back into the render-blocking `modulepreload`.
          if (
            id.includes('vite/preload-helper') ||
            id.includes('vite/modulepreload-polyfill') ||
            id.includes('commonjsHelpers')
          ) {
            return 'vendor';
          }
          if (!id.includes('node_modules')) return undefined;
          // Group the entire WebGL stack into ONE async chunk. It's reachable
          // only through dynamic imports (FooterScene, SintaraLogo3D), so this
          // chunk is fetched on demand and never enters the eager entry graph.
          // Using the function form (not an object) keeps Vite's __vitePreload
          // helper in the entry instead of co-locating it here — which is what
          // previously forced the entry to statically import the 1.1 MB bundle
          // and kept it in the render-blocking `modulepreload` list.
          if (
            id.includes('/three/') ||
            id.includes('/three-stdlib/') ||
            id.includes('/@react-three/') ||
            id.includes('/postprocessing/') ||
            id.includes('/its-fine/') ||
            id.includes('/react-reconciler/') ||
            id.includes('/zustand/') ||
            id.includes('/suspend-react/') ||
            id.includes('/maath/') ||
            id.includes('/meshline/') ||
            id.includes('/troika') ||
            id.includes('/draco') ||
            id.includes('/@mediapipe/')
          ) {
            return 'webgl';
          }
          if (id.includes('/react-router')) return 'vendor';
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/scheduler/')
          )
            return 'vendor';
          if (id.includes('/framer-motion/') || id.includes('/motion-')) return 'animations';
          if (id.includes('/react-icons/')) return 'icons';
          if (id.includes('/styled-components/') || id.includes('/stylis')) return 'ui';
          return undefined;
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
