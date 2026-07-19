/**
 * A tiny localStorage-backed store that mimics just enough of Firestore's
 * shape (subscribe/add/update/remove) for this app to run fully
 * client-side in "demo mode", with no Firebase project required.
 *
 * This is intentionally simple: it is a development/demo convenience,
 * not a replacement for Firestore's security, multi-user sync or
 * scalability. Real deployments should configure Firebase (see
 * README.md) so admin edits are shared across devices.
 */

const STORAGE_PREFIX = 'shree-laxmi-inn:';

const readRaw = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeRaw = (key, value) => {
  window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
};

/** Per-key set of subscriber callbacks, notified after every write. */
const subscribers = new Map();

const notify = (key, value) => {
  (subscribers.get(key) || new Set()).forEach((callback) => callback(value));
};

/** Ensure a collection key has an initial value, seeding it once. */
export function ensureSeeded(key, seedValue) {
  const existing = readRaw(key, null);
  if (existing === null) {
    writeRaw(key, seedValue);
  }
}

/** Read the current value for a key. */
export function getValue(key, fallback) {
  return readRaw(key, fallback);
}

/** Replace the entire value for a key and notify subscribers. */
export function setValue(key, value) {
  writeRaw(key, value);
  notify(key, value);
}

/**
 * Subscribe to a key. Calls back immediately with the current value,
 * then again on every future write from this tab (via the in-memory
 * subscriber set) or another tab (via the native "storage" event).
 * Returns an unsubscribe function.
 */
export function subscribe(key, fallback, callback) {
  ensureSeeded(key, fallback);
  callback(getValue(key, fallback));

  if (!subscribers.has(key)) subscribers.set(key, new Set());
  subscribers.get(key).add(callback);

  const onStorageEvent = (event) => {
    if (event.key === STORAGE_PREFIX + key) {
      callback(getValue(key, fallback));
    }
  };
  window.addEventListener('storage', onStorageEvent);

  return () => {
    subscribers.get(key)?.delete(callback);
    window.removeEventListener('storage', onStorageEvent);
  };
}

/** Generate a short, sufficiently-unique id for new demo-mode records. */
export function generateLocalId() {
  return `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
