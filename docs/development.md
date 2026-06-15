---
description: Set up the async-pool repository, run checks and benchmarks, and build its documentation.
---

# Development Workflow

Follow these steps to work on `@avensio/async-pool`, run tests, and update documentation.

## Prerequisites
- Node.js 20+
- pnpm 10+ (`package.json` pins `pnpm@10.20.0`)

Install dependencies at the repo root:
```bash
pnpm install
```

## Scripts
| Command | Description |
| --- | --- |
| `pnpm test` | Runs Vitest over `test/pool.test.ts` with coverage output in `coverage/`. |
| `pnpm lint` | ESLint with auto-fix enabled via `eslint.config.mjs`. |
| `pnpm build` | Builds the ESM and IIFE bundles (`dist/`) and refreshes type declarations (`dist/pool.es.d.ts`). |
| `pnpm docs:dev` | Launches VitePress for the docs folder. |
| `pnpm docs:build` / `pnpm docs:preview` | Generate and review the static docs site. |
| `pnpm release` | Runs tests, builds artifacts, and updates the changelog using `changelogen`. |

## Recommended loop
1. `pnpm test --watch` while modifying `src/index.ts` so you catch concurrency regressions early.
2. Update docs (`README.md`, `docs/`) alongside code changes to keep guidance accurate.
3. Run `pnpm build` before publishing to ensure the bundler and DTS generation still succeed.
4. Build docs (`pnpm docs:build`) if you touched the documentation site to catch markdown/front-matter issues.

## Coverage & debugging tips
- Open `coverage/index.html` to inspect which branches remain untested.
- Use `vitest --runInBand` for deterministic scheduling when debugging race conditions.
- Insert temporary logging in `src/index.ts` to inspect queue depth; remove before committing.

## Contributing
- Keep the public API surface (`createPool`) backward-compatible; add new helpers in separate modules if necessary.
- Extend the Vitest suite when fixing bugs—especially around error propagation or queue fairness.
- Note changes in `CHANGELOG.md` (or rely on `pnpm release`) and mention user-facing behavior updates in the docs.
