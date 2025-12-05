/**
 * Componente Navbar
 * Barra de navegación principal de la aplicación
 */

"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { logout } from "@/lib/auth";

export const Navbar = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push("/");
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-petro-500">
              🐾 PETZO
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/pets"
              className="text-gray-700 hover:text-petro-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Mascotas
            </Link>

            {user ? (
              <>
                <Link
                  href="/pets/new"
                  className="text-gray-700 hover:text-petro-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Publicar Mascota
                </Link>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-petro-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Mi Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-outline text-sm"
                >
                  Cerrar Sesión
                </button>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Usuario"}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-petro-500 flex items-center justify-center text-white text-sm">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-petro-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

