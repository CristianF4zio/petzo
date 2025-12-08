/**
 * Página de detalle de una mascota
 * Muestra información completa de una mascota específica
 */

"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  MapPin,
  Calendar,
  Share2,
  ArrowLeft,
  Check,
  X,
  Edit,
  MessageCircle,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PetCard } from "@/components/PetCard";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { getPetById, Pet } from "@/lib/services/pets.service";
import { isFavorite, addFavorite, removeFavorite } from "@/lib/services/favorites.service";
import { getPets } from "@/lib/services/pets.service";
import { createAdoptionRequest } from "@/lib/services/adoptionRequests.service";
import { createReport } from "@/lib/services/reports.service";
import { getOrCreateConversation } from "@/lib/services/conversations.service";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [relatedPets, setRelatedPets] = useState<Pet[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [favoriteStatus, setFavoriteStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adoptionDialogOpen, setAdoptionDialogOpen] = useState(false);
  const [adoptionMessage, setAdoptionMessage] = useState("");
  const [submittingAdoption, setSubmittingAdoption] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState<"spam" | "inappropriate" | "false_information" | "harassment" | "other">("other");
  const [reportDescription, setReportDescription] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);
  const [startingConversation, setStartingConversation] = useState(false);

  useEffect(() => {
    loadPet();
  }, [params.id]);

  useEffect(() => {
    if (user && pet) {
      checkFavoriteStatus();
    }
  }, [user, pet]);

  const loadPet = async () => {
    try {
      setLoading(true);
      setError(null);
      const petData = await getPetById(params.id as string);
      setPet(petData);
      
      // Cargar mascotas relacionadas (mismo tipo y ciudad)
      const relatedResult = await getPets({
        type: petData.type,
        city: petData.city,
      }, { page: 1, limit: 10 });
      setRelatedPets(relatedResult.data.filter(p => p.id !== petData.id).slice(0, 3));
    } catch (err: any) {
      console.error("Error al cargar mascota:", err);
      setError("Error al cargar la mascota");
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    if (!user || !pet) return;
    try {
      const favorite = await isFavorite(pet.id);
      setFavoriteStatus(favorite);
    } catch (err) {
      console.error("Error al verificar favorito:", err);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (!pet) return;

    try {
      if (favoriteStatus) {
        await removeFavorite(pet.id);
        setFavoriteStatus(false);
      } else {
        await addFavorite(pet.id);
        setFavoriteStatus(true);
      }
    } catch (err: any) {
      console.error("Error al actualizar favorito:", err);
      alert(err.response?.data?.error || "Error al actualizar favorito");
    }
  };

  const handleAdoptionRequest = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (!pet) return;

    // No permitir que el dueño solicite adoptar su propia mascota
    if (pet.ownerId === user.uid) {
      alert("No puedes solicitar adoptar tu propia mascota");
      return;
    }

    setSubmittingAdoption(true);
    try {
      await createAdoptionRequest({
        petId: pet.id,
        message: adoptionMessage.trim() || undefined,
      });
      alert("¡Solicitud de adopción enviada exitosamente! El dueño se pondrá en contacto contigo.");
      setAdoptionDialogOpen(false);
      setAdoptionMessage("");
    } catch (err: any) {
      console.error("Error al crear solicitud de adopción:", err);
      alert(err.response?.data?.error || "Error al enviar la solicitud de adopción");
    } finally {
      setSubmittingAdoption(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
          <div className="text-6xl mb-4">🐾</div>
          <p className="text-[var(--color-text-secondary)]">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
          <div className="text-6xl mb-4">😿</div>
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            Mascota no encontrada
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-6">
            {error || "La mascota que buscas no existe o ha sido adoptada"}
          </p>
          <Link href="/pets">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al listado
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Convertir Pet del backend a formato para mostrar
  // Usar múltiples imágenes si están disponibles, sino usar photoUrl
  const petImages = pet.photos && pet.photos.length > 0 ? pet.photos : [pet.photoUrl];
  
  const statusMap: Record<string, string> = {
    available: "disponible",
    pending: "reservado",
    adopted: "adoptado",
  };
  
  const genderMap: Record<string, string> = {
    male: "macho",
    female: "hembra",
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Botón volver */}
        <Link
          href="/pets"
          className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al listado
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Galería de Imágenes */}
          <div className="space-y-4">
            {/* Imagen principal */}
            <div className="relative aspect-[4/3] rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-lg)]">
              <ImageWithFallback
                src={petImages[selectedImage] || pet.photoUrl}
                alt={`${pet.name} - Imagen ${selectedImage + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Miniaturas */}
            {petImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {petImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-[var(--radius-md)] overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-[var(--color-primary)] shadow-md"
                        : "border-transparent hover:border-[var(--color-border)]"
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${pet.name} - Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información Principal */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <CardTitle className="text-4xl mb-2">{pet.name}</CardTitle>
                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                      <span className="text-lg capitalize">{pet.type === "dog" ? "Perro" : "Gato"}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0"
                      onClick={handleToggleFavorite}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favoriteStatus
                            ? "fill-[var(--color-primary)] text-[var(--color-primary)]"
                            : ""
                        }`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0"
                      onClick={async (e) => {
                        e.preventDefault();
                        if (navigator.share && pet) {
                          try {
                            await navigator.share({
                              title: `${pet.name} - En adopción`,
                              text: `Mira a ${pet.name}, está buscando un hogar amoroso en ${pet.city}`,
                              url: window.location.href,
                            });
                          } catch (err) {
                            // Usuario canceló o error al compartir
                            console.log("Error al compartir:", err);
                          }
                        } else {
                          // Fallback: copiar al portapapeles
                          navigator.clipboard.writeText(window.location.href);
                          alert("¡Enlace copiado al portapapeles!");
                        }
                      }}
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  className="w-fit bg-[var(--color-accent)] text-[var(--color-text-primary)]"
                >
                  {pet.status === "available" && "✅ Disponible para adopción"}
                  {pet.status === "pending" && "⏳ Reservado"}
                  {pet.status === "adopted" && "❤️ Adoptado"}
                </Badge>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-[var(--color-surface)] rounded-[var(--radius-md)]">
                    <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Edad
                      </p>
                      <p className="font-semibold">{pet.age} {pet.age === 1 ? "año" : "años"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-[var(--color-surface)] rounded-[var(--radius-md)]">
                    <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Ubicación
                      </p>
                      <p className="font-semibold">{pet.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-[var(--color-surface)] rounded-[var(--radius-md)]">
                    <span className="text-xl">
                      {pet.sex === "male" ? "♂️" : "♀️"}
                    </span>
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Género
                      </p>
                      <p className="font-semibold capitalize">{genderMap[pet.sex] || pet.sex}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-[var(--color-surface)] rounded-[var(--radius-md)]">
                    <span className="text-xl">👁️</span>
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Vistas
                      </p>
                      <p className="font-semibold">{pet.views}</p>
                    </div>
                  </div>
                </div>

                {pet.ownerId === user?.uid ? (
                  <Link href={`/pets/${pet.id}/edit`} className="block">
                    <Button variant="secondary" size="lg" className="w-full mt-6">
                      <Edit className="w-5 h-5 mr-2" />
                      Editar Mascota
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-3 mt-6">
                    <Dialog open={adoptionDialogOpen} onOpenChange={setAdoptionDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="primary"
                          size="lg"
                          className="w-full"
                          disabled={pet.status !== "available"}
                        >
                          {pet.status === "available"
                            ? "Solicitar Adopción"
                            : "No disponible"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Solicitar Adopción de {pet.name}</DialogTitle>
                        <DialogDescription>
                          Envía un mensaje al dueño explicando por qué serías un buen hogar para {pet.name}.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Mensaje (opcional)
                          </label>
                          <Textarea
                            value={adoptionMessage}
                            onChange={(e) => setAdoptionMessage(e.target.value)}
                            placeholder="Cuéntale al dueño sobre ti y por qué serías un buen hogar para esta mascota..."
                            rows={5}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setAdoptionDialogOpen(false);
                            setAdoptionMessage("");
                          }}
                          disabled={submittingAdoption}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleAdoptionRequest}
                          disabled={submittingAdoption}
                        >
                          {submittingAdoption ? "Enviando..." : "Enviar Solicitud"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Botón para iniciar conversación */}
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={async () => {
                      if (!user) {
                        router.push("/auth/login");
                        return;
                      }

                      if (pet.ownerId === user.uid) {
                        alert("No puedes iniciar una conversación contigo mismo");
                        return;
                      }

                      setStartingConversation(true);
                      try {
                        const conversation = await getOrCreateConversation({
                          participantId: pet.ownerId,
                          petId: pet.id,
                        });
                        router.push(`/messages/${conversation.id}`);
                      } catch (err: any) {
                        console.error("Error al iniciar conversación:", err);
                        alert(err.response?.data?.error || "Error al iniciar la conversación");
                      } finally {
                        setStartingConversation(false);
                      }
                    }}
                    disabled={startingConversation}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {startingConversation ? "Iniciando..." : "Enviar Mensaje"}
                  </Button>
                  </div>
                )}

                {/* Botón de reportar */}
                {user && pet.ownerId !== user.uid && (
                  <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                      >
                        Reportar publicación
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reportar publicación</DialogTitle>
                        <DialogDescription>
                          ¿Por qué quieres reportar esta publicación?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Razón
                          </label>
                          <Select
                            value={reportReason}
                            onValueChange={(value: any) => setReportReason(value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="spam">Spam</SelectItem>
                              <SelectItem value="inappropriate">Contenido inapropiado</SelectItem>
                              <SelectItem value="false_information">Información falsa</SelectItem>
                              <SelectItem value="harassment">Acoso</SelectItem>
                              <SelectItem value="other">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Descripción
                          </label>
                          <Textarea
                            value={reportDescription}
                            onChange={(e) => setReportDescription(e.target.value)}
                            placeholder="Describe el problema..."
                            rows={4}
                            maxLength={1000}
                          />
                          <p className="text-xs text-[var(--color-text-muted)] mt-1">
                            {reportDescription.length}/1000 caracteres
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setReportDialogOpen(false);
                            setReportDescription("");
                            setReportReason("other");
                          }}
                          disabled={submittingReport}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="primary"
                          onClick={async () => {
                            if (!reportDescription.trim()) {
                              alert("Por favor, proporciona una descripción del problema");
                              return;
                            }
                            setSubmittingReport(true);
                            try {
                              await createReport({
                                type: "pet",
                                reportedPetId: pet.id,
                                reason: reportReason,
                                description: reportDescription.trim(),
                              });
                              alert("Reporte enviado. Gracias por ayudarnos a mantener la comunidad segura.");
                              setReportDialogOpen(false);
                              setReportDescription("");
                              setReportReason("other");
                            } catch (err: any) {
                              console.error("Error al reportar:", err);
                              alert(err.response?.data?.error || "Error al enviar el reporte");
                            } finally {
                              setSubmittingReport(false);
                            }
                          }}
                          disabled={submittingReport}
                        >
                          {submittingReport ? "Enviando..." : "Enviar reporte"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Descripción */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Sobre {pet.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
              {pet.description}
            </p>
          </CardContent>
        </Card>

        {/* Información del Dueño/Refugio */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Publicado por</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-2xl font-bold">
                {pet.ownerId.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-1">Usuario</h4>
                <p className="text-sm text-[var(--color-text-muted)] mt-2">
                  Publicado el{" "}
                  {new Date(pet.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mascotas relacionadas */}
        {relatedPets.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">
              Mascotas similares
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPets.map((relatedPet) => {
                const speciesMap: Record<string, "perro" | "gato"> = {
                  dog: "perro",
                  cat: "gato",
                };
                return (
                  <PetCard
                    key={relatedPet.id}
                    id={relatedPet.id}
                    name={relatedPet.name}
                    species={speciesMap[relatedPet.type] || "perro"}
                    breed=""
                    age={`${relatedPet.age} ${relatedPet.age === 1 ? "año" : "años"}`}
                    imageUrl={relatedPet.photoUrl}
                    location={relatedPet.city}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
