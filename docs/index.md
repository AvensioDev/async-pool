# Overview

`@avensio/async-pool` schedules asynchronous tasks so that only a fixed number run at once. Use it when you need to overlap I/O-bound work—file writes, HTTP calls, database queries—without overwhelming the event loop with hundreds of pending promises. Concurrency here means multiple asynchronous operations share the same thread; the library does **not** add threads or worker processes and therefore does not provide parallel execution on additional CPU cores.

## How it works

The pool maintains a FIFO queue of task callbacks. When you invoke the pool function, the callback is either executed immediately (if the number of active tasks is below the configured limit) or enqueued. Every task completion frees a slot and triggers the next queued callback. Because the scheduler never blocks the event loop and only performs constant-time bookkeeping, the pool keeps resource usage predictable even under bursty workloads.

# Usage
## Async file-IO
```ts
import { createPool } from '@avensio/async-pool'
import { writeFile } from 'node:fs/promises'

const pool = createPool(4)
const files = Array.from({ length: 20 }, (_, i) => `chunk-${i}.json`)

await Promise.all(files.map((file) =>
  pool(async () => {
    const payload = await buildPayload(file)
    await writeFile(file, JSON.stringify(payload))
  }),
))
```

## Async net-IO
```ts
import { createPool } from '@avensio/async-pool'

const pool = createPool(6)
const endpoints = ids.map((id) => `https://api.example.test/users/${id}`)
const responses = await Promise.all(endpoints.map((url) => pool(() => fetch(url))))
```

## Async task
```ts
import { createPool } from '@avensio/async-pool'
import { EventEmitter } from '@avensio/event-emitter'

const emitter = new EventEmitter<{ done: [string] }>()
const pool = createPool(3)

tasks.forEach((task) => {
  void pool(async () => {
    await task()
    emitter.emit('done', task.name)
  })
})
```

# Performance Insights

Asynchronous scheduling only outperforms synchronous loops when the underlying operation waits on external resources. If the workload is CPU-bound or completes in microseconds, the promise machinery dominates total time.

| Task Size / Duration | Recommended Mode | Reason |
| --- | --- | --- |
| < 50 KB or < 1 ms | sync | Promise overhead outweighs any gains. |
| 50–200 KB | either | Small difference; benchmark in context. |
| > 200 KB | async | Latency hiding compensates for scheduling cost. |
| > 1 MB | async required | Synchronous loops would block the event loop. |

Run a quick benchmark: measure time for one task, then compare batching with the pool at different sizes (start at 4). When the per-task latency is above ~10 ms, the pool almost always improves throughput.

# Limitations

The pool does not introduce CPU-level parallelism. For CPU-bound tasks such as parsing large ASTs or hashing files, use Node.js `worker_threads`, `cluster`, or dedicated job queues.

# License & Credits

Released under the MIT License. Part of the Avensio Shared Toolkit.
