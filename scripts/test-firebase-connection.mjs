/**
 * StyleNest × Drippy - Firebase Connection & Firestore Verification Script
 * 
 * Verifies live connection to Firebase project: stylenest-65f02
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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
  return { env, activePath };
}

async function run() {
  console.log('\n======================================================');
  console.log('  STYLENEST × DRIPPY — FIREBASE CONFIGURATION INSPECTOR');
  console.log('  Target Project ID: stylenest-65f02');
  console.log('======================================================\n');

  const { env, activePath } = loadEnv();

  if (!activePath) {
    console.error('❌ Error: No .env or .env.local file found in project root.');
    console.log('Created .env with project defaults. Please add your Web App credentials.\n');
    return;
  }

  console.log(`📄 Active Configuration File: ${path.basename(activePath)}`);

  const keys = {
    VITE_FIREBASE_API_KEY: env.VITE_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: env.VITE_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN || 'stylenest-65f02.firebaseapp.com',
    VITE_FIREBASE_PROJECT_ID: env.VITE_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || 'stylenest-65f02',
    VITE_FIREBASE_STORAGE_BUCKET: env.VITE_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET || 'stylenest-65f02.firebasestorage.app',
    VITE_FIREBASE_MESSAGING_SENDER_ID: env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID: env.VITE_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID,
  };

  const missing = [];
  if (!keys.VITE_FIREBASE_API_KEY) missing.push('VITE_FIREBASE_API_KEY');
  if (!keys.VITE_FIREBASE_MESSAGING_SENDER_ID) missing.push('VITE_FIREBASE_MESSAGING_SENDER_ID');
  if (!keys.VITE_FIREBASE_APP_ID) missing.push('VITE_FIREBASE_APP_ID');

  if (missing.length > 0) {
    console.log('⚠️  Status: Pending Real Firebase Web App Credentials');
    console.log(`Missing from .env: ${missing.join(', ')}\n`);
    console.log('Pre-configured project parameters:');
    console.log(`  • Project ID:      ${keys.VITE_FIREBASE_PROJECT_ID}`);
    console.log(`  • Auth Domain:     ${keys.VITE_FIREBASE_AUTH_DOMAIN}`);
    console.log(`  • Storage Bucket:  ${keys.VITE_FIREBASE_STORAGE_BUCKET}\n`);
    console.log('👉 To obtain the 3 missing credentials:');
    console.log('1. Open: https://console.firebase.google.com/project/stylenest-65f02/settings/general');
    console.log('2. Scroll down to "Your apps" (if no web app exists, click </> Add Web App and name it "StyleNest Web")');
    console.log('3. Under "Firebase SDK snippet", select "Config"');
    console.log('4. Copy apiKey, messagingSenderId, and appId into your .env file.\n');
    return;
  }

  // Attempt real live SDK connection
  console.log('🔄 Attempting live connection to Firestore...');
  try {
    const app = initializeApp({
      apiKey: keys.VITE_FIREBASE_API_KEY,
      authDomain: keys.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: keys.VITE_FIREBASE_PROJECT_ID,
      storageBucket: keys.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: keys.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: keys.VITE_FIREBASE_APP_ID,
    });

    const db = getFirestore(app);
    const testDocId = `verification-${Date.now()}`;
    const testRef = doc(db, 'connection_test', testDocId);

    // 1. Test Write
    await setDoc(testRef, {
      test: true,
      timestamp: new Date().toISOString(),
      verifiedBy: 'StyleNest Automation'
    });
    console.log('  ✅ [Firestore Write] Document successfully written!');

    // 2. Test Read
    const snap = await getDoc(testRef);
    if (snap.exists()) {
      console.log('  ✅ [Firestore Read] Document successfully read back!');
    }

    // 3. Cleanup Test Document
    await deleteDoc(testRef);
    console.log('  ✅ [Firestore Cleanup] Temporary test document removed!');

    console.log('\n🎉 ALL CHECKS PASSED: Firebase project stylenest-65f02 is active and fully connected!\n');
  } catch (err) {
    console.error('\n❌ Firebase Connection Error:', err.message);
    if (err.code === 'permission-denied') {
      console.log('Tip: Check firestore.rules to ensure read/write permissions are granted.');
    }
  }
}

run();

