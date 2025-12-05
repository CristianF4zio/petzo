/**
 * Servicio para manejar la lógica de negocio relacionada con mascotas
 * Interactúa con Firestore para CRUD de mascotas
 */

import { db } from "../config/firebaseAdmin";
import { Pet, CreatePetDto, UpdatePetDto } from "../types/Pet";

const PETS_COLLECTION = "pets";

/**
 * Obtener todas las mascotas (con filtros opcionales)
 */
export const getAllPets = async (filters?: {
  type?: "dog" | "cat";
  city?: string;
  ownerId?: string;
}): Promise<Pet[]> => {
  try {
    let query: FirebaseFirestore.Query = db.collection(PETS_COLLECTION);

    // Aplicar filtros si existen
    if (filters?.type) {
      query = query.where("type", "==", filters.type);
    }
    if (filters?.city) {
      query = query.where("city", "==", filters.city);
    }
    if (filters?.ownerId) {
      query = query.where("ownerId", "==", filters.ownerId);
    }

    // Ordenar por fecha de creación (más recientes primero)
    query = query.orderBy("createdAt", "desc");

    const snapshot = await query.get();

    const pets: Pet[] = [];
    snapshot.forEach((doc) => {
      pets.push({
        id: doc.id,
        ...doc.data(),
      } as Pet);
    });

    return pets;
  } catch (error) {
    console.error("Error al obtener mascotas:", error);
    throw new Error("Error al obtener las mascotas");
  }
};

/**
 * Obtener una mascota por ID
 */
export const getPetById = async (petId: string): Promise<Pet | null> => {
  try {
    const doc = await db.collection(PETS_COLLECTION).doc(petId).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as Pet;
  } catch (error) {
    console.error("Error al obtener mascota:", error);
    throw new Error("Error al obtener la mascota");
  }
};

/**
 * Crear una nueva mascota
 */
export const createPet = async (
  petData: CreatePetDto,
  ownerId: string
): Promise<Pet> => {
  try {
    // Validar datos requeridos
    if (!petData.name || !petData.type || !petData.city) {
      throw new Error("Faltan campos requeridos");
    }

    const newPet: Omit<Pet, "id"> = {
      ...petData,
      ownerId,
      createdAt: Date.now(),
    };

    const docRef = await db.collection(PETS_COLLECTION).add(newPet);

    return {
      id: docRef.id,
      ...newPet,
    } as Pet;
  } catch (error) {
    console.error("Error al crear mascota:", error);
    throw new Error("Error al crear la mascota");
  }
};

/**
 * Actualizar una mascota existente
 */
export const updatePet = async (
  petId: string,
  petData: UpdatePetDto,
  ownerId: string
): Promise<Pet> => {
  try {
    // Verificar que la mascota existe y pertenece al usuario
    const pet = await getPetById(petId);

    if (!pet) {
      throw new Error("Mascota no encontrada");
    }

    if (pet.ownerId !== ownerId) {
      throw new Error("No tienes permiso para actualizar esta mascota");
    }

    // Actualizar solo los campos proporcionados
    const updateData: Partial<Pet> = {
      ...petData,
    };

    await db.collection(PETS_COLLECTION).doc(petId).update(updateData);

    // Retornar la mascota actualizada
    const updatedPet = await getPetById(petId);
    return updatedPet!;
  } catch (error: any) {
    console.error("Error al actualizar mascota:", error);
    throw error;
  }
};

/**
 * Eliminar una mascota
 */
export const deletePet = async (
  petId: string,
  ownerId: string
): Promise<void> => {
  try {
    // Verificar que la mascota existe y pertenece al usuario
    const pet = await getPetById(petId);

    if (!pet) {
      throw new Error("Mascota no encontrada");
    }

    if (pet.ownerId !== ownerId) {
      throw new Error("No tienes permiso para eliminar esta mascota");
    }

    await db.collection(PETS_COLLECTION).doc(petId).delete();
  } catch (error: any) {
    console.error("Error al eliminar mascota:", error);
    throw error;
  }
};

