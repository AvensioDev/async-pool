# @avensio/async-pool

[![npm version](https://img.shields.io/npm/v/%40avensio%2Fasync-pool)](https://www.npmjs.com/package/@avensio/async-pool)
[![npm downloads](https://img.shields.io/npm/dm/%40avensio%2Fasync-pool)](https://www.npmjs.com/package/@avensio/async-pool)
[![Documentation](https://img.shields.io/badge/docs-docs.avensio.de-0969da)](https://docs.avensio.de/packages/async-pool/docs/)
[![GitHub](https://img.shields.io/badge/GitHub-AvensioDev%2Fasync--pool-181717?logo=github)](https://github.com/AvensioDev/async-pool)
[![License](https://img.shields.io/npm/l/%40avensio%2Fasync-pool)](./LICENSE)

[Documentation](https://docs.avensio.de/packages/async-pool/docs/) · [GitHub](https://github.com/AvensioDev/async-pool)

Lightweight concurrency control for async work in Node.js and browsers. `createPool(limit)` lets you cap how many promises run at once, so you can overlap I/O-bound tasks without flooding the event loop.

## Features
- Deterministic FIFO scheduling backed by `LinkedQueue` from `@avensio/shared`
- Strict parameter validation with helpful errors for bad limits or task factories
- Graceful handling of rejections: failed tasks free their slot and the queue keeps draining
- Works in modern Node.js runtimes and ship-ready as an IIFE bundle for browsers/Workers
- Zero dependencies beyond `@avensio/shared`, which pulls in no transitive packages

## Installation
```bash
pnpm add @avensio/async-pool
# npm install @avensio/async-pool
# yarn add @avensio/async-pool
```

## Quick start
```ts
import { createPool } from '@avensio/async-pool'

const pool = createPool(8)
const items = [...Array(32).keys()]
const results = await Promise.all(items.map((item) => pool(async () => fetchData(item))))
console.log(results)
```
> Concurrency ≠ parallelism: the pool multiplexes async work on the same thread; use worker threads for CPU-bound tasks.

## API
| Signature | Description |
| --- | --- |
| `createPool(limit: number): PoolRunner` | Validates `limit` (positive integer) and returns a function `pool<T>(task: () => Promise<T>): Promise<T>` that queues tasks when `limit` in-flight jobs are running. |

### Behavior & errors
- Passing `0`, negative, or non-integer limits throws `RangeError` before any task runs.
- If the `task` callback is not a function, the returned promise rejects with `TypeError`.
- Synchronous exceptions inside the task reject immediately; async rejections bubble up unchanged.
- After any task settles (fulfilled or rejected) the slot is freed and the next queued workload starts.

See the [API reference](docs/api.md) for details on queue internals, typing, and error propagation diagrams.

## Usage patterns
```ts
import { createPool } from '@avensio/async-pool'

const pool = createPool(4)

// 1. Fire-and-forget (log errors)
urls.forEach((url) => {
  void pool(() => fetch(url).catch((err) => logError(url, err)))
})

// 2. Per-resource limits (e.g., DB vs HTTP)
const dbPool = createPool(2)
const httpPool = createPool(6)
await Promise.all([
  ...queries.map((q) => dbPool(() => dbClient.query(q))),
  ...requests.map((req) => httpPool(() => fetch(req)))
])

// 3. Dynamic limit adjustment
let limit = 4
const poolFactory = () => createPool(limit)
// rebuild pool when you need to tighten/loosen concurrency
```
More recipes (timeouts, cancellation, queue draining) live in the [usage guide](docs/usage.md).

## Performance & limitations
- Ideal for I/O-heavy operations (>10 ms latency, >200 KB payloads).
- For CPU-bound loops prefer `worker_threads`, `cluster`, or job queues.
- Monitor queue depth to implement backpressure (patterns in [performance.md](docs/performance.md)).
- The scheduler is FIFO; if you need priority queues, wrap `LinkedQueue` with your own structure.

## Development
| Command | Description |
| --- | --- |
| `pnpm test` | Run Vitest (`test/pool.test.ts`) with coverage (`coverage/`). |
| `pnpm lint` | ESLint with auto-fix. |
| `pnpm build` | Bundle ESM + IIFE outputs via Vite and regenerate types. |
| `pnpm docs:dev` / `docs:build` | Work on the VitePress docs. |
| `pnpm release` | Test + build + changelog via `changelogen`. |

Clone the repo, `pnpm install`, and keep docs/tests in sync with code changes. See [`docs/development.md`](docs/development.md) for the full workflow.

## Links
- [Documentation](https://docs.avensio.de/packages/async-pool/docs/)
- [Changelog](docs/CHANGELOG.md)
- [License](./LICENSE)
