/**
 * Servicio para gestionar mascotas
 * Conecta con el backend API
 */

import api from "../api";

export interface Pet {
  id: string;
  name: string;
  type: "dog" | "cat";
  age: number;
  sex: "male" | "female";
  size?: "small" | "medium" | "large";
  city: string;
  description: string;
  photoUrl: string;
  photos?: string[]; // Múltiples imágenes
  ownerId: string;
  createdAt: number;
  updatedAt: number;
  status: "available" | "pending" | "adopted";
  views: number;
  likes: number;
}

export interface CreatePetDto {
  name: string;
  type: "dog" | "cat";
  age: number;
  sex: "male" | "female";
  city: string;
  description: string;
  photoUrl: string;
}

export interface UpdatePetDto extends Partial<CreatePetDto> {}

export interface PetsFilters {
  type?: "dog" | "cat";
  city?: string;
  ownerId?: string;
  status?: "available" | "pending" | "adopted";
  sex?: "male" | "female";
  size?: "small" | "medium" | "large";
  minAge?: number;
  maxAge?: number;
  search?: string; // Búsqueda por texto
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Obtener todas las mascotas con filtros opcionales y paginación
 */
export const getPets = async (
  filters?: PetsFilters,
  pagination?: PaginationParams
): Promise<PaginatedResponse<Pet>> => {
  try {
    const params = new URLSearchParams();
    
    // Filtros
    if (filters?.type) params.append("type", filters.type);
    if (filters?.city) params.append("city", filters.city);
    if (filters?.ownerId) params.append("ownerId", filters.ownerId);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.sex) params.append("sex", filters.sex);
    if (filters?.size) params.append("size", filters.size);
    if (filters?.minAge !== undefined) params.append("minAge", filters.minAge.toString());
    if (filters?.maxAge !== undefined) params.append("maxAge", filters.maxAge.toString());
    if (filters?.search) params.append("search", filters.search);
    
    // Paginación
    if (pagination?.page) params.append("page", pagination.page.toString());
    if (pagination?.limit) params.append("limit", pagination.limit.toString());

    const queryString = params.toString();
    const response = await api.get<{ success: boolean } & PaginatedResponse<Pet>>(
      `/pets${queryString ? `?${queryString}` : ""}`
    );
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error("Error al obtener mascotas:", error);
    throw error;
  }
};

/**
 * Obtener una mascota por ID
 */
export const getPetById = async (id: string): Promise<Pet> => {
  try {
    const response = await api.get<{ success: boolean; data: Pet }>(`/pets/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener mascota:", error);
    throw error;
  }
};

/**
 * Crear una nueva mascota
 */
export const createPet = async (petData: CreatePetDto): Promise<Pet> => {
  try {
    const response = await api.post<{ success: boolean; data: Pet }>(
      "/pets",
      petData
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al crear mascota:", error);
    throw error;
  }
};

/**
 * Actualizar una mascota existente
 */
export const updatePet = async (
  id: string,
  petData: UpdatePetDto
): Promise<Pet> => {
  try {
    const response = await api.put<{ success: boolean; data: Pet }>(
      `/pets/${id}`,
      petData
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al actualizar mascota:", error);
    throw error;
  }
};

/**
 * Eliminar una mascota
 */
export const deletePet = async (id: string): Promise<void> => {
  try {
    await api.delete(`/pets/${id}`);
  } catch (error) {
    console.error("Error al eliminar mascota:", error);
    throw error;
  }
};

