/**
 * Componente Footer
 * Pie de página de la aplicación PETZO
 */

import React from "react";
import Link from "next/link";
import { PawPrint, Facebook, Instagram, Twitter, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-auto bg-gradient-to-r from-[var(--color-surface)] to-[var(--color-background)] border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-[var(--color-text-primary)]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-primary)]/20 backdrop-blur-sm">
                <PawPrint className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <span className="text-2xl font-bold text-[var(--color-text-primary)]">PETZO</span>
            </div>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              Conectando mascotas con familias amorosas. Tu nuevo mejor amigo te
              está esperando.
            </p>
          </div>

          {/* Explora */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Explora</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/pets"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200"
                >
                  Ver Mascotas
                </Link>
              </li>
              <li>
                <Link
                  href="/pets/new"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200"
                >
                  Publicar Mascota
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200"
                >
                  Mi Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Soporte</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200"
                >
                  Términos de Servicio
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200"
                >
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@petzo.com"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Conéctate */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Conéctate</h4>
            <p className="text-[var(--color-text-secondary)] mb-4">
              Síguenos en redes sociales para mantenerte actualizado
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)] hover:scale-110 hover:shadow-lg transition-all duration-200 group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@petzo.com"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[var(--color-border)] mt-8 pt-8 text-center">
          <p className="text-[var(--color-text-secondary)]">
            &copy; {new Date().getFullYear()} PETZO. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

