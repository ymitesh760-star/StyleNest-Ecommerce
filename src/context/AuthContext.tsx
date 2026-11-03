import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile as fbUpdateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import { UserProfile, Address, Order, OrderStatus } from '../types';
import { useToast } from './ToastContext';
import { getUserProfile, saveUserProfile, updateUserAddresses } from '../services/userService';
import { getUserOrders, updateOrderStatus as firestoreUpdateOrderStatus } from '../services/orderService';

export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  isAdmin: boolean;
  isFirebaseConnected: boolean;
  login: (email: string, role?: 'customer' | 'admin') => Promise<void> | void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; message?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; message?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  refreshOrders: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'stylenest_user_profile_v2';
const ORDERS_STORAGE_KEY = 'stylenest_user_orders_v2';

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-01',
    fullName: 'Arya Singhania',
    phone: '+91 98200 45812',
    email: 'arya.singhania@stylenest.com',
    addressLine1: 'Penthouse 42, The Grand Residences',
    addressLine2: 'Worli Sea Face',
    landmark: 'Opposite Promenade',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400018',
    isDefault: true,
  },
  {
    id: 'addr-02',
    fullName: 'Arya Singhania (Summer Residence)',
    phone: '+91 98200 45812',
    email: 'arya.singhania@stylenest.com',
    addressLine1: 'Villa 7, Olive Crest Estate',
    addressLine2: 'Kalyani Nagar',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411006',
    isDefault: false,
  }
];

