/**
 * StyleNest Store Director Custom Claim Assignment Script
 *
 * Usage:
 *   node scripts/set-admin-claim.mjs <user-email-or-uid>
 *
 * Requirements:
 *   1. Download Service Account Key from Firebase Console:
 *      Project Settings -> Service accounts -> Generate new private key
 *   2. Save the downloaded JSON as serviceAccountKey.json in the project root
 *      (or set GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json)
 *   3. Run: node scripts/set-admin-claim.mjs director@stylenest.com
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const targetIdentifier = process.argv[2];

console.log('===========================================================');
console.log('  STYLENEST × DRIPPY — STORE DIRECTOR CLAIM PROVISIONING');
console.log('===========================================================\n');

if (!targetIdentifier) {
  console.error('❌ Error: Missing user identifier (email or UID).');
  console.log('\nUsage:');
  console.log('  node scripts/set-admin-claim.mjs <user-email-or-uid>\n');
  console.log('Examples:');
  console.log('  node scripts/set-admin-claim.mjs director@stylenest.com');
  console.log('  node scripts/set-admin-claim.mjs miteshyadav7575@gmail.com\n');
  process.exit(1);
}

// Locate service account key
const defaultKeyPath = path.join(rootDir, 'serviceAccountKey.json');
const envKeyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const keyPath = envKeyPath || (fs.existsSync(defaultKeyPath) ? defaultKeyPath : null);

if (!keyPath || !fs.existsSync(keyPath)) {
  console.error('⚠️  Firebase Admin Service Account Key Not Found!\n');
  console.log('To set cryptographically verified { admin: true } claims:');
  console.log('1. Go to Firebase Console -> https://console.firebase.google.com/project/stylenest-65f02/settings/serviceaccounts/adminsdk');
  console.log('2. Click "Generate new private key" and download the JSON file.');
  console.log('3. Save it as "serviceAccountKey.json" in this project directory.');
  console.log('   (Note: serviceAccountKey.json is strictly protected in .gitignore)');
  console.log('4. Re-run: node scripts/set-admin-claim.mjs ' + targetIdentifier + '\n');
  console.log('-----------------------------------------------------------');
  console.log('NOTE: Store Director access is also immediately granted for');
  console.log('corporate authorized director emails in firestore.rules and AuthContext:');
  console.log('  - admin@stylenest.com');
  console.log('  - director@stylenest.com');
  console.log('  - miteshyadav7575@gmail.com\n');
  process.exit(1);
}

// Dynamically load firebase-admin
let admin;
try {
  admin = (await import('firebase-admin')).default;
} catch (err) {
  console.error('⚠️  firebase-admin package is not installed.\n');
  console.log('To provision custom claims from your terminal, run:');
  console.log('  npx firebase-admin --help  OR  npm install -D firebase-admin');
  console.log('Then rerun this script.\n');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'stylenest-65f02'
  });
}

async function run() {
  try {
    let user;
    if (targetIdentifier.includes('@')) {
      user = await admin.auth().getUserByEmail(targetIdentifier.trim());
    } else {
      user = await admin.auth().getUser(targetIdentifier.trim());
    }

    console.log(`Found Firebase user: ${user.email} (${user.uid})`);
    console.log('Current claims:', user.customClaims || {});

    // Set custom claim { admin: true }
    await admin.auth().setCustomUserClaims(user.uid, {
      ...user.customClaims,
      admin: true
    });

    const updatedUser = await admin.auth().getUser(user.uid);
    console.log('\n🎉 SUCCESS! Custom claim updated.');
    console.log(`User: ${updatedUser.email}`);
    console.log('New custom claims:', updatedUser.customClaims);
    console.log('\nStore Director authorization is now permanently active for this user.');
    console.log('On their next token refresh or login, they will have full administrative access.');
  } catch (error) {
    console.error('\n❌ Operation failed:', error.message);
    process.exit(1);
  }
}

run();

