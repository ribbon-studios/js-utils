let fallbackDelay = 500;

export async function delay(): Promise<void>;
export async function delay(promise: number): Promise<void>;
export async function delay<T>(promise: Promise<T>): Promise<T>;
export async function delay<T>(promise: Promise<T> | number, delay?: number): Promise<void>;
export async function delay<T>(promise: Promise<T> | number, delay: number): Promise<T>;
export async function delay<T>(promise?: Promise<T> | number, delay?: number): Promise<T | void> {
  if (typeof promise === 'number') {
    return await new Promise((resolve) => setTimeout(resolve, promise));
  }

  const [result] = await Promise.all([promise, new Promise((resolve) => setTimeout(resolve, delay ?? fallbackDelay))]);

  return result;
}

export namespace delay {
  export function fallback(delay: number) {
    fallbackDelay = delay;
  }
}
