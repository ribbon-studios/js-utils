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
    get: RibbonStorage.get.bind(Storage, localStorage),
    set: RibbonStorage.set.bind(Storage, localStorage),
  };

  /**
   * Shorthands for getting / setting from {@link sessionStorage}
   */
  static session = {
    get: RibbonStorage.get.bind(Storage, sessionStorage),
    set: RibbonStorage.set.bind(Storage, sessionStorage),
  };
}
