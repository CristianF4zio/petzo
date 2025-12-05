/**
 * Componente PetForm
 * Formulario para crear o editar una mascota
 */

"use client";

import { useState, FormEvent } from "react";
import { UploadButton } from "./UploadButton";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Pet } from "./PetCard";

interface PetFormProps {
  pet?: Pet; // Si se proporciona, es edición
  onSuccess?: () => void;
}

export const PetForm: React.FC<PetFormProps> = ({ pet, onSuccess }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState(pet?.photoUrl || "");

  const [formData, setFormData] = useState({
    name: pet?.name || "",
    type: pet?.type || ("dog" as "dog" | "cat"),
    age: pet?.age || 0,
    sex: pet?.sex || ("male" as "male" | "female"),
    city: pet?.city || "",
    description: pet?.description || "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validación básica
    if (!formData.name || !formData.city || !photoUrl) {
      setError("Por favor completa todos los campos requeridos");
      setLoading(false);
      return;
    }

    try {
      const petData = {
        ...formData,
        photoUrl,
      };

      if (pet) {
        // Editar mascota existente
        await api.put(`/pets/${pet.id}`, petData);
      } else {
        // Crear nueva mascota
        await api.post("/pets", petData);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/pets");
      }
    } catch (err: any) {
      console.error("Error al guardar mascota:", err);
      setError(
        err.response?.data?.error || "Error al guardar la mascota"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre de la mascota *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="input-field"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo *
          </label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as "dog" | "cat",
              })
            }
            className="input-field"
            required
          >
            <option value="dog">🐕 Perro</option>
            <option value="cat">🐈 Gato</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Edad (años) *
          </label>
          <input
            type="number"
            min="0"
            max="30"
            value={formData.age}
            onChange={(e) =>
              setFormData({ ...formData, age: parseInt(e.target.value) || 0 })
            }
            className="input-field"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sexo *
          </label>
          <select
            value={formData.sex}
            onChange={(e) =>
              setFormData({
                ...formData,
                sex: e.target.value as "male" | "female",
              })
            }
            className="input-field"
            required
          >
            <option value="male">Macho</option>
            <option value="female">Hembra</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ciudad *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
            className="input-field"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
          className="input-field"
          placeholder="Describe a la mascota..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Foto de la mascota *
        </label>
        {photoUrl ? (
          <div className="space-y-2">
            <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-300">
              <img
                src={photoUrl}
                alt="Foto de la mascota"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => setPhotoUrl("")}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Cambiar foto
            </button>
          </div>
        ) : (
          <UploadButton
            onUploadSuccess={(url) => {
              setPhotoUrl(url);
            }}
            onUploadError={(error) => {
              setError(error);
            }}
            label="Subir Foto"
          />
        )}
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Guardando..."
            : pet
            ? "Actualizar Mascota"
            : "Publicar Mascota"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-outline"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

