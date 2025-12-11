/**
 * Página principal de PETZO
 * Home page con hero, beneficios, categorías, testimonios y CTA
 */

"use client";

import React from "react";
import Link from "next/link";
import { Heart, Clock, Shield, Dog, Cat, Star, ArrowRight, Bone, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/5 via-[var(--color-secondary)]/8 to-[var(--color-primary)]/5 py-24 lg:py-40">
        {/* Elementos decorativos mejorados */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-[var(--color-secondary)]/10 dark:bg-[var(--color-secondary)]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Texto */}
            <div className="text-[var(--color-text-primary)] space-y-6">
              <Badge
                variant="default"
                className="mb-4 bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-primary)]/10 backdrop-blur-sm border border-[var(--color-primary)]/40 px-5 py-2.5 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Heart className="w-4 h-4 mr-2 animate-pulse" />
                Miles de mascotas esperando un hogar
              </Badge>

              <h1 className="text-5xl lg:text-7xl font-extrabold mb-6" style={{ lineHeight: '1.15' }}>
                <span className="bg-gradient-to-r from-[var(--color-text-primary)] via-[var(--color-text-primary)] to-[var(--color-primary)] bg-clip-text text-transparent inline-block" style={{ paddingBottom: '0.15em', lineHeight: '1.2' }}>
                  Encuentra tu nuevo mejor amigo con Petzo
                </span>
              </h1>

              <p className="text-xl lg:text-2xl mb-10 text-[var(--color-text-secondary)] leading-relaxed font-medium">
                Conectamos mascotas con familias amorosas. Miles de perros y
                gatos esperan conocerte. ¡Dale una segunda oportunidad al amor!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <Link href="/pets" className="flex-1 sm:flex-initial">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full relative group shadow-xl hover:shadow-2xl text-lg px-8 h-14 flex items-center justify-center"
                  >
                    <PawPrint className="w-5 h-5 mr-2 group-hover:animate-bounce-bone" />
                    Ver mascotas
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link href="/pets/new" className="flex-1 sm:flex-initial">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-2 border-[var(--color-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-primary)] hover:text-white relative group shadow-lg hover:shadow-xl text-lg px-8 h-14 flex items-center justify-center"
                  >
                    <Bone className="w-5 h-5 mr-2 group-hover:animate-bounce-bone" />
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
                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80&auto=format&fit=crop"
                    alt="Gatito jugando"
                    className="w-full h-full object-cover"
                    loading="lazy"
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
      <section className="py-12 bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-[var(--color-text-primary)] mb-4">
            ¿Por qué Petzo?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Rápido */}
            <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-md)]">
              <div className="flex items-center justify-center w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--color-primary)]/10 mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
                Rápido y Fácil
              </h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed text-base">
                Encuentra a tu compañero ideal en minutos. Nuestro sistema de
                búsqueda te conecta rápidamente con mascotas disponibles en tu
                área.
              </p>
            </div>

            {/* Seguro */}
            <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-md)]">
              <div className="flex items-center justify-center w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--color-primary)]/10 mb-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
                100% Seguro
              </h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed text-base">
                Verificamos cada perfil y refugio. Tu seguridad y la de las
                mascotas es nuestra prioridad número uno.
              </p>
            </div>

            {/* Bienestar */}
            <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-md)]">
              <div className="flex items-center justify-center w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--color-primary)]/10 mb-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
                Bienestar Animal
              </h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed text-base">
                Trabajamos con refugios certificados que garantizan el cuidado y
                bienestar de cada mascota hasta encontrar su hogar definitivo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-[var(--color-background)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] mb-6">
              Busca por categoría
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Perros */}
            <Link href="/pets?species=perro" className="group block cursor-pointer h-full">
              <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] transition-all duration-500 hover:scale-[1.03] border-2 border-transparent hover:border-[var(--color-primary)]/50 w-full">
                <img
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80"
                  alt="Perros en adopción"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <Dog className="w-12 h-12 flex-shrink-0" />
                    <h3 className="text-3xl font-bold">Perros</h3>
                  </div>
                  <p className="text-white/90 text-lg">
                    Encuentra tu compañero canino ideal
                  </p>
                </div>
              </div>
            </Link>

            {/* Gatos */}
            <Link href="/pets?species=gato" className="group block cursor-pointer h-full">
              <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] transition-all duration-500 hover:scale-[1.03] border-2 border-transparent hover:border-[var(--color-primary)]/50 w-full">
                <img
                  src="https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=1200&q=80"
                  alt="Gatos en adopción"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <Cat className="w-12 h-12 flex-shrink-0" />
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
            <div className="bg-[var(--color-surface)] rounded-2xl p-10 shadow-xl border border-[var(--color-border)]/50">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[var(--color-primary)] text-[var(--color-primary)]"
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
            <div className="bg-[var(--color-surface)] rounded-2xl p-10 shadow-xl border border-[var(--color-border)]/50">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[var(--color-primary)] text-[var(--color-primary)]"
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
            <div className="bg-[var(--color-surface)] rounded-2xl p-10 shadow-xl border border-[var(--color-border)]/50">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[var(--color-primary)] text-[var(--color-primary)]"
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
      <section className="py-20 bg-[var(--color-secondary)]/10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] mb-6">
            ¿Listo para cambiar una vida?
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)] mb-8 leading-relaxed">
            Miles de mascotas están esperando conocer a su nueva familia.
            Comienza tu búsqueda hoy y dale una segunda oportunidad al amor.
          </p>
          <Link href="/pets">
            <Button variant="outline" size="md" className="border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white shadow-lg hover:shadow-xl px-6">
              Explorar
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
