---
description: Practical patterns for throttling HTTP requests, filesystem work, batches, and other asynchronous tasks.
---

# Usage Patterns

This guide collects practical recipes for combining `createPool` with common async workflows.

## Throttle HTTP requests
```ts
const httpPool = createPool(6)
const users = await Promise.all(ids.map((id) => httpPool(() => fetchJSON(`/users/${id}`))))
```
- Use separate pools per upstream service to avoid head-of-line blocking.
- Wrap the callback in retry logic or `Promise.race` with `AbortSignal` when calling unreliable endpoints.

## Batch filesystem writes
```ts
const filePool = createPool(4)
await Promise.all(files.map((file) => filePool(async () => {
  const payload = await buildPayload(file)
  await writeFile(file, payload)
})))
```
- For very large files combine the pool with streaming APIs to reduce memory pressure.

## Fire-and-forget background tasks
```ts
const backgroundPool = createPool(3)
queue.forEach((task) => {
  void backgroundPool(async () => {
    try {
      await task()
    } catch (err) {
      logError(task.name, err)
    }
  })
})
```
- Use `void` to ignore the returned promise intentionally.
- Always catch errors inside the callback to avoid unhandled rejection warnings.

## Per-resource limits
Limit database queries harder than HTTP calls:
```ts
const dbPool = createPool(2)
const httpPool = createPool(8)

await Promise.all([
  ...queries.map((q) => dbPool(() => db.query(q))),
  ...requests.map((req) => httpPool(() => fetch(req)))
])
```

## Progressive warm-up
Start conservative, then bump concurrency as the system proves stable.
```ts
let concurrency = 2
let pool = createPool(concurrency)

const adjust = (next: number) => {
  concurrency = next
  pool = createPool(concurrency)
}
```
- When you swap pools, finish outstanding tasks first or keep both pools alive until queues drain.

## Cancellation & timeouts
The pool doesn’t cancel queued work, but you can wrap tasks with `AbortController`:
```ts
const pool = createPool(5)

const runWithTimeout = (task: () => Promise<unknown>, ms: number) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), ms)
  return pool(async () => {
    try {
      return await task(controller.signal)
    } finally {
      clearTimeout(timeout)
    }
  })
}
```

## Metrics & logging
Hook into the returned promise to emit events:
```ts
const pool = createPool(4)

const instrumented = <T>(name: string, task: () => Promise<T>) =>
  pool(async () => {
    const started = performance.now()
    try {
      return await task()
    } finally {
      const duration = performance.now() - started
      metrics.observe('task_duration_ms', duration, { name })
    }
  })
```

Head to the [performance guide](./performance.md) for benchmarking advice and queue sizing formulas.
