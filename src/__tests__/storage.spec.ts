import { afterEach, describe, expect, it } from 'vitest';
import { RibbonStorage } from '../storage';

describe('Storage', () => {
  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('fn(get)', () => {
    it('should support retrieving keys', () => {
      localStorage.setItem('hello', JSON.stringify('world'));

      expect(RibbonStorage.get(localStorage, 'hello')).toBe('world');
    });

    it('should providing a default value', () => {
      expect(RibbonStorage.get(localStorage, 'hello', 'welt')).toBe('welt');
    });

    it('should default to null if the key does not exist', () => {
      expect(RibbonStorage.get(localStorage, 'hello')).toBe(null);
    });

    it('should handle json parsing errors', () => {
      localStorage.setItem('hello', '{owo}');

      expect(RibbonStorage.get(localStorage, 'hello')).toBe(null);
    });
  });

  describe('fn(set)', () => {
    it('should support setting keys', () => {
      RibbonStorage.set(localStorage, 'hello', 'world');

      expect(localStorage.getItem('hello')).toBe(JSON.stringify('world'));
    });

    it.each([undefined, null])('should remove the key when set to %s', (value) => {
      localStorage.setItem('hello', JSON.stringify('world'));

      RibbonStorage.set(localStorage, 'hello', value);

      expect(localStorage.getItem('hello')).toBe(null);
    });
  });

  describe.each([
    ['local', localStorage],
    ['session', sessionStorage],
  ] as const)('prop(%s)', (key, storage) => {
    describe('fn(get)', () => {
      it(`should be shorthand for getting from ${key}Storage`, () => {
        storage.setItem('hello', JSON.stringify('world'));

        expect(RibbonStorage[key].get('hello')).toBe('world');
      });
    });

    describe('fn(set)', () => {
      it(`should be shorthand for setting to ${key}Storage`, () => {
        RibbonStorage[key].set('hello', 'world');

        expect(storage.getItem('hello')).toBe(JSON.stringify('world'));
      });
    });
  });
});
