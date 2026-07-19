import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * All Firebase credentials come from Vite environment variables so no
 * secret ever lives in source control. See .env.example for the full
 * list and README.md > "Connect your own Firebase project" for setup
 * steps.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  // No Firebase project configured yet: the app falls back to a
  // localStorage-backed demo data store (see src/services/localStore.js)
  // so `npm run dev` works immediately for evaluation, without any
  // external setup.
  console.info(
    '[Shree Laxmi Inn] No Firebase config detected — running in local demo data mode. ' +
      'See README.md to connect a real Firebase project.',
  );
}

export { app, auth, db };
