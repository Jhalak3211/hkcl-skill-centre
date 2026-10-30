import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { siteConfig } from './src/data/siteConfig.js';

// Replaces %SITE_URL%, %SITE_NAME% and %SITE_DESCRIPTION% in index.html with
// the values from src/data/siteConfig.js (or env), so you only edit them in one place.
function injectSiteConfig() {
  return {
    name: 'inject-site-config',
    transformIndexHtml(html) {
      const siteUrl = (
        process.env.VITE_SITE_URL ||
        (process.env.VERCEL_PROJECT_PRODUCTION_URL
          ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
          : siteConfig.siteUrl)
      ).replace(/\/$/, '');

      return html
        .replaceAll('%SITE_URL%', siteUrl)
        .replaceAll('%SITE_NAME%', siteConfig.name)
        .replaceAll('%SITE_TAGLINE%', siteConfig.tagline)
        .replaceAll('%SITE_DESCRIPTION%', siteConfig.description);
    },
  };
}

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), injectSiteConfig()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router-dom')
          ) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-framer';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
        },
      },
    },
  },
});
