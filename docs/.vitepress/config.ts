import { defineConfig, type HeadConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'
import path from 'node:path'

const isDevCommand = process.argv.includes('dev')
const siteUrl = 'https://docs.avensio.dev/async-pool'
const organizationId = `${siteUrl}#organization`

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': organizationId,
  name: 'Avensio',
  url: siteUrl,
  logo: `${siteUrl}/favicon.ico`,
  sameAs: [
    'https://github.com/Avensio/graph',
    'https://github.com/Avensio/shared',
    'https://www.avensio.de',
    'https://www.dev-journey.de',
  ],
}

const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Avensio Async-Pool Docs',
  url: siteUrl,
  publisher: {
    '@id': organizationId,
  },
}

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '@avensio/async-pool',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Windows, macOS, Linux, Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  url: siteUrl,
  downloadUrl: 'https://www.npmjs.com/package/@avensio/async-pool',
  publisher: {
    '@id': organizationId,
  },
}

const createJsonLdScript = (data: Record<string, unknown>): HeadConfig => ([
  'script',
  { type: 'application/ld+json' },
  JSON.stringify(data),
])

const buildPageUrl = (relativePath?: string) => {
  if (!relativePath)
    return siteUrl

  let normalized = relativePath.replace(/\\/g, '/')

  if (/(?:^|\/)(index|README)\.md$/i.test(normalized))
    normalized = normalized.replace(/(?:^|\/)(index|README)\.md$/i, '')
  else
    normalized = normalized.replace(/\.md$/i, '')

  normalized = normalized
    .replace(/\/+/g, '/')
    .replace(/^\/|\/$/g, '')

  return normalized ? `${siteUrl}/${normalized}` : siteUrl
}

export default withPwa(defineConfig({
  title: 'Avensio Async-Pool',
  description: 'Documentation for the Avensio async concurrency utility.',
  lang: 'en-US',
  lastUpdated: true,
  base: '/',
  sitemap: {
    hostname: siteUrl,
  },
  vite: {
    publicDir: path.resolve(__dirname, '../public'),
  },
  pwa: {
    outDir: path.resolve(__dirname, '../.vitepress/dist'),
    mode: isDevCommand ? 'development' : 'production',
    registerType: 'autoUpdate',
    injectRegister: 'script-defer',
    includeAssets: ['favicon.ico', 'Logo Avensio.png'],
    manifest: {
      name: 'Avensio Async-Pool',
      short_name: 'Async-Pool',
      theme_color: '#0ea5e9',
      scope: '/',
      start_url: '/',
    },
    pwaAssets: {
      config: true,
    },
    workbox: {
      globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,woff2}'],
      navigateFallback: '/',
      navigateFallbackAllowlist: [/./],
    },
    devOptions: {
      enabled: isDevCommand,
      suppressWarnings: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/./],
    },
  },
  markdown: {
    lineNumbers: true,
    toc: { level: [2, 3, 4] },
  },
  head: [
    ['meta', { name: 'author', content: 'Avensio Dev Team' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    createJsonLdScript(organizationJsonLd),
    createJsonLdScript(webSiteJsonLd),
    createJsonLdScript(softwareJsonLd),
  ],
  transformHead({ pageData, title, description }) {
    const page = pageData ?? {}
    const resolvedDescription = page.frontmatter?.description ?? description
    const pageTitle = title ?? page.title ?? page.frontmatter?.title ?? 'Avensio Graph Docs'

    const headEntries: HeadConfig[] = [
      ['meta', { property: 'og:title', content: pageTitle }],
    ]

    if (resolvedDescription) {
      headEntries.push(['meta', { property: 'og:description', content: resolvedDescription }])
      headEntries.push(createJsonLdScript({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: pageTitle,
        description: resolvedDescription,
        author: { '@id': organizationId },
        publisher: { '@id': organizationId },
        mainEntityOfPage: buildPageUrl(page.relativePath),
        image: `${siteUrl}/pwa-512x512.png`,
      }))
    }

    return headEntries
  },
  themeConfig: {
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Avensio',
    },
    logo: '/favicon.ico',
    search: {
      provider: 'local',
      options: {
        detailedView: 'auto',
      },
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Avensio/async-pool' },
    ],
    editLink: {
      pattern: 'https://github.com/Avensio/async-pool/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short',
      },
    },
    nav: [
      { text: 'Docs', link: '/' },
      { text: 'API', link: '/api' },
      {
        text: 'Projects',
        items: [
          { text: 'MonoRepo', link: 'https://github.com/Avensio/avensio/' },
          { text: '@avensio/graph', link: 'https://github.com/Avensio/graph/' },
          { text: '@avensio/shared', link: 'https://github.com/Avensio/shared/' },
          { text: 'dev-journey.de', link: 'https://www.dev-journey.de' },
          { text: 'avensio.de', link: 'https://www.avensio.de' },
        ],
      },
    ],
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
}))
