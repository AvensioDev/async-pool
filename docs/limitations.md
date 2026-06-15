---
description: Understand when the async pool is insufficient and choose alternatives for cancellation, priorities, or CPU parallelism.
---

# Limitations & Alternatives

The async pool intentionally keeps its feature set small. Before adopting it, review these constraints and potential workarounds.

## No CPU parallelism
Tasks still run on the main event loop. Heavy CPU work (compression, hashing, AST transforms) will block everything regardless of pool size. Use:
- [`worker_threads`](https://nodejs.org/api/worker_threads.html) for Node.js multi-core execution
- [`cluster`](https://nodejs.org/api/cluster.html) or external job queues for horizontal scaling
- Web Workers in browsers

## FIFO only
The internal scheduler is FIFO. There is no priority queue or aging. If you need prioritization, wrap the pool with your own queue implementation (e.g., binary heap) before invoking `createPool`.

## No cancellation of queued tasks
Once enqueued, tasks run when a slot opens. To drop queued work, build a small wrapper that tracks pending callbacks and skips execution based on your own flags, or guard the callback body with an `AbortSignal`.

## No built-in retries/timeouts
The pool simply calls your callback. Implement retries, circuit breakers, or timeouts inside the task you pass in (see [usage patterns](./usage.md#cancellation--timeouts)).

## Resource contention still possible
If the underlying resource maintains its own pool (e.g., DB clients), stacking pools might reduce throughput. In these cases favour the resource’s native throttling mechanism.

## Browser caveats
While the IIFE build works in modern browsers/workers, note that browsers already cap concurrent HTTP connections per origin, so setting the pool limit higher than ~6 rarely helps.

Need to push beyond these constraints? Consider higher-level libraries or a full job queue (BullMQ, RabbitMQ, temporal.io) where you can distribute work across processes.
