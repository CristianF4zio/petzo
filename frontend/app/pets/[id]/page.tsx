/**
 * Página de detalle de una mascota
 * Muestra información completa de una mascota específica
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Pet } from "@/components/PetCard";

export default function PetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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
        setPet(response.data.data);
      } else {
        setError("Mascota no encontrada");
      }
    } catch (err: any) {
      console.error("Error al obtener mascota:", err);
      if (err.response?.status === 404) {
        setError("Mascota no encontrada");
      } else {
        setError("Error al cargar la información de la mascota");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!pet || !user) return;
    
    if (!confirm("¿Estás seguro de que quieres eliminar esta mascota?")) {
      return;
    }

    try {
      setDeleting(true);
      await api.delete(`/pets/${pet.id}`);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Error al eliminar mascota:", err);
      alert("Error al eliminar la mascota");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petro-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😿</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Mascota no encontrada"}
          </h2>
          <Link href="/pets" className="btn-primary mt-4">
            Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.uid === pet.ownerId;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Botón volver */}
        <Link
          href="/pets"
          className="inline-flex items-center text-petro-600 hover:text-petro-700 mb-6"
        >
          ← Volver al listado
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagen */}
          <div className="card">
            <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-200">
              {pet.photoUrl ? (
                <Image
                  src={pet.photoUrl}
                  alt={pet.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-9xl">
                    {pet.type === "dog" ? "🐕" : "🐈"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Información */}
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {pet.name}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <span className="text-lg">
                      {pet.type === "dog" ? "🐕" : "🐈"}{" "}
                      {pet.type === "dog" ? "Perro" : "Gato"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex items-center">
                  <span className="text-gray-600 w-24">Edad:</span>
                  <span className="font-medium text-gray-900">
                    {pet.age} {pet.age === 1 ? "año" : "años"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-24">Sexo:</span>
                  <span className="font-medium text-gray-900">
                    {pet.sex === "male" ? "Macho" : "Hembra"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-24">Ciudad:</span>
                  <span className="font-medium text-gray-900">
                    📍 {pet.city}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-24">Publicado:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(pet.createdAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Descripción
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {pet.description || "No hay descripción disponible."}
              </p>
            </div>

            {/* Acciones */}
            {isOwner && (
              <div className="card bg-petro-50 border-2 border-petro-200">
                <h3 className="text-lg font-semibold text-petro-900 mb-4">
                  Acciones del propietario
                </h3>
                <div className="flex space-x-4">
                  <Link
                    href={`/pets/${pet.id}/edit`}
                    className="btn-primary"
                  >
                    Editar Mascota
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="btn-outline border-red-500 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deleting ? "Eliminando..." : "Eliminar Mascota"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

