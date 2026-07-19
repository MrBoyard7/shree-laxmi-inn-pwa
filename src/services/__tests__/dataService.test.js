import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  subscribeTemples,
  addTemple,
  updateTemple,
  deleteTemple,
  subscribeRoutes,
  saveRoutes,
  subscribeGuesthouseInfo,
  saveGuesthouseInfo,
  subscribeEmergencyContacts,
  saveEmergencyContacts,
} from '../dataService';

describe('dataService (local demo mode)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('subscribeTemples calls back with the seed temples, then again after a change', async () => {
    const callback = vi.fn();
    const unsubscribe = subscribeTemples(callback);

    expect(callback).toHaveBeenCalledTimes(1);
    const initial = callback.mock.calls[0][0];
    expect(initial).toHaveLength(22);

    await addTemple({ name: 'New Temple', category: 'Major Temple' });
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback.mock.calls[1][0]).toHaveLength(23);

    unsubscribe();
  });

  it('updateTemple changes only the targeted temple', async () => {
    const callback = vi.fn();
    subscribeTemples(callback);

    await updateTemple('01', { name: 'Renamed Temple' });

    const latest = callback.mock.calls.at(-1)[0];
    const updated = latest.find((t) => t.id === '01');
    expect(updated.name).toBe('Renamed Temple');
  });

  it('deleteTemple removes the targeted temple', async () => {
    const callback = vi.fn();
    subscribeTemples(callback);

    await deleteTemple('01');

    const latest = callback.mock.calls.at(-1)[0];
    expect(latest.find((t) => t.id === '01')).toBeUndefined();
    expect(latest).toHaveLength(21);
  });

  it('subscribeRoutes / saveRoutes round-trip through the local store', async () => {
    const callback = vi.fn();
    subscribeRoutes(callback);
    expect(callback.mock.calls[0][0]).toHaveLength(3);

    await saveRoutes([{ id: 'route-2h', label: '2 Hours', templeIds: [] }]);
    expect(callback.mock.calls.at(-1)[0]).toHaveLength(1);
  });

  it('subscribeGuesthouseInfo / saveGuesthouseInfo round-trip through the local store', async () => {
    const callback = vi.fn();
    subscribeGuesthouseInfo(callback);
    expect(callback.mock.calls[0][0].name).toBe('Shree Laxmi Inn');

    await saveGuesthouseInfo({ name: 'Updated Inn' });
    expect(callback.mock.calls.at(-1)[0].name).toBe('Updated Inn');
  });

  it('subscribeEmergencyContacts / saveEmergencyContacts round-trip through the local store', async () => {
    const callback = vi.fn();
    subscribeEmergencyContacts(callback);
    expect(callback.mock.calls[0][0].length).toBeGreaterThan(0);

    await saveEmergencyContacts([]);
    expect(callback.mock.calls.at(-1)[0]).toHaveLength(0);
  });
});
