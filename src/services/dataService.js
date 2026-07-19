import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  orderBy,
  query,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { temples as templesSeed } from '../data/temples.seed';
import { routes as routesSeed } from '../data/routes.seed';
import {
  guesthouseInfo as guesthouseSeed,
  emergencyContacts as contactsSeed,
} from '../data/guesthouse.seed';
import * as localStore from './localStore';

/**
 * This module is the only place in the app that knows whether data is
 * coming from Firestore or from the local demo store. Every page and
 * the Admin Panel talk to the functions below, never to Firebase or
 * localStorage directly, so swapping the backend never touches UI code.
 */

// ---- Temples (collection) ---------------------------------------------

export function subscribeTemples(callback) {
  if (isFirebaseConfigured) {
    const q = query(collection(db, 'temples'), orderBy('name'));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }
  return localStore.subscribe('temples', templesSeed, callback);
}

export async function addTemple(temple) {
  if (isFirebaseConfigured) {
    await addDoc(collection(db, 'temples'), temple);
    return;
  }
  const current = localStore.getValue('temples', templesSeed);
  const withId = { ...temple, id: localStore.generateLocalId(), isSampleData: false };
  localStore.setValue('temples', [...current, withId]);
}

export async function updateTemple(templeId, changes) {
  if (isFirebaseConfigured) {
    await updateDoc(doc(db, 'temples', templeId), changes);
    return;
  }
  const current = localStore.getValue('temples', templesSeed);
  localStore.setValue(
    'temples',
    current.map((t) => (t.id === templeId ? { ...t, ...changes } : t)),
  );
}

export async function deleteTemple(templeId) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, 'temples', templeId));
    return;
  }
  const current = localStore.getValue('temples', templesSeed);
  localStore.setValue(
    'temples',
    current.filter((t) => t.id !== templeId),
  );
}

// ---- Darshan routes (single document holding the array) ----------------

export function subscribeRoutes(callback) {
  if (isFirebaseConfigured) {
    return onSnapshot(doc(db, 'settings', 'routes'), (snap) => {
      callback(snap.exists() ? snap.data().items : routesSeed);
    });
  }
  return localStore.subscribe('routes', routesSeed, callback);
}

export async function saveRoutes(items) {
  if (isFirebaseConfigured) {
    await setDoc(doc(db, 'settings', 'routes'), { items });
    return;
  }
  localStore.setValue('routes', items);
}

// ---- Guesthouse info (single document) ----------------------------------

export function subscribeGuesthouseInfo(callback) {
  if (isFirebaseConfigured) {
    return onSnapshot(doc(db, 'settings', 'guesthouseInfo'), (snap) => {
      callback(snap.exists() ? snap.data() : guesthouseSeed);
    });
  }
  return localStore.subscribe('guesthouseInfo', guesthouseSeed, callback);
}

export async function saveGuesthouseInfo(info) {
  if (isFirebaseConfigured) {
    await setDoc(doc(db, 'settings', 'guesthouseInfo'), info);
    return;
  }
  localStore.setValue('guesthouseInfo', info);
}

// ---- Emergency contacts (single document holding the array) ------------

export function subscribeEmergencyContacts(callback) {
  if (isFirebaseConfigured) {
    return onSnapshot(doc(db, 'settings', 'emergencyContacts'), (snap) => {
      callback(snap.exists() ? snap.data().items : contactsSeed);
    });
  }
  return localStore.subscribe('emergencyContacts', contactsSeed, callback);
}

export async function saveEmergencyContacts(items) {
  if (isFirebaseConfigured) {
    await setDoc(doc(db, 'settings', 'emergencyContacts'), { items });
    return;
  }
  localStore.setValue('emergencyContacts', items);
}
