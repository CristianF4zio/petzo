/**
 * Componente Footer
 * Pie de página de la aplicación
 */

import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-petro-700 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">🐾 PETZO</h3>
            <p className="text-petro-200">
              Plataforma moderna para la adopción de perros y gatos.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-petro-200">
              <li>
                <a href="/pets" className="hover:text-white transition-colors">
                  Ver Mascotas
                </a>
              </li>
              <li>
                <a
                  href="/pets/new"
                  className="hover:text-white transition-colors"
                >
                  Publicar Mascota
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <p className="text-petro-200">
              ¿Tienes preguntas? Contáctanos en{" "}
              <a
                href="mailto:info@petzo.com"
                className="hover:text-white transition-colors"
              >
                info@petzo.com
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-petro-600 mt-8 pt-8 text-center text-petro-200">
          <p>&copy; {new Date().getFullYear()} PETZO. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

