/**
 * Componente PetCard
 * Tarjeta para mostrar información de una mascota
 */

import React from "react";
import Link from "next/link";
import Image from "next/image";

export interface Pet {
  id: string;
  name: string;
  type: "dog" | "cat";
  age: number;
  sex: "male" | "female";
  city: string;
  description: string;
  photoUrl: string;
  ownerId: string;
  createdAt: number;
}

interface PetCardProps {
  pet: Pet;
}

export const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  return (
    <Link href={`/pets/${pet.id}`}>
      <div className="card cursor-pointer h-full">
        <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden bg-gray-200">
          {pet.photoUrl ? (
            <Image
              src={pet.photoUrl}
              alt={pet.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-6xl">{pet.type === "dog" ? "🐕" : "🐈"}</span>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
            <span className="text-sm text-gray-500">
              {pet.type === "dog" ? "🐕" : "🐈"} {pet.type === "dog" ? "Perro" : "Gato"}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
            <span>{pet.age} {pet.age === 1 ? "año" : "años"}</span>
            <span>•</span>
            <span>{pet.sex === "male" ? "Macho" : "Hembra"}</span>
            <span>•</span>
            <span>📍 {pet.city}</span>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2">{pet.description}</p>

          <div className="mt-4">
            <span className="text-petro-500 font-medium text-sm hover:text-petro-600">
              Ver detalles →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

