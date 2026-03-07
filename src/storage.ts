export class RibbonStorage {
  /**
   * Here be dragons!
   *
   * If you need to remove a listener use {@link RibbonStorage.off}
   * to reset all listeners use {@link RibbonStorage.reset}
   * @private
   */
  static $listeners: RibbonStorage.Listeners = {
    change: [],
  };

  static {
    // Picks up localStorage changes from other tabs
    window.addEventListener('storage', (event) => {
      if (event.key === null) return;

      RibbonStorage.$emit('change', {
        type: event.storageArea === localStorage ? 'local' : 'session',
        key: event.key,
        value: event.newValue === null ? null : JSON.parse(event.newValue),
      });
    });
  }

  static get<T>(storage: globalThis.Storage, key: string, defaultValue: T): T;
  static get<T>(storage: globalThis.Storage, key: string, defaultValue?: T): T | null;
  static get<T>(storage: globalThis.Storage, key: string, defaultValue?: T): T | null {
    try {
      const value = storage.getItem(key);

      if (!value) return defaultValue ?? null;

      return JSON.parse(value);
    } catch {
      return defaultValue ?? null;
    }
  }

  static set<T>(storage: globalThis.Storage, key: string, value: T): void {
    const type = storage === localStorage ? 'local' : 'session';

    if (value === undefined || value === null) {
      storage.removeItem(key);

      RibbonStorage.$emit('change', {
        type,
        key,
        value: null,
      });
    } else {
      storage.setItem(key, JSON.stringify(value));

      RibbonStorage.$emit('change', {
        type,
        key,
        value,
      });
    }
  }

  static on<K extends keyof RibbonStorage.Listeners>(key: K, listener: RibbonStorage.Listeners[K][number]): void {
    const index = RibbonStorage.$listeners[key].indexOf(listener);

    if (index !== -1) return;

    RibbonStorage.$listeners[key].push(listener);
  }

  static off<K extends keyof RibbonStorage.Listeners>(key: K, listener: RibbonStorage.Listeners[K][number]): void {
    const index = RibbonStorage.$listeners[key].indexOf(listener);

    if (index === -1) return;

    RibbonStorage.$listeners[key].splice(index, 1);
  }

  /**
   * Here be dragons! This should never be called externally!
   * @private
   */
  static $emit<K extends keyof RibbonStorage.Listeners>(
    key: K,
    ...args: Parameters<RibbonStorage.Listeners[K][number]>
  ): void {
    const [event] = args;

    for (const listener of RibbonStorage.$listeners[key]) {
      listener.apply(undefined, args);
    }

    switch (event.type) {
      case 'local':
        RibbonStorage.local.$emit(key, ...args);
        break;
      case 'session':
        RibbonStorage.session.$emit(key, ...args);
        break;
    }
  }

  /**
   * Resets RibbonStorage to a fresh state.
   * Clearing out listeners and what not.
   */
  static reset() {
    RibbonStorage.$listeners = {
      change: [],
    };

    RibbonStorage.local.reset();
    RibbonStorage.session.reset();
  }

  /**
   * Clears local and session storage.
   */
  static clear() {
    localStorage.clear();
    sessionStorage.clear();
  }

  /**
   * Shorthands for getting / setting from {@link localStorage}
   */
  static local: RibbonStorage.SubStorage = {
    $listeners: {
      change: [],
    },

    get: <T>(key: string, defaultValue?: T) => RibbonStorage.get(localStorage, key, defaultValue),
    set: <T>(key: string, value: T) => RibbonStorage.set(localStorage, key, value),

    on(key, listener) {
      const index = RibbonStorage.local.$listeners[key].indexOf(listener);

      if (index !== -1) return;

      RibbonStorage.local.$listeners[key].push(listener);
    },

    off(key, listener) {
      const index = RibbonStorage.local.$listeners[key].indexOf(listener);

      if (index === -1) return;

      RibbonStorage.local.$listeners[key].splice(index, 1);
    },

    reset() {
      RibbonStorage.local.$listeners = {
        change: [],
      };
    },

    $emit(key, ...args) {
      for (const listener of RibbonStorage.local.$listeners[key]) {
        listener.apply(undefined, args);
      }
    },
  };

  /**
   * Shorthands for getting / setting from {@link sessionStorage}
   */
  static session: RibbonStorage.SubStorage = {
    /**
     * Here be dragons!
     *
     * If you need to remove a listener use {@link RibbonStorage.off}
     * to reset all listeners use {@link RibbonStorage.reset}
     * @private
     */
    $listeners: {
      change: [],
    },

    get: <T>(key: string, defaultValue?: T) => RibbonStorage.get(sessionStorage, key, defaultValue),
    set: <T>(key: string, value: T) => RibbonStorage.set(sessionStorage, key, value),

    on(key, listener) {
      const index = RibbonStorage.session.$listeners[key].indexOf(listener);

      if (index !== -1) return;

      RibbonStorage.session.$listeners[key].push(listener);
    },

    off(key, listener) {
      const index = RibbonStorage.session.$listeners[key].indexOf(listener);

      if (index === -1) return;

      RibbonStorage.session.$listeners[key].splice(index, 1);
    },

    reset() {
      RibbonStorage.session.$listeners = {
        change: [],
      };
    },

    $emit(key, ...args) {
      for (const listener of RibbonStorage.session.$listeners[key]) {
        listener.apply(undefined, args);
      }
    },
  };
}

export namespace RibbonStorage {
  export type Listeners = {
    change: ((event: ChangeEvent) => void)[];
  };

  export type ChangeEvent = {
    type: 'local' | 'session';
    key: string;

    /**
     * This will always be the _parsed_ value!
     */
    value: any;
  };

  export type SubStorage = {
    $listeners: Listeners;

    on<K extends keyof Listeners>(key: K, listener: Listeners[K][number]): void;
    off<K extends keyof Listeners>(key: K, listener: Listeners[K][number]): void;

    get<T>(key: string, defaultValue: T): T;
    get<T>(key: string, defaultValue?: T): T | null;
    get<T>(key: string, defaultValue?: T): T | null;

    set<T>(key: string, value: T): void;

    reset(): void;

    /**
     * Here be dragons! This should never be called externally!
     * @private
     */
    $emit<K extends keyof Listeners>(key: K, ...args: Parameters<Listeners[K][number]>): void;
  };
}
