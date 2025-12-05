/**
 * Página principal de PETZO
 * Home page con hero, beneficios, categorías, testimonios y CTA
 */

"use client";

import React from "react";
import Link from "next/link";
import { Heart, Clock, Shield, Dog, Cat, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[var(--color-primary)] via-[#ff8787] to-[var(--color-secondary)] py-20 lg:py-32">
        {/* Elementos decorativos */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[var(--color-accent)]/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texto */}
            <div className="text-white">
              <Badge
                variant="default"
                className="mb-6 bg-white/10 backdrop-blur-sm border-none px-4 py-2"
              >
                <Heart className="w-4 h-4 mr-2" />
                Miles de mascotas esperando un hogar
              </Badge>

              <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                Encuentra tu nuevo mejor amigo con Petzo
              </h1>

              <p className="text-xl mb-8 text-white/90 leading-relaxed">
                Conectamos mascotas con familias amorosas. Miles de perros y
                gatos esperan conocerte. ¡Dale una segunda oportunidad al amor!
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/pets">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Ver mascotas
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/pets/new">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-[var(--color-primary)]"
                  >
                    Dar en adopción
                  </Button>
                </Link>
              </div>
            </div>

            {/* Grid de imágenes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-2xl)]">
                  <img
                    src="https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&q=80"
                    alt="Perro feliz"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-2xl)]">
                  <img
                    src="https://images.unsplash.com/photo-1573865526739-10c1dd7e9e9a?w=800&q=80"
                    alt="Gatito jugando"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-2xl)]">
                  <img
                    src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&q=80"
                    alt="Gato curioso"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-2xl)]">
                  <img
                    src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80"
                    alt="Cachorro adorable"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-[var(--color-text-primary)] mb-12">
            ¿Por qué Petzo?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Rápido */}
            <div className="bg-white rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] transition-shadow duration-300">
              <div className="flex items-center justify-center w-14 h-14 rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--color-primary)] to-[#ff8787] mb-4">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
                Rápido y Fácil
              </h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Encuentra a tu compañero ideal en minutos. Nuestro sistema de
                búsqueda te conecta rápidamente con mascotas disponibles en tu
                área.
              </p>
            </div>

            {/* Seguro */}
            <div className="bg-white rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] transition-shadow duration-300">
              <div className="flex items-center justify-center w-14 h-14 rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-tertiary)] mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
                100% Seguro
              </h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Verificamos cada perfil y refugio. Tu seguridad y la de las
                mascotas es nuestra prioridad número uno.
              </p>
            </div>

            {/* Bienestar */}
            <div className="bg-white rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] transition-shadow duration-300">
              <div className="flex items-center justify-center w-14 h-14 rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--color-accent)] to-[#ffd700] mb-4">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
                Bienestar Animal
              </h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Trabajamos con refugios certificados que garantizan el cuidado y
                bienestar de cada mascota hasta encontrar su hogar definitivo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-[var(--color-text-primary)] mb-12">
            Busca por categoría
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Perros */}
            <Link href="/pets?species=perro" className="group block">
              <div className="relative h-80 rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-2xl)] transition-all duration-300">
                <img
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80"
                  alt="Perros en adopción"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <Dog className="w-12 h-12" />
                    <h3 className="text-3xl font-bold">Perros</h3>
                  </div>
                  <p className="text-white/90 text-lg">
                    Encuentra tu compañero canino ideal
                  </p>
                </div>
              </div>
            </Link>

            {/* Gatos */}
            <Link href="/pets?species=gato" className="group block">
              <div className="relative h-80 rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-2xl)] transition-all duration-300">
                <img
                  src="https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=1200&q=80"
                  alt="Gatos en adopción"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <Cat className="w-12 h-12" />
                    <h3 className="text-3xl font-bold">Gatos</h3>
                  </div>
                  <p className="text-white/90 text-lg">
                    Conoce a tu futuro amigo felino
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-[var(--color-text-primary)] mb-12">
            Historias de éxito
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonio 1 */}
            <div className="bg-white rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-md)]">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[var(--color-accent)] text-[var(--color-accent)]"
                  />
                ))}
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                "Encontramos a Max a través de Petzo y ha sido la mejor decisión
                de nuestras vidas. Es el compañero perfecto para nuestra familia."
              </p>
              <p className="font-semibold text-[var(--color-primary)]">
                - Laura Martínez
              </p>
            </div>

            {/* Testimonio 2 */}
            <div className="bg-white rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-md)]">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[var(--color-accent)] text-[var(--color-accent)]"
                  />
                ))}
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                "El proceso fue muy sencillo y el equipo nos ayudó en todo momento.
                Luna llegó a casa y se adaptó perfectamente."
              </p>
              <p className="font-semibold text-[var(--color-primary)]">
                - Carlos Rodríguez
              </p>
            </div>

            {/* Testimonio 3 */}
            <div className="bg-white rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-md)]">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[var(--color-accent)] text-[var(--color-accent)]"
                  />
                ))}
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                "Gracias a Petzo, nuestro refugio ha encontrado hogares para
                decenas de mascotas. Una plataforma increíble."
              </p>
              <p className="font-semibold text-[var(--color-primary)]">
                - Refugio Animales Felices
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            ¿Listo para cambiar una vida?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Miles de mascotas están esperando conocer a su nueva familia.
            Comienza tu búsqueda hoy y dale una segunda oportunidad al amor.
          </p>
          <Link href="/pets">
            <Button
              variant="primary"
              size="lg"
              className="shadow-[var(--shadow-2xl)]"
            >
              Explorar mascotas
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
