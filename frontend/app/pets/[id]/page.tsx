/**
 * Página de detalle de una mascota
 * Muestra información completa de una mascota específica
 */

"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  MapPin,
  Calendar,
  Share2,
  ArrowLeft,
  Check,
  X,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PetCard } from "@/components/PetCard";
import { getPetById, getRelatedPets } from "@/lib/mockData";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export default function PetDetailPage() {
  const params = useParams();
  const pet = getPetById(params.id as string);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!pet) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
          <div className="text-6xl mb-4">😿</div>
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            Mascota no encontrada
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-6">
            La mascota que buscas no existe o ha sido adoptada
          </p>
          <Link href="/pets">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al listado
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedPets = getRelatedPets(pet.id);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Botón volver */}
        <Link
          href="/pets"
          className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al listado
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Galería de Imágenes */}
          <div className="space-y-4">
            {/* Imagen principal */}
            <div className="relative aspect-[4/3] rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-lg)]">
              <ImageWithFallback
                src={pet.images[selectedImage]}
                alt={`${pet.name} - Imagen ${selectedImage + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Miniaturas */}
            {pet.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {pet.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-[var(--radius-md)] overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-[var(--color-primary)] shadow-md"
                        : "border-transparent hover:border-[var(--color-border)]"
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${pet.name} - Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información Principal */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <CardTitle className="text-4xl mb-2">{pet.name}</CardTitle>
                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                      <span className="text-lg">{pet.breed}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0"
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isFavorite
                            ? "fill-[var(--color-primary)] text-[var(--color-primary)]"
                            : ""
                        }`}
                      />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  className="w-fit bg-[var(--color-accent)] text-[var(--color-text-primary)]"
                >
                  {pet.status === "disponible" && "✅ Disponible para adopción"}
                  {pet.status === "reservado" && "⏳ Reservado"}
                  {pet.status === "adoptado" && "❤️ Adoptado"}
                </Badge>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-[var(--color-surface)] rounded-[var(--radius-md)]">
                    <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Edad
                      </p>
                      <p className="font-semibold">{pet.age}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-[var(--color-surface)] rounded-[var(--radius-md)]">
                    <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Ubicación
                      </p>
                      <p className="font-semibold">{pet.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-[var(--color-surface)] rounded-[var(--radius-md)]">
                    <span className="text-xl">⚖️</span>
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Tamaño
                      </p>
                      <p className="font-semibold capitalize">{pet.size}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-[var(--color-surface)] rounded-[var(--radius-md)]">
                    <span className="text-xl">
                      {pet.gender === "macho" ? "♂️" : "♀️"}
                    </span>
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Género
                      </p>
                      <p className="font-semibold capitalize">{pet.gender}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Características */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Características</h3>
                  <div className="flex flex-wrap gap-2">
                    {pet.characteristics.map((char) => (
                      <Badge key={char} variant="outline">
                        {char}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Estado de salud */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`flex items-center gap-2 p-3 rounded-[var(--radius-md)] ${
                      pet.vaccinated
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    {pet.vaccinated ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <X className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">Vacunado</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 p-3 rounded-[var(--radius-md)] ${
                      pet.sterilized
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    {pet.sterilized ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <X className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">Esterilizado</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full mt-6"
                  disabled={pet.status !== "disponible"}
                >
                  {pet.status === "disponible"
                    ? "Contactar para adoptar"
                    : "No disponible"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Descripción */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Sobre {pet.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
              {pet.description}
            </p>
          </CardContent>
        </Card>

        {/* Información del Dueño/Refugio */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Publicado por</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-2xl font-bold">
                {pet.owner.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-1">{pet.owner.name}</h4>
                <Badge variant="outline" className="mb-2 capitalize">
                  {pet.owner.type}
                </Badge>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Contacto: {pet.owner.contact}
                </p>
                <p className="text-sm text-[var(--color-text-muted)] mt-2">
                  Publicado el{" "}
                  {new Date(pet.publishedDate).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mascotas relacionadas */}
        {relatedPets.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">
              Mascotas similares
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPets.map((relatedPet) => (
                <PetCard
                  key={relatedPet.id}
                  id={relatedPet.id}
                  name={relatedPet.name}
                  species={relatedPet.species}
                  breed={relatedPet.breed}
                  age={relatedPet.age}
                  imageUrl={relatedPet.images[0]}
                  location={relatedPet.city}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
