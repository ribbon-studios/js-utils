/**
 * Attempts a request {@link n} times until it resolves.
 *
 * @param fn The function to invoke.
 * @param n The maximum number of attempts
 * @returns A resolved promise if it succeeds or the rejected promise if it exceeds {@link n}
 */
export async function retry<T>(fn: () => Promise<T>, n: number): Promise<T> {
  let attempts = 0;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (++attempts < n) continue;

      throw error;
    }
  }
}
