let fallbackDelay = 500;

/**
 * If requests resolve instantly it can lead to users feeling like nothing *really* happened.
 * This just ensures a request always takes a *little* bit of time so that spinners and what not can appear.
 *
 * @param promise The promise to return upon resolving
 * @param ms The time to wait
 * @returns A promise that resolves based on the time specified
 */
export async function delay(): Promise<void>;
export async function delay(ms: number): Promise<void>;
export async function delay<T>(promise: Promise<T>): Promise<T>;
export async function delay<T>(promise: Promise<T>, ms: number): Promise<T>;
export async function delay<T>(promise?: Promise<T> | number, ms?: number): Promise<T | void> {
  if (typeof promise === 'number') {
    return await new Promise((resolve) => setTimeout(resolve, promise));
  }

  const [result] = await Promise.all([promise, new Promise((resolve) => setTimeout(resolve, ms ?? fallbackDelay))]);

  return result;
}

export namespace delay {
  /**
   * Overrides the default delay value
   */
  export function fallback(delay: number) {
    fallbackDelay = delay;
  }
}
