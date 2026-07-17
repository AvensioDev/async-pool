---
description: Choose and benchmark concurrency limits that improve throughput without overwhelming downstream services.
---

# Performance & Tuning

Correct pool sizing depends on task duration, upstream quotas, and host capacity. Use this guide to benchmark and tune concurrency limits.

## Benchmark checklist
1. Measure a single task in isolation (baseline latency `t`).
2. Run a control batch serially (`limit = 1`).
3. Run with increasing limits (2, 4, 8, 16…) until throughput stops improving or upstream services throttle you.
4. Record both total duration and max in-flight requests to understand pressure on downstream systems.

There is no universal duration, payload size, or concurrency limit at which pooling becomes beneficial. Compare representative workloads and include downstream throttling, memory use, and error rates in the result.

## Choosing a limit
| Scenario | Suggested limit | Rationale |
| --- | --- | --- |
| Single external API with rate limit | `Math.floor(rate / per-request cost)` | Match provider quotas. |
| Mixed resources (DB + HTTP) | Separate pools (e.g., 2 for DB, 6 for HTTP) | Avoid one resource starving another. |
| I/O-heavy CLI tools | Increase from a low baseline while measuring | The useful limit depends on the downstream resource rather than CPU count alone. |
| Browser environments | Tune per origin and workload | Connection limits, protocols, devices, and upstream quotas vary. |

## Backpressure & queue depth
Monitor queue length to decide when to stop accepting work:
```ts
const pool = createPool(5)
let queued = 0

export const enqueue = <T>(task: () => Promise<T>) => {
  if (queued > 1000) throw new Error('Backpressure: queue too large')
  queued += 1
  return pool(task).finally(() => {
    queued -= 1
  })
}
```

## Detecting slow tasks
Instrument task duration and log anything above a threshold:
```ts
const pool = createPool(4)
const warnSlow = 250

const run = <T>(name: string, task: () => Promise<T>) =>
  pool(async () => {
    const start = performance.now()
    try {
      return await task()
    } finally {
      const duration = performance.now() - start
      if (duration > warnSlow) {
        console.warn(`[pool] slow task %s took %dms`, name, duration)
      }
    }
  })
```

## Troubleshooting
- **Queue never drains**: ensure every task resolves/rejects; missing `await` may leave promises dangling.
- **Inconsistent throughput**: some tasks may internally serialize (e.g., DB client connection pool). Introduce resource-aware pools or restructure the workload.
- **Too many open connections**: lower the limit or insert small delays between batches.

See the [limitations](./limitations.md) page for scenarios where the pool is the wrong tool entirely.
