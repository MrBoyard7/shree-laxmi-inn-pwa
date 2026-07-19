import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ensureSeeded, getValue, setValue, subscribe, generateLocalId } from '../localStore';

describe('localStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('ensureSeeded writes the seed value only when the key is missing', () => {
    ensureSeeded('widgets', ['a', 'b']);
    expect(getValue('widgets', [])).toEqual(['a', 'b']);

    ensureSeeded('widgets', ['different']);
    expect(getValue('widgets', [])).toEqual(['a', 'b']);
  });

  it('getValue returns the fallback when nothing is stored', () => {
    expect(getValue('missing-key', 'fallback')).toBe('fallback');
  });

  it('getValue falls back gracefully on corrupted JSON', () => {
    window.localStorage.setItem('shree-laxmi-inn:broken', '{not valid json');
    expect(getValue('broken', 'fallback')).toBe('fallback');
  });

  it('setValue persists the value and notifies subscribers', () => {
    const callback = vi.fn();
    subscribe('counter', 0, callback);
    expect(callback).toHaveBeenLastCalledWith(0);

    setValue('counter', 1);
    expect(callback).toHaveBeenLastCalledWith(1);
    expect(getValue('counter', 0)).toBe(1);
  });

  it('subscribe calls back immediately with the current (seeded) value', () => {
    const callback = vi.fn();
    subscribe('greeting', 'hello', callback);
    expect(callback).toHaveBeenCalledWith('hello');
  });

  it('reacts to a native "storage" event for the same key (cross-tab updates)', () => {
    const callback = vi.fn();
    subscribe('shared-counter', 0, callback);
    callback.mockClear();

    window.localStorage.setItem('shree-laxmi-inn:shared-counter', JSON.stringify(42));
    window.dispatchEvent(new StorageEvent('storage', { key: 'shree-laxmi-inn:shared-counter' }));

    expect(callback).toHaveBeenCalledWith(42);
  });

  it('ignores a "storage" event for an unrelated key', () => {
    const callback = vi.fn();
    subscribe('my-key', 'initial', callback);
    callback.mockClear();

    window.dispatchEvent(new StorageEvent('storage', { key: 'shree-laxmi-inn:other-key' }));

    expect(callback).not.toHaveBeenCalled();
  });

  it('unsubscribe stops further notifications', () => {
    const callback = vi.fn();
    const unsubscribe = subscribe('stoppable', 'first', callback);
    callback.mockClear();

    unsubscribe();
    setValue('stoppable', 'second');

    expect(callback).not.toHaveBeenCalled();
  });

  it('generateLocalId returns a short, unique-looking string each time', () => {
    const first = generateLocalId();
    const second = generateLocalId();
    expect(first).toMatch(/^local-/);
    expect(first).not.toBe(second);
  });
});
