/**
 * Tipos TypeScript para las entidades del sistema
 */

export type PetType = "dog" | "cat";
export type PetSex = "male" | "female";

export type PetSize = "small" | "medium" | "large";

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  age: number;
  sex: PetSex;
  size?: PetSize; // Nuevo campo
  city: string;
  description: string;
  photoUrl: string;
  photos?: string[]; // Múltiples imágenes
  ownerId: string;
  createdAt: number;
  updatedAt: number;
  status: "available" | "adopted" | "pending";
  views: number;
  likes: number;
}

export interface CreatePetDto {
  name: string;
  type: PetType;
  age: number;
  sex: PetSex;
  size?: PetSize;
  city: string;
  description: string;
  photoUrl: string;
  photos?: string[];
}

export interface UpdatePetDto {
  name?: string;
  type?: PetType;
  age?: number;
  sex?: PetSex;
  size?: PetSize;
  city?: string;
  description?: string;
  photoUrl?: string;
  photos?: string[];
}

