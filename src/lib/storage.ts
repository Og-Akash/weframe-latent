export const safeGet = <T,>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

export const safeSet = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* noop */
  }
};

export const safeRemove = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    /* noop */
  }
};
