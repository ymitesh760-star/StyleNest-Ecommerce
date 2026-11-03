import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { useToast } from './ToastContext';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { getUserWishlist, syncUserWishlist } from '../services/wishlistService';

interface WishlistContextType {
  wishlist: Product[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  moveToCart: (product: Product, options?: { size?: string; color?: string; volume?: string }) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'stylenest_wishlist_items_v2';

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const toast = useToast();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY) || localStorage.getItem('elan_wishlist_items_v2');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Local storage synchronization
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to sync wishlist to localStorage', e);
    }
  }, [wishlist]);

  const isRemoteWishlistLoaded = React.useRef(false);

  // Load wishlist from Firestore safely on authentication
  useEffect(() => {
    if (!user?.id) {
      isRemoteWishlistLoaded.current = false;
      return;
    }

    let isMounted = true;
    isRemoteWishlistLoaded.current = false;

    getUserWishlist(user.id)
      .then((remoteWishlist) => {
        if (!isMounted) return;
        if (remoteWishlist && remoteWishlist.length > 0) {
          setWishlist((localItems) => {
            if (localItems.length === 0) {
              return remoteWishlist;
            }
            // Merge without duplicates
            const merged = [...remoteWishlist];
            for (const localItem of localItems) {
              if (!merged.some((m) => m.id === localItem.id)) {
                merged.push(localItem);
              }
            }
            return merged;
          });
        }
        isRemoteWishlistLoaded.current = true;
      })
      .catch((err) => {
        console.error('[StyleNest] Failed to load remote wishlist:', err);
        isRemoteWishlistLoaded.current = true;
      });

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Sync wishlist updates to Firestore ONLY after remote items have been loaded
  useEffect(() => {
    if (!user?.id || !isRemoteWishlistLoaded.current) return;
    syncUserWishlist(user.id, wishlist).catch((err) => {
      console.warn('[StyleNest] Sync wishlist to Firestore failed:', err);
    });
  }, [wishlist, user?.id]);

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        toast.info('Removed from Wishlist', `${product.name} removed from your saved items.`);
        return prev.filter((item) => item.id !== product.id);
      } else {
        toast.luxury('Saved to Wishlist', `${product.name} added to your wishlist.`);
        return [...prev, product];
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const moveToCart = (product: Product, options?: { size?: string; color?: string; volume?: string }) => {
    const success = addToCart(product, options);
    if (success) {
      removeFromWishlist(product.id);
      toast.luxury('Moved to Shopping Bag', `${product.name} has been transferred to your bag.`);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
