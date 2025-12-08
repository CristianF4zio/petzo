/**
 * Servicio para subir imágenes
 * Conecta con el backend API
 */

import api from "../api";

export interface UploadImageResponse {
  url: string;
  publicId: string;
}

/**
 * Subir una imagen a Cloudinary
 */
export const uploadImage = async (file: File): Promise<UploadImageResponse> => {
  try {
    const formData = new FormData();
    formData.append("photo", file); // El backend espera "photo"

    // No establecer Content-Type manualmente, axios lo hace automáticamente para FormData
    const response = await api.post<{ success: boolean; data: UploadImageResponse }>(
      "/uploads/pet-photo",
      formData,
      {
        headers: {
          // Eliminar Content-Type para que axios lo establezca automáticamente con el boundary correcto
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al subir imagen:", error);
    throw error;
  }
};

