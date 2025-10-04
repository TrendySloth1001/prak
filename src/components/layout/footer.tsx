
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ClientFooter() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [builders, setBuilders] = useState<string[]>([]);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    
    const buildersEnv = process.env.NEXT_PUBLIC_BUILDERS;
    if (buildersEnv) {
      setBuilders(buildersEnv.split(',').map(name => name.trim()).filter(Boolean));
    }
  }, []);

  return (
    <footer className="py-6 border-t border-border/50">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
        <p>
            {currentYear && `© ${currentYear} ImageCloak. All Rights Reserved.`}
        </p>
        {builders.length > 0 && (
          <p>
            Built by <span className="font-semibold text-foreground">{builders.join(' & ')}</span>
          </p>
        )}
        <nav className="flex gap-4">
            <Link href="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
             <Link href="/documentation" className="hover:text-foreground transition-colors">Docs</Link>
        </nav>
      </div>
    </footer>
  );
}
