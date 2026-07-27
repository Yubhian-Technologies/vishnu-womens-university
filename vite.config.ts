import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Firebase's app+firestore core and React/Router are large,
        // slow-changing dependencies shared by every public route — splitting
        // them into their own chunk lets browsers cache them independently of
        // app code, instead of re-downloading everything on each deploy.
        // firebase/auth and firebase/storage are deliberately NOT listed here:
        // only /admin (login + uploads, see firebaseAdmin.ts) touches them,
        // and they're loaded there via dynamic import() rather than a static
        // import specifically so Rollup treats them as a genuine on-demand
        // chunk. Adding them to manualChunks previously caused Rollup to
        // statically link that chunk into every page's bundle (since manual
        // chunk buckets are joined by static import edges) — the ~180kB SDK
        // was downloading on every public page load, including this one.
        manualChunks: {
          firebase: ['firebase/app', 'firebase/firestore'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
