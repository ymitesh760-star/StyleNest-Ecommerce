# STYLENEST — Luxury Fashion, Footwear & Haute Parfumerie

A modern, responsive, high-performance luxury fashion e-commerce platform built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Firebase** (Authentication & Cloud Firestore).

- **Brand**: STYLENEST (`stylenest.com`)
- **Firebase Project ID**: `stylenest-65f02`

---

## 🏛️ Brand & Visual Identity

- **Aesthetic**: Refined quiet luxury with deep charcoal (`#151515`), warm ivory (`#F8F6F2`), soft beige (`#D0B18A`), and muted gold accents (`#B89A70`).
- **Typography**: Editorial serif headings with modern clean sans-serif controls and descriptions.
- **Logo System**: Custom architectural interlocking `SN` monogram with micro-sparkle detail, supporting horizontal, stacked, and monogram-only layouts.
- **Micro-Interactions**: Smooth image cross-fades, Lightbox zoom gallery with keyboard navigation and touch swipe, free shipping meter, slide-out bag drawer, and celebratory confetti.

---

## 🔥 Firebase Backend Architecture

The project connects to **Firebase** (Project ID: `stylenest-65f02`) through clean, decoupled modular services located in `src/services/` and initialized safely in `src/lib/firebase.ts`:

1. **Authentication (`src/context/AuthContext.tsx`)**:
   - Real Firebase Email/Password Sign-Up & Sign-In (`createUserWithEmailAndPassword`, `signInWithEmailAndPassword`).
   - Secure Password Reset link dispatch (`sendPasswordResetEmail`).
   - Google OAuth provider support (`GoogleAuthProvider`, `signInWithPopup`).
   - Safe session recovery via `onAuthStateChanged`.
   - Built-in graceful degradation: when running without `.env` credentials, the application functions in local demo mode with 1-click test profiles.

2. **Cloud Firestore Services**:
   - `src/services/productService.ts`: Real-time catalog retrieval from `products` collection, admin product creation, modification, deletion, and one-click database seeding (`seedProductsToFirestore`).
   - `src/services/userService.ts`: User profile management, address book persistence in `users/{userId}`.
   - `src/services/cartService.ts`: Cross-device cart persistence in `carts/{userId}`.
   - `src/services/wishlistService.ts`: Cross-device wishlist synchronization in `wishlists/{userId}`.
   - `src/services/orderService.ts`: Real-time order creation (`orders/{orderId}`), order status tracking (`Placed`, `Processing`, `Shipped`, `Out for Delivery`, `Delivered`, `Cancelled`).
   - `src/services/newsletterService.ts`: Privé client circle email subscriptions in `newsletterSubscribers/{email}`.

3. **Security Rules (`firestore.rules`)**:
   - Hardened production rules strictly adhering to the principle of least privilege.
   - Zero unrestricted (`allow read, write: if true`) rules.
   - Schema validation functions for all collections.
   - User document isolation and privilege escalation prevention.
   - Non-deletable order audit history.

---

## 🚀 Step-by-Step Setup Guide

### 1. Enable Email/Password Authentication in Firebase Console

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: **`stylenest-65f02`**.
3. In the left navigation menu, go to **Build** > **Authentication**.
4. Click **Get Started** (if not already initiated).
5. In the **Sign-in method** tab, click on **Email/Password**.
6. Toggle **Enable** to ON for *Email/Password*.
7. (Optional) Enable *Email link (passwordless sign-in)* if desired.
8. Click **Save**.
9. (Optional) In the same tab, add **Google** as an additional sign-in provider by providing your project support email.

---

### 2. Create the Cloud Firestore Database

1. In the Firebase Console, go to **Build** > **Firestore Database**.
2. Click **Create database**.
3. Choose your database location (e.g., `asia-south1` for Mumbai / India, or `us-central1`).
4. Select **Start in production mode** (your `firestore.rules` will secure it).
5. Click **Create**.
6. To deploy the security rules:
   - Install the Firebase CLI if you haven't: `npm install -g firebase-tools`
   - Sign in: `firebase login`
   - Select your project: `firebase use stylenest-65f02`
   - Deploy rules: `firebase deploy --only firestore:rules`
   - Alternatively, copy the exact contents of `firestore.rules` from this repository into the **Rules** tab of your Firestore Database in the Firebase Console and click **Publish**.

---

### 3. Configure Local Environment Variables

Create a `.env` or `.env.local` file in the project root:

```bash
cp .env.example .env
```

Retrieve your web app credentials from:
**Firebase Console** > **Project Settings** (gear icon) > **General** > **Your apps** > Select or add Web app (`</>`).

Fill in the keys:

```env
VITE_FIREBASE_API_KEY=AIzaSy...your_actual_api_key...
VITE_FIREBASE_AUTH_DOMAIN=stylenest-65f02.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=stylenest-65f02
VITE_FIREBASE_STORAGE_BUCKET=stylenest-65f02.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=1:your_app_id:web:your_hash
```

---

### 4. Seed the Luxury Catalog into Firestore

1. Start the development server: `npm run dev`
2. Open `http://localhost:5173/account` and authenticate as Store Director, or navigate to `http://localhost:5173/admin`.
3. In the Director Overview header, click **Sync Catalog to Firestore**.
4. All 24 high-fashion creations across Men, Women, Shoes, and Perfumes will be populated directly into your Firestore `products` collection with full descriptions, features, and imagery!

---

### 5. Deploying to Vercel

The project includes an optimized `vercel.json` with single-page application (SPA) rewrites and security headers.

#### Option A: Deploy via GitHub (Recommended)
1. Push your repository to GitHub.
2. Visit [Vercel](https://vercel.com/) and click **Add New** > **Project**.
3. Import your GitHub repository.
4. Framework Preset will auto-detect: **Vite**.
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. In the **Environment Variables** section, add all your `VITE_FIREBASE_*` variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
8. Click **Deploy**.

#### Option B: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
# When prompted, select default settings.
# Add your environment variables in the project dashboard or via:
vercel env add VITE_FIREBASE_API_KEY
vercel --prod
```

---

## 🛠️ Tech Stack & Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Launch local Vite development server (`http://localhost:5173`) |
| `npm run build` | Type-check with `tsc -b` and produce optimized production bundle in `dist/` |
| `npm run preview` | Preview production build locally |

- **Framework**: React 18, TypeScript 5, Vite 6
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Cloud Backend**: Firebase 13 (Auth, Firestore)
- **Deployment**: Vercel (`vercel.json`) / Netlify (`public/_redirects`) / Firebase Hosting (`firebase.json`)
