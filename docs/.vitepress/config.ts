import { defineConfig } from 'vitepress'

export const docs = {
  title: '@avensio/async-pool',
  description: 'Documentation for the Avensio async concurrency utility.',
  sidebar: ['Overview', 'Usage', 'Performance', 'Examples', 'Limitations'],
}

export default defineConfig({
  title: docs.title,
  description: docs.description,
  lastUpdated: true,
  themeConfig: {
    search: {
      provider: 'local'
    },
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Overview', link: '/' },
          { text: 'API Reference', link: '/api' },
        ],
      },
      {
        text: 'Guides',
        items: [
          { text: 'Usage Patterns', link: '/usage' },
          { text: 'Performance & Tuning', link: '/performance' },
          { text: 'Limitations', link: '/limitations' },
        ],
      },
      {
        text: 'Project',
        items: [
          { text: 'Development Workflow', link: '/development' },
        ],
      },
    ],
  },
})
