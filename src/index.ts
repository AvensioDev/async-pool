import { LinkedQueue } from '@avensio/shared'

export type Task<T> = () => T | PromiseLike<T>

export type PoolRunner = <T>(task: Task<T>) => Promise<T>

/**
 * Creates a concurrency-limited promise runner.
 * @param limit Maximum number of concurrent tasks. Must be a positive integer.
 */
export function createPool(limit: number): PoolRunner {
  if (!Number.isSafeInteger(limit) || limit <= 0) {
    throw new RangeError('Pool limit must be a positive integer')
  }

  let active = 0
  const queue: LinkedQueue<() => void> = new LinkedQueue()

  const startNext = () => {
    if (active >= limit || queue.isEmpty()) {
      return
    }
    const next = queue.dequeue()
    next?.()
  }

  return <T>(task: Task<T>) =>
    new Promise<T>((resolve, reject) => {
      if (typeof task !== 'function') {
        reject(new TypeError('Task must be a function'))
        return
      }

      const finalize = () => {
        active = Math.max(0, active - 1)
        startNext()
      }

      const execute = () => {
        try {
          const result = task()
          Promise.resolve(result).then(resolve, reject).finally(finalize)
        } catch (error) {
          reject(error)
          finalize()
        }
      }

      const start = () => {
        active += 1
        execute()
      }

      if (active < limit) {
        start()
      } else {
        queue.enqueue(start)
      }
    })
}
