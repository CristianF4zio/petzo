/**
 * Componente Lightbox para galería de imágenes
 * Muestra imágenes en pantalla completa con navegación
 */

"use client";

import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { cn } from "@/lib/utils";

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Lightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        onPrev();
      } else if (e.key === "ArrowRight") {
        onNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose, onNext, onPrev]);

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-background)]/95 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      {/* Botón cerrar */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] h-12 w-12 rounded-full"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Botón anterior */}
      {images.length > 1 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 md:left-4 z-10 text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] h-12 w-12 rounded-full min-w-[48px] min-h-[48px]"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      )}

      {/* Imagen */}
      <div
        className="relative max-w-7xl max-h-[90vh] mx-auto px-4 md:px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <ImageWithFallback
          src={currentImage}
          alt={`Imagen ${currentIndex + 1} de ${images.length}`}
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
          showSkeleton={false}
        />
      </div>

      {/* Botón siguiente */}
      {images.length > 1 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 md:right-4 z-10 text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] h-12 w-12 rounded-full min-w-[48px] min-h-[48px]"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Imagen siguiente"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      )}

      {/* Contador */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[var(--color-surface)]/80 backdrop-blur-sm border border-[var(--color-border)] text-[var(--color-text-primary)] px-4 py-2 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Miniaturas en la parte inferior */}
      {images.length > 1 && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-4xl overflow-x-auto px-4 pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                // Necesitaríamos pasar una función para cambiar el índice directamente
              }}
              className={cn(
                "relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0",
                index === currentIndex
                  ? "border-[var(--color-primary)] scale-110"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <ImageWithFallback
                src={image}
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

