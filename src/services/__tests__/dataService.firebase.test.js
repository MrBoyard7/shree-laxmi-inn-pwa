import { describe, it, expect, vi } from 'vitest';

vi.mock('../../firebase/config', () => ({
  db: { name: 'mock-db' },
  isFirebaseConfigured: true,
}));

const snapshotHandlers = vi.hoisted(() => ({}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn((db, name) => ({ type: 'collection', name })),
  doc: vi.fn((db, ...segments) => ({ type: 'doc', segments })),
  query: vi.fn((ref) => ref),
  orderBy: vi.fn(() => ({})),
  onSnapshot: vi.fn((ref, handler) => {
    const key = ref.name || ref.segments?.join('/');
    snapshotHandlers[key] = handler;
    return () => {
      delete snapshotHandlers[key];
    };
  }),
  addDoc: vi.fn(async () => ({ id: 'new-doc-id' })),
  updateDoc: vi.fn(async () => undefined),
  deleteDoc: vi.fn(async () => undefined),
  setDoc: vi.fn(async () => undefined),
}));

const dataService = await import('../dataService');
const { addDoc, updateDoc, deleteDoc, setDoc, collection, doc } =
  await import('firebase/firestore');

describe('dataService (Firebase configured)', () => {
  it('subscribeTemples queries the temples collection ordered by name', () => {
    const callback = vi.fn();
    dataService.subscribeTemples(callback);
    expect(collection).toHaveBeenCalledWith({ name: 'mock-db' }, 'temples');

    snapshotHandlers.temples({
      docs: [{ id: 'abc', data: () => ({ name: 'Test Temple' }) }],
    });
    expect(callback).toHaveBeenCalledWith([{ id: 'abc', name: 'Test Temple' }]);
  });

  it('addTemple calls addDoc on the temples collection', async () => {
    await dataService.addTemple({ name: 'New Temple' });
    expect(addDoc).toHaveBeenCalledWith(expect.objectContaining({ name: 'temples' }), {
      name: 'New Temple',
    });
  });

  it('updateTemple calls updateDoc for the given temple id', async () => {
    await dataService.updateTemple('temple-1', { name: 'Renamed' });
    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), { name: 'Renamed' });
    expect(doc).toHaveBeenCalledWith({ name: 'mock-db' }, 'temples', 'temple-1');
  });

  it('deleteTemple calls deleteDoc for the given temple id', async () => {
    await dataService.deleteTemple('temple-1');
    expect(deleteDoc).toHaveBeenCalledWith(expect.anything());
    expect(doc).toHaveBeenCalledWith({ name: 'mock-db' }, 'temples', 'temple-1');
  });

  it('subscribeRoutes reads the routes document, falling back to seed data when missing', () => {
    const callback = vi.fn();
    dataService.subscribeRoutes(callback);

    snapshotHandlers['settings/routes']({ exists: () => false });
    expect(callback.mock.calls.at(-1)[0]).toHaveLength(3);

    snapshotHandlers['settings/routes']({
      exists: () => true,
      data: () => ({ items: [{ id: 'route-2h' }] }),
    });
    expect(callback.mock.calls.at(-1)[0]).toEqual([{ id: 'route-2h' }]);
  });

  it('saveRoutes calls setDoc with the routes document', async () => {
    await dataService.saveRoutes([{ id: 'route-2h' }]);
    expect(setDoc).toHaveBeenCalledWith(expect.anything(), { items: [{ id: 'route-2h' }] });
  });

  it('subscribeGuesthouseInfo reads the guesthouseInfo document', () => {
    const callback = vi.fn();
    dataService.subscribeGuesthouseInfo(callback);

    snapshotHandlers['settings/guesthouseInfo']({
      exists: () => true,
      data: () => ({ name: 'Real Firebase Inn' }),
    });
    expect(callback).toHaveBeenCalledWith({ name: 'Real Firebase Inn' });
  });

  it('saveGuesthouseInfo calls setDoc with the guesthouse info document', async () => {
    await dataService.saveGuesthouseInfo({ name: 'Updated Inn' });
    expect(setDoc).toHaveBeenCalledWith(expect.anything(), { name: 'Updated Inn' });
  });

  it('subscribeEmergencyContacts reads the emergencyContacts document', () => {
    const callback = vi.fn();
    dataService.subscribeEmergencyContacts(callback);

    snapshotHandlers['settings/emergencyContacts']({
      exists: () => true,
      data: () => ({ items: [{ id: 'police' }] }),
    });
    expect(callback).toHaveBeenCalledWith([{ id: 'police' }]);
  });

  it('saveEmergencyContacts calls setDoc with the emergency contacts document', async () => {
    await dataService.saveEmergencyContacts([{ id: 'police' }]);
    expect(setDoc).toHaveBeenCalledWith(expect.anything(), { items: [{ id: 'police' }] });
  });
});
