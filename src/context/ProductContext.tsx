import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ProductCategory } from '../types';
import { PRODUCTS } from '../data/products';
import {
  getProducts,
  getProductById as serviceGetProductById,
  saveProduct,
  deleteProduct as serviceDeleteProduct,
  seedProductsToFirestore
} from '../services/productService';
import { isFirebaseConfigured, db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { normalizeProduct } from '../utils/imageUtils';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  isFirestoreEmpty: boolean;
  isFirestoreActive: boolean;
  getProductById: (id: string) => Product | undefined;
  getCategoryProducts: (category: ProductCategory) => Product[];
  refreshProducts: () => Promise<void>;
  createOrUpdateProduct: (product: Product) => Promise<void>;
  removeProduct: (productId: string) => Promise<void>;
  seedCatalogToFirestore: () => Promise<{ count: number; message: string }>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Start with full normalized 24-piece luxury catalog
  const [products, setProducts] = useState<Product[]>(() => PRODUCTS.map(normalizeProduct));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFirestoreEmpty, setIsFirestoreEmpty] = useState<boolean>(false);

  // Initial load & real-time Firestore listener if configured
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (isFirebaseConfigured && db) {
      setLoading(true);
      setError(null);
      try {
        const productsCol = collection(db, 'products');
        unsubscribe = onSnapshot(
          productsCol,
          (snapshot) => {
            if (!snapshot.empty) {
              const fetched: Product[] = [];
              snapshot.forEach((doc) => {
                fetched.push(normalizeProduct({ id: doc.id, ...doc.data() }));
              });
              setProducts(fetched);
              setIsFirestoreEmpty(false);
              setError(null);
            } else {
              setProducts(PRODUCTS.map(normalizeProduct));
              setIsFirestoreEmpty(true);
              setError(null);
            }
            setLoading(false);
          },
          (err: any) => {
            setLoading(false);
            // Graceful fallback to built-in portfolio so user experience is flawless
            setProducts(PRODUCTS);
            let msg = err.message || 'Error communicating with Cloud Firestore';
            if (err.code === 'permission-denied') {
              msg = 'Permission Denied: Ensure firestore.rules allows public read access to the "products" collection.';
            } else if (err.code === 'unavailable') {
              msg = 'Cloud Firestore service unavailable. Running with offline luxury catalog.';
            }
            console.warn('[StyleNest] Firestore products snapshot notice:', msg);
            setError(msg);
          }
        );
      } catch (err: any) {
        setLoading(false);
        setProducts(PRODUCTS);
        console.warn('[StyleNest] Could not attach Firestore snapshot listener, using luxury catalog:', err);
      }
    } else {
      // Firebase not configured in .env: use full luxury catalog
      setProducts(PRODUCTS);
      setLoading(false);
      setIsFirestoreEmpty(false);
      setError(null);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const refreshProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const liveProducts = await getProducts();
      setProducts(liveProducts);
      setIsFirestoreEmpty(liveProducts.length === 0);
    } catch (e: any) {
      console.error('[StyleNest] Error refreshing products:', e);
      let msg = e?.message || 'Failed to refresh products from Firestore';
      if (e?.code === 'permission-denied') {
        msg = 'Permission Denied: Unable to query products collection.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find((p) => p.id === id);
  };

  const getCategoryProducts = (category: ProductCategory): Product[] => {
    return products.filter((p) => p.category === category);
  };

  const createOrUpdateProduct = async (product: Product): Promise<void> => {
    const normalized = normalizeProduct(product);
    // Optimistic local update
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === normalized.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = normalized;
        return copy;
      }
      return [normalized, ...prev];
    });

    if (isFirebaseConfigured) {
      await saveProduct(normalized);
    }
  };

  const removeProduct = async (productId: string): Promise<void> => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (isFirebaseConfigured) {
      await serviceDeleteProduct(productId);
    }
  };

  const seedCatalogToFirestore = async (): Promise<{ count: number; message: string }> => {
    return await seedProductsToFirestore();
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        isFirestoreEmpty,
        isFirestoreActive: isFirebaseConfigured,
        getProductById,
        getCategoryProducts,
        refreshProducts,
        createOrUpdateProduct,
        removeProduct,
        seedCatalogToFirestore,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

