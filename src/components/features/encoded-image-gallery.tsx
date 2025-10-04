
'use client';

import { FileQuestion } from "lucide-react";

export default function EncodedImageGallery() {
    // This is a placeholder component.
    // In the future, we will fetch the user's encoded images from Firestore here.

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-64 bg-muted/50">
            <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Images Yet</h3>
            <p className="text-muted-foreground">
                Once you encode an image, it will appear in your history here.
            </p>
        </div>
    );
}
