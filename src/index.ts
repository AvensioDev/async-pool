import { LinkedQueue } from '@avensio/shared'

export type PoolRunner = <T>(task: () => Promise<T>) => Promise<T>

/**
 * Creates a concurrency-limited promise runner.
 * @param limit Maximum number of concurrent tasks. Must be a positive integer.
 */
export function createPool(limit: number): PoolRunner {
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new RangeError('Pool limit must be a positive integer')
  }

  let active = 0
  const queue: LinkedQueue<() => void> = new LinkedQueue()

  const startNext = () => {
    if (active >= limit) {
      return
    }
    if (!queue.isEmpty()) {
      const next = queue.dequeue()
      next()
    }
  }

  return <T>(task: () => Promise<T>) =>
    new Promise<T>((resolve, reject) => {
      if (typeof task !== 'function') {
        reject(new TypeError('Task must be a function that returns a promise'))
        return
      }

      const finalize = () => {
        active = Math.max(0, active - 1)
        startNext()
      }

      const execute = () => {
        let result: Promise<T>

        try {
          result = Promise.resolve(task())
        } catch (error) {
          reject(error)
          finalize()
          return
        }

        result.then(resolve, reject).finally(finalize)
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
