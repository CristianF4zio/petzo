/**
 * Sistema de partículas temático para PETZO
 * Huesitos, patitas y corazones flotantes como partículas
 */

"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bone, PawPrint, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: "bone" | "paw" | "heart";
}

interface ParticlesProps {
  count?: number;
  intensity?: "low" | "medium" | "high";
  types?: ("bone" | "paw" | "heart")[];
}

export function PetParticles({ 
  count = 30, 
  intensity = "medium",
  types = ["bone", "paw", "heart"]
}: ParticlesProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Configuración según intensidad - Más visible
  const intensityConfig = {
    low: { opacity: 0.3, speed: 0.4 },
    medium: { opacity: 0.45, speed: 0.6 },
    high: { opacity: 0.6, speed: 0.8 },
  };

  const config = intensityConfig[intensity];

  // Radio de interacción con el cursor
  const INTERACTION_RADIUS = 120;
  const REPULSION_FORCE = 0.15;

  // Seguimiento del cursor - Usando eventos globales para no bloquear clics
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      // Verificar si el mouse está dentro del contenedor
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mousePosRef.current = { x, y };
      } else {
        // Si está fuera, mantener la posición pero reducir la fuerza gradualmente
        mousePosRef.current = null;
      }
    };

    // Usar eventos globales del documento
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const container = canvasRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    // Crear partículas iniciales
    const initialParticles: Particle[] = Array.from({ length: count }, (_, i) => {
      const typeIndex = i % types.length;
      const type = types[typeIndex];
      
      return {
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        size: type === "bone" ? 20 + Math.random() * 12 : type === "paw" ? 24 + Math.random() * 16 : 18 + Math.random() * 10,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        opacity: config.opacity + Math.random() * 0.1,
        type,
      };
    });

    setParticles(initialParticles);

    // Animación con interacción del cursor
    const animate = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          let newX = particle.x + particle.vx;
          let newY = particle.y + particle.vy;
          let newRotation = particle.rotation + particle.rotationSpeed;
          let newVx = particle.vx;
          let newVy = particle.vy;

          // Interacción con el cursor
          if (mousePosRef.current) {
            const dx = newX - mousePosRef.current.x;
            const dy = newY - mousePosRef.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < INTERACTION_RADIUS && distance > 0) {
              // Fuerza de repulsión inversamente proporcional a la distancia
              const force = (INTERACTION_RADIUS - distance) / INTERACTION_RADIUS;
              const angle = Math.atan2(dy, dx);
              
              // Aplicar fuerza de repulsión
              newVx += Math.cos(angle) * REPULSION_FORCE * force;
              newVy += Math.sin(angle) * REPULSION_FORCE * force;
              
              // Limitar velocidad máxima
              const maxSpeed = config.speed * 3;
              const currentSpeed = Math.sqrt(newVx * newVx + newVy * newVy);
              if (currentSpeed > maxSpeed) {
                newVx = (newVx / currentSpeed) * maxSpeed;
                newVy = (newVy / currentSpeed) * maxSpeed;
              }
            }
          }

          // Aplicar fricción suave para movimiento más natural
          newVx *= 0.98;
          newVy *= 0.98;

          // Rebote en los bordes
          if (newX < 0 || newX > width) newVx *= -1;
          if (newY < 0 || newY > height) newVy *= -1;

          // Mantener dentro de los límites
          newX = Math.max(0, Math.min(width, newX));
          newY = Math.max(0, Math.min(height, newY));

          return {
            ...particle,
            x: newX,
            y: newY,
            rotation: newRotation,
            vx: newVx,
            vy: newVy,
          };
        })
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Manejar resize
    const handleResize = () => {
      const newWidth = container.offsetWidth;
      const newHeight = container.offsetHeight;
      
      setParticles((prevParticles) =>
        prevParticles.map((p) => ({
          ...p,
          x: (p.x / width) * newWidth,
          y: (p.y / height) * newHeight,
        }))
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [count, config.speed, types]);

  const getIcon = (type: string) => {
    switch (type) {
      case "bone":
        return Bone;
      case "paw":
        return PawPrint;
      case "heart":
        return Heart;
      default:
        return Bone;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "bone":
        return "text-[var(--color-accent)]";
      case "paw":
        return "text-[var(--color-tertiary)]";
      case "heart":
        return "text-[var(--color-primary)] fill-[var(--color-primary)]";
      default:
        return "text-[var(--color-accent)]";
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      <div
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      >
      {particles.map((particle) => {
        const Icon = getIcon(particle.type);
        return (
          <div
            key={particle.id}
            className="absolute transition-opacity duration-300"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              transform: `translate(-50%, -50%) rotate(${particle.rotation}deg)`,
              opacity: particle.opacity,
            }}
          >
            <Icon
              className={cn(
                getColor(particle.type),
                "animate-float-particle drop-shadow-sm"
              )}
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
              }}
            />
          </div>
        );
      })}
      </div>
    </div>
  );
}

// Componente simplificado para uso rápido - Más visible y con más partículas
export function FloatingBonesParticles({ count = 50 }: { count?: number }) {
  return <PetParticles count={count} intensity="high" types={["bone"]} />;
}

export function PawPrintsParticles({ count = 45 }: { count?: number }) {
  return <PetParticles count={count} intensity="high" types={["paw"]} />;
}

export function HeartsParticles({ count = 35 }: { count?: number }) {
  return <PetParticles count={count} intensity="high" types={["heart"]} />;
}

export function MixedParticles({ count = 100 }: { count?: number }) {
  return <PetParticles count={count} intensity="high" types={["bone", "paw", "heart"]} />;
}

