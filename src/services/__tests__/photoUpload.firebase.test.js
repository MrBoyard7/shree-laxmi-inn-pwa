import { describe, it, expect, vi } from 'vitest';

vi.mock('../../firebase/config', () => ({
  app: { name: 'mock-app' },
  isFirebaseConfigured: true,
}));

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({})),
  ref: vi.fn((storage, path) => ({ path })),
  uploadBytes: vi.fn(async () => ({})),
  getDownloadURL: vi.fn(async (storageRef) => `https://storage.example.com/${storageRef.path}`),
}));

const { uploadTemplePhoto } = await import('../photoUpload');
const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');

describe('uploadTemplePhoto (Firebase configured)', () => {
  it('uploads to Cloud Storage and returns the download URL', async () => {
    const file = new File(['bytes'], 'temple.png', { type: 'image/png' });

    const url = await uploadTemplePhoto(file, 'temple-01');

    expect(uploadBytes).toHaveBeenCalled();
    expect(ref).toHaveBeenCalledWith({}, expect.stringContaining('temples/temple-01/'));
    expect(getDownloadURL).toHaveBeenCalled();
    expect(url).toMatch(/^https:\/\/storage\.example\.com\/temples\/temple-01\//);
  });
});
