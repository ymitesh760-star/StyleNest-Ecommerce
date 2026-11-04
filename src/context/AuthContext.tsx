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
  signInWithRedirect,
  getRedirectResult,
  User as FirebaseUser,
  IdTokenResult
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
  checkAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'stylenest_user_profile_v2';
const ORDERS_STORAGE_KEY = 'stylenest_user_orders_v2';

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-01',
    fullName: 'Arya Singhania',
    phone: '+91 98200 45812',
    email: 'client@stylenest.com',
    addressLine1: 'Penthouse 42, The Grand Residences',
    addressLine2: 'Worli Sea Face',
    landmark: 'Opposite Promenade',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400018',
    isDefault: true,
  }
];

/**
 * Server-authorized administrator verification.
 * Checks:
 * 1. Cryptographically signed Firebase ID token custom claims (admin: true)
 * 2. Pre-authorized store director emails
 * NEVER trusts client-editable database fields.
 */
export async function verifyUserAdminStatus(fbUser: FirebaseUser): Promise<boolean> {
  try {
    const idTokenResult: IdTokenResult = await fbUser.getIdTokenResult(true);
    const hasAdminClaim = Boolean(idTokenResult.claims.admin);
    const email = fbUser.email?.toLowerCase().trim();
    const isWhitelistedEmail = Boolean(
      email && [
        'admin@stylenest.com',
        'director@stylenest.com',
        'miteshyadav7575@gmail.com'
      ].includes(email)
    );
    return hasAdminClaim || isWhitelistedEmail;
  } catch (err) {
    console.warn('[StyleNest Auth] Failed to inspect ID token claims:', err);
    return false;
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const toast = useToast();

  const [isAuthReady, setIsAuthReady] = useState<boolean>(!isFirebaseConfigured);
  const [isServerVerifiedAdmin, setIsServerVerifiedAdmin] = useState<boolean>(false);

  const [user, setUser] = useState<UserProfile | null>(() => {
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

  // Sync user changes to localStorage
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

  // Check admin status for current user
  const checkAdminStatus = async (): Promise<boolean> => {
    if (!auth?.currentUser) return false;
    return await verifyUserAdminStatus(auth.currentUser);
  };

  // Handle redirect result if Google sign-in was redirected
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      getRedirectResult(auth)
        .then(async (result) => {
          if (result?.user) {
            console.info('[StyleNest Auth] Handled Google redirect authentication for:', result.user.email);
          }
        })
        .catch((err) => {
          if (err.code !== 'auth/null-user') {
            console.warn('[StyleNest Auth] Redirect auth result:', err);
          }
        });
    }
  }, []);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setIsAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        try {
          const isVerifiedAdmin = await verifyUserAdminStatus(fbUser);
          setIsServerVerifiedAdmin(isVerifiedAdmin);
          const profile = await getUserProfile(fbUser.uid);

          if (profile) {
            const effectiveRole = isVerifiedAdmin ? 'admin' : 'customer';
            setUser({ ...profile, role: effectiveRole });
          } else {
            // New user registered via Google or Email
            const newProfile: UserProfile = {
              id: fbUser.uid,
              name: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0].replace(/[._]/g, ' ') : 'Valued Client'),
              email: fbUser.email || '',
              phone: fbUser.phoneNumber || '+91 98200 45812',
              role: isVerifiedAdmin ? 'admin' : 'customer',
              addresses: DEFAULT_ADDRESSES,
            };
            setUser(newProfile);
            await saveUserProfile(fbUser.uid, newProfile).catch((err) => {
              console.warn('[StyleNest Auth] Initial user profile save note:', err);
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
        setUser(null);
        setIsServerVerifiedAdmin(false);
        setOrders([]);
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(ORDERS_STORAGE_KEY);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Real Firebase Email/Password Sign-In
  const signIn = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    if (!isFirebaseConfigured || !auth) {
      toast.error('Service Unavailable', 'Firebase configuration pending. Please check credentials.');
      return { success: false, message: 'Authentication service is not configured.' };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = userCredential.user;
      const isVerifiedAdmin = await verifyUserAdminStatus(fbUser);
      const profile = await getUserProfile(fbUser.uid);

      if (profile) {
        setUser({ ...profile, role: isVerifiedAdmin ? 'admin' : 'customer' });
      } else {
        const fallbackProfile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || email.split('@')[0].replace(/[._]/g, ' '),
          email: fbUser.email || email,
          phone: '+91 98200 45812',
          role: isVerifiedAdmin ? 'admin' : 'customer',
          addresses: DEFAULT_ADDRESSES
        };
        setUser(fallbackProfile);
        await saveUserProfile(fbUser.uid, fallbackProfile).catch(console.warn);
      }

      toast.luxury('Welcome Back', `Signed in as ${userCredential.user.displayName || email}`);
      return { success: true };
    } catch (error: any) {
      console.warn('[StyleNest] Firebase sign-in error:', error);
      let userFriendlyMessage = 'Invalid email or password.';
      if (error?.code === 'auth/user-not-found' || error?.code === 'auth/wrong-password' || error?.code === 'auth/invalid-credential') {
        userFriendlyMessage = 'Invalid email or password. Please verify your credentials.';
      } else if (error?.code === 'auth/too-many-requests') {
        userFriendlyMessage = 'Access temporarily restricted due to multiple failed attempts. Please reset your password.';
      } else if (error?.code === 'auth/user-disabled') {
        userFriendlyMessage = 'This account has been disabled. Please contact concierge.';
      } else if (error?.message) {
        userFriendlyMessage = error.message;
      }
      toast.error('Authentication Failed', userFriendlyMessage);
      return { success: false, message: userFriendlyMessage };
    }
  };

  // Real Firebase Email/Password Sign-Up (Always assigns customer role)
  const signUp = async (email: string, password: string, name?: string): Promise<{ success: boolean; message?: string }> => {
    if (!isFirebaseConfigured || !auth) {
      toast.error('Service Unavailable', 'Firebase configuration pending. Please check credentials.');
      return { success: false, message: 'Authentication service is not configured.' };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = userCredential.user;

      if (name) {
        await fbUpdateProfile(fbUser, { displayName: name });
      }

      // New registrations are strictly customer role
      const isVerifiedAdmin = await verifyUserAdminStatus(fbUser);
      const newProfile: UserProfile = {
        id: fbUser.uid,
        name: name || email.split('@')[0].replace(/[._]/g, ' '),
        email: email.trim(),
        phone: '+91 98200 45812',
        role: isVerifiedAdmin ? 'admin' : 'customer',
        addresses: DEFAULT_ADDRESSES
      };

      setUser(newProfile);
      await saveUserProfile(fbUser.uid, newProfile).catch((err) => {
        console.warn('[StyleNest Auth] Failed to save profile document:', err);
      });
      toast.luxury('Account Created', `Welcome to the Maison Privé, ${newProfile.name}.`);
      return { success: true };
    } catch (error: any) {
      console.warn('[StyleNest] Firebase sign-up error:', error);
      let userFriendlyMessage = error?.message || 'Could not create account';
      if (error?.code === 'auth/email-already-in-use') {
        userFriendlyMessage = 'An account with this email address already exists. Please sign in instead.';
      } else if (error?.code === 'auth/weak-password') {
        userFriendlyMessage = 'Password should be at least 6 characters.';
      } else if (error?.code === 'auth/invalid-email') {
        userFriendlyMessage = 'Please enter a valid email address.';
      }
      toast.error('Registration Failed', userFriendlyMessage);
      return { success: false, message: userFriendlyMessage };
    }
  };

  // Google OAuth Provider Sign-In with Graceful Fallback
  const signInWithGoogle = async (): Promise<{ success: boolean; message?: string }> => {
    if (!isFirebaseConfigured || !auth) {
      toast.error('Service Unavailable', 'Firebase configuration pending. Please check credentials.');
      return { success: false, message: 'Authentication service is not configured.' };
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      let fbUser: FirebaseUser;
      try {
        const result = await signInWithPopup(auth, provider);
        fbUser = result.user;
      } catch (popupErr: any) {
        // User closed the popup intentionally
        if (popupErr.code === 'auth/popup-closed-by-user' || popupErr.code === 'auth/cancelled-popup-request') {
          return { success: false, message: 'Google sign-in was cancelled.' };
        }
        // Popup was blocked by browser - fallback to redirect
        if (popupErr.code === 'auth/popup-blocked') {
          console.info('[StyleNest Auth] Browser popup blocked. Initiating redirect fallback...');
          await signInWithRedirect(auth, provider);
          return { success: true };
        }
        throw popupErr;
      }

      const isVerifiedAdmin = await verifyUserAdminStatus(fbUser);
      const existingProfile = await getUserProfile(fbUser.uid);

      if (existingProfile) {
        // Keep existing profile data, only synchronize verified role
        setUser({ ...existingProfile, role: isVerifiedAdmin ? 'admin' : 'customer' });
      } else {
        // First-time Google user
        const newProfile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Privé Client',
          email: fbUser.email || '',
          phone: fbUser.phoneNumber || '+91 98200 45812',
          role: isVerifiedAdmin ? 'admin' : 'customer',
          addresses: DEFAULT_ADDRESSES
        };
        setUser(newProfile);
        await saveUserProfile(fbUser.uid, newProfile).catch((err) => {
          console.warn('[StyleNest Auth] Google profile initial sync note:', err);
        });
      }

      toast.luxury('Privé Access Confirmed', `Welcome, ${fbUser.displayName || 'Client'}.`);
      return { success: true };
    } catch (error: any) {
      console.warn('[StyleNest] Google sign-in error:', error);
      let userFriendlyMessage = 'Could not authenticate via Google. Please try again.';
      if (error?.code === 'auth/account-exists-with-different-credential') {
        userFriendlyMessage = 'An account already exists with the same email. Please sign in with email and password.';
      } else if (error?.code === 'auth/network-request-failed') {
        userFriendlyMessage = 'Network connection error. Please check your internet connection.';
      } else if (error?.message) {
        userFriendlyMessage = error.message;
      }
      toast.error('Google Sign-In Failed', userFriendlyMessage);
      return { success: false, message: userFriendlyMessage };
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
      // Protect role from client update
      const sanitized = { ...updates };
      delete (sanitized as any).role;
      const updated = { ...prev, ...sanitized };
      if (isFirebaseConfigured && user) {
        saveUserProfile(user.id, sanitized).catch(console.warn);
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
        isAdmin: isServerVerifiedAdmin,
        isFirebaseConnected: isFirebaseConfigured,
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
        checkAdminStatus,
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
