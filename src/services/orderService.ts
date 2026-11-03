import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { Order, OrderStatus } from '../types';

const ORDERS_COLLECTION = 'orders';

export interface CreateOrderPayload extends Omit<Order, 'id'> {
  id?: string;
  userId?: string;
}

/**
 * Atomically create and record a new order in Firestore
 */
export async function createOrder(
  payload: CreateOrderPayload,
  userId?: string
): Promise<Order> {
  const orderId = payload.id || `ord-${Date.now()}`;
  const orderNumber = payload.orderNumber || `STN-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const finalOrder: Order = {
    ...payload,
    id: orderId,
    orderNumber,
    createdAt: payload.createdAt || new Date().toISOString(),
  };

  if (!isFirebaseConfigured || !db) {
    console.info(`[StyleNest] Order ${orderNumber} created locally.`);
    return finalOrder;
  }

  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await setDoc(docRef, {
      ...finalOrder,
      userId: userId || null,
      updatedAt: new Date().toISOString()
    });
    console.info(`[StyleNest] Order ${orderNumber} saved to Firestore.`);
    return finalOrder;
  } catch (error) {
    console.error(`[StyleNest] Error saving order ${orderNumber} to Firestore:`, error);
    // Return order so user experience is not disrupted
    return finalOrder;
  }
}

/**
 * Fetch a single order by ID or orderNumber
 */
export async function getOrderByIdOrNumber(identifier: string): Promise<Order | null> {
  if (!isFirebaseConfigured || !db || !identifier) {
    return null;
  }

  try {
    // 1. Try direct doc ID
    const docRef = doc(db, ORDERS_COLLECTION, identifier);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as Omit<Order, 'id'>) };
    }

    // 2. Try query by orderNumber
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersRef, where('orderNumber', '==', identifier));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      const firstDoc = querySnap.docs[0];
      return { id: firstDoc.id, ...(firstDoc.data() as Omit<Order, 'id'>) };
    }

    return null;
  } catch (error) {
    console.warn(`[StyleNest] Error fetching order ${identifier}:`, error);
    return null;
  }
}

/**
 * Fetch orders for a specific user by userId or email address
 */
export async function getUserOrders(userId?: string, userEmail?: string): Promise<Order[]> {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  if (!userId && !userEmail) {
    return [];
  }

  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const fetched: Order[] = [];

    if (userId) {
      const q = query(ordersRef, where('userId', '==', userId));
      const snap = await getDocs(q);
      snap.forEach((d) => {
        fetched.push({ id: d.id, ...(d.data() as Omit<Order, 'id'>) });
      });
    }

    if (fetched.length === 0 && userEmail) {
      try {
        const q = query(ordersRef, where('shippingAddress.email', '==', userEmail));
        const snap = await getDocs(q);
        snap.forEach((d) => {
          fetched.push({ id: d.id, ...(d.data() as Omit<Order, 'id'>) });
        });
      } catch (emailQueryErr) {
        console.warn('[StyleNest] Secondary order query by email was skipped or restricted:', emailQueryErr);
      }
    }

    // Sort descending by date
    return fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error: any) {
    console.error('[StyleNest] Error querying orders from Firestore:', error);
    throw error;
  }
}

/**
 * Admin: Fetch all orders across the boutique
 */
export async function getAllOrders(): Promise<Order[]> {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const snap = await getDocs(ordersRef);
    const list: Order[] = [];

    snap.forEach((d) => {
      list.push({ id: d.id, ...(d.data() as Omit<Order, 'id'>) });
    });

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.warn('[StyleNest] Error loading all orders from Firestore:', error);
    return [];
  }
}

/**
 * Update an order's status and tracking information
 */
export async function updateOrderStatus(
  orderId: string,
  orderStatus: OrderStatus,
  trackingNumber?: string,
  courierPartner?: string
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const updateData: Record<string, any> = {
      orderStatus,
      updatedAt: new Date().toISOString()
    };
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }
    if (courierPartner) {
      updateData.courierPartner = courierPartner;
    }
    await updateDoc(docRef, updateData);
    console.info(`[StyleNest] Order ${orderId} status updated to ${orderStatus}.`);
  } catch (error) {
    console.error(`[StyleNest] Failed to update order status for ${orderId}:`, error);
    throw error;
  }
}

/**
 * Customer Action: Request Return and Refund for an order
 */
export async function requestOrderReturn(
  orderId: string,
  returnReason: string,
  refundMode: 'Original Source' | 'Store Credit' | 'Bank Transfer (COD)'
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      orderStatus: 'Return Requested',
      returnStatus: 'Requested',
      returnReason,
      refundMode,
      updatedAt: new Date().toISOString()
    });
    console.info(`[StyleNest] Return requested for order ${orderId}.`);
  } catch (error) {
    console.error(`[StyleNest] Failed to submit return for ${orderId}:`, error);
    throw error;
  }
}

/**
 * Admin Action: Approve Return & Process Refund
 */
export async function processOrderRefund(
  orderId: string,
  refundAmount: number
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      orderStatus: 'Refunded',
      returnStatus: 'Refunded',
      paymentStatus: 'Refunded',
      refundAmount,
      updatedAt: new Date().toISOString()
    });
    console.info(`[StyleNest] Order ${orderId} marked as Refunded for amount ₹${refundAmount}.`);
  } catch (error) {
    console.error(`[StyleNest] Failed to process refund for ${orderId}:`, error);
    throw error;
  }
}

