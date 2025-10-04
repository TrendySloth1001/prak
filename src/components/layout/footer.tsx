"use client";
import { useEffect, useState } from "react";

export function ClientFooter() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-4">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        {currentYear && `© ${currentYear} ImageCloak. All Rights Reserved.`}
      </div>
    </footer>
  );
}
