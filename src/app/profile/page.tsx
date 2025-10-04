
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/layout/header';
import { ClientFooter } from '@/components/layout/footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User as UserIcon } from 'lucide-react';
import EncodedImageGallery from '@/components/features/encoded-image-gallery';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex items-center space-x-4 mb-8">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-6 w-64" />
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <Skeleton className="h-7 w-56" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Skeleton className="h-40 w-full" />
                    </CardContent>
                </Card>
            </main>
            <ClientFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
            <AvatarFallback className="text-3xl">
              {user.displayName?.charAt(0) ?? <UserIcon />}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <p className="text-lg text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Encoded Images</CardTitle>
          </CardHeader>
          <CardContent>
            <EncodedImageGallery />
          </CardContent>
        </Card>
      </main>
      <ClientFooter />
    </div>
  );
}
