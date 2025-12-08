/**
 * Servicio para gestionar usuarios
 * Conecta con el backend API
 */

import api from "../api";

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  name?: string; // Alias para displayName para compatibilidad
  photoURL?: string;
  phone?: string;
  city?: string;
  bio?: string;
  createdAt: number;
  updatedAt: number;
}

export interface UpdateProfileDto {
  displayName?: string;
  phone?: string;
  city?: string;
  bio?: string;
}

/**
 * Obtener el perfil del usuario autenticado
 */
export const getCurrentUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get<{ success: boolean; user: UserProfile }>(
      "/auth/me"
    );
    return response.data.user;
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    throw error;
  }
};

/**
 * Actualizar el perfil del usuario
 */
export const updateProfile = async (
  profileData: UpdateProfileDto
): Promise<UserProfile> => {
  try {
    const response = await api.put<{ success: boolean; user: UserProfile }>(
      "/auth/profile",
      profileData
    );
    return response.data.user;
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    throw error;
  }
};

/**
 * Obtener un usuario por ID
 */
export const getUserById = async (userId: string): Promise<UserProfile> => {
  try {
    const response = await api.get<{ success: boolean; user: UserProfile }>(
      `/auth/user/${userId}`
    );
    const user = response.data.user;
    // Asegurar que name esté disponible como alias de displayName
    if (!user.name && user.displayName) {
      user.name = user.displayName;
    }
    return user;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    throw error;
  }
};

