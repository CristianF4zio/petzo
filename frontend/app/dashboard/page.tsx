/**
 * Dashboard del usuario
 * Muestra las mascotas publicadas por el usuario autenticado
 */

"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PetCard, Pet } from "@/components/PetCard";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserPets();
    }
  }, [user]);

  const fetchUserPets = async () => {
    try {
      setLoading(true);
      const response = await api.get("/pets", {
        params: { ownerId: user?.uid },
      });

      if (response.data.success) {
        setPets(response.data.data || []);
      } else {
        setError("Error al cargar tus mascotas");
      }
    } catch (err: any) {
      console.error("Error al obtener mascotas del usuario:", err);
      setError("Error al cargar tus mascotas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Mi Dashboard
            </h1>
            <p className="text-gray-600">
              Gestiona las mascotas que has publicado
            </p>
          </div>
          <Link href="/pets/new" className="btn-primary">
            + Publicar Nueva Mascota
          </Link>
        </div>

        {/* Información del usuario */}
        {user && (
          <div className="card mb-8 bg-gradient-to-r from-petro-500 to-petro-600 text-white">
            <div className="flex items-center space-x-4">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "Usuario"}
                  className="h-16 w-16 rounded-full border-2 border-white"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-white text-petro-600 flex items-center justify-center text-2xl font-bold">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">
                  {user.displayName || "Usuario"}
                </h2>
                <p className="text-petro-100">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-petro-600 mb-2">
              {pets.length}
            </div>
            <div className="text-gray-600">
              Mascota{pets.length !== 1 ? "s" : ""} Publicada{pets.length !== 1 ? "s" : ""}
            </div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-mint-600 mb-2">
              {pets.filter((p) => p.type === "dog").length}
            </div>
            <div className="text-gray-600">Perros</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-mint-600 mb-2">
              {pets.filter((p) => p.type === "cat").length}
            </div>
            <div className="text-gray-600">Gatos</div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petro-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando tus mascotas...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Lista de mascotas */}
        {!loading && !error && (
          <>
            {pets.length === 0 ? (
              <div className="card text-center py-12">
                <div className="text-6xl mb-4">🐾</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Aún no has publicado ninguna mascota
                </h3>
                <p className="text-gray-600 mb-6">
                  Comienza compartiendo una mascota que necesite un hogar
                </p>
                <Link href="/pets/new" className="btn-primary">
                  Publicar Mi Primera Mascota
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Tus Mascotas Publicadas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pets.map((pet) => (
                    <PetCard key={pet.id} pet={pet} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

