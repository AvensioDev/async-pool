import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      rollupTypes: true
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  mode: 'production',
  build: {
    target: 'ES6',
    lib: {
      entry: resolve(__dirname, 'src', 'index.ts'),
      name: 'pool',
      formats: ['es', 'cjs', 'iife'],
      fileName: (format) => `pool.${format}.js`,
    },
    minify: false
  }
})
