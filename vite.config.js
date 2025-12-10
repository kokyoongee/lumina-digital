import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        meridian: resolve(__dirname, 'meridian/index.html'),
        artisan: resolve(__dirname, 'artisan/index.html'),
        aurora: resolve(__dirname, 'aurora/index.html'),
        noir: resolve(__dirname, 'noir/index.html'),
        savor: resolve(__dirname, 'savor/index.html'),
      }
    }
  },
  server: {
    port: 5175,
    open: true
  }
});
