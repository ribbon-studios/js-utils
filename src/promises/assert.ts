/**
 * Ensures a promise matches the given predicate
 * @returns The original promise
 */
export async function assert<P extends Promise<any>, V = P extends Promise<infer V> ? V : never>(
  p: P,
  predicate: (value: V) => boolean,
  message?: string
): Promise<V> {
  const value: V = await p;

  if (predicate(value)) return value;

  throw new Error(message ?? 'Value does not satisfy predicate');
}

/* c8 ignore start */
export namespace assert {
  /* c8 ignore end */

  /**
   * Ensures a promise result is defined
   * @returns The original promise
   */
  export async function defined<P extends Promise<any>, V = Awaited<P>>(
    p: P,
    message?: string
  ): Promise<Exclude<V, undefined | null>> {
    return assert(p, (v) => v !== undefined && v !== null, message);
  }
}
