import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  base: './',
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        roomOne: fileURLToPath(new URL('./room-one.html', import.meta.url)),
        roomTwo: fileURLToPath(new URL('./room-two.html', import.meta.url)),
        roomThree: fileURLToPath(new URL('./room-three.html', import.meta.url)),
        roomFour: fileURLToPath(new URL('./room-four.html', import.meta.url))
      },
      output: { manualChunks: id => id.includes('/node_modules/phaser/') ? 'phaser' : undefined }
    }
  }
});
