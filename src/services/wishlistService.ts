import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { Product } from '../types';

const WISHLISTS_COLLECTION = 'wishlists';

export interface UserWishlistData {
  items: Product[];
  updatedAt: string;
}

/**
 * Fetch persisted wishlist for an authenticated user
 */
export async function getUserWishlist(userId: string): Promise<Product[] | null> {
  if (!isFirebaseConfigured || !db || !userId) {
    return null;
  }

  try {
    const docRef = doc(db, WISHLISTS_COLLECTION, userId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data() as UserWishlistData;
      return data.items || [];
    }
    return null;
  } catch (error) {
    console.warn(`[StyleNest] Error fetching wishlist for user ${userId}:`, error);
    return null;
  }
}

/**
 * Sync current wishlist items to Firestore for an authenticated user
 */
export async function syncUserWishlist(userId: string, items: Product[]): Promise<void> {
  if (!isFirebaseConfigured || !db || !userId) {
    return;
  }

  try {
    const docRef = doc(db, WISHLISTS_COLLECTION, userId);
    await setDoc(docRef, {
      items,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn(`[StyleNest] Error syncing wishlist to Firestore for ${userId}:`, error);
  }
}

/**
 * Clear wishlist in Firestore
 */
export async function clearUserWishlist(userId: string): Promise<void> {
  if (!isFirebaseConfigured || !db || !userId) {
    return;
  }

  try {
    const docRef = doc(db, WISHLISTS_COLLECTION, userId);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn(`[StyleNest] Error clearing wishlist for user ${userId}:`, error);
  }
}

