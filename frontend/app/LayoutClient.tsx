/**
 * Componente cliente para el layout
 * Maneja la lógica del cliente que requiere hooks
 */

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className={`flex-grow page-transition ${isTransitioning ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}


