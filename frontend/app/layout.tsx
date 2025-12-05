/**
 * Layout principal de la aplicación
 * Envuelve toda la aplicación con el AuthProvider y estilos globales
 */

"use client";

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "./styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <title>PETZO - Adopción de Mascotas</title>
        <meta
          name="description"
          content="Plataforma moderna para la adopción de perros y gatos"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">{children}</main>
            {!isAuthPage && <Footer />}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

