/**
 * Layout principal de la aplicación
 * Envuelve toda la aplicación con el AuthProvider y estilos globales
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PETZO - Adopción de Mascotas",
  description: "Plataforma moderna para la adopción de perros y gatos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

