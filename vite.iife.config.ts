import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  mode: 'production',
  build: {
    target: 'ES6',
    lib: {
      entry: resolve(__dirname, 'src', 'index.ts'),
      name: 'pool',
      formats: ['iife'],
      fileName: () => 'pool.iife.js',
    },
    minify: false,
    emptyOutDir: false,
  },
})
