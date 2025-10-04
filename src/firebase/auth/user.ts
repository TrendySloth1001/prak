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
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

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
 * Uploads an image to Firebase Storage and saves its metadata to Firestore.
 * @param firestore - The Firestore instance.
 * @param userId - The ID of the user.
 * @param imageData - The metadata for the encoded image.
 * @param imageFile - The actual image file to upload.
 * @param logCallback - A function to call with progress updates.
 */
export async function saveEncodedImage(
    firestore: Firestore,
    userId: string,
    imageData: Omit<EncodedImage, 'id' | 'encodingDateTime' | 'carrierImageUrl' | 'carrierImageStoragePath'>,
    imageFile: File,
    logCallback: (message: string, status?: 'pending' | 'complete' | 'error') => void
): Promise<void> {
    const storage = getStorage();
    const imageId = doc(collection(firestore, 'tmp')).id; // Generate a unique ID
    const storagePath = `users/${userId}/encodedImages/${imageId}_${imageFile.name}`;
    const storageRef = ref(storage, storagePath);

    try {
        // 1. Upload the image file to Firebase Storage
        logCallback('Uploading image to secure storage...');
        const uploadResult = await uploadBytes(storageRef, imageFile);
        logCallback('Image upload complete.', 'complete');

        // 2. Get the download URL for the uploaded file
        logCallback('Generating permanent image URL...');
        const downloadURL = await getDownloadURL(uploadResult.ref);
        logCallback('URL generated.', 'complete');

        // 3. Prepare the data for Firestore
        const imageRef = doc(firestore, `users/${userId}/encodedImages`, imageId);
        const newImageData: EncodedImage = {
            ...imageData,
            id: imageRef.id,
            userId: userId,
            encodingDateTime: serverTimestamp() as any,
            carrierImageUrl: downloadURL,
            carrierImageStoragePath: storagePath,
        };

        // 4. Save the metadata to Firestore
        logCallback('Saving image metadata to database...');
        await setDoc(imageRef, newImageData);
        logCallback('Metadata saved.', 'complete');

    } catch (error: any) {
        console.error("Error in saveEncodedImage:", error);
        
        const errorMessage = error.code ? `[${error.code}] ${error.message}` : error.message;
        
        // Always log the raw error message to the UI
        logCallback(errorMessage, 'error');

        let permissionError: FirestorePermissionError;

        // Check if it's a storage permission error
        if (error.code && (error.code.includes('storage/unauthorized') || error.code.includes('storage/object-not-found') || error.code.includes('permission-denied'))) {
             permissionError = new FirestorePermissionError({
                path: storagePath,
                operation: 'write', // Representing upload as a 'write' operation
                requestResourceData: { note: `Attempted to upload to Firebase Storage at path: ${storagePath}` },
            });
        } else { // Assume it's a Firestore error
            permissionError = new FirestorePermissionError({
                path: `users/${userId}/encodedImages/${imageId}`,
                operation: 'create',
                requestResourceData: imageData
            });
        }
        
        // Emit the structured error for dev overlay
        errorEmitter.emit('permission-error', permissionError);
        
        // Re-throw the error so the calling component can handle the UI state (e.g., stop loading spinner)
        throw new Error(errorMessage);
    }
}
