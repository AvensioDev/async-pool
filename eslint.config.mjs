// @ts-check
// eslint.config.js
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: [
      'src/**/*.ts',
      'test/**/*.ts'
    ],
    rules: {
      semi: ['error', 'never'],
      'prefer-const': 'error',
      'import/newline-after-import': ['error', { count: 1 }],
      'no-extra-semi': 'error'
    },
  },
])
