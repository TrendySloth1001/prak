
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ClientFooter() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-6 border-t border-border/50">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
        <p>
            {currentYear && `© ${currentYear} ImageCloak. All Rights Reserved.`}
        </p>
        <nav className="flex gap-4 mt-4 sm:mt-0">
            <Link href="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
        </nav>
      </div>
    </footer>
  );
}
