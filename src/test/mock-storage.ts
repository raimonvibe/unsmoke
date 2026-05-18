/**
 * Minimal localStorage mock for Node tests.
 * storage.ts checks `typeof window` — assign via installMockWindow().
 */

export function createMockStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
}

export function installMockWindow(): Storage {
  const storage = createMockStorage();
  const g = globalThis as typeof globalThis & {
    window?: Window & typeof globalThis;
    localStorage?: Storage;
  };
  g.localStorage = storage;
  g.window = { localStorage: storage } as Window & typeof globalThis;
  return storage;
}

export function uninstallMockWindow(): void {
  const g = globalThis as typeof globalThis & {
    window?: unknown;
    localStorage?: unknown;
  };
  delete g.window;
  delete g.localStorage;
}
