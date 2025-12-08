/**
 * Componente PetCard
 * Tarjeta para mostrar información de una mascota
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, MapPin, Eye, ThumbsUp } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { isFavorite, addFavorite, removeFavorite } from "@/lib/services/favorites.service";

interface PetCardProps {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age: string;
  imageUrl: string;
  location?: string;
  className?: string;
  views?: number;
  likes?: number;
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
  views,
  likes,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  // Verificar estado de favorito al cargar
  useEffect(() => {
    if (user && id) {
      checkFavoriteStatus();
    }
  }, [user, id]);

  const checkFavoriteStatus = async () => {
    if (!user) return;
    try {
      const favorite = await isFavorite(id);
      setIsFavorite(favorite);
    } catch (err) {
      console.error("Error al verificar favorito:", err);
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    setLoadingFavorite(true);
    try {
      if (isFavorite) {
        await removeFavorite(id);
        setIsFavorite(false);
      } else {
        await addFavorite(id);
        setIsFavorite(true);
      }
    } catch (err: any) {
      console.error("Error al actualizar favorito:", err);
      // No mostrar alerta para no interrumpir la experiencia
    } finally {
      setLoadingFavorite(false);
    }
  };

  return (
    <Link href={`/pets/${id}`} className={cn("block group", className)}>
      <div className="bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] transition-all duration-300 overflow-hidden">
        {/* Imagen */}
        <div className="relative aspect-[3/2] overflow-hidden">
          <ImageWithFallback
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Botón de favorito */}
          <button
            onClick={handleFavoriteClick}
            disabled={loadingFavorite}
            className={cn(
              "absolute top-3 right-3 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm transition-all duration-200",
              "hover:bg-white hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed",
              isFavorite && "bg-[var(--color-primary)] text-white"
            )}
            aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Heart
              className={cn("w-5 h-5 transition-all", isFavorite && "fill-current")}
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
            <div className="flex items-center gap-2 text-[var(--color-text-muted)] mb-3">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{location}</span>
            </div>
          )}

          {/* Estadísticas */}
          {(views !== undefined || likes !== undefined) && (
            <div className="flex items-center gap-4 mb-4 text-sm text-[var(--color-text-muted)]">
              {views !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{views}</span>
                </div>
              )}
              {likes !== undefined && (
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{likes}</span>
                </div>
              )}
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

