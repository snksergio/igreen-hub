import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: { main: 'index.html', video: 'index-video.html' },
      output: { manualChunks: { three: ['three'], react: ['react', 'react-dom'] } },
    },
  },
});
