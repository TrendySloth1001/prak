
import type { Timestamp } from 'firebase/firestore';

export type EncodedImage = {
    id: string;
    userId: string;
    carrierImageDescription: string;
    carrierImagePreview: string; // URL to the image, likely in Firebase Storage
    encodingDateTime: Timestamp;
    encryptionKey: string; // In a real app, this should be a reference to a key, not the key itself
};
