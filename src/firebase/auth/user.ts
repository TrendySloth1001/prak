'use client';

import {
  collection,
  doc,
  setDoc,
  Firestore,
  serverTimestamp,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { EncodedImage } from '@/lib/types';
import { getStorage } from 'firebase/storage';

/**
 * Creates a user profile document in Firestore if one doesn't already exist.
 * This is a non-blocking operation.
 * @param firestore - The Firestore instance.
 * @param user - The Firebase Auth user object.
 */
export function upsertUserProfile(firestore: Firestore, user: User) {
  const userRef = doc(firestore, `users/${user.uid}`);
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    createdAt: serverTimestamp(), // Use server timestamp for consistency
  };

  // Use setDoc with merge:true to create or update without overwriting
  setDoc(userRef, userData, { merge: true }).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: userRef.path,
      operation: 'write',
      requestResourceData: userData,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}


/**
 * Saves encoded image metadata to Firestore.
 * Does NOT upload images to Firebase Storage.
 * @param firestore - The Firestore instance.
 * @param userId - The ID of the user.
 * @param imageData - The metadata for the encoded image.
 * @param logCallback - A function to call with progress updates.
 */
export async function saveEncodedImage(
    firestore: Firestore,
    userId: string,
    imageData: Omit<EncodedImage, 'id' | 'encodingDateTime' | 'carrierImageStoragePath'>,
    logCallback: (message: string, status?: 'pending' | 'complete' | 'error') => void
): Promise<void> {
    const imageId = doc(collection(firestore, 'tmp')).id; // Generate a unique ID
    
    try {
        logCallback('Preparing image metadata...');
        const imageRef = doc(firestore, `users/${userId}/encodedImages`, imageId);
        
        const newImageData: EncodedImage = {
            ...imageData,
            id: imageRef.id,
            userId: userId,
            encodingDateTime: serverTimestamp() as any,
            carrierImageStoragePath: '', // No longer storing in Firebase Storage
        };
        logCallback('Metadata prepared.', 'complete');

        // Save the metadata to Firestore
        logCallback('Saving image metadata to database...');
        await setDoc(imageRef, newImageData);
        logCallback('Metadata saved successfully.', 'complete');

    } catch (error: any) {
        console.error("Error in saveEncodedImage:", error);
        
        const errorMessage = error.code ? `[${error.code}] ${error.message}` : error.message;
        
        // Always log the raw error message to the UI
        logCallback(errorMessage, 'error');

        const permissionError = new FirestorePermissionError({
            path: `users/${userId}/encodedImages/${imageId}`,
            operation: 'create',
            requestResourceData: imageData
        });
        
        // Emit the structured error for dev overlay
        errorEmitter.emit('permission-error', permissionError);
        
        // Re-throw the error so the calling component can handle the UI state (e.g., stop loading spinner)
        throw new Error(errorMessage);
    }
}
