/**
 * Página de listado de mascotas
 * Muestra todas las mascotas disponibles con filtros
 */

"use client";

import { useState, useEffect } from "react";
import { PetCard, Pet } from "@/components/PetCard";
import api from "@/lib/api";

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: "" as "" | "dog" | "cat",
    city: "",
  });

  useEffect(() => {
    fetchPets();
  }, [filters]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.type) params.type = filters.type;
      if (filters.city) params.city = filters.city;

      const response = await api.get("/pets", { params });
      
      if (response.data.success) {
        setPets(response.data.data || []);
      } else {
        setError("Error al cargar las mascotas");
      }
    } catch (err: any) {
      console.error("Error al obtener mascotas:", err);
      setError("Error al cargar las mascotas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Mascotas en Adopción
          </h1>
          <p className="text-gray-600">
            Encuentra tu compañero perfecto entre nuestras mascotas disponibles
          </p>
        </div>

        {/* Filtros */}
        <div className="card mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Filtrar por:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value as any })
                }
                className="input-field"
              >
                <option value="">Todos</option>
                <option value="dog">🐕 Perros</option>
                <option value="cat">🐈 Gatos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad
              </label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) =>
                  setFilters({ ...filters, city: e.target.value })
                }
                placeholder="Ej: Madrid, Barcelona..."
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petro-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando mascotas...</p>
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
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🐾</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No se encontraron mascotas
                </h3>
                <p className="text-gray-600">
                  Intenta ajustar los filtros o vuelve más tarde
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-gray-600">
                  Se encontraron {pets.length} mascota{pets.length !== 1 ? "s" : ""}
                </div>
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

