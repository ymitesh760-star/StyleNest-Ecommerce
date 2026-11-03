import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

/**
 * StyleNest Firebase Configuration
 * Target Project ID: stylenest-65f02
 * Values are retrieved strictly from Vite environment variables (.env).
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'stylenest-65f02',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/**
 * Check which environment variables are missing from .env
 */
export function getMissingFirebaseEnvVars(): string[] {
  const missing: string[] = [];
  if (!import.meta.env.VITE_FIREBASE_API_KEY) missing.push('VITE_FIREBASE_API_KEY');
  if (!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) missing.push('VITE_FIREBASE_AUTH_DOMAIN');
  if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) missing.push('VITE_FIREBASE_PROJECT_ID');
  if (!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) missing.push('VITE_FIREBASE_STORAGE_BUCKET');
  if (!import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) missing.push('VITE_FIREBASE_MESSAGING_SENDER_ID');
  if (!import.meta.env.VITE_FIREBASE_APP_ID) missing.push('VITE_FIREBASE_APP_ID');
  return missing;
}

// True only when all essential credentials are provided and not dummy placeholders
export const isFirebaseConfigured: boolean = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.appId &&
  firebaseConfig.apiKey !== 'your_firebase_api_key' &&
  !firebaseConfig.apiKey.includes('placeholder')
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.info(`[StyleNest] Successfully initialized Firebase instance for project: ${firebaseConfig.projectId}`);
  } catch (error) {
    console.warn('[StyleNest] Failed to initialize Firebase SDK instance:', error);
    app = null;
    auth = null;
    db = null;
    storage = null;
  }
} else {
  const missing = getMissingFirebaseEnvVars();
  if (missing.length > 0) {
    console.info(
      `[StyleNest] Firebase environment variables pending in .env: ${missing.join(', ')}. Running with luxury local state persistence until credentials are supplied.`
    );
  }
}

export { app, auth, db, storage, firebaseConfig };
export default app;
