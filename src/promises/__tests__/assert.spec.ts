import { describe, it, expect } from 'vitest';
import { assert } from '../assert';

describe('utils(Assert)', () => {
  describe('fn(assert)', () => {
    it('should passthrough the value if the assert succeeds', async () => {
      await expect(assert(Promise.resolve('hello'), () => true)).resolves.toEqual('hello');
    });

    it('should throw an error if the assert fails', async () => {
      await expect(assert(Promise.resolve('hello'), () => false)).rejects.toThrow('Value does not satisfy predicate');
    });

    it('should support overriding the error message', async () => {
      await expect(assert(Promise.resolve('hello'), () => false, 'Oops!')).rejects.toThrow('Oops!');
    });
  });

  describe('fn(assert.defined)', () => {
    it('should verify the value is defined', async () => {
      await expect(assert.defined(Promise.resolve('hello'))).resolves.toEqual('hello');
    });

    it('should throw an error if the value is not defined', async () => {
      await expect(assert.defined(Promise.resolve())).rejects.toThrow();
    });

    it('should support overriding the error message', async () => {
      await expect(assert.defined(Promise.resolve(), 'Oops!')).rejects.toThrow('Oops!');
    });
  });
});
