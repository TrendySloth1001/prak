'use client';
import { getAuth, signInWithPopup, GoogleAuthProvider, setPersistence, inMemoryPersistence } from 'firebase/auth';

export async function signInWithGoogle() {
  const auth = getAuth();
  try {
    // Use in-memory persistence for the popup flow to avoid session storage issues.
    await setPersistence(auth, inMemoryPersistence);
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error('Error signing in with Google:', error);
  }
}
