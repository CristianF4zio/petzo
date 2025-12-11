/**
 * Componentes decorativos con temática de perros y gatos
 * Efectos visuales y animaciones temáticas
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Emoji, PetEmojis } from "./emoji";

// Huesitos flotantes decorativos - Versión profesional y sutil usando emojis
export function FloatingBones({ count = 4 }: { count?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-float-bone opacity-10 dark:opacity-15"
          style={{
            left: `${15 + Math.random() * 70}%`,
            top: `${15 + Math.random() * 70}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${4 + Math.random() * 2}s`,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
          }}
        >
          <Emoji emoji={PetEmojis.bone} size={24} />
        </div>
      ))}
    </div>
  );
}

// Patitas decorativas - Versión profesional y sutil usando emojis
export function PawPrints({ count = 3 }: { count?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-paw-print opacity-12 dark:opacity-18"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${i * 1.2}s`,
            animationDuration: `${5 + Math.random() * 2}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
          }}
        >
          <Emoji emoji={PetEmojis.paw} size={32} />
        </div>
      ))}
    </div>
  );
}

// Efecto de corazones flotantes - Versión profesional y sutil usando emojis
export function FloatingHearts({ count = 3 }: { count?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-float-heart opacity-15 dark:opacity-22"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${i * 1}s`,
            animationDuration: `${3 + Math.random() * 1.5}s`,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
          }}
        >
          <Emoji emoji={PetEmojis.heart} size={20} />
        </div>
      ))}
    </div>
  );
}

// Botón con efecto de huesito usando emoji
export function BoneButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "relative overflow-hidden group",
        "transition-all duration-300",
        "hover:scale-105 active:scale-95",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div
        className={cn(
          "absolute -right-8 top-1/2 -translate-y-1/2",
          "opacity-20",
          "transition-all duration-500",
          "group-hover:right-2 group-hover:rotate-12 group-hover:opacity-30"
        )}
      >
        <Emoji emoji={PetEmojis.bone} size={24} />
      </div>
    </button>
  );
}

// Card con efecto de patita - Versión profesional y sutil usando emoji
export function PawCard({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden group",
        "transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
      <div
        className={cn(
          "absolute -bottom-6 -right-6",
          "opacity-10 dark:opacity-15",
          "transition-all duration-500",
          "group-hover:scale-105 group-hover:opacity-15 dark:group-hover:opacity-20"
        )}
        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
      >
        <Emoji emoji={PetEmojis.paw} size={80} />
      </div>
    </div>
  );
}

// Efecto de lluvia de huesitos (para celebraciones) - Versión profesional con emojis
export function BoneRain({ active = false }: { active?: boolean }) {
  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-bone-fall"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-10%",
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${1.5 + Math.random() * 0.5}s`,
            transform: `rotate(${Math.random() * 180}deg)`,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
          }}
        >
          <Emoji emoji={PetEmojis.bone} size={24} />
        </div>
      ))}
    </div>
  );
}

// Efecto de patitas caminando usando emojis
export function WalkingPaws() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-walk-paw opacity-25"
          style={{
            left: `${i * 25}%`,
            bottom: "10%",
            animationDelay: `${i * 0.3}s`,
            animationDuration: "2s",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
          }}
        >
          <Emoji emoji={PetEmojis.paw} size={24} />
        </div>
      ))}
    </div>
  );
}

