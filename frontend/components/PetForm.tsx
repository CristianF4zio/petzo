/**
 * Componente PetForm
 * Formulario para crear o editar una mascota
 */

"use client";

import { useState, FormEvent } from "react";
import { UploadButton } from "./UploadButton";
import { useRouter } from "next/navigation";
import { createPet, updatePet, Pet } from "@/lib/services/pets.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";
import { getCities } from "@/lib/mockData";

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

    // Validaciones de longitud
    if (formData.name.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      setLoading(false);
      return;
    }

    if (formData.name.trim().length > 100) {
      setError("El nombre no puede exceder 100 caracteres");
      setLoading(false);
      return;
    }

    if (formData.city.trim().length < 2) {
      setError("La ciudad debe tener al menos 2 caracteres");
      setLoading(false);
      return;
    }

    if (formData.description && formData.description.length > 2000) {
      setError("La descripción no puede exceder 2000 caracteres");
      setLoading(false);
      return;
    }

    // Validar edad
    if (formData.age < 0 || formData.age > 30) {
      setError("La edad debe estar entre 0 y 30 años");
      setLoading(false);
      return;
    }

    // Validar URL de foto
    try {
      new URL(photoUrl);
    } catch {
      setError("La URL de la foto no es válida");
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
        await updatePet(pet.id, petData);
      } else {
        // Crear nueva mascota
        await createPet(petData);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/pets");
      }
    } catch (err: any) {
      console.error("Error al guardar mascota:", err);
      setError(
        err.response?.data?.error || err.message || "Error al guardar la mascota"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="name">
          Nombre de la mascota <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          placeholder="Ej: Max, Luna, Rocky..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">
            Tipo <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                type: value as "dog" | "cat",
              })
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dog">🐕 Perro</SelectItem>
              <SelectItem value="cat">🐈 Gato</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="age">
            Edad (años) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="age"
            type="number"
            min="0"
            max="30"
            value={formData.age}
            onChange={(e) =>
              setFormData({ ...formData, age: parseInt(e.target.value) || 0 })
            }
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sex">
            Sexo <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.sex}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                sex: value as "male" | "female",
              })
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el sexo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">♂️ Macho</SelectItem>
              <SelectItem value="female">♀️ Hembra</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="city">
            Ciudad <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.city}
            onValueChange={(value) =>
              setFormData({ ...formData, city: value })
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una ciudad" />
            </SelectTrigger>
            <SelectContent>
              {getCities().map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
          placeholder="Describe a la mascota..."
        />
        <p className="text-sm text-[var(--color-text-muted)] mt-2">
          Una buena descripción ayuda a encontrar el hogar perfecto
        </p>
      </div>

      <div>
        <Label>
          Foto de la mascota <span className="text-red-500">*</span>
        </Label>
        {photoUrl ? (
          <div className="space-y-2 mt-2">
            <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-[var(--color-border)]">
              <img
                src={photoUrl}
                alt="Foto de la mascota"
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPhotoUrl("")}
            >
              <X className="w-4 h-4 mr-2" />
              Cambiar foto
            </Button>
          </div>
        ) : (
          <div className="mt-2">
            <UploadButton
              onUploadSuccess={(url) => {
                setPhotoUrl(url);
                setError(null);
              }}
              onUploadError={(error) => {
                setError(error);
              }}
              label="Subir Foto"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="flex-1"
          disabled={loading}
        >
          {loading
            ? "Guardando..."
            : pet
            ? "Actualizar Mascota"
            : "Publicar Mascota"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

