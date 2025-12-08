/**
 * Servicio para gestionar favoritos
 * Conecta con el backend API
 */

import api from "../api";

export interface Favorite {
  id: string;
  userId: string;
  petId: string;
  createdAt: number;
}

/**
 * Obtener todos los favoritos del usuario autenticado
 */
export const getFavorites = async (): Promise<Favorite[]> => {
  try {
    const response = await api.get<{ success: boolean; data: Favorite[] }>(
      "/favorites"
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    throw error;
  }
};

/**
 * Agregar una mascota a favoritos
 */
export const addFavorite = async (petId: string): Promise<Favorite> => {
  try {
    const response = await api.post<{ success: boolean; data: Favorite }>(
      `/favorites/${petId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al agregar favorito:", error);
    throw error;
  }
};

/**
 * Eliminar una mascota de favoritos
 */
export const removeFavorite = async (petId: string): Promise<void> => {
  try {
    await api.delete(`/favorites/${petId}`);
  } catch (error) {
    console.error("Error al eliminar favorito:", error);
    throw error;
  }
};

/**
 * Verificar si una mascota está en favoritos
 */
export const isFavorite = async (petId: string): Promise<boolean> => {
  try {
    const response = await api.get<{ success: boolean; isFavorite: boolean }>(
      `/favorites/check/${petId}`
    );
    return response.data.isFavorite;
  } catch (error) {
    console.error("Error al verificar favorito:", error);
    return false;
  }
};

/**
 * Obtener el conteo de favoritos de una mascota
 */
export const getFavoriteCount = async (petId: string): Promise<number> => {
  try {
    const response = await api.get<{ success: boolean; count: number }>(
      `/favorites/count/${petId}`
    );
    return response.data.count;
  } catch (error) {
    console.error("Error al obtener conteo de favoritos:", error);
    return 0;
  }
};

