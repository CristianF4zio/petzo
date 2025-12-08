/**
 * Página para crear una nueva mascota
 * Requiere autenticación
 */

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PetForm } from "@/components/PetForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewPetPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/dashboard");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[var(--color-background)]">
        <Navbar />

        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] mb-3">
              Publicar Nueva Mascota
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)]">
              Ayuda a una mascota a encontrar un hogar lleno de amor
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Información de la Mascota</CardTitle>
            </CardHeader>
            <CardContent>
              <PetForm onSuccess={handleSuccess} />
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
