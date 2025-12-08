/**
 * Componente cliente para el layout
 * Maneja la lógica del cliente que requiere hooks
 */

"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">{children}</main>
      {!isAuthPage && <Footer />}
    </div>
  );
}


