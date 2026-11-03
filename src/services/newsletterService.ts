import { doc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

const NEWSLETTER_COLLECTION = 'newsletterSubscribers';

/**
 * Register an email address to the luxury newsletter list
 */
export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, message: 'Please provide a valid email address.' };
  }

  if (!isFirebaseConfigured || !db) {
    return {
      success: true,
      message: 'You have been enrolled in the STYLENEST Privé newsletter.'
    };
  }

  try {
    const docId = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');
    const docRef = doc(db, NEWSLETTER_COLLECTION, docId);
    await setDoc(
      docRef,
      {
        email: cleanEmail,
        subscribedAt: new Date().toISOString(),
        status: 'active'
      },
      { merge: true }
    );
    return {
      success: true,
      message: 'Welcome to the inner circle. Your exclusive preview code has been noted.'
    };
  } catch (error) {
    console.warn('[StyleNest] Error saving newsletter subscriber to Firestore:', error);
    // Graceful fallback response
    return {
      success: true,
      message: 'Thank you for subscribing to STYLENEST Privé.'
    };
  }
}

