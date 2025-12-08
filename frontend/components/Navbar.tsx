/**
 * Componente Navbar
 * Barra de navegación principal de la aplicación PETZO
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { PawPrint, Menu, X, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { logout } from "@/lib/auth";
import { getUnreadMessages } from "@/lib/services/messages.service";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadUnreadCount();
      // Recargar cada 30 segundos
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadUnreadCount = async () => {
    if (!user) return;
    try {
      const unreadMessages = await getUnreadMessages();
      setUnreadMessagesCount(unreadMessages.length);
    } catch (err) {
      console.error("Error al cargar mensajes no leídos:", err);
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push("/");
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/pets", label: "Mascotas" },
    { href: "/pets/new", label: "Publicar", authRequired: true },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[var(--color-border)] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" onClick={closeMobileMenu}>
            <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-primary)]">
              <PawPrint className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[var(--color-primary)]">
              PETZO
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              if (link.authRequired && !user) return null;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-base font-medium transition-colors duration-200",
                    pathname === link.href
                      ? "text-[var(--color-primary)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link href="/messages" className="relative">
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Mensajes
                  </Button>
                  {unreadMessagesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadMessagesCount > 9 ? "9+" : unreadMessagesCount}
                    </span>
                  )}
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Mi Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "Usuario"} />
                  <AvatarFallback className="bg-[var(--color-primary)] text-white">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--color-border)] py-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                if (link.authRequired && !user) return null;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-base font-medium transition-colors duration-200 py-2",
                      pathname === link.href
                        ? "text-[var(--color-primary)]"
                        : "text-[var(--color-text-secondary)]"
                    )}
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="border-t border-[var(--color-border)] pt-4 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link href="/messages" onClick={closeMobileMenu} className="relative">
                      <Button variant="ghost" size="sm" className="w-full">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Mensajes
                        {unreadMessagesCount > 0 && (
                          <Badge className="ml-2 bg-red-500 text-white">
                            {unreadMessagesCount > 9 ? "9+" : unreadMessagesCount}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                    <Link href="/dashboard" onClick={closeMobileMenu}>
                      <Button variant="ghost" size="sm" className="w-full">
                        Mi Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleLogout();
                        closeMobileMenu();
                      }}
                      className="w-full"
                    >
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={closeMobileMenu}>
                      <Button variant="ghost" size="sm" className="w-full">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={closeMobileMenu}>
                      <Button variant="primary" size="sm" className="w-full">
                        Registrarse
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

