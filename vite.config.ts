import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Ensures Vercel's static file server can serve /auth/callback directly as a static route
 * with 200 OK, preventing 404 / Page Not Found on direct OAuth redirects.
 */
function spaAuthCallbackPlugin(): Plugin {
  return {
    name: 'spa-auth-callback-plugin',
    closeBundle() {
      const distDir = path.resolve(import.meta.dirname, 'dist')
      const indexHtml = path.resolve(distDir, 'index.html')
      if (fs.existsSync(indexHtml)) {
        // Fallback for Vercel SPA routing
        fs.copyFileSync(indexHtml, path.resolve(distDir, '404.html'))

        ;['auth/callback', 'signup', 'signin', 'login'].forEach(sub => {
          const targetDir = path.resolve(distDir, ...sub.split('/'))
          fs.mkdirSync(targetDir, { recursive: true })
          fs.copyFileSync(indexHtml, path.resolve(targetDir, 'index.html'))
        })
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), spaAuthCallbackPlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
