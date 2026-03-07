export class RibbonStorage {
  static get<T>(storage: globalThis.Storage, key: string, defaultValue: T = null): T {
    try {
      const value = storage.getItem(key);

      if (!value) return defaultValue;

      return JSON.parse(value);
    } catch {
      return defaultValue;
    }
  }

  static set<T>(storage: globalThis.Storage, key: string, value: T): void {
    if (value === undefined || value === null) {
      storage.removeItem(key);
    } else {
      storage.setItem(key, JSON.stringify(value));
    }
  }

  /**
   * Shorthands for getting / setting from {@link localStorage}
   */
  static local = {
    get: <T>(key: string, defaultValue?: T) => RibbonStorage.get(localStorage, key, defaultValue),
    set: <T>(key: string, value: T) => RibbonStorage.set(localStorage, key, value),
  };

  /**
   * Shorthands for getting / setting from {@link sessionStorage}
   */
  static session = {
    get: <T>(key: string, defaultValue?: T) => RibbonStorage.get(sessionStorage, key, defaultValue),
    set: <T>(key: string, value: T) => RibbonStorage.set(sessionStorage, key, value),
  };
}
