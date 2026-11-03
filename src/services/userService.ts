import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { UserProfile, Address } from '../types';

const USERS_COLLECTION = 'users';

/**
 * Fetch all registered customer profiles from Firestore (Admin function)
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  try {
    const colRef = collection(db, USERS_COLLECTION);
    const snap = await getDocs(colRef);
    const users: UserProfile[] = [];
    snap.forEach((docSnap) => {
      users.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<UserProfile, 'id'>)
      });
    });
    return users;
  } catch (error) {
    console.error('[StyleNest] Error fetching registered users from Firestore:', error);
    return [];
  }
}

/**
 * Fetch a user profile by Firebase UID or ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!isFirebaseConfigured || !db || !userId) {
    return null;
  }

  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as Omit<UserProfile, 'id'>) };
    }
    return null;
  } catch (error: any) {
    console.error(`[StyleNest] Error fetching user profile ${userId}:`, error);
    throw error;
  }
}

/**
 * Create or update a user profile in Firestore
 */
export async function saveUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.error(`[StyleNest] Error saving user profile ${userId}:`, error);
    throw error;
  }
}

/**
 * Update user shipping addresses
 */
export async function updateUserAddresses(userId: string, addresses: Address[]): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(docRef, {
      addresses,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error(`[StyleNest] Error updating addresses for user ${userId}:`, error);
    throw error;
  }
}

