/**
 * Servicio para manejar la lógica de negocio relacionada con mascotas
 * Interactúa con Firestore para CRUD de mascotas
 */

import { db } from "../config/firebaseAdmin";
import { Pet, CreatePetDto, UpdatePetDto } from "../types/Pet";
import { COLLECTIONS } from "../types/database";
import { PetFilters } from "../types/filters";
import {
  PaginationParams,
  PaginationResult,
  normalizePagination,
} from "../types/pagination";
import logger from "../config/logger";

const PETS_COLLECTION = COLLECTIONS.PETS;

/**
 * Obtener todas las mascotas (con filtros, búsqueda y paginación)
 */
export const getAllPets = async (
  filters?: PetFilters,
  pagination?: PaginationParams
): Promise<PaginationResult<Pet>> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const { page, limit, offset } = normalizePagination(pagination || {});

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
    if (filters?.status) {
      query = query.where("status", "==", filters.status);
    }
    if (filters?.sex) {
      query = query.where("sex", "==", filters.sex);
    }
    if (filters?.size) {
      query = query.where("size", "==", filters.size);
    }
    if (filters?.minAge !== undefined) {
      query = query.where("age", ">=", filters.minAge);
    }
    if (filters?.maxAge !== undefined) {
      query = query.where("age", "<=", filters.maxAge);
    }
    if (filters?.minDate) {
      query = query.where("createdAt", ">=", filters.minDate);
    }
    if (filters?.maxDate) {
      query = query.where("createdAt", "<=", filters.maxDate);
    }

    // Ordenar por fecha de creación (más recientes primero)
    query = query.orderBy("createdAt", "desc");

    // Obtener total antes de paginación (para búsqueda por texto necesitamos todos)
    let allPets: Pet[] = [];
    const snapshot = await query.get();
    snapshot.forEach((doc) => {
      allPets.push({
        id: doc.id,
        ...doc.data(),
      } as Pet);
    });

    // Aplicar búsqueda por texto si existe (en memoria porque Firestore no soporta búsqueda full-text nativa)
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      allPets = allPets.filter(
        (pet) =>
          pet.name.toLowerCase().includes(searchLower) ||
          pet.description.toLowerCase().includes(searchLower)
      );
    }

    // Calcular total después de filtros de búsqueda
    const total = allPets.length;

    // Aplicar paginación
    const paginatedPets = allPets.slice(offset, offset + limit);

    return {
      data: paginatedPets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: offset + limit < total,
        hasPrev: offset > 0,
      },
    };
  } catch (error: any) {
    logger.error("Error al obtener mascotas:", error);

    // Si es un error de índice faltante o en construcción
    if (error.code === 9 || error.details?.includes("index")) {
      if (error.details?.includes("currently building")) {
        const indexLink = error.details?.match(/https:\/\/[^\s]+/)?.[0];
        logger.warn("Índice en construcción", { indexLink });
        console.error("\n⏳ ÍNDICE EN CONSTRUCCIÓN");
        console.error("📋 El índice se está construyendo. Espera unos minutos.");
        if (indexLink) {
          console.error("🔗 Ver estado aquí:");
          console.error(`   ${indexLink}\n`);
        }
        throw new Error(
          "El índice está en construcción. Espera unos minutos y vuelve a intentar."
        );
      } else {
        const indexLink = error.details?.match(/https:\/\/[^\s]+/)?.[0];
        if (indexLink) {
          logger.warn("Índice faltante en Firestore", { indexLink });
          console.error("\n⚠️  ÍNDICE FALTANTE EN FIRESTORE");
          console.error("📋 Firestore requiere un índice compuesto para esta consulta.");
          console.error("🔗 Crea el índice aquí:");
          console.error(`   ${indexLink}\n`);
          console.error("💡 También puedes crear los índices manualmente en:");
          console.error(
            "   https://console.firebase.google.com/project/petzo-c1dd5/firestore/indexes\n"
          );
        }
        throw new Error(
          "Índice faltante en Firestore. Revisa la consola para ver el enlace de creación."
        );
      }
    }

    throw new Error("Error al obtener las mascotas");
  }
};

/**
 * Obtener una mascota por ID e incrementar vistas
 */
export const getPetById = async (
  petId: string,
  incrementViews: boolean = true
): Promise<Pet | null> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const doc = await db.collection(PETS_COLLECTION).doc(petId).get();

    if (!doc.exists) {
      return null;
    }

    const pet = {
      id: doc.id,
      ...doc.data(),
    } as Pet;

    // Incrementar vistas si se solicita
    if (incrementViews) {
      await db
        .collection(PETS_COLLECTION)
        .doc(petId)
        .update({
          views: (pet.views || 0) + 1,
        });
      pet.views = (pet.views || 0) + 1;
    }

    return pet;
  } catch (error) {
    logger.error("Error al obtener mascota:", error);
    throw new Error("Error al obtener la mascota");
  }
};

/**
 * Incrementar likes de una mascota
 */
