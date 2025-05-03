import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@logos": fileURLToPath(new URL("src/assets/logos", import.meta.url)),
      "@components": fileURLToPath(new URL("src/components", import.meta.url)),
    },
  },
});
