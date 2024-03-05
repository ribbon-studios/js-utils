/**
 * Purely for testing spinners / skeletons
 * @returns A promise that never resolves
 */
export async function never(p?: Promise<any>): Promise<void> {
  if (p) console.warn(`Promise is being called via "never", please ensure this doesn't get deployed!`, p);
  return new Promise(() => {});
}
