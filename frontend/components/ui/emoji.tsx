/**
 * Componente de emoji usando Twemoji
 * Sistema de diseño profesional para emojis
 */

"use client";

import React, { useEffect, useRef } from "react";
import twemoji from "twemoji";
import { cn } from "@/lib/utils";

interface EmojiProps {
  emoji: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Componente Emoji que renderiza emojis usando Twemoji
 * Garantiza consistencia visual en todas las plataformas
 */
export function Emoji({ emoji, size = 24, className = "", style = {} }: EmojiProps) {
  const emojiRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (emojiRef.current) {
      // Parsear el emoji usando Twemoji
      // Twemoji convierte emojis Unicode en imágenes SVG consistentes y profesionales
      twemoji.parse(emojiRef.current as HTMLElement, {
        folder: "svg",
        ext: ".svg",
        base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/",
        size: size.toString(),
        className: "twemoji",
      });
    }
  }, [emoji, size]);

  return (
    <span
      ref={emojiRef}
      className={cn("inline-block", className)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        lineHeight: `${size}px`,
        fontSize: `${size}px`,
        ...style,
      }}
    >
      {emoji}
    </span>
  );
}

/**
 * Emojis temáticos predefinidos para mascotas
 */
export const PetEmojis = {
  bone: "🦴",
  paw: "🐾",
  heart: "❤️",
  dog: "🐕",
  cat: "🐈",
  dogFace: "🐶",
  catFace: "🐱",
  pawPrints: "🐾",
  heartEyes: "😍",
  star: "⭐",
  sparkles: "✨",
} as const;

