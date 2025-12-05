"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackBg?: string;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/images/placeholder-pet.jpg",
  fallbackBg = "var(--color-surface)",
  className,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
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
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
    />
  );
}

