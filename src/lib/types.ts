
import type { Timestamp } from 'firebase/firestore';

export type EncodedImage = {
    id: string;
    userId: string;
    carrierImageDescription: string;
    carrierImageUrl: string; 
    carrierImageStoragePath: string;
    encodingDateTime: Timestamp;
    encryptionKey: string; 
    watermark?: string;
    algorithm?: string;
};

    
