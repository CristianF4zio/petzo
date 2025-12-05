/**
 * Componente Footer
 * Pie de página de la aplicación PETZO
 */

import React from "react";
import Link from "next/link";
import { PawPrint, Facebook, Instagram, Twitter, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-auto bg-gradient-to-r from-[var(--color-primary)] to-[#ff8787]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-white">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] bg-white/20 backdrop-blur-sm">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">PETZO</span>
            </div>
            <p className="text-white/90 leading-relaxed">
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
                  className="text-white/90 hover:text-white transition-colors duration-200"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/pets"
                  className="text-white/90 hover:text-white transition-colors duration-200"
                >
                  Ver Mascotas
                </Link>
              </li>
              <li>
                <Link
                  href="/pets/new"
                  className="text-white/90 hover:text-white transition-colors duration-200"
                >
                  Publicar Mascota
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-white/90 hover:text-white transition-colors duration-200"
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
                  className="text-white/90 hover:text-white transition-colors duration-200"
                >
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/90 hover:text-white transition-colors duration-200"
                >
                  Términos de Servicio
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/90 hover:text-white transition-colors duration-200"
                >
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@petzo.com"
                  className="text-white/90 hover:text-white transition-colors duration-200"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Conéctate */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Conéctate</h4>
            <p className="text-white/90 mb-4">
              Síguenos en redes sociales para mantenerte actualizado
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@petzo.com"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/90">
            &copy; {new Date().getFullYear()} PETZO. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

