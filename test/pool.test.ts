import { describe, expect, it } from 'vitest';
import { createPool } from '../src/index.js';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

describe('createPool', () => {
  it('enforces a positive integer limit', () => {
    expect(() => createPool(0)).toThrow(RangeError);
    expect(() => createPool(-1)).toThrow(RangeError);
    expect(() => createPool(1.5)).toThrow(RangeError);
  });

  it('runs tasks up to the concurrency limit', async () => {
    const limit = 2;
    const pool = createPool(limit);
    let inFlight = 0;
    let maxInFlight = 0;

    const tasks = Array.from({ length: 8 }, (_, index) =>
      pool(async () => {
        inFlight += 1;
        maxInFlight = Math.max(maxInFlight, inFlight);
        await wait(10 + index);
        inFlight -= 1;
        return index;
      }),
    );

    const results = await Promise.all(tasks);
    expect(results).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(maxInFlight).toBeLessThanOrEqual(limit);
    expect(inFlight).toBe(0);
  });

  it('continues processing after a task rejects', async () => {
    const pool = createPool(2);
    const [first, second, third] = await Promise.allSettled([
      pool(async () => {
        await wait(5);
        throw new Error('boom');
      }),
      pool(async () => {
        await wait(10);
        return 42;
      }),
      pool(async () => 99),
    ]);

    expect(first.status).toBe('rejected');
    expect(second).toEqual({ status: 'fulfilled', value: 42 });
    expect(third).toEqual({ status: 'fulfilled', value: 99 });
  });

  it('propagates synchronous errors from the task factory', async () => {
    const pool = createPool(1);
    await expect(
      pool(() => {
        throw new Error('sync');
      }),
    ).rejects.toThrow('sync');
  });
});
