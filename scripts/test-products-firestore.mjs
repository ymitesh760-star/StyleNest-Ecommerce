import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc,
  limit,
  query
} from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function loadEnv() {
  const envLocalPath = path.join(rootDir, '.env.local');
  const envPath = path.join(rootDir, '.env');
  const activePath = fs.existsSync(envLocalPath) ? envLocalPath : fs.existsSync(envPath) ? envPath : null;

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

async function verifyProductsFirestore() {
  console.log('======================================================');
  console.log(' STYLENEST — FIRESTORE PRODUCTS COLLECTION TEST');
  console.log(' Target Project: stylenest-65f02');
  console.log('======================================================\n');

  const { env, activePath } = loadEnv();
  console.log(`Loaded credentials from: ${path.basename(activePath)}`);

  const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  };

  console.log('Firebase Configuration:');
  console.log(`  • Project ID: ${firebaseConfig.projectId}`);
  console.log(`  • Auth Domain: ${firebaseConfig.authDomain}`);
  console.log(`  • API Key: ${firebaseConfig.apiKey?.slice(0, 10)}...${firebaseConfig.apiKey?.slice(-4)}`);
  console.log(`  • Storage Bucket: ${firebaseConfig.storageBucket}`);
  console.log(`  • App ID: ${firebaseConfig.appId}\n`);

  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // 1. Read test from 'products' collection
    console.log('🔍 [1/3] Testing Firestore Read from "products" collection...');
    const productsRef = collection(db, 'products');
    const q = query(productsRef, limit(5));
    const snapshot = await getDocs(q);
    console.log(`  ✅ Read successful! Retrieved ${snapshot.size} existing product documents.`);
    if (snapshot.size > 0) {
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        console.log(`     - [${docSnap.id}] ${d.name || 'Unnamed'} (₹${d.price || 0})`);
      });
    }

    // 2. Write test in 'products' collection
    console.log('\n✍️  [2/3] Testing Firestore Write to "products" collection...');
    const testProductId = `test-verification-${Date.now()}`;
    const testDocRef = doc(db, 'products', testProductId);
    const testProductData = {
      id: testProductId,
      name: 'Verification Atelier Silk Shirt',
      brand: 'StyleNest',
      category: 'men',
      subcategory: 'Shirts',
      price: 18900,
      inStock: true,
      stockCount: 5,
      images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'],
      description: 'Temporary verification item created to confirm bidirectional Firestore connectivity.',
      createdAt: new Date().toISOString()
    };

    await setDoc(testDocRef, testProductData);
    console.log(`  ✅ Write successful! Document [${testProductId}] created.`);

    // Read back the written document to verify consistency
    const readBackSnap = await getDoc(testDocRef);
    if (readBackSnap.exists()) {
      const readData = readBackSnap.data();
      console.log(`  ✅ Read-back verified! Name: "${readData.name}", Price: ₹${readData.price}`);
    } else {
      throw new Error('Written document could not be retrieved immediately.');
    }

    // 3. Clean up the test document
    console.log('\n🧹 [3/3] Cleaning up temporary test product...');
    await deleteDoc(testDocRef);
    console.log(`  ✅ Cleanup successful! Document [${testProductId}] removed.`);

    console.log('\n======================================================');
    console.log('🎉 FIRESTORE READ & WRITE VERIFICATION COMPLETE: SUCCESS!');
    console.log('======================================================\n');
  } catch (error) {
    console.error('\n❌ Firestore Verification Failed:', error.message);
    if (error.code) {
      console.error(`   Error Code: ${error.code}`);
    }
    process.exit(1);
  }
}

verifyProductsFirestore();

