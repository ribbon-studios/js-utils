import { afterEach, describe, expect, it, vi } from 'vitest';
import { RibbonStorage } from '../storage';

describe('Storage', () => {
  afterEach(() => {
    RibbonStorage.clear();
    RibbonStorage.reset();
  });

  describe('constructor', () => {
    it('should listen for storage events', () => {
      const listener = vi.fn();
      RibbonStorage.on('change', listener);

      window.dispatchEvent(
        new StorageEvent('storage', {
          storageArea: localStorage,
          key: 'hello',
          newValue: '"world"',
        })
      );

      expect(listener).toHaveBeenCalledWith({
        type: 'local',
        key: 'hello',
        value: 'world',
      });
    });

    it('should support session storage events', () => {
      const listener = vi.fn();
      RibbonStorage.on('change', listener);

      window.dispatchEvent(
        new StorageEvent('storage', {
          storageArea: sessionStorage,
          key: 'hello',
          newValue: null,
        })
      );

      expect(listener).toHaveBeenCalledWith({
        type: 'session',
        key: 'hello',
        value: null,
      });
    });

    it('should ignore storage events if the key is null', () => {
      const listener = vi.fn();
      RibbonStorage.on('change', listener);

      window.dispatchEvent(
        new StorageEvent('storage', {
          storageArea: localStorage,
          key: null,
        })
      );

      expect(listener).not.toHaveBeenCalled();
    });
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

  describe('fn(on)', () => {
    it('should support adding listeners', () => {
      const expectedListener = vi.fn();
      RibbonStorage.on('change', expectedListener);

      expect(RibbonStorage.$listeners.change).toEqual([expectedListener]);
    });

    it('should ignore trying to add multiple of the same listener', () => {
      const expectedListener = vi.fn();
      RibbonStorage.on('change', expectedListener);
      RibbonStorage.on('change', expectedListener);

      expect(RibbonStorage.$listeners.change).toEqual([expectedListener]);
    });
  });

  describe('fn(off)', () => {
    it('should support removing listeners', () => {
      const expectedListener = vi.fn();
      RibbonStorage.on('change', expectedListener);
      RibbonStorage.off('change', expectedListener);

      expect(RibbonStorage.$listeners.change).toEqual([]);
    });

    it('should ignore if the listener does not exist', () => {
      const expectedListener = vi.fn();
      RibbonStorage.off('change', expectedListener);

      expect(RibbonStorage.$listeners.change).toEqual([]);
    });
  });

  describe('fn($emit)', () => {
    it('should invoke the listeners', () => {
      const listener = vi.fn();
      const localListener = vi.fn();
      const sessionListener = vi.fn();

      const expectedEvent: RibbonStorage.ChangeEvent = {
        type: 'local',
        key: 'hello',
        value: 'world',
      };

      RibbonStorage.on('change', listener);
      RibbonStorage.local.on('change', localListener);
      RibbonStorage.session.on('change', sessionListener);

      RibbonStorage.$emit('change', expectedEvent);

      expect(listener).toHaveBeenCalledWith(expectedEvent);
      expect(localListener).toHaveBeenCalledWith(expectedEvent);

      expect(sessionListener).not.toHaveBeenCalled();
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

    describe('fn(on)', () => {
      it('should support adding listeners', () => {
        const expectedListener = vi.fn();
        RibbonStorage[key].on('change', expectedListener);

        expect(RibbonStorage[key].$listeners.change).toEqual([expectedListener]);
      });

      it('should ignore trying to add multiple of the same listener', () => {
        const expectedListener = vi.fn();
        RibbonStorage[key].on('change', expectedListener);
        RibbonStorage[key].on('change', expectedListener);

        expect(RibbonStorage[key].$listeners.change).toEqual([expectedListener]);
      });
    });

    describe('fn(off)', () => {
      it('should support removing listeners', () => {
        const expectedListener = vi.fn();
        RibbonStorage[key].on('change', expectedListener);
        RibbonStorage[key].off('change', expectedListener);

        expect(RibbonStorage[key].$listeners.change).toEqual([]);
      });

      it('should ignore if the listener does not exist', () => {
        const expectedListener = vi.fn();
        RibbonStorage[key].off('change', expectedListener);

        expect(RibbonStorage[key].$listeners.change).toEqual([]);
      });
    });

    describe('fn($emit)', () => {
      it('should invoke the listeners', () => {
        const listener = vi.fn();
        RibbonStorage[key].on('change', listener);
        RibbonStorage[key].$emit('change', {
          type: 'local',
          key: 'hello',
          value: 'world',
        });

        expect(listener).toHaveBeenCalledWith({
          type: 'local',
          key: 'hello',
          value: 'world',
        });
      });
    });
  });
});
