import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let processedApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
if (import.meta.env.VITE_FIREBASE_API_KEY_B64) {
  try { processedApiKey = atob(import.meta.env.VITE_FIREBASE_API_KEY_B64); } catch (e) {}
} else if (processedApiKey && !processedApiKey.startsWith('AIza')) {
  try { processedApiKey = atob(processedApiKey); } catch (e) {}
}

const firebaseConfig = {
  apiKey: processedApiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, import.meta.env.VITE_FIREBASE_DATABASE_ID);
export const auth = getAuth(app);
