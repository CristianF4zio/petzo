/**
 * Servicio para obtener estadísticas
 */

import api from "../api";
import { Pet } from "./pets.service";

export interface OverviewStats {
  totalPets: number;
  availablePets: number;
  adoptedPets: number;
  pendingPets: number;
  totalUsers: number;
  totalAdoptionRequests: number;
  totalFavorites: number;
}

export interface PetsByCity {
  city: string;
  count: number;
}

/**
 * Obtener estadísticas generales
 */
export const getOverviewStats = async (): Promise<OverviewStats> => {
  try {
    const response = await api.get<{ success: boolean; data: OverviewStats }>(
      "/stats/overview"
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    throw error;
  }
};

/**
 * Obtener mascotas agrupadas por ciudad
 */
export const getPetsByCity = async (limit: number = 10): Promise<PetsByCity[]> => {
  try {
    const response = await api.get<{ success: boolean; data: PetsByCity[] }>(
      `/stats/pets-by-city?limit=${limit}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener mascotas por ciudad:", error);
    throw error;
  }
};

/**
 * Obtener mascotas más vistas
 */
export const getMostViewedPets = async (limit: number = 10): Promise<Pet[]> => {
  try {
    const response = await api.get<{ success: boolean; data: Pet[] }>(
      `/stats/most-viewed?limit=${limit}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener mascotas más vistas:", error);
    throw error;
  }
};

/**
 * Obtener mascotas más favoritas
 */
export const getMostFavoritedPets = async (limit: number = 10): Promise<Pet[]> => {
  try {
    const response = await api.get<{ success: boolean; data: Pet[] }>(
      `/stats/most-favorited?limit=${limit}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener mascotas más favoritas:", error);
    throw error;
  }
};

