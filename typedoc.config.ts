// @ts-nocheck
// typedoc.config.ts
import type { TypeDocOptions } from 'typedoc'

const config: Partial<TypeDocOptions> = {
  name: 'Typed API (TypeDoc)',
  gitRevision: 'main',
  gitRemote: 'origin',
  entryPoints: ['src/index.ts'],
  out: 'docs/api',
  plugin: [
    'typedoc-plugin-mdn-links',
    'typedoc-plugin-mermaid',
    'typedoc-plugin-markdown',
    'typedoc-plugin-frontmatter',
  ],
  blockTags: [
    "@description",
    "@example",
    "@returns",
    "@param",
    "@remarks",
    "@since",
    "@template",
    "@return",
    "@throws"
  ],
  frontmatterCommentTags: ["author", "description"],
  frontmatterGlobals: {},
  theme: 'markdown',
  hideGenerator: true,
  readme: 'none',
  categorizeByGroup: true,
  sort: ['alphabetical'],
  includeVersion: false,
  excludeExternals: true,
  excludePrivate: true,
  excludeProtected: true,
  excludeInternal: true
}
export default config
