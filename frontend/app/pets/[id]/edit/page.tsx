/**
 * Página para editar una mascota existente
 * Requiere autenticación y ser el propietario
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PetForm } from "@/components/PetForm";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Pet } from "@/components/PetCard";

export default function EditPetPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchPet(params.id as string);
    }
  }, [params.id]);

  const fetchPet = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/pets/${id}`);
      
      if (response.data.success) {
        const petData = response.data.data;
        
        // Verificar que el usuario sea el propietario
        if (user && user.uid !== petData.ownerId) {
          setError("No tienes permiso para editar esta mascota");
          return;
        }
        
        setPet(petData);
      } else {
        setError("Mascota no encontrada");
      }
    } catch (err: any) {
      console.error("Error al obtener mascota:", err);
      if (err.response?.status === 404) {
        setError("Mascota no encontrada");
      } else if (err.response?.status === 403) {
        setError("No tienes permiso para editar esta mascota");
      } else {
        setError("Error al cargar la información de la mascota");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    router.push(`/pets/${params.id}`);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petro-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !pet) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😿</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {error || "Mascota no encontrada"}
            </h2>
            <div className="flex space-x-4 justify-center mt-4">
              <Link href={`/pets/${params.id}`} className="btn-primary">
                Volver a la mascota
              </Link>
              <Link href="/pets" className="btn-outline">
                Ver todas las mascotas
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Botón volver */}
          <Link
            href={`/pets/${pet.id}`}
            className="inline-flex items-center text-petro-600 hover:text-petro-700 mb-6"
          >
            ← Volver a {pet.name}
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Editar Mascota
            </h1>
            <p className="text-gray-600">
              Modifica la información de {pet.name}
            </p>
          </div>

          <div className="card">
            <PetForm pet={pet} onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

