import { defineConfig } from 'vite';
import { contentPlugin } from './scripts/content-plugin';

// This GitHub Pages project site is served from /HengjiLi/.
export default defineConfig({
  base: '/HengjiLi/',
  plugins: [contentPlugin()],
  server: {
    host: true,
  },
});
