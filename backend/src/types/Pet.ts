/**
 * Tipos TypeScript para las entidades del sistema
 */

export type PetType = "dog" | "cat";
export type PetSex = "male" | "female";

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  age: number;
  sex: PetSex;
  city: string;
  description: string;
  photoUrl: string;
  ownerId: string;
  createdAt: number;
}

export interface CreatePetDto {
  name: string;
  type: PetType;
  age: number;
  sex: PetSex;
  city: string;
  description: string;
  photoUrl: string;
}

export interface UpdatePetDto {
  name?: string;
  type?: PetType;
  age?: number;
  sex?: PetSex;
  city?: string;
  description?: string;
  photoUrl?: string;
}

