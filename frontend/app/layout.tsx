/**
 * Layout principal de la aplicación
 * Envuelve toda la aplicación con el AuthProvider y estilos globales
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { LayoutClient } from "./LayoutClient";

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
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <LayoutClient>{children}</LayoutClient>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

