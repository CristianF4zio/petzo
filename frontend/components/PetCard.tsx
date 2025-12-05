/**
 * Componente PetCard
 * Tarjeta para mostrar información de una mascota
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PetCardProps {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age: string;
  imageUrl: string;
  location?: string;
  className?: string;
}

export const PetCard: React.FC<PetCardProps> = ({
  id,
  name,
  species,
  breed,
  age,
  imageUrl,
  location,
  className,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link href={`/pets/${id}`} className={cn("block group", className)}>
      <div className="bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] transition-all duration-300 overflow-hidden">
        {/* Imagen */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <ImageWithFallback
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Botón de favorito */}
          <button
            onClick={handleFavoriteClick}
            className={cn(
              "absolute top-3 right-3 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm transition-all duration-200",
              "hover:bg-white hover:scale-110",
              isFavorite && "bg-[var(--color-primary)] text-white"
            )}
            aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Heart
              className={cn("w-5 h-5", isFavorite && "fill-current")}
            />
          </button>
        </div>

        {/* Información */}
        <div className="p-5">
          <h5 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
            {name}
          </h5>

          <div className="flex items-center gap-2 text-[var(--color-text-secondary)] mb-3">
            <span className="text-sm">{breed || species}</span>
            <span className="text-sm">•</span>
            <span className="text-sm">{age}</span>
          </div>

          {location && (
            <div className="flex items-center gap-2 text-[var(--color-text-muted)] mb-4">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{location}</span>
            </div>
          )}

          <Button variant="primary" size="sm" className="w-full">
            Ver más
          </Button>
        </div>
      </div>
    </Link>
  );
};

