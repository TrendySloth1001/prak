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

/**
 * Creates a user profile document in Firestore if one doesn't already exist.
 * This is a non-blocking operation.
 * @param firestore - The Firestore instance.
 * @param user - The Firebase Auth user object.
 */
export function upsertUserProfile(firestore: Firestore, user: User) {
  // const userRef = doc(firestore, `users/${user.uid}`);
  // const userData = {
  //   uid: user.uid,
  //   email: user.email,
  //   displayName: user.displayName,
  //   photoURL: user.photoURL,
  //   createdAt: serverTimestamp(), // Use server timestamp for consistency
  // };

  // // Use setDoc with merge:true to create or update without overwriting
  // setDoc(userRef, userData, { merge: true }).catch((serverError) => {
  //   const permissionError = new FirestorePermissionError({
  //     path: userRef.path,
  //     operation: 'write',
  //     requestResourceData: userData,
  //   });
  //   errorEmitter.emit('permission-error', permissionError);
  // });
}


/**
 * Saves the metadata of an encoded image to a user's collection in Firestore.
 * This is a non-blocking operation.
 * @param firestore - The Firestore instance.
 * @param userId - The ID of the user.
 * @param imageData - The data for the encoded image.
 */
export function saveEncodedImage(firestore: Firestore, userId: string, imageData: Omit<EncodedImage, 'id' | 'encodingDateTime'>) {
    // const imageRef = doc(collection(firestore, `users/${userId}/encodedImages`));

    // const newImageData = {
    //     ...imageData,
    //     id: imageRef.id,
    //     userId: userId,
    //     encodingDateTime: serverTimestamp()
    // };

    // setDoc(imageRef, newImageData)
    //     .catch((serverError) => {
    //         const permissionError = new FirestorePermissionError({
    //             path: imageRef.path,
    //             operation: 'create',
    //             requestResourceData: newImageData,
    //         });
    //         errorEmitter.emit('permission-error', permissionError);
    //     });
}
