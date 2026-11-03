import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const envLocalPath = path.join(rootDir, '.env.local');
const content = fs.readFileSync(envLocalPath, 'utf8');
const env = {};
for (const line of content.split('\n')) {
  const [k, ...v] = line.trim().split('=');
  if (k) env[k.trim()] = v.join('=').trim();
}

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
});

const auth = getAuth(app);
console.log('Testing Firebase Auth connection with API key...');

try {
  // Try signing in with test credentials
  const res = await signInWithEmailAndPassword(auth, 'test@example.com', 'wrongpassword');
  console.log('Sign in success:', res.user.uid);
} catch (err) {
  console.log('Auth response code:', err.code, 'message:', err.message);
}

