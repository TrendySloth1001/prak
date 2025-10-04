
'use client';

import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { FileQuestion, Image as ImageIcon, Loader2, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import Image from 'next/image';
import { Button } from '../ui/button';
import { formatDistanceToNow } from 'date-fns';
import type { EncodedImage } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';


function EncodedImageCard({ image }: { image: EncodedImage }) {
    const formattedDate = image.encodingDateTime ? formatDistanceToNow(image.encodingDateTime.toDate(), { addSuffix: true }) : 'a moment ago';

    return (
        <Card className="flex flex-col">
            <CardHeader className="p-0">
                <div className="aspect-video relative w-full bg-muted">
                   {image.carrierImageUrl ? (
                        <Image src={image.carrierImageUrl} alt={image.carrierImageDescription} fill className="object-cover rounded-t-lg" />
                   ) : (
                        <div className="flex items-center justify-center h-full">
                            <ImageIcon className="h-10 w-10 text-muted-foreground" />
                        </div>
                   )}
                </div>
            </CardHeader>
            <CardContent className="flex-grow p-4">
                <CardTitle className="text-base leading-snug truncate" title={image.carrierImageDescription}>{image.carrierImageDescription}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">{formattedDate}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                 <Button asChild variant="secondary" size="sm" className="w-full">
                    <a href={image.carrierImageUrl} target="_blank" download>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </a>
                 </Button>
            </CardFooter>
        </Card>
    )
}


export default function EncodedImageGallery() {
    const { user, firestore } = useFirebase();

    const imagesQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(
            collection(firestore, `users/${user.uid}/encodedImages`),
            orderBy('encodingDateTime', 'desc')
        );
    }, [user, firestore]);
    
    const { data: images, isLoading } = useCollection<EncodedImage>(imagesQuery);

    if (isLoading) {
        return (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                             <Skeleton className="h-32 w-full" />
                        </CardHeader>
                        <CardContent className="p-4">
                             <Skeleton className="h-5 w-3/4 mb-2" />
                             <Skeleton className="h-4 w-1/2" />
                        </CardContent>
                         <CardFooter className="p-4">
                            <Skeleton className="h-9 w-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )
    }

    if (!images || images.length === 0) {
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


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
                <EncodedImageCard key={image.id} image={image} />
            ))}
        </div>
    );
}
