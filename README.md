# @avensio/async-pool

Lightweight concurrency control for async tasks in Node.js — manage how many promises run at once.

## Installation

```bash
pnpm add @avensio/async-pool
```

## Quick Example

```ts
import { createPool as createAsyncPool } from '@avensio/async-pool'

const pool = createAsyncPool(8)
await Promise.all(items.map((item) => pool(() => fetchData(item))))
```

> This library controls concurrency, not parallelism. It uses Node.js’ event loop and does not spawn worker threads.

→ See [Full Documentation](./docs/index.md)
