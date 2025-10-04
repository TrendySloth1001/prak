'use client';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export async function signInWithGoogle() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error('Error signing in with Google:', error);
  }
}
