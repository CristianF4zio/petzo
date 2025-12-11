/**
 * Componente PetCard
 * Tarjeta para mostrar información de una mascota
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, MapPin, Eye, ThumbsUp, PawPrint } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { isFavorite as checkIsFavorite, addFavorite, removeFavorite } from "@/lib/services/favorites.service";
import { PawCard } from "@/components/ui/pet-decorations";

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
      const favorite = await checkIsFavorite(id);
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
    <Link href={`/pets/${id}`} className={cn("block group animate-fade-in cursor-pointer", className)}>
      <PawCard className="bg-[var(--color-surface)] dark:bg-[var(--color-surface)] rounded-2xl shadow-xl hover-lift overflow-hidden border border-[var(--color-border)]/50 hover:border-[var(--color-primary)]/50 hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2">
        {/* Imagen */}
        <div className="relative aspect-[3/2] overflow-hidden bg-[var(--color-border)]">
          <ImageWithFallback
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {/* Overlay sutil en hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Botón de favorito */}
          <button
            onClick={handleFavoriteClick}
            disabled={loadingFavorite}
            className={cn(
              "absolute top-3 right-3 flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-surface)]/95 backdrop-blur-md transition-all duration-300 z-10",
              "hover:bg-[var(--color-surface)] hover:scale-110 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
              "active:scale-95",
              isFavorite && "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90"
            )}
            aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-all duration-300",
                isFavorite && "fill-current scale-110",
                loadingFavorite && "animate-pulse"
              )}
            />
          </button>
        </div>

        {/* Información */}
        <div className="p-5 space-y-3">
          <h5 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-primary)] transition-colors duration-300">
            {name}
          </h5>

          <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-sm">
            <span className="font-medium">{breed || species}</span>
            <span className="text-[var(--color-text-muted)]">•</span>
            <span>{age}</span>
          </div>

          {location && (
            <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}

          {/* Estadísticas */}
          {(views !== undefined || likes !== undefined) && (
            <div className="flex items-center gap-4 pt-2 border-t border-[var(--color-border)] text-sm text-[var(--color-text-muted)]">
              {views !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">{views}</span>
                </div>
              )}
              {likes !== undefined && (
                <div className="flex items-center gap-1.5">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="font-medium">{likes}</span>
                </div>
              )}
            </div>
          )}

          <Button 
            variant="bone" 
            size="sm" 
            className="w-full mt-4 group-hover:shadow-lg transition-all duration-300 relative group/btn"
          >
            <PawPrint className="w-4 h-4 mr-2 group-hover/btn:animate-bounce-bone inline-block" />
            Ver más
          </Button>
        </div>
      </PawCard>
    </Link>
  );
};

