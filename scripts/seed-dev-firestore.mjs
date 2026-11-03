/**
 * StyleNest Luxury Fashion - Development Firestore Catalog Seed Script
 * 
 * Target Firebase Project ID: stylenest-65f02
 * Target Collection: products
 * 
 * Safety & Idempotency:
 * - Uses fixed, deterministic document IDs (e.g., 'men-01', 'women-01', 'shoe-01', 'perfume-01').
 * - Can be executed repeatedly without generating duplicate documents or orphaned records.
 * - Does not run automatically on app boot; only runs when explicitly invoked.
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, writeBatch } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Read environment variables from .env if present
function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  const envLocalPath = path.join(rootDir, '.env.local');
  const activePath = fs.existsSync(envPath) ? envPath : fs.existsSync(envLocalPath) ? envLocalPath : null;

  const env = {};
  if (activePath) {
    const content = fs.readFileSync(activePath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...rest] = trimmed.split('=');
      if (key && rest.length > 0) {
        env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  }
  return env;
}

const env = loadEnv();

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN || 'stylenest-65f02.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || 'stylenest-65f02',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET || 'stylenest-65f02.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
  console.error('\x1b[31m[StyleNest Error]\x1b[0m Missing VITE_FIREBASE_API_KEY in .env.');
  console.error('Please configure your .env file with your Firebase web app keys before running the seed script.');
  console.error('Reference .env.example for required variable names.');
  process.exit(1);
}

// 2. Initialize Firebase
const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. Import PRODUCTS from data file
async function seedCatalog() {
  console.log(`\x1b[36m[StyleNest]\x1b[0m Initializing safe Firestore catalog seed for project: ${firebaseConfig.projectId}...`);

  // Read products data from products.ts
  const productsTsPath = path.join(rootDir, 'src', 'data', 'products.ts');
  const code = fs.readFileSync(productsTsPath, 'utf8');

  // Extract products array using regex or node eval of json-like section
  const match = code.match(/export const PRODUCTS: Product\[\] = (\[[\s\S]*?\n\]);/);
  if (!match) {
    console.error('\x1b[31m[StyleNest Error]\x1b[0m Could not parse PRODUCTS from src/data/products.ts');
    process.exit(1);
  }

  // Parse products
  let products;
  try {
    // Clean comments and trailing commas to parse safely
    const jsonStr = match[1]
      .replace(/\/\/.*$/gm, '')
      .replace(/,(\s*[\]}])/g, '$1');
    products = eval(`(${jsonStr})`);
  } catch (err) {
    console.error('\x1b[31m[StyleNest Error]\x1b[0m Failed to evaluate products structure:', err);
    process.exit(1);
  }

  console.log(`\x1b[36m[StyleNest]\x1b[0m Found ${products.length} catalog items to seed into collection 'products'.`);

  // Batch commit to Firestore
  const batch = writeBatch(db);
  for (const item of products) {
    const docRef = doc(db, 'products', item.id);
    batch.set(docRef, {
      ...item,
      seededAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log(`  ✓ Prepared: [${item.id}] ${item.name} (₹${item.price.toLocaleString('en-IN')})`);
  }

  await batch.commit();

  console.log(`\x1b[32m[StyleNest Success]\x1b[0m Successfully committed ${products.length} products to Firestore 'products' collection!`);
  console.log(`Project: ${firebaseConfig.projectId}`);
  console.log('Each product has a deterministic ID ensuring no duplicates on subsequent runs.');
  process.exit(0);
}

seedCatalog().catch((err) => {
  console.error('\x1b[31m[StyleNest Error]\x1b[0m Seeding failed:', err);
  process.exit(1);
});

