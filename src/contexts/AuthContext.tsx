import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  googleAccessToken: string | null;
  signInWithGoogle: () => Promise<User | null>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  googleAccessToken: null,
  signInWithGoogle: async () => null,
  resetPassword: async () => {}
});

export const useAuth = () => useContext(AuthContext);

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      if (usr) {
        if (!isSigningIn) {
          cachedAccessToken = null;
          setGoogleAccessToken(null);
        } else {
           setGoogleAccessToken(cachedAccessToken);
        }
      } else {
        cachedAccessToken = null;
        setGoogleAccessToken(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      isSigningIn = true;
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/calendar');
      try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          cachedAccessToken = credential.accessToken;
          setGoogleAccessToken(cachedAccessToken);
        }
        return result.user;
      } catch (innerErr: any) {
        // If it failed because of scope-related denial or missing auth consent validation, retry with standard scopes!
        console.warn("Google Google Sign-In with Calendar scope failed, retrying with standard profile scope only...", innerErr);
        if (
          innerErr.code === 'auth/unauthorized-domain' || 
          innerErr.code === 'auth/operation-not-allowed' || 
          innerErr.code === 'auth/popup-blocked'
        ) {
          // Pass cross-origin/domain/configuration errors up so the diagnostic helper can catch them!
          throw innerErr;
        }
        
        const standardProvider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, standardProvider);
        return result.user;
      }
    } finally {
      isSigningIn = false;
    }
  };

  const resetPassword = async (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, loading, googleAccessToken, signInWithGoogle, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
