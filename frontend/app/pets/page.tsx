/**
 * Página de listado de mascotas
 * Muestra todas las mascotas disponibles
 */

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { PetCard } from "@/components/PetCard";
import { Button } from "@/components/ui/button";
import { getAvailablePets, MockPet } from "@/lib/mockData";

export default function PetsPage() {
  const searchParams = useSearchParams();
  const [filteredPets, setFilteredPets] = useState<MockPet[]>([]);
  const [allPets] = useState<MockPet[]>(getAvailablePets());

  // Filtros
  const [filters, setFilters] = useState({
    species: searchParams.get("species") || "",
    size: "",
    gender: "",
    city: "",
  });

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    let filtered = [...allPets];

    if (filters.species) {
      filtered = filtered.filter((pet) => pet.species === filters.species);
    }
    if (filters.size) {
      filtered = filtered.filter((pet) => pet.size === filters.size);
    }
    if (filters.gender) {
      filtered = filtered.filter((pet) => pet.gender === filters.gender);
    }
    if (filters.city) {
      filtered = filtered.filter(
        (pet) => pet.city.toLowerCase() === filters.city.toLowerCase()
      );
    }

    setFilteredPets(filtered);
  };

  const clearFilters = () => {
    setFilters({
      species: "",
      size: "",
      gender: "",
      city: "",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] mb-3">
            Mascotas en Adopción
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)]">
            Encuentra tu compañero perfecto entre nuestras {allPets.length}{" "}
            mascotas disponibles
          </p>
        </div>

        {/* Grid de Mascotas */}
        <div>
          {/* Resultados Count */}
          <div className="mb-6">
            <p className="text-[var(--color-text-secondary)]">
              {filteredPets.length} mascota
              {filteredPets.length !== 1 ? "s" : ""} encontrada
              {filteredPets.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Grid */}
          {filteredPets.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-md)]">
              <div className="text-6xl mb-4">🐾</div>
              <h3 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
                No se encontraron mascotas
              </h3>
              <p className="text-[var(--color-text-secondary)] mb-6">
                Intenta ajustar los filtros para ver más resultados
              </p>
              <Button onClick={clearFilters}>Limpiar filtros</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPets.map((pet) => (
                <PetCard
                  key={pet.id}
                  id={pet.id}
                  name={pet.name}
                  species={pet.species}
                  breed={pet.breed}
                  age={pet.age}
                  imageUrl={pet.images[0]}
                  location={pet.city}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
