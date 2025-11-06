// @ts-check
// eslint.config.mjs
import eslint from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  globalIgnores([
    'dist/**',
    'coverage/**',
    'vite.config.ts',
    'eslint.config.mjs'
  ]),
  {
    files: [
      'src/**/*.ts',
      'test/**/*.ts',
    ],
    languageOptions: {
      parserOptions: {
        projectService: false,
      },
    },
    rules: {
      semi: ['error', 'never'],
      'prefer-const': 'error',
      'import/newline-after-import': ['error', { count: 1 }],
      'no-extra-semi': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      'import/no-unresolved': 'off'
    },
  },
)
