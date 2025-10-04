import Header from '@/components/layout/header';
import ImageCloak from '@/components/features/image-cloak';
import { ClientFooter } from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <ImageCloak />
      </main>
      <ClientFooter />
    </div>
  );
}
