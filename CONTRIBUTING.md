# Contributing to @avensio/async-pool

Thanks for helping improve `async-pool`! This document explains how to get started, what quality gates we expect, and how releases are coordinated.

## Project layout

- **Source** lives in `src/index.ts`
- **Tests** live in `test/pool.test.ts` and use Vitest
- **Docs** live under `docs/` and are rendered via VitePress
- **Tooling** scripts live in `scripts/` (including git hooks)

## Prerequisites

- Node.js 20+ and pnpm 10.20+
- Clone this repository and run `pnpm install` from its root directory
- Optionally run `pnpm hooks:install` to enable commit-message validation locally

## Workflow

1. **Create a branch** from `main`.
2. **Develop with safety nets**:
   - `pnpm dev` for watch mode with coverage
   - `pnpm test` for the full Vitest suite
3. **Update docs** alongside code:
   - Page content in `docs/*.md`
   - API reference via `pnpm docs:api`
4. **Validate the docs site**: `pnpm docs:dev` and `pnpm docs:build && pnpm docs:preview`
5. **Commit and create PR**; `scripts/hooks/commit-msg.mjs` enforces commitlint with tags given in `changelog.config.ts`

Before pushing, run:

```bash
pnpm lint
pnpm test
```

## Pull requests

- Keep changes focused; separate refactors from features/fixes.
- Add tests for regressions or new behavior.
- Update docs and changelog entries when user-facing changes occur.
- Reference related issues (e.g., `Fixes #123`).

## Release process

Releases are handled by maintainers in this repository. The release script runs the tests, builds the package, updates the changelog, and creates the release commit and tag. After the initial manual npm publication, later releases are published through [the repository's trusted-publishing workflow](.github/workflows/publish.yml).

To cut a release as a maintainer:

```bash
pnpm release
```

## Reporting bugs & requesting features

Use the GitHub issue templates (`Bug report` / `Feature request`). Provide reproducible steps, environment details, and failing tests where possible.

## Security

Please follow the steps in [SECURITY.md](./SECURITY.md) for reporting vulnerabilities privately.

## License

By contributing, you agree that your contributions are licensed under the MIT License.
