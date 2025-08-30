/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: "esnext",
  },
  resolve: {
    alias: {
      "@logos": fileURLToPath(new URL("src/assets/logos", import.meta.url)),
      "@components": fileURLToPath(new URL("src/components", import.meta.url)),
      "@providers": fileURLToPath(new URL("src/providers", import.meta.url)),
      "@utils": fileURLToPath(new URL("src/utils", import.meta.url)),
      "@hooks": fileURLToPath(new URL("src/hooks", import.meta.url)),
      "@app-types": fileURLToPath(new URL("src/types", import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'src/main.tsx',
      ],
    },
  },
});
