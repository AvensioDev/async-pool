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
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Overview', link: '/' },
          { text: 'Usage', link: '/#usage' },
          { text: 'Performance', link: '/#performance-insights' },
          { text: 'Limitations', link: '/#limitations' },
        ],
      },
    ],
  },
})
