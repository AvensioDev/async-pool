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
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'cjs' ? 'pool.cjs' : 'pool.es.js',
    },
    rollupOptions: {
      external: ['@avensio/shared'],
    },
    minify: false,
    emptyOutDir: true,
  }
})
