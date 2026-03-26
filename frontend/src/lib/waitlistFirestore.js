import {
  collection,
  doc,
  getCountFromServer,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirestoreDb } from './firebase';

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
    const snapshot = await getCountFromServer(collection(db, 'waitlist'));
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
  const ref = doc(db, 'waitlist', docId);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    if (snap.exists()) {
      const err = new Error('duplicate-email');
      err.code = 'duplicate-email';
      throw err;
    }
    transaction.set(ref, {
      prenom: formData.prenom.trim(),
      email: formData.email.trim().toLowerCase(),
      ville: formData.ville.trim(),
      userType: {
        louer: Boolean(formData.userType.louer),
        proposer: Boolean(formData.userType.proposer),
      },
      createdAt: serverTimestamp(),
    });
  });
}
