/**
 * Servicio para manejar favoritos
 * Permite a los usuarios guardar mascotas como favoritas
 */

import { db } from "../config/firebaseAdmin";
import { COLLECTIONS } from "../types/database";

const FAVORITES_COLLECTION = COLLECTIONS.FAVORITES;

export interface Favorite {
  id: string;
  userId: string;
  petId: string;
  createdAt: number;
}

/**
 * Agregar una mascota a favoritos
 */
export const addFavorite = async (
  userId: string,
  petId: string
): Promise<Favorite> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    // Verificar si ya existe
    const existing = await db
      .collection(FAVORITES_COLLECTION)
      .where("userId", "==", userId)
      .where("petId", "==", petId)
      .limit(1)
      .get();

    if (!existing.empty) {
      const doc = existing.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as Favorite;
    }

    // Crear nuevo favorito
    const favoriteData = {
      userId,
      petId,
      createdAt: Date.now(),
    };

    const docRef = await db.collection(FAVORITES_COLLECTION).add(favoriteData);

    return {
      id: docRef.id,
      ...favoriteData,
    };
  } catch (error) {
    console.error("Error al agregar favorito:", error);
    throw new Error("Error al agregar a favoritos");
  }
};

/**
 * Eliminar una mascota de favoritos
 */
export const removeFavorite = async (
  userId: string,
  petId: string
): Promise<void> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const snapshot = await db
      .collection(FAVORITES_COLLECTION)
      .where("userId", "==", userId)
      .where("petId", "==", petId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      throw new Error("Favorito no encontrado");
    }

    await snapshot.docs[0].ref.delete();
  } catch (error: any) {
    console.error("Error al eliminar favorito:", error);
    throw error;
  }
};

/**
 * Obtener todos los favoritos de un usuario
 */
export const getUserFavorites = async (userId: string): Promise<Favorite[]> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const snapshot = await db
      .collection(FAVORITES_COLLECTION)
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Favorite[];
  } catch (error: any) {
    console.error("Error al obtener favoritos:", error);
    
    // Si es un error de índice faltante o en construcción
    if (error.code === 9 || error.details?.includes("index")) {
      if (error.details?.includes("currently building")) {
        const indexLink = error.details?.match(/https:\/\/[^\s]+/)?.[0];
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
          console.error("\n⚠️  ÍNDICE FALTANTE EN FIRESTORE");
          console.error("📋 Firestore requiere un índice compuesto para esta consulta.");
          console.error("🔗 Crea el índice aquí:");
          console.error(`   ${indexLink}\n`);
        }
        throw new Error(
          "Índice faltante en Firestore. Revisa la consola para ver el enlace de creación."
        );
      }
    }
    
    throw new Error("Error al obtener favoritos");
  }
};

/**
 * Verificar si una mascota está en favoritos del usuario
 */
export const isFavorite = async (
  userId: string,
  petId: string
): Promise<boolean> => {
  try {
    if (!db) {
      return false;
    }

    const snapshot = await db
      .collection(FAVORITES_COLLECTION)
      .where("userId", "==", userId)
      .where("petId", "==", petId)
      .limit(1)
      .get();

    return !snapshot.empty;
  } catch (error) {
    console.error("Error al verificar favorito:", error);
    return false;
  }
};

/**
 * Obtener el conteo de favoritos de una mascota
 */
export const getPetFavoriteCount = async (petId: string): Promise<number> => {
  try {
    if (!db) {
      return 0;
    }

    const snapshot = await db
      .collection(FAVORITES_COLLECTION)
      .where("petId", "==", petId)
      .get();

    return snapshot.size;
  } catch (error) {
    console.error("Error al obtener conteo de favoritos:", error);
    return 0;
  }
};

