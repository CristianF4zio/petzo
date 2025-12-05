/**
 * Página de listado de mascotas
 * Muestra todas las mascotas disponibles con filtros
 */

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { PetCard } from "@/components/PetCard";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter } from "lucide-react";
import { getAvailablePets, getCities, MockPet } from "@/lib/mockData";

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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de Filtros */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-md)] sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-sm"
                >
                  Limpiar
                </Button>
              </div>

              <div className="space-y-6">
                {/* Tipo */}
                <div>
                  <Label className="mb-3 block">Tipo de mascota</Label>
                  <Select
                    value={filters.species}
                    onValueChange={(value) =>
                      setFilters({ ...filters, species: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="perro">🐕 Perros</SelectItem>
                      <SelectItem value="gato">🐈 Gatos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tamaño */}
                <div>
                  <Label className="mb-3 block">Tamaño</Label>
                  <Select
                    value={filters.size}
                    onValueChange={(value) =>
                      setFilters({ ...filters, size: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pequeño">Pequeño</SelectItem>
                      <SelectItem value="mediano">Mediano</SelectItem>
                      <SelectItem value="grande">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Género */}
                <div>
                  <Label className="mb-3 block">Género</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="male"
                        checked={filters.gender === "macho"}
                        onCheckedChange={(checked) =>
                          setFilters({
                            ...filters,
                            gender: checked ? "macho" : "",
                          })
                        }
                      />
                      <label
                        htmlFor="male"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Macho
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="female"
                        checked={filters.gender === "hembra"}
                        onCheckedChange={(checked) =>
                          setFilters({
                            ...filters,
                            gender: checked ? "hembra" : "",
                          })
                        }
                      />
                      <label
                        htmlFor="female"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Hembra
                      </label>
                    </div>
                  </div>
                </div>

                {/* Ciudad */}
                <div>
                  <Label className="mb-3 block">Ciudad</Label>
                  <Select
                    value={filters.city}
                    onValueChange={(value) =>
                      setFilters({ ...filters, city: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {getCities().map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </aside>

          {/* Grid de Mascotas */}
          <div className="lg:col-span-3">
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
    </div>
  );
}
