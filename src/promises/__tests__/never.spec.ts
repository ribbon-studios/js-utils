import { describe, it, expect, vi, expectTypeOf } from 'vitest';
import { never } from '../never';

describe('fn(never)', () => {
  const race = async <T>(p?: Promise<T>) => {
    let finished = false;

    await Promise.race([
      never(p).then(() => {
        finished = true;
      }),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ]);

    return finished;
  };

  it('should never resolve', async () => {
    vi.spyOn(console, 'warn');
    const finished = await race();

    expect(finished).toEqual(false);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('should log when a promise is passed to it', async () => {
    vi.spyOn(console, 'warn').mockReturnValue();
    const expectedPromise = Promise.resolve();

    const finished = await race(expectedPromise);

    expect(finished).toEqual(false);
    expect(console.warn).toHaveBeenCalledWith(
      `Promise is being called via "never", please ensure this doesn't get deployed!`,
      expectedPromise
    );
  });

  it('should return the type that is provided to it', async () => {
    vi.spyOn(console, 'warn').mockReturnValue();
    const expectedPromise = Promise.resolve('hello');

    const promise = never(expectedPromise);

    expectTypeOf(promise).toEqualTypeOf<Promise<string>>();
  });

  it('should return the type that is provided to it', async () => {
    vi.spyOn(console, 'warn').mockReturnValue();
    const expectedPromise = Promise.resolve();

    const promise = never(expectedPromise);

    expectTypeOf(promise).toEqualTypeOf<Promise<void>>();
  });
});
