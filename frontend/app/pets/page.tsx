/**
 * Página de listado de mascotas
 * Muestra todas las mascotas disponibles desde el backend
 * Incluye búsqueda, filtros avanzados y paginación
 */

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { PetCard } from "@/components/PetCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getPets, Pet, PetsFilters, PaginatedResponse } from "@/lib/services/pets.service";
import { PetCardGridSkeleton, EmptyState } from "@/components/ui/loading-states";
import { Search as SearchIcon, Heart } from "lucide-react";

export default function PetsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<PetsFilters>({
    type: (searchParams.get("type") as "dog" | "cat") || undefined,
    city: searchParams.get("city") || undefined,
    sex: undefined,
    size: undefined,
    minAge: undefined,
    maxAge: undefined,
  });
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false);

  useEffect(() => {
    loadPets();
  }, [filters, pagination.page]);

  const loadPets = async () => {
    try {
      setLoading(true);
      setError(null);

      const filtersToSend: PetsFilters = {
        ...filters,
        search: searchQuery.trim() || undefined,
      };

      const result: PaginatedResponse<Pet> = await getPets(filtersToSend, {
        page: pagination.page,
        limit: pagination.limit,
      });

      setPets(result.data);
      setPagination({
        ...pagination,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
        hasNext: result.pagination.hasNext,
        hasPrev: result.pagination.hasPrev,
      });
    } catch (err: any) {
      console.error("Error al cargar mascotas:", err);
      setError("Error al cargar las mascotas. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    loadPets();
  };

  const clearFilters = () => {
    setFilters({
      type: undefined,
      city: undefined,
      sex: undefined,
      size: undefined,
      minAge: undefined,
      maxAge: undefined,
    });
    setSearchQuery("");
    setPagination({ ...pagination, page: 1 });
  };

  const applyFilters = () => {
    setFiltersDialogOpen(false);
    setPagination({ ...pagination, page: 1 });
    loadPets();
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined) || searchQuery.trim() !== "";

  // Convertir Pet del backend a formato compatible con PetCard
  const convertPetForCard = (pet: Pet) => {
    const speciesMap: Record<string, "perro" | "gato"> = {
      dog: "perro",
      cat: "gato",
    };

    // Usar la primera imagen de photos si existe, sino photoUrl
    const imageUrl = pet.photos && pet.photos.length > 0 ? pet.photos[0] : pet.photoUrl;

    return {
      id: pet.id,
      name: pet.name,
      species: speciesMap[pet.type] || "perro",
      breed: "",
      age: `${pet.age} ${pet.age === 1 ? "año" : "años"}`,
      imageUrl,
      location: pet.city,
      views: pet.views,
      likes: pet.likes,
    };
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] relative">
      <Navbar />
      
      {/* Sistema de partículas - Muy visible e interactivo */}

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12 space-y-3">
          <h1 className="text-4xl lg:text-6xl font-extrabold text-[var(--color-text-primary)]" style={{ lineHeight: '1.15' }}>
            <span className="bg-gradient-to-r from-[var(--color-text-primary)] via-[var(--color-text-primary)] to-[var(--color-primary)] bg-clip-text text-transparent inline-block" style={{ paddingBottom: '0.15em', lineHeight: '1.2' }}>
              Mascotas en Adopción
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-[var(--color-text-secondary)] font-medium">
            Encuentra tu compañero perfecto
          </p>
        </div>

        {/* Búsqueda y Filtros */}
        <div className="mb-8 space-y-4">
          {/* Barra de búsqueda */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="bone">
              Buscar
            </Button>
            <Dialog open={filtersDialogOpen} onOpenChange={setFiltersDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Filtros de Búsqueda</DialogTitle>
                  <DialogDescription>
                    Ajusta los filtros para encontrar la mascota perfecta
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Tipo</Label>
                    <Select
                      value={filters.type || ""}
                      onValueChange={(value) =>
                        setFilters({ ...filters, type: value as "dog" | "cat" || undefined })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="dog">Perro</SelectItem>
                        <SelectItem value="cat">Gato</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Ciudad</Label>
                    <Input
                      placeholder="Ej: Buenos Aires"
                      value={filters.city || ""}
                      onChange={(e) =>
                        setFilters({ ...filters, city: e.target.value || undefined })
                      }
                    />
                  </div>

                  <div>
                    <Label>Sexo</Label>
                    <Select
                      value={filters.sex || ""}
                      onValueChange={(value) =>
                        setFilters({ ...filters, sex: value as "male" | "female" || undefined })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="male">Macho</SelectItem>
                        <SelectItem value="female">Hembra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Tamaño</Label>
                    <Select
                      value={filters.size || ""}
                      onValueChange={(value) =>
                        setFilters({
                          ...filters,
                          size: value as "small" | "medium" | "large" || undefined,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="small">Pequeño</SelectItem>
                        <SelectItem value="medium">Mediano</SelectItem>
                        <SelectItem value="large">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Edad mínima</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={filters.minAge || ""}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            minAge: e.target.value ? parseInt(e.target.value) : undefined,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Edad máxima</Label>
                      <Input
                        type="number"
                        placeholder="20"
                        value={filters.maxAge || ""}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            maxAge: e.target.value ? parseInt(e.target.value) : undefined,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  {hasActiveFilters && (
                    <Button type="button" variant="outline" onClick={clearFilters}>
                      <X className="w-4 h-4 mr-2" />
                      Limpiar
                    </Button>
                  )}
                  <Button type="button" onClick={applyFilters}>
                    Aplicar Filtros
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </form>

          {/* Filtros activos */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-[var(--color-text-secondary)]">Filtros activos:</span>
              {filters.type && (
                <Badge variant="secondary" className="flex items-center gap-1 hover:bg-[var(--color-primary)]/20 cursor-pointer group">
                  Tipo: {filters.type === "dog" ? "Perro" : "Gato"}
                  <X
                    className="w-3 h-3 cursor-pointer hover:scale-125 transition-transform duration-200 group-hover:text-white"
                    onClick={() => setFilters({ ...filters, type: undefined })}
                  />
                </Badge>
              )}
              {filters.city && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Ciudad: {filters.city}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setFilters({ ...filters, city: undefined })}
                  />
                </Badge>
              )}
              {filters.sex && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Sexo: {filters.sex === "male" ? "Macho" : "Hembra"}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setFilters({ ...filters, sex: undefined })}
                  />
                </Badge>
              )}
              {filters.size && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Tamaño: {filters.size}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setFilters({ ...filters, size: undefined })}
                  />
                </Badge>
              )}
              {(filters.minAge !== undefined || filters.maxAge !== undefined) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Edad: {filters.minAge || 0}-{filters.maxAge || "∞"}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() =>
                      setFilters({ ...filters, minAge: undefined, maxAge: undefined })
                    }
                  />
                </Badge>
              )}
              {searchQuery.trim() && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Búsqueda: {searchQuery}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setSearchQuery("")}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Grid de Mascotas */}
        <div className="page-transition">
          {loading ? (
            <PetCardGridSkeleton count={12} />
          ) : error ? (
            <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] p-8">
              <EmptyState
                icon={SearchIcon}
                title="Error al cargar mascotas"
                description={error}
                action={
                  <Button onClick={loadPets} variant="primary">
                    Intentar de nuevo
                  </Button>
                }
              />
            </div>
          ) : pets.length === 0 ? (
            <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] p-8">
              <EmptyState
                icon={Heart}
                title="No se encontraron mascotas"
                description={
                  hasActiveFilters
                    ? "Intenta ajustar los filtros para ver más resultados"
                    : "No hay mascotas disponibles en este momento. ¡Vuelve pronto!"
                }
                action={
                  hasActiveFilters ? (
                    <Button onClick={clearFilters} variant="outline">
                      Limpiar filtros
                    </Button>
                  ) : (
                    <Button onClick={() => router.push("/pets/new")} variant="primary">
                      Publicar una mascota
                    </Button>
                  )
                }
              />
            </div>
          ) : (
            <>
              {/* Resultados Count */}
              <div className="mb-6 flex justify-between items-center">
                <p className="text-[var(--color-text-secondary)]">
                  {pagination.total} mascota{pagination.total !== 1 ? "s" : ""} encontrada
                  {pagination.total !== 1 ? "s" : ""}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Página {pagination.page} de {pagination.totalPages}
                </p>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {pets.map((pet) => {
                  const cardData = convertPetForCard(pet);
                  return (
                    <PetCard
                      key={pet.id}
                      id={cardData.id}
                      name={cardData.name}
                      species={cardData.species}
                      breed={cardData.breed}
                      age={cardData.age}
                      imageUrl={cardData.imageUrl}
                      location={cardData.location}
                      views={cardData.views}
                      likes={cardData.likes}
                    />
                  );
                })}
              </div>

              {/* Paginación */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={!pagination.hasPrev}
                    className="hover:scale-105 disabled:hover:scale-100"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Anterior
                  </Button>
                  <span className="text-sm text-[var(--color-text-secondary)] px-4">
                    Página {pagination.page} de {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={!pagination.hasNext}
                    className="hover:scale-105 disabled:hover:scale-100"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
