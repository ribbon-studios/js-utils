import { describe, it, expect } from 'vitest';
import { delay } from '../delay';
import { afterEach } from 'node:test';

describe('fn(delay)', () => {
  const time = async <T>(expectedTime: number, cb: () => Promise<T>, buffer: number = 5): Promise<T> => {
    const start = performance.now();

    const result = await cb();

    expect(performance.now() - start).toBeGreaterThanOrEqual(expectedTime - buffer);

    return result;
  };

  afterEach(() => delay.fallback(500));

  it('should support passing nothing', async () => {
    await expect(time(500, () => delay())).resolves.toEqual(undefined);
  });

  it('should support overriding the default delay', async () => {
    delay.fallback(100);

    await expect(time(100, () => delay())).resolves.toEqual(undefined);
  });

  it('should passing a delay', async () => {
    await expect(time(100, () => delay(100))).resolves.toEqual(undefined);
  });

  it('should passing a promise', async () => {
    await expect(delay(Promise.resolve('hello'))).resolves.toEqual('hello');
  });

  it('should passing a promise and a delay', async () => {
    await expect(time(100, () => delay(Promise.resolve('hello'), 100))).resolves.toEqual('hello');
  });
});
