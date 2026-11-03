import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from '../lib/firebase';
import { Product, ProductCategory } from '../types';
import { PRODUCTS } from '../data/products';
import { normalizeProduct } from '../utils/imageUtils';

const PRODUCTS_COLLECTION = 'products';

/**
 * Upload a product image to Firebase Storage (with local base64 fallback)
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (isFirebaseConfigured && storage) {
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const storageRef = ref(storage, `products/${Date.now()}_${sanitizedName}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(uploadResult.ref);
      return downloadUrl;
    } catch (storageErr) {
      console.warn('[StyleNest] Storage upload failed or not enabled, falling back to data URL:', storageErr);
    }
  }

  // Fallback: Read as Base64 Data URL so image persists in memory & database
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Fetch all products from Firestore if configured.
 * Does NOT swallow errors or return fake static data when Firestore is active.
 */
export async function getProducts(): Promise<Product[]> {
  if (!isFirebaseConfigured || !db) {
    console.info('[StyleNest] Firebase is not configured. Serving local development catalog.');
    return PRODUCTS.map(normalizeProduct);
  }

  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);

    if (snapshot.empty) {
      console.info('[StyleNest] Firestore "products" collection is currently empty.');
      return [];
    }

    const fetchedProducts: Product[] = [];
    snapshot.forEach((docSnap) => {
      fetchedProducts.push(normalizeProduct({ id: docSnap.id, ...docSnap.data() }));
    });

    return fetchedProducts;
  } catch (error: any) {
    console.error('[StyleNest] Failed to fetch products from Firestore:', error);
    throw error;
  }
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  if (!isFirebaseConfigured || !db) {
    const found = PRODUCTS.find((p) => p.id === id);
    return found ? normalizeProduct(found) : null;
  }

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return normalizeProduct({ id: docSnap.id, ...docSnap.data() });
    }

    return null;
  } catch (error: any) {
    console.error(`[StyleNest] Error fetching product ${id} from Firestore:`, error);
    throw error;
  }
}

/**
 * Fetch products filtered by category
 */
export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  if (!isFirebaseConfigured || !db) {
    return PRODUCTS.filter((p) => p.category === category).map(normalizeProduct);
  }

  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsRef, where('category', '==', category));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    const categoryProducts: Product[] = [];
    snapshot.forEach((docSnap) => {
      categoryProducts.push(normalizeProduct({ id: docSnap.id, ...docSnap.data() }));
    });

    return categoryProducts;
  } catch (error: any) {
    console.error(`[StyleNest] Error fetching category ${category} products from Firestore:`, error);
    throw error;
  }
}

/**
 * Save or update a product in Firestore (Admin function)
 */
export async function saveProduct(product: Product): Promise<void> {
  const normalized = normalizeProduct(product);

  if (!isFirebaseConfigured || !db) {
    console.info('[StyleNest] Product saved locally in demo state.');
    return;
  }

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, normalized.id);
    // Write both images array and backward-compatible single image fields
    const payload = {
      ...normalized,
      images: normalized.images,
      image: normalized.images[0],
      imageUrl: normalized.images[0],
      thumbnail: normalized.images[0],
      stock: normalized.stockCount,
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, payload, { merge: true });
    console.info(`[StyleNest] Product ${normalized.id} synced to Firestore with consistent image schema.`);
  } catch (error) {
    console.error(`[StyleNest] Failed to save product ${normalized.id} to Firestore:`, error);
    throw error;
  }
}

/**
 * Delete a product from Firestore (Admin function)
 */
export async function deleteProduct(productId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
    console.info(`[StyleNest] Product ${productId} deleted from Firestore.`);
  } catch (error) {
    console.error(`[StyleNest] Failed to delete product ${productId}:`, error);
    throw error;
  }
}

/**
 * Seed all default catalog products into Firestore
 */
export async function seedProductsToFirestore(): Promise<{ count: number; message: string }> {
  if (!isFirebaseConfigured || !db) {
    return {
      count: PRODUCTS.length,
      message: 'Firebase is not configured. Running in offline mode with full 24-item luxury catalog.'
    };
  }

  try {
    const batch = writeBatch(db);
    let count = 0;

    for (const prod of PRODUCTS) {
      const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
      batch.set(docRef, prod, { merge: true });
      count++;
    }

    await batch.commit();
    return {
      count,
      message: `Successfully seeded ${count} luxury creations into Firestore 'products' collection.`
    };
  } catch (error) {
    console.error('[StyleNest] Failed to seed products into Firestore:', error);
    throw error;
  }
}

