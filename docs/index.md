---
next:
  text: API Reference
  link: /packages/async-pool/docs/api
---

# Async-Pool

`@avensio/async-pool` schedules asynchronous tasks so that only a fixed number run at once. Use it when you need to overlap I/O-bound work—file writes, HTTP calls, database queries—without overwhelming the event loop with hundreds of pending promises. Concurrency here means multiple asynchronous operations share the same thread; the library does **not** add threads or worker processes and therefore does not provide parallel execution on additional CPU cores.

## Overview
- **API surface**: a single exported factory, [`createPool`](./api.md), which validates the concurrency limit and returns a FIFO scheduler.
- **Use cases**: throttling HTTP requests, batching filesystem writes, providing per-resource caps for heterogeneous workloads, and coordinating background tasks (see [Usage patterns](./usage.md)).
- **Performance guidance**: asynchronous pooling shines once tasks last longer than ~10 ms or move sizable payloads; otherwise the promise machinery eclipses gains. Benchmarks and tuning tips live in [Performance](./performance.md).
- **Limitations**: no CPU parallelism, no built-in cancellation, FIFO only—documented in [Limitations](./limitations.md).

## How it works

The pool maintains a FIFO queue of task callbacks. When you invoke the pool function, the callback is either executed immediately (if the number of active tasks is below the configured limit) or enqueued. Every task completion frees a slot and triggers the next queued callback. Because the scheduler never blocks the event loop and only performs constant-time bookkeeping, the pool keeps resource usage predictable even under bursty workloads.

```ts
import { createPool } from '@avensio/async-pool'

const pool = createPool(4)

await Promise.all(tasks.map((task) => pool(async () => {
  const data = await task()        // might fetch(), writeFile(), etc.
  return transform(data)
})))
```

## Next steps
- Dive into the [API reference](./api.md) for parameter semantics and error propagation.
- Explore [Usage patterns](./usage.md) for recipes (fire-and-forget, batching, per-resource throttles).
- Read [Performance](./performance.md) to benchmark and tune limits.
- Understand [Limitations](./limitations.md) before adopting the pool for CPU-bound workloads.
- Contribute via the [development workflow](./development.md).
