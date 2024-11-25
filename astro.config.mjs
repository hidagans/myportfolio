import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [tailwind(), react()],
  output: 'static',
  build: {
    assets: 'assets'
  },
  vite: {
    build: {
      target: 'esnext',
      assetsInlineLimit: 0,
      chunkSizeWarningLimit: 1024,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      }
    },
    worker: {
      format: 'es'
    },
    optimizeDeps: {
      exclude: ['jose']
    }
  }
});
