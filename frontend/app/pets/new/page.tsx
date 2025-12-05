/**
 * Página para crear una nueva mascota
 * Requiere autenticación
 */

"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PetForm } from "@/components/PetForm";

export default function NewPetPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Publicar Nueva Mascota
            </h1>
            <p className="text-gray-600">
              Completa el formulario para publicar una mascota en adopción
            </p>
          </div>

          <div className="card">
            <PetForm />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

