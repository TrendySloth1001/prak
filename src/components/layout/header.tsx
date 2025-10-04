import { LockKeyhole } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-border/80 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <div className="flex items-center gap-3">
          <LockKeyhole className="w-7 h-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground tracking-tight">ImageCloak</h1>
        </div>
      </div>
    </header>
  );
}
