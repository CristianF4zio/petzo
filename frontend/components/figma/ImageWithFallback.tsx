"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackBg?: string;
  showSkeleton?: boolean;
}

// SVG placeholder para mascotas
const PET_PLACEHOLDER_SVG = `data:image/svg+xml,${encodeURIComponent(`
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="%23f3f4f6"/>
  <path d="M200 120 Q180 100 160 120 Q140 140 160 160 Q180 180 200 160 Q220 180 240 160 Q260 140 240 120 Q220 100 200 120 Z" fill="%23d1d5db" opacity="0.5"/>
  <circle cx="180" cy="140" r="8" fill="%239ca3af"/>
  <circle cx="220" cy="140" r="8" fill="%239ca3af"/>
  <path d="M200 180 Q190 200 200 220" stroke="%239ca3af" stroke-width="2" fill="none"/>
  <text x="200" y="280" font-family="Arial" font-size="16" fill="%239ca3af" text-anchor="middle">Sin imagen</text>
</svg>
`)}`;

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = PET_PLACEHOLDER_SVG,
  fallbackBg = "var(--color-surface)",
  className,
  loading = "lazy",
  showSkeleton = true,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (loading !== "lazy" || !imgRef.current) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "50px" }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [loading]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError && !fallbackSrc) {
    return (
      <div
        className={cn("flex items-center justify-center", className)}
        style={{ backgroundColor: fallbackBg }}
      >
        <span className="text-[var(--color-text-muted)]">Sin imagen</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && showSkeleton && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <img
        {...props}
        ref={imgRef}
        src={isInView ? imgSrc : undefined}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        loading={loading}
        className={cn(
          className,
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
      />
    </div>
  );
}

