import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { CartItem, Coupon } from '../types';

const CARTS_COLLECTION = 'carts';

export interface UserCartData {
  items: CartItem[];
  coupon: Coupon | null;
  updatedAt: string;
}

/**
 * Fetch persisted cart for an authenticated user
 */
export async function getUserCart(userId: string): Promise<UserCartData | null> {
  if (!isFirebaseConfigured || !db || !userId) {
    return null;
  }

  try {
    const docRef = doc(db, CARTS_COLLECTION, userId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return snap.data() as UserCartData;
    }
    return null;
  } catch (error) {
    console.warn(`[StyleNest] Error fetching cart for user ${userId}:`, error);
    return null;
  }
}

/**
 * Sync current cart state to Firestore for an authenticated user
 */
export async function syncUserCart(
  userId: string,
  items: CartItem[],
  coupon: Coupon | null
): Promise<void> {
  if (!isFirebaseConfigured || !db || !userId) {
    return;
  }

  try {
    const docRef = doc(db, CARTS_COLLECTION, userId);
    await setDoc(docRef, {
      items,
      coupon,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn(`[StyleNest] Error syncing cart to Firestore for ${userId}:`, error);
  }
}

/**
 * Clear user cart from Firestore
 */
export async function clearUserCart(userId: string): Promise<void> {
  if (!isFirebaseConfigured || !db || !userId) {
    return;
  }

  try {
    const docRef = doc(db, CARTS_COLLECTION, userId);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn(`[StyleNest] Error clearing cart in Firestore for ${userId}:`, error);
  }
}