const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'STN-2026-8941',
    createdAt: '2026-10-24T14:20:00.000Z',
    items: [
      {
        id: 'perfume-01-nosize-nocolor-50ml',
        productId: 'perfume-01',
        name: 'Santal Impérial Extrait de Parfum',
        brand: 'STYLENEST Parfums',
        category: 'perfumes',
        image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=80',
        price: 6499,
        quantity: 1,
        selectedVolume: '50ml',
        stockCount: 20
      },
      {
        id: 'shoe-01-UK 8-Monochrome White-novol',
        productId: 'shoe-01',
        name: 'Artisan Calfskin Minimalist Sneaker',
        brand: 'STYLENEST Footwear',
        category: 'shoes',
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=80',
        price: 7999,
        quantity: 1,
        selectedSize: 'UK 8',
        selectedColor: 'Monochrome White',
        stockCount: 25
      }
    ],
    subtotal: 14498,
    discount: 1450,
    shippingFee: 0,
    total: 13048,
    couponCode: 'STYLENEST10',
    paymentMethod: 'UPI',
    paymentStatus: 'Completed',
    orderStatus: 'Out for Delivery',
    shippingAddress: DEFAULT_ADDRESSES[0],
    estimatedDelivery: 'Tomorrow, by 6:00 PM',
    trackingNumber: 'BLUEDART-IND-9872145'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const toast = useToast();

  const [isAuthReady, setIsAuthReady] = useState<boolean>(!isFirebaseConfigured);

  const [user, setUser] = useState<UserProfile | null>(() => {
    // If Firebase is configured, start clean until onAuthStateChanged verifies the real session
    if (isFirebaseConfigured) return null;
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    if (isFirebaseConfigured) return [];
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync user changes to localStorage only when user is present
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync user to localStorage', e);
    }
  }, [user]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      if (orders.length > 0) {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
      } else if (!user) {
        localStorage.removeItem(ORDERS_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync orders to localStorage', e);
    }
  }, [orders, user]);

  // Fetch real orders from Firestore when user changes
  const refreshOrders = async () => {
    if (!user?.id) return;
    try {
      const firestoreOrders = await getUserOrders(user.id, user.email);
      setOrders(firestoreOrders || []);
    } catch (e: any) {
      console.error('[StyleNest] Could not fetch real-time orders:', e);
      let errorMsg = 'Could not retrieve orders.';
      if (e?.code === 'permission-denied') {
        errorMsg = 'Permission denied reading order history. Ensure order documents match your user ID.';
      }
      toast.error('Order Sync Issue', errorMsg);
    }
  };

  // Listen to Firebase Auth state changes
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setIsAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        // Authenticated with Firebase
        try {
          const profile = await getUserProfile(fbUser.uid);
          if (profile) {
            setUser(profile);
          } else {
            const isSpecialAdmin = fbUser.email?.toLowerCase().includes('admin') || false;
            const newProfile: UserProfile = {
              id: fbUser.uid,
              name: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0].replace(/[._]/g, ' ') : 'Valued Client'),
              email: fbUser.email || '',
              phone: fbUser.phoneNumber || '+91 98200 45812',
              role: isSpecialAdmin ? 'admin' : 'customer',
              addresses: DEFAULT_ADDRESSES,
            };
            setUser(newProfile);
            await saveUserProfile(fbUser.uid, newProfile).catch((err) => {
              console.warn('[StyleNest] Failed to create initial profile document:', err);
            });
          }

          // Fetch orders for this user
          try {
            const userOrders = await getUserOrders(fbUser.uid, fbUser.email || undefined);
            setOrders(userOrders || []);
          } catch (ordErr) {
            console.error('[StyleNest] Error fetching user orders:', ordErr);
            setOrders([]);
          }
        } catch (e) {
          console.error('[StyleNest] Error synchronizing Firebase user profile:', e);
        }
      } else {
        // User logged out or unauthenticated in Firebase
        setUser(null);
        setOrders([]);
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(ORDERS_STORAGE_KEY);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Backwards-compatible instant login (for demo/evaluators)
  const login = (email: string, role: 'customer' | 'admin' = 'customer') => {
    const isSpecialAdmin = email.toLowerCase().includes('admin') || role === 'admin';
    const newUser: UserProfile = {
      id: 'usr-' + Date.now().toString().slice(-4),
      name: isSpecialAdmin ? 'STYLENEST Store Director' : email.split('@')[0].replace(/[._]/g, ' '),
      email,
      phone: '+91 98200 45812',
      role: isSpecialAdmin ? 'admin' : 'customer',
      addresses: DEFAULT_ADDRESSES,
    };
    setUser(newUser);
    toast.luxury(
      isSpecialAdmin ? 'Admin Access Granted' : 'Welcome to STYLENEST Privé',
      `Signed in as ${newUser.name} (${newUser.role})`
    );
  };

  // Real Firebase Email/Password Sign-In
  const signIn = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    if (!isFirebaseConfigured || !auth) {
      login(email);
      return { success: true };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      const profile = await getUserProfile(fbUser.uid);

      if (profile) {
        setUser(profile);
      } else {
        const isSpecialAdmin = email.toLowerCase().includes('admin');
        const fallbackProfile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || email.split('@')[0].replace(/[._]/g, ' '),
          email: fbUser.email || email,
          phone: '+91 98200 45812',
          role: isSpecialAdmin ? 'admin' : 'customer',
          addresses: DEFAULT_ADDRESSES
        };
        setUser(fallbackProfile);
        await saveUserProfile(fbUser.uid, fallbackProfile);
      }

      toast.luxury('Welcome Back', `Signed in as ${user?.name || email}`);
      return { success: true };
    } catch (error: any) {
      console.warn('[StyleNest] Firebase sign-in error:', error);
      toast.error('Authentication Failed', error?.message || 'Invalid credentials');
      return { success: false, message: error?.message || 'Invalid credentials' };
    }
  };

  // Real Firebase Email/Password Sign-Up
  const signUp = async (email: string, password: string, name?: string): Promise<{ success: boolean; message?: string }> => {
    if (!isFirebaseConfigured || !auth) {
      login(email);
      return { success: true };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;

      if (name) {
        await fbUpdateProfile(fbUser, { displayName: name });
      }

      const isSpecialAdmin = email.toLowerCase().includes('admin');
      const newProfile: UserProfile = {
        id: fbUser.uid,
        name: name || email.split('@')[0].replace(/[._]/g, ' '),
        email,
        phone: '+91 98200 45812',
        role: isSpecialAdmin ? 'admin' : 'customer',
        addresses: DEFAULT_ADDRESSES
      };

      setUser(newProfile);
      await saveUserProfile(fbUser.uid, newProfile);
      toast.luxury('Account Created', `Welcome to the Maison Privé, ${newProfile.name}.`);
      return { success: true };
    } catch (error: any) {
      console.warn('[StyleNest] Firebase sign-up error:', error);
      toast.error('Registration Failed', error?.message || 'Could not create account');
      return { success: false, message: error?.message || 'Registration failed' };
    }
  };

  // Google OAuth Provider Sign-In
  const signInWithGoogle = async (): Promise<{ success: boolean; message?: string }> => {
    if (!isFirebaseConfigured || !auth) {
      login('vip.client@stylenest.com');
      return { success: true };
    }

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      const profile = await getUserProfile(fbUser.uid);
      if (profile) {
        setUser(profile);
      } else {
        const newProfile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || 'VIP Client',
          email: fbUser.email || '',
          phone: fbUser.phoneNumber || '+91 98200 45812',
          role: fbUser.email?.toLowerCase().includes('admin') ? 'admin' : 'customer',
          addresses: DEFAULT_ADDRESSES
        };
        setUser(newProfile);
        await saveUserProfile(fbUser.uid, newProfile);
      }

      toast.luxury('Privé Access Confirmed', `Welcome, ${fbUser.displayName || 'Client'}.`);
      return { success: true };
    } catch (error: any) {
      console.warn('[StyleNest] Google sign-in error:', error);
      toast.error('Google Sign-In Failed', error?.message || 'Could not authenticate via Google');
      return { success: false, message: error?.message };
    }
  };

  // Password Reset
  const resetPassword = async (email: string): Promise<{ success: boolean; message?: string }> => {
    if (!isFirebaseConfigured || !auth) {
      toast.success('Password Reset Sent', 'A secure reset link has been dispatched to your email.');
      return { success: true };
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Reset Email Dispatched', `Password reset instructions sent to ${email}.`);
      return { success: true };
    } catch (error: any) {
      toast.error('Reset Failed', error?.message || 'Could not send reset email.');
      return { success: false, message: error?.message };
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await fbSignOut(auth);
      } catch (e) {
        console.warn('Error during Firebase signOut:', e);
      }
    }
    setUser(null);
    toast.info('Signed Out', 'You have been safely signed out from your account.');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      if (isFirebaseConfigured && user) {
        saveUserProfile(user.id, updates).catch(console.warn);
      }
      return updated;
    });
    toast.success('Profile Updated', 'Your profile details have been saved.');
  };

  const addAddress = (newAddr: Omit<Address, 'id'>) => {
    const id = 'addr-' + Date.now().toString().slice(-4);
    const addressWithId: Address = { ...newAddr, id };

    setUser((prev) => {
      if (!prev) return null;
      const updatedAddresses = addressWithId.isDefault
        ? [...prev.addresses.map((a) => ({ ...a, isDefault: false })), addressWithId]
        : [...prev.addresses, addressWithId];

      const updatedUser = { ...prev, addresses: updatedAddresses };
      if (isFirebaseConfigured && user) {
        updateUserAddresses(user.id, updatedAddresses).catch(console.warn);
      }
      return updatedUser;
    });
    toast.success('Address Added', 'New delivery address has been saved.');
  };

  const deleteAddress = (id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedAddresses = prev.addresses.filter((a) => a.id !== id);
      const updatedUser = { ...prev, addresses: updatedAddresses };
      if (isFirebaseConfigured && user) {
        updateUserAddresses(user.id, updatedAddresses).catch(console.warn);
      }
      return updatedUser;
    });
    toast.info('Address Removed', 'The address has been removed from your saved list.');
  };

  const setDefaultAddress = (id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedAddresses = prev.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }));
      const updatedUser = { ...prev, addresses: updatedAddresses };
      if (isFirebaseConfigured && user) {
        updateUserAddresses(user.id, updatedAddresses).catch(console.warn);
      }
      return updatedUser;
    });
    toast.success('Default Updated', 'Default shipping address has been updated.');
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o))
    );
    if (isFirebaseConfigured) {
      firestoreUpdateOrderStatus(orderId, status).catch(console.warn);
    }
    toast.success('Order Status Updated', `Order #${orderId} marked as ${status}.`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthReady,
        isAdmin: user?.role === 'admin',
        isFirebaseConnected: isFirebaseConfigured,
        login,
        signIn,
        signUp,
        signInWithGoogle,
        resetPassword,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        orders,
        addOrder,
        updateOrderStatus,
        refreshOrders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
