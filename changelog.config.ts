import type { ChangelogConfig } from 'changelogen'

const config: Partial<ChangelogConfig> = {
  types: {
    feat: { title: '🚀 Features', semver: 'minor' },
    fix: { title: '🐛 Fixes', semver: 'patch' },
    refactor: { title: '🧹 Refactors' },
    docs: { title: '📝 Docs' },
    test: { title: '🧪 Tests' },
    chore: false,
  },
  publish: {
    private: false,
  },
  signTags: true,
  output: 'CHANGELOG.md',
  noAuthors: false,
  hideAuthorEmail: true,
}

export default config
