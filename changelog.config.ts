import type { ChangelogConfig } from 'changelogen'

const config: Partial<ChangelogConfig> = {
  types: {
    feat: { title: '🚀 Features', semver: 'minor' },
    fix: { title: '🐛 Fixes', semver: 'patch' },
    refactor: { title: '🧹 Refactors' },
    docs: { title: '📝 Docs' },
    test: { title: '🧪 Tests' },
    chore: { title: 'Chores', semver: 'patch' },
  },
  publish: {
    private: false,
  },
  signTags: true,
  output: 'docs/CHANGELOG.md',
  noAuthors: false,
  hideAuthorEmail: true,
}

export default config
