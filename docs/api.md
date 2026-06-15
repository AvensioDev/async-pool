---
description: Reference for createPool, concurrency limits, task scheduling, return values, and error propagation.
---

# API Reference

`@avensio/async-pool` exports a single factory: `createPool(limit)`. This page covers its signature, runtime guarantees, and error propagation.

## `createPool(limit: number): PoolRunner`
- **`limit`** – required positive integer. Represents the maximum number of tasks that may run concurrently. Passing `0`, negative, or non-integer values throws `RangeError` before any task is scheduled (see validation in `src/index.ts`).
- **Returns** a `PoolRunner`, i.e. a function `pool<T>(task: () => Promise<T>): Promise<T>`.

### Runner contract
| Aspect | Details |
| --- | --- |
| Task argument | Must be a function returning a promise (or value that becomes a promise). Non-functions trigger a `TypeError`. |
| Execution order | FIFO. Tasks start immediately until `limit` is reached; additional tasks are queued in a `LinkedQueue`. |
| Completion | Each task’s promise resolves/rejects exactly once with the value/error from the provided callback. Slots are freed in `finally`, so errors never stall the queue. |
| Synchronous exceptions | If the task throws before returning a promise, the pool rejects the wrapper promise and frees the slot. |
| Rejections | Propagate unchanged to the caller. Use `Promise.allSettled` if you want to continue after failures (demonstrated in `test/pool.test.ts`). |
| Context | The pool does not bind `this`; arrow functions or closures capture whatever state they need. |

### Example
```ts
import { createPool } from '@avensio/async-pool'

const pool = createPool(5)

const payloads = await Promise.allSettled(
  urls.map((url) => pool(async () => {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Request failed: ${response.status}`)
    return response.json()
  })),
)
```

## Inspecting queue depth
The pool implementation keeps the queue private. If you need metrics, wrap `createPool`:
```ts
export const createInstrumentedPool = (limit: number, onStats: (stats: { inFlight: number, queued: number }) => void) => {
  let queued = 0
  const pool = createPool(limit)
  return async <T>(task: () => Promise<T>) => {
    queued += 1
    onStats({ inFlight: Math.min(limit, queued), queued: Math.max(0, queued - limit) })
    try {
      return await pool(task)
    } finally {
      queued -= 1
      onStats({ inFlight: Math.min(limit, queued), queued: Math.max(0, queued - limit) })
    }
  }
}
```

## TypeScript typings
- `PoolRunner` is exported for reuse (`export type PoolRunner = <T>(task: () => Promise<T>) => Promise<T>`).
- The library ships `.d.ts` declarations (`package.json:8-9`) so both ESM and CJS consumers get accurate types.

## Error matrix
| Scenario | Error type | Mitigation |
| --- | --- | --- |
| `createPool(0)` | `RangeError` | Pass an integer > 0. Consider deriving limit from CPU count or config. |
| `pool('not a function')` | `TypeError` | Always pass a callback. Wrap values in `() => Promise.resolve(value)`. |
| Callback throws synchronously | Original error | Wrap logic in try/catch if you need custom handling. |
| Callback rejects | Original rejection reason | Use `.catch`, `Promise.allSettled`, or per-task try/catch inside the callback. |

Head back to the [usage guide](./usage.md) for higher-level recipes.
