
'use client';
import { LockKeyhole, LogOut, User as UserIcon, BookOpen, FileCode } from 'lucide-react';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { getAuth, signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signInWithGoogle } from '@/firebase/auth/auth-helpers';
import Link from 'next/link';

function UserProfile() {
  const { user } = useUser();
  const auth = getAuth();

  if (!user) {
    return (
      <Button onClick={signInWithGoogle} variant="outline" className="bg-background/80">
        Login with Google
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.photoURL ?? ''}
              alt={user.displayName ?? 'User'}
            />
            <AvatarFallback>
              {user.displayName?.charAt(0) ?? <UserIcon />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut(auth)}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export default function Header() {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-3">
          <LockKeyhole className="w-7 h-7 text-accent" />
          <h1 className="text-2xl font-bold text-foreground tracking-tight">ImageCloak</h1>
        </Link>
        <nav className="ml-6 hidden md:flex items-center gap-4">
            <Button variant="link" asChild className="text-muted-foreground">
                <Link href="/how-it-works">
                    <BookOpen className="mr-2 h-4 w-4" />
                    How It Works
                </Link>
            </Button>
             <Button variant="link" asChild className="text-muted-foreground">
                <Link href="/documentation">
                    <FileCode className="mr-2 h-4 w-4" />
                    Docs
                </Link>
            </Button>
        </nav>
        <div className="ml-auto">
          <UserProfile />
        </div>
      </div>
    </header>
  );
}