export const incrementPetLikes = async (
  petId: string,
  increment: number = 1
): Promise<Pet> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const pet = await getPetById(petId, false);
    if (!pet) {
      throw new Error("Mascota no encontrada");
    }

    const newLikes = Math.max(0, (pet.likes || 0) + increment);

    await db.collection(PETS_COLLECTION).doc(petId).update({
      likes: newLikes,
      updatedAt: Date.now(),
    });

    return {
      ...pet,
      likes: newLikes,
    };
  } catch (error: any) {
    logger.error("Error al incrementar likes:", error);
    throw error;
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
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    // Validar datos requeridos
    if (!petData.name || !petData.type || !petData.city) {
      throw new Error("Faltan campos requeridos");
    }

    // Si hay photos, usar la primera como photoUrl si no hay photoUrl
    const photoUrl = petData.photoUrl || petData.photos?.[0] || "";

    const newPet: Omit<Pet, "id"> = {
      ...petData,
      photoUrl,
      photos: petData.photos || [photoUrl].filter(Boolean),
      ownerId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: "available" as const,
      views: 0,
      likes: 0,
    };

    const docRef = await db.collection(PETS_COLLECTION).add(newPet);

    return {
      id: docRef.id,
      ...newPet,
    } as Pet;
  } catch (error) {
    logger.error("Error al crear mascota:", error);
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
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    // Verificar que la mascota existe y pertenece al usuario
    const pet = await getPetById(petId, false);

    if (!pet) {
      throw new Error("Mascota no encontrada");
    }

    if (pet.ownerId !== ownerId) {
      throw new Error("No tienes permiso para actualizar esta mascota");
    }

    // Si se actualiza photos, asegurar que photoUrl también se actualice
    const updateData: Partial<Pet> = {
      ...petData,
      updatedAt: Date.now(),
    };

    if (petData.photos && petData.photos.length > 0 && !petData.photoUrl) {
      updateData.photoUrl = petData.photos[0];
    }

    await db.collection(PETS_COLLECTION).doc(petId).update(updateData);

    // Retornar la mascota actualizada
    const updatedPet = await getPetById(petId, false);
    return updatedPet!;
  } catch (error: any) {
    logger.error("Error al actualizar mascota:", error);
    throw error;
  }
};

/**
 * Agregar foto a una mascota
 */
export const addPetPhoto = async (
  petId: string,
  photoUrl: string,
  ownerId: string
): Promise<Pet> => {
  try {
    const pet = await getPetById(petId, false);
    if (!pet) {
      throw new Error("Mascota no encontrada");
    }

    if (pet.ownerId !== ownerId) {
      throw new Error("No tienes permiso para modificar esta mascota");
    }

    const currentPhotos = pet.photos || [pet.photoUrl].filter(Boolean);
    const updatedPhotos = [...currentPhotos, photoUrl];

    return await updatePet(
      petId,
      {
        photos: updatedPhotos,
        photoUrl: updatedPhotos[0], // Mantener la primera como principal
      },
      ownerId
    );
  } catch (error: any) {
    logger.error("Error al agregar foto:", error);
    throw error;
  }
};

/**
 * Eliminar foto de una mascota
 */
export const removePetPhoto = async (
  petId: string,
  photoUrl: string,
  ownerId: string
): Promise<Pet> => {
  try {
    const pet = await getPetById(petId, false);
    if (!pet) {
      throw new Error("Mascota no encontrada");
    }

    if (pet.ownerId !== ownerId) {
      throw new Error("No tienes permiso para modificar esta mascota");
    }

    const currentPhotos = pet.photos || [pet.photoUrl].filter(Boolean);
    const updatedPhotos = currentPhotos.filter((p) => p !== photoUrl);

    if (updatedPhotos.length === 0) {
      throw new Error("No se puede eliminar la última foto");
    }

    return await updatePet(
      petId,
      {
        photos: updatedPhotos,
        photoUrl: updatedPhotos[0],
      },
      ownerId
    );
  } catch (error: any) {
    logger.error("Error al eliminar foto:", error);
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
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    // Verificar que la mascota existe y pertenece al usuario
    const pet = await getPetById(petId, false);

    if (!pet) {
      throw new Error("Mascota no encontrada");
    }

    if (pet.ownerId !== ownerId) {
      throw new Error("No tienes permiso para eliminar esta mascota");
    }

    await db.collection(PETS_COLLECTION).doc(petId).delete();
  } catch (error: any) {
    logger.error("Error al eliminar mascota:", error);
    throw error;
  }
};

/**
 * Actualizar estado de una mascota (solo admin)
 */
export const updatePetStatusAsAdmin = async (
  petId: string,
  status: "available" | "adopted" | "pending"
): Promise<Pet> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const pet = await getPetById(petId, false);
    if (!pet) {
      throw new Error("Mascota no encontrada");
    }

    await db.collection(PETS_COLLECTION).doc(petId).update({
      status,
      updatedAt: Date.now(),
    });

    return await getPetById(petId, false) as Pet;
  } catch (error: any) {
    logger.error("Error al actualizar estado de mascota:", error);
    throw error;
  }
};

/**
 * Eliminar una mascota (solo admin, sin verificar ownership)
 */
export const deletePetAsAdmin = async (petId: string): Promise<void> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const pet = await getPetById(petId, false);
    if (!pet) {
      throw new Error("Mascota no encontrada");
    }

    await db.collection(PETS_COLLECTION).doc(petId).delete();
  } catch (error: any) {
    logger.error("Error al eliminar mascota como admin:", error);
    throw error;
  }
};
