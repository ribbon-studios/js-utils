import { describe, it, expect, vi } from 'vitest';
import { Chance } from 'chance';
import { retry } from '../retry';

const chance = new Chance();

describe('fn(retry)', () => {
  it('should retry until the method succeeds', async () => {
    const expectedValue = chance.word();

    const fn = vi.fn().mockRejectedValueOnce(null).mockResolvedValueOnce(expectedValue);

    await expect(retry(fn, 5)).resolves.toEqual(expectedValue);

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should throw an error if it exceeds the retry count', async () => {
    const expectedRetries = chance.integer({ min: 3, max: 5 });
    const expectedValue = chance.word();

    const fn = vi.fn().mockRejectedValue(expectedValue);

    await expect(retry(fn, expectedRetries)).rejects.toEqual(expectedValue);

    expect(fn).toHaveBeenCalledTimes(expectedRetries);
  });
});
