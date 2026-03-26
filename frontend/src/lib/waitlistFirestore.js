import {
  collection,
  doc,
  getCountFromServer,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirestoreDb } from './firebase';

/** Données complètes (prénom, email, etc.) — pas de lecture client. */
const COLLECTION_WAITLIST = 'waitlist';
/** Un document minimal par inscription — utilisé uniquement pour le comptage public. */
const COLLECTION_WAITLIST_INDEX = 'waitlist_index';

async function emailToDocId(email) {
  const normalized = email.trim().toLowerCase();
  const buffer = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const bytes = new Uint8Array(hashBuffer);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function fetchWaitlistCountFromFirestore() {
  const db = getFirestoreDb();
  if (!db) {
    return null;
  }
  try {
    const snapshot = await getCountFromServer(
      collection(db, COLLECTION_WAITLIST_INDEX)
    );
    return snapshot.data().count;
  } catch {
    return null;
  }
}

export async function submitWaitlistToFirestore(formData) {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error('Firebase non configuré');
  }

  const docId = await emailToDocId(formData.email);
  const privateRef = doc(db, COLLECTION_WAITLIST, docId);
  const indexRef = doc(db, COLLECTION_WAITLIST_INDEX, docId);

  await runTransaction(db, async (transaction) => {
    // Doublon : uniquement via waitlist_index (lecture autorisée par les règles).
    // Ne pas lire waitlist ici : allow read est à false pour protéger les données.
    const indexSnap = await transaction.get(indexRef);
    if (indexSnap.exists()) {
      const err = new Error('duplicate-email');
      err.code = 'duplicate-email';
      throw err;
    }
    transaction.set(privateRef, {
      prenom: formData.prenom.trim(),
      email: formData.email.trim().toLowerCase(),
      ville: formData.ville.trim(),
      userType: {
        louer: Boolean(formData.userType.louer),
        proposer: Boolean(formData.userType.proposer),
      },
      createdAt: serverTimestamp(),
    });
    transaction.set(indexRef, { v: 1 });
  });
}
