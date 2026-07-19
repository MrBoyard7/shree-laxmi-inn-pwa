import { describe, it, expect } from 'vitest';
import { uploadTemplePhoto } from '../photoUpload';

describe('uploadTemplePhoto (local demo mode)', () => {
  it('encodes a small image as a base64 data URL', async () => {
    const file = new File(['tiny-image-bytes'], 'temple.png', { type: 'image/png' });
    const url = await uploadTemplePhoto(file, '01');
    expect(url).toMatch(/^data:image\/png;base64,/);
  });

  it('rejects a file larger than the 1.5 MB demo-mode limit', async () => {
    const bigContent = new Uint8Array(1.6 * 1024 * 1024);
    const file = new File([bigContent], 'huge.png', { type: 'image/png' });

    await expect(uploadTemplePhoto(file, '01')).rejects.toThrow(/too large for local demo mode/);
  });
});
