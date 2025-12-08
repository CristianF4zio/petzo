/**
 * Servicio para estadísticas y analytics
 */

import { db } from "../config/firebaseAdmin";
import { COLLECTIONS } from "../types/database";

/**
 * Obtener estadísticas generales
 */
export const getOverviewStats = async () => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const [
      petsSnapshot,
      usersSnapshot,
      favoritesSnapshot,
      adoptionRequestsSnapshot,
    ] = await Promise.all([
      db.collection(COLLECTIONS.PETS).get(),
      db.collection(COLLECTIONS.USERS).get(),
      db.collection(COLLECTIONS.FAVORITES).get(),
      db.collection(COLLECTIONS.ADOPTION_REQUESTS).get(),
    ]);

    const totalPets = petsSnapshot.size;
    const totalUsers = usersSnapshot.size;
    const totalFavorites = favoritesSnapshot.size;
    const totalAdoptionRequests = adoptionRequestsSnapshot.size;

    // Contar mascotas por estado
    const petsByStatus = {
      available: 0,
      adopted: 0,
      pending: 0,
    };

    petsSnapshot.forEach((doc) => {
      const pet = doc.data();
      if (pet.status === "available") petsByStatus.available++;
      else if (pet.status === "adopted") petsByStatus.adopted++;
      else if (pet.status === "pending") petsByStatus.pending++;
    });

    // Contar mascotas por tipo
    const petsByType = {
      dog: 0,
      cat: 0,
    };

    petsSnapshot.forEach((doc) => {
      const pet = doc.data();
      if (pet.type === "dog") petsByType.dog++;
      else if (pet.type === "cat") petsByType.cat++;
    });

    // Contar solicitudes por estado
    const requestsByStatus = {
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
    };

    adoptionRequestsSnapshot.forEach((doc) => {
      const request = doc.data();
      if (request.status === "pending") requestsByStatus.pending++;
      else if (request.status === "approved") requestsByStatus.approved++;
      else if (request.status === "rejected") requestsByStatus.rejected++;
      else if (request.status === "cancelled") requestsByStatus.cancelled++;
    });

    return {
      totalPets,
      totalUsers,
      totalFavorites,
      totalAdoptionRequests,
      petsByStatus,
      petsByType,
      requestsByStatus,
    };
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    throw new Error("Error al obtener las estadísticas");
  }
};

/**
 * Obtener mascotas por ciudad
 */
export const getPetsByCity = async (limit: number = 10) => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const snapshot = await db.collection(COLLECTIONS.PETS).get();
    const cityCount: Record<string, number> = {};

    snapshot.forEach((doc) => {
      const pet = doc.data();
      const city = pet.city || "Sin ciudad";
      cityCount[city] = (cityCount[city] || 0) + 1;
    });

    const sorted = Object.entries(cityCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([city, count]) => ({ city, count }));

    return sorted;
  } catch (error) {
    console.error("Error al obtener mascotas por ciudad:", error);
    throw new Error("Error al obtener las estadísticas por ciudad");
  }
};

/**
 * Obtener mascotas más vistas
 */
export const getMostViewedPets = async (limit: number = 10) => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const snapshot = await db
      .collection(COLLECTIONS.PETS)
      .orderBy("views", "desc")
      .limit(limit)
      .get();

    const pets: Array<{ id: string; name: string; views: number }> = [];
    snapshot.forEach((doc) => {
      const pet = doc.data();
      pets.push({
        id: doc.id,
        name: pet.name,
        views: pet.views || 0,
      });
    });

    return pets;
  } catch (error) {
    console.error("Error al obtener mascotas más vistas:", error);
    throw new Error("Error al obtener las mascotas más vistas");
  }
};

/**
 * Obtener mascotas más favoritas
 */
export const getMostFavoritedPets = async (limit: number = 10) => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const favoritesSnapshot = await db.collection(COLLECTIONS.FAVORITES).get();
    const petFavoriteCount: Record<string, number> = {};

    favoritesSnapshot.forEach((doc) => {
      const favorite = doc.data();
      const petId = favorite.petId;
      petFavoriteCount[petId] = (petFavoriteCount[petId] || 0) + 1;
    });

    // Obtener detalles de las mascotas más favoritas
    const sortedPetIds = Object.entries(petFavoriteCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([petId]) => petId);

    const pets: Array<{ id: string; name: string; favoriteCount: number }> = [];

    for (const petId of sortedPetIds) {
      const petDoc = await db.collection(COLLECTIONS.PETS).doc(petId).get();
      if (petDoc.exists) {
        const pet = petDoc.data();
        pets.push({
          id: petId,
          name: pet?.name || "Sin nombre",
          favoriteCount: petFavoriteCount[petId],
        });
      }
    }

    return pets;
  } catch (error) {
    console.error("Error al obtener mascotas más favoritas:", error);
    throw new Error("Error al obtener las mascotas más favoritas");
  }
};

