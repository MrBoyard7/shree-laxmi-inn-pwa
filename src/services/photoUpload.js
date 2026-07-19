import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app, isFirebaseConfigured } from '../firebase/config';

const MAX_DEMO_FILE_SIZE_BYTES = 1.5 * 1024 * 1024; // 1.5 MB

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

/**
 * Upload a temple photo and return a URL that can be stored directly on
 * the temple record.
 *
 * - With Firebase configured: uploads to Cloud Storage and returns a
 *   permanent download URL, shared across every device.
 * - In local demo mode: encodes the image as a base64 data URL kept in
 *   localStorage. This only works well for small images on the current
 *   device/browser — it is a convenience for trying the Admin Panel,
 *   not a substitute for real storage in production.
 */
export async function uploadTemplePhoto(file, templeId) {
  if (isFirebaseConfigured) {
    const storage = getStorage(app);
    const path = `temples/${templeId}/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  if (file.size > MAX_DEMO_FILE_SIZE_BYTES) {
    throw new Error(
      'This image is too large for local demo mode (max 1.5 MB). Connect Firebase Storage for full-size photos, or choose a smaller image.',
    );
  }
  return readAsDataUrl(file);
}
