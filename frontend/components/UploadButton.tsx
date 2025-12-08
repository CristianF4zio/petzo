/**
 * Componente UploadButton
 * Botón para subir imágenes al backend (Cloudinary)
 */

"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/services/uploads.service";

interface UploadButtonProps {
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: string) => void;
  label?: string;
}

export const UploadButton: React.FC<UploadButtonProps> = ({
  onUploadSuccess,
  onUploadError,
  label = "Subir Foto",
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith("image/")) {
      onUploadError?.("Solo se permiten archivos de imagen");
      return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      onUploadError?.("La imagen debe ser menor a 5MB");
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Subir archivo
    setUploading(true);

    try {
      const result = await uploadImage(file);
      onUploadSuccess(result.url);
    } catch (error: any) {
      console.error("Error al subir imagen:", error);
      onUploadError?.(
        error.response?.data?.error || error.message || "Error al subir la imagen"
      );
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {preview && (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-300">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <label className="cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
        <div className="btn-primary inline-block text-center">
          {uploading ? "Subiendo..." : label}
        </div>
      </label>

      {uploading && (
        <div className="flex items-center space-x-2 text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-petro-500"></div>
          <span className="text-sm">Subiendo imagen...</span>
        </div>
      )}
    </div>
  );
};

