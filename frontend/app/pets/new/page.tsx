/**
 * Página para crear una nueva mascota
 * Requiere autenticación
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Upload, Save, X } from "lucide-react";
import { getCities } from "@/lib/mockData";

export default function NewPetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    size: "",
    gender: "",
    city: "",
    description: "",
    vaccinated: false,
    sterilized: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulación de guardado
    setTimeout(() => {
      alert("¡Mascota publicada exitosamente! (Modo demo)");
      router.push("/dashboard");
    }, 1000);
  };

  const handleChange = (
    field: string,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[var(--color-background)]">
        <Navbar />

        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] mb-3">
              Publicar Nueva Mascota
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)]">
              Ayuda a una mascota a encontrar un hogar lleno de amor
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nombre */}
                <div>
                  <Label htmlFor="name">
                    Nombre de la mascota <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ej: Max, Luna, Rocky..."
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>

                {/* Tipo y Raza */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="species">
                      Tipo <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.species}
                      onValueChange={(value) => handleChange("species", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="perro">🐕 Perro</SelectItem>
                        <SelectItem value="gato">🐈 Gato</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="breed">Raza</Label>
                    <Input
                      id="breed"
                      placeholder="Ej: Labrador, Siamés..."
                      value={formData.breed}
                      onChange={(e) => handleChange("breed", e.target.value)}
                    />
                  </div>
                </div>

                {/* Edad, Tamaño, Género */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="age">
                      Edad <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="age"
                      placeholder="Ej: 2 años, 6 meses..."
                      value={formData.age}
                      onChange={(e) => handleChange("age", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="size">
                      Tamaño <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.size}
                      onValueChange={(value) => handleChange("size", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tamaño" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pequeño">Pequeño</SelectItem>
                        <SelectItem value="mediano">Mediano</SelectItem>
                        <SelectItem value="grande">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="gender">
                      Género <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleChange("gender", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="macho">♂️ Macho</SelectItem>
                        <SelectItem value="hembra">♀️ Hembra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Ciudad */}
                <div>
                  <Label htmlFor="city">
                    Ciudad <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.city}
                    onValueChange={(value) => handleChange("city", value)}
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

                {/* Descripción */}
                <div>
                  <Label htmlFor="description">
                    Descripción <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Cuéntanos sobre la personalidad, hábitos y necesidades especiales de la mascota..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={6}
                    required
                  />
                  <p className="text-sm text-[var(--color-text-muted)] mt-2">
                    Una buena descripción ayuda a encontrar el hogar perfecto
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Estado de Salud</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[var(--color-surface)] rounded-[var(--radius-md)]">
                  <div>
                    <Label htmlFor="vaccinated" className="text-base font-medium">
                      Vacunado
                    </Label>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                      ¿La mascota tiene sus vacunas al día?
                    </p>
                  </div>
                  <Switch
                    id="vaccinated"
                    checked={formData.vaccinated}
                    onCheckedChange={(checked) =>
                      handleChange("vaccinated", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[var(--color-surface)] rounded-[var(--radius-md)]">
                  <div>
                    <Label htmlFor="sterilized" className="text-base font-medium">
                      Esterilizado
                    </Label>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                      ¿La mascota está esterilizada/castrada?
                    </p>
                  </div>
                  <Switch
                    id="sterilized"
                    checked={formData.sterilized}
                    onCheckedChange={(checked) =>
                      handleChange("sterilized", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Imágenes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] p-12 text-center hover:border-[var(--color-primary)] transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-muted)]" />
                  <p className="text-[var(--color-text-secondary)] mb-2">
                    <span className="font-semibold text-[var(--color-primary)]">
                      Haz clic para subir
                    </span>{" "}
                    o arrastra y suelta
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    PNG, JPG o WEBP (máx. 5MB por imagen)
                  </p>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] mt-3">
                  💡 Las fotos de buena calidad aumentan las posibilidades de
                  adopción
                </p>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  "Publicando..."
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Publicar Mascota
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.back()}
                disabled={loading}
              >
                <X className="w-5 h-5 mr-2" />
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
