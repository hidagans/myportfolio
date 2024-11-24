import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [tailwind(), react()],
  output: 'server',
  build: {
    assets: 'assets'
  },
  server: {
    host: true, // Allow connections from all network interfaces
    port: process.env.PORT || 4321
  }
});
