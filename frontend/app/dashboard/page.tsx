/**
 * Dashboard del usuario
 * Muestra las mascotas publicadas por el usuario autenticado y sus favoritos
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Eye, MessageCircle, Edit, Trash2, Plus, Bell, Check, X } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PetCard } from "@/components/PetCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { getPets, Pet, deletePet } from "@/lib/services/pets.service";
import { getFavorites } from "@/lib/services/favorites.service";
import { updateProfile } from "@/lib/services/users.service";
import {
  getReceivedAdoptionRequests,
  getMyAdoptionRequests,
  updateAdoptionRequestStatus,
  AdoptionRequest,
} from "@/lib/services/adoptionRequests.service";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  Notification,
} from "@/lib/services/notifications.service";
import { changePassword, deleteAccount } from "@/lib/auth";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [favoritePets, setFavoritePets] = useState<Pet[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [receivedRequests, setReceivedRequests] = useState<AdoptionRequest[]>([]);
  const [myRequests, setMyRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el perfil
  const [profileData, setProfileData] = useState({
    name: user?.displayName || "",
    phone: "",
    city: "",
    bio: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  
  // Estados para cambiar contraseña
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Estados para eliminar cuenta
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
      setProfileData({
        name: user.displayName || "",
        phone: "",
        city: "",
        bio: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Cargar mascotas del usuario
      const petsResult = await getPets({ ownerId: user.uid }, { page: 1, limit: 100 });
      setUserPets(petsResult.data);

      // Cargar favoritos
      const favorites = await getFavorites();
      
      // Obtener detalles de las mascotas favoritas
      const favoritePetIds = favorites.map(f => f.petId);
      const favoritePetDetails = await Promise.all(
        favoritePetIds.map(async (petId) => {
          try {
            const { getPetById } = await import("@/lib/services/pets.service");
            return await getPetById(petId);
          } catch {
            return null;
          }
        })
      );
      
      setFavoritePets(favoritePetDetails.filter((pet): pet is Pet => pet !== null));

      // Cargar notificaciones
      const notificationsResult = await getNotifications(1, 20);
      setNotifications(notificationsResult.data);

      // Cargar conteo de no leídas
      const unread = await getUnreadCount();
      setUnreadCount(unread);

      // Cargar solicitudes de adopción recibidas
      const received = await getReceivedAdoptionRequests();
      setReceivedRequests(received);

      // Cargar mis solicitudes de adopción
      const myReqs = await getMyAdoptionRequests();
      setMyRequests(myReqs);
    } catch (err: any) {
      console.error("Error al cargar datos del dashboard:", err);
      setError("Error al cargar los datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    // Validaciones
    if (profileData.name && profileData.name.length > 100) {
      alert("El nombre no puede exceder 100 caracteres");
      return;
    }

    if (profileData.phone && profileData.phone.length > 20) {
      alert("El teléfono no puede exceder 20 caracteres");
      return;
    }

    if (profileData.city && profileData.city.length > 100) {
      alert("La ciudad no puede exceder 100 caracteres");
      return;
    }

    if (profileData.bio && profileData.bio.length > 500) {
      alert("La biografía no puede exceder 500 caracteres");
      return;
    }

    setSavingProfile(true);
    try {
      await updateProfile({
        displayName: profileData.name.trim() || undefined,
        phone: profileData.phone.trim() || undefined,
        city: profileData.city.trim() || undefined,
        bio: profileData.bio.trim() || undefined,
      });
      alert("Perfil actualizado exitosamente");
      // Recargar datos del usuario si es necesario
      if (user) {
        // Actualizar el displayName en Firebase Auth si cambió
        if (profileData.name !== user.displayName) {
          // Esto se actualizará automáticamente en el contexto cuando Firebase Auth se actualice
        }
      }
    } catch (err: any) {
      console.error("Error al actualizar perfil:", err);
      const errorMessage = err.response?.data?.details 
        ? err.response.data.details.join(", ")
        : err.response?.data?.error || "Error al actualizar el perfil";
      alert(errorMessage);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.newPassword || passwordData.newPassword.trim().length === 0) {
      alert("La nueva contraseña es requerida");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (passwordData.newPassword.length > 128) {
      alert("La contraseña no puede exceder 128 caracteres");
      return;
    }

    setChangingPassword(true);
    try {
      const result = await changePassword(passwordData.newPassword);
      if (result.success) {
        alert("Contraseña cambiada exitosamente");
        setPasswordDialogOpen(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        alert(result.error || "Error al cambiar la contraseña");
      }
    } catch (err: any) {
      console.error("Error al cambiar contraseña:", err);
      alert("Error al cambiar la contraseña");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmText = "ELIMINAR";
    const userInput = prompt(
      `Esta acción es irreversible. Escribe "${confirmText}" para confirmar:`
    );

    if (userInput !== confirmText) {
      return;
    }

    setDeletingAccount(true);
    try {
      const result = await deleteAccount();
      if (result.success) {
        alert("Cuenta eliminada exitosamente");
        router.push("/");
        // El contexto de autenticación detectará que el usuario fue eliminado
      } else {
        alert(result.error || "Error al eliminar la cuenta");
      }
    } catch (err: any) {
      console.error("Error al eliminar cuenta:", err);
      alert("Error al eliminar la cuenta. Asegúrate de haber iniciado sesión recientemente.");
    } finally {
      setDeletingAccount(false);
      setDeleteDialogOpen(false);
    }
  };

  const stats = {
    publications: userPets.length,
    views: userPets.reduce((sum, pet) => sum + pet.views, 0),
    contacts: receivedRequests.filter(r => r.status === "pending").length,
    favorites: favoritePets.length,
  };

  // Convertir Pet del backend a formato compatible con PetCard
  const convertPetForCard = (pet: Pet) => {
    const speciesMap: Record<string, "perro" | "gato"> = {
      dog: "perro",
      cat: "gato",
    };
    return {
      id: pet.id,
      name: pet.name,
      species: speciesMap[pet.type] || "perro",
      breed: "", // No tenemos breed en el backend por ahora
      age: `${pet.age} ${pet.age === 1 ? "año" : "años"}`,
      imageUrl: pet.photoUrl,
      location: pet.city,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🐾</div>
            <p className="text-[var(--color-text-secondary)]">Cargando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😿</div>
            <h3 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
              Error al cargar el dashboard
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-6">{error}</p>
            <Button onClick={loadDashboardData}>Intentar de nuevo</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] relative">
      <Navbar />
      
      {/* Sistema de partículas - Interactivo */}

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <Badge variant="secondary" className="text-sm px-4 py-1.5">
              Panel de Control
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-[var(--color-text-primary)]" style={{ lineHeight: '1.15' }}>
              <span className="bg-gradient-to-r from-[var(--color-text-primary)] via-[var(--color-text-primary)] to-[var(--color-primary)] bg-clip-text text-transparent inline-block" style={{ paddingBottom: '0.15em', lineHeight: '1.2' }}>
                Mi Dashboard
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-[var(--color-text-secondary)] font-medium">
              Gestiona tus publicaciones y favoritos
            </p>
          </div>
          <Link href="/pets/new">
            <Button variant="primary" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Publicar Mascota
            </Button>
          </Link>
        </div>

        {/* Tarjeta de Usuario */}
        <Card className="mb-10 bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface)] to-[var(--color-background)] border-2 border-[var(--color-border)]/50 rounded-2xl">
          <CardContent className="p-10">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-[var(--color-primary)]/40 shadow-xl">
                <AvatarImage src={user?.photoURL || undefined} />
                <AvatarFallback className="bg-[var(--color-primary)] text-[var(--color-background)] text-2xl">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold mb-1 text-[var(--color-text-primary)]">
                  {user?.displayName || "Usuario PETZO"}
                </h2>
                <p className="text-[var(--color-text-secondary)]">{user?.email}</p>
                <Badge variant="secondary" className="mt-2">
                  Miembro activo
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="border border-[var(--color-border)]/50 rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary)]/10 shadow-lg mx-auto mb-4">
                <Edit className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <div className="text-4xl font-extrabold text-[var(--color-text-primary)] mb-2">
                {stats.publications}
              </div>
              <div className="text-base font-medium text-[var(--color-text-secondary)]">
                Publicaciones
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[var(--color-border)]/50 rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary)]/10 shadow-lg mx-auto mb-4">
                <Eye className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <div className="text-4xl font-extrabold text-[var(--color-text-primary)] mb-2">
                {stats.views}
              </div>
              <div className="text-base font-medium text-[var(--color-text-secondary)]">
                Visualizaciones
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[var(--color-border)]/50 rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary)]/10 shadow-lg mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <div className="text-4xl font-extrabold text-[var(--color-text-primary)] mb-2">
                {stats.contacts}
              </div>
              <div className="text-base font-medium text-[var(--color-text-secondary)]">
                Contactos
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[var(--color-border)]/50 rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary)]/10 shadow-lg mx-auto mb-4">
                <Heart className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <div className="text-4xl font-extrabold text-[var(--color-text-primary)] mb-2">
                {stats.favorites}
              </div>
              <div className="text-base font-medium text-[var(--color-text-secondary)]">
                Favoritos
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="publications" className="space-y-6">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger value="publications" className="flex-1 lg:flex-none">
              Mis Publicaciones
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex-1 lg:flex-none">
              Favoritos
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 lg:flex-none relative">
              Notificaciones
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="adoption-requests" className="flex-1 lg:flex-none relative">
              Solicitudes
              {receivedRequests.filter(r => r.status === "pending").length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {receivedRequests.filter(r => r.status === "pending").length > 9 ? "9+" : receivedRequests.filter(r => r.status === "pending").length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex-1 lg:flex-none">
              Mensajes
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex-1 lg:flex-none">
              Mi Perfil
            </TabsTrigger>
          </TabsList>

          {/* Mis Publicaciones */}
          <TabsContent value="publications" className="space-y-6">
            {userPets.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-6xl mb-4">🐾</div>
                  <h3 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
                    Aún no has publicado ninguna mascota
                  </h3>
                  <p className="text-[var(--color-text-secondary)] mb-6">
                    Comienza compartiendo una mascota que necesite un hogar
                  </p>
                  <Link href="/pets/new">
                    <Button variant="primary" size="lg">
                      <Plus className="w-5 h-5 mr-2" />
                      Publicar Mi Primera Mascota
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPets.map((pet) => {
                  const cardData = convertPetForCard(pet);
                  return (
                    <div key={pet.id} className="relative group">
                      <PetCard
                        id={cardData.id}
                        name={cardData.name}
                        species={cardData.species}
                        breed={cardData.breed}
                        age={cardData.age}
                        imageUrl={cardData.imageUrl}
                        location={cardData.location}
                      />
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/pets/${pet.id}/edit`}>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-9 w-9 p-0 shadow-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 w-9 p-0 bg-[var(--color-surface)] border-red-500 text-red-500 hover:bg-red-500/10 shadow-lg"
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (confirm(`¿Estás seguro de que quieres eliminar a ${pet.name}?`)) {
                              try {
                                await deletePet(pet.id);
                                loadDashboardData(); // Recargar datos
                              } catch (err: any) {
                                console.error("Error al eliminar mascota:", err);
                                alert(err.response?.data?.error || "Error al eliminar la mascota");
                              }
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Favoritos */}
          <TabsContent value="favorites" className="space-y-6">
            {favoritePets.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-6xl mb-4">❤️</div>
                  <h3 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
                    No tienes favoritos aún
                  </h3>
                  <p className="text-[var(--color-text-secondary)] mb-6">
                    Explora mascotas y guarda tus favoritas para verlas más tarde
                  </p>
                  <Link href="/pets">
                    <Button variant="primary" size="lg">
                      Explorar Mascotas
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoritePets.map((pet) => {
                  const cardData = convertPetForCard(pet);
                  return (
                    <PetCard
                      key={pet.id}
                      id={cardData.id}
                      name={cardData.name}
                      species={cardData.species}
                      breed={cardData.breed}
                      age={cardData.age}
                      imageUrl={cardData.imageUrl}
                      location={cardData.location}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Notificaciones */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-[var(--color-text-primary)]">
                Notificaciones
              </h3>
              {notifications.length > 0 && unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      await markAllAsRead();
                      const unread = await getUnreadCount();
                      setUnreadCount(unread);
                      const updated = await getNotifications(1, 20);
                      setNotifications(updated.data);
                    } catch (err) {
                      console.error("Error al marcar todas como leídas:", err);
                    }
                  }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Marcar todas como leídas
                </Button>
              )}
            </div>

            {notifications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-6xl mb-4">🔔</div>
                  <h3 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
                    No tienes notificaciones
                  </h3>
                  <p className="text-[var(--color-text-secondary)]">
                    Te notificaremos cuando haya actividad relacionada con tus mascotas
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={notification.read ? "opacity-75" : "border-l-4 border-l-[var(--color-primary)]"}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-[var(--color-text-primary)] mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {new Date(notification.createdAt).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {notification.relatedPetId && (
                            <Link href={`/pets/${notification.relatedPetId}`}>
                              <Button variant="ghost" size="sm" className="p-0 h-auto mt-2">
                                Ver mascota →
                              </Button>
                            </Link>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={async () => {
                                try {
                                  await markAsRead(notification.id);
                                  const unread = await getUnreadCount();
                                  setUnreadCount(unread);
                                  const updated = await getNotifications(1, 20);
                                  setNotifications(updated.data);
                                } catch (err) {
                                  console.error("Error al marcar como leída:", err);
                                }
                              }}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            onClick={async () => {
                              if (confirm("¿Eliminar esta notificación?")) {
                                try {
                                  await deleteNotification(notification.id);
                                  const unread = await getUnreadCount();
                                  setUnreadCount(unread);
                                  const updated = await getNotifications(1, 20);
                                  setNotifications(updated.data);
                                } catch (err) {
                                  console.error("Error al eliminar notificación:", err);
                                }
                              }
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Mensajes */}
          {/* Solicitudes de Adopción */}
          <TabsContent value="adoption-requests" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Solicitudes Recibidas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Solicitudes Recibidas
                    {receivedRequests.filter(r => r.status === "pending").length > 0 && (
                      <Badge className="ml-2 bg-red-500">
                        {receivedRequests.filter(r => r.status === "pending").length}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Solicitudes de adopción para tus mascotas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {receivedRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📬</div>
                      <p className="text-[var(--color-text-secondary)]">
                        No has recibido solicitudes aún
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {receivedRequests.map((request) => (
                        <Card key={request.id} className={request.status === "pending" ? "border-l-4 border-l-[var(--color-primary)]" : ""}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant={request.status === "pending" ? "default" : request.status === "approved" ? "secondary" : "destructive"} className={request.status === "rejected" || request.status === "cancelled" ? "bg-red-500" : ""}>
                                    {request.status === "pending" ? "Pendiente" : request.status === "approved" ? "Aprobada" : request.status === "rejected" ? "Rechazada" : "Cancelada"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                                  {request.message || "Sin mensaje"}
                                </p>
                                <p className="text-xs text-[var(--color-text-muted)]">
                                  {new Date(request.createdAt).toLocaleDateString("es-ES", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                                <Link href={`/pets/${request.petId}`}>
                                  <Button variant="ghost" size="sm" className="p-0 h-auto mt-2">
                                    Ver mascota →
                                  </Button>
                                </Link>
                              </div>
                              {request.status === "pending" && (
                                <div className="flex gap-2">
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={async () => {
                                      if (confirm("¿Aprobar esta solicitud de adopción?")) {
                                        try {
                                          await updateAdoptionRequestStatus(request.id, "approved");
                                          await loadDashboardData();
                                        } catch (err: any) {
                                          console.error("Error al aprobar solicitud:", err);
                                          alert(err.response?.data?.error || "Error al aprobar la solicitud");
                                        }
                                      }
                                    }}
                                  >
                                    <Check className="w-4 h-4 mr-1" />
                                    Aprobar
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={async () => {
                                      if (confirm("¿Rechazar esta solicitud de adopción?")) {
                                        try {
                                          await updateAdoptionRequestStatus(request.id, "rejected");
                                          await loadDashboardData();
                                        } catch (err: any) {
                                          console.error("Error al rechazar solicitud:", err);
                                          alert(err.response?.data?.error || "Error al rechazar la solicitud");
                                        }
                                      }
                                    }}
                                  >
                                    <X className="w-4 h-4 mr-1" />
                                    Rechazar
                                  </Button>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Mis Solicitudes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Mis Solicitudes
                  </CardTitle>
                  <CardDescription>
                    Solicitudes que has enviado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {myRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">💌</div>
                      <p className="text-[var(--color-text-secondary)]">
                        No has enviado solicitudes aún
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myRequests.map((request) => (
                        <Card key={request.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant={request.status === "pending" ? "default" : request.status === "approved" ? "secondary" : "destructive"} className={request.status === "rejected" || request.status === "cancelled" ? "bg-red-500" : ""}>
                                    {request.status === "pending" ? "Pendiente" : request.status === "approved" ? "Aprobada" : request.status === "rejected" ? "Rechazada" : "Cancelada"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                                  {request.message || "Sin mensaje"}
                                </p>
                                <p className="text-xs text-[var(--color-text-muted)]">
                                  {new Date(request.createdAt).toLocaleDateString("es-ES", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                                <Link href={`/pets/${request.petId}`}>
                                  <Button variant="ghost" size="sm" className="p-0 h-auto mt-2">
                                    Ver mascota →
                                  </Button>
                                </Link>
                              </div>
                              {request.status === "pending" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={async () => {
                                    if (confirm("¿Cancelar esta solicitud de adopción?")) {
                                      try {
                                        await updateAdoptionRequestStatus(request.id, "cancelled");
                                        await loadDashboardData();
                                      } catch (err: any) {
                                        console.error("Error al cancelar solicitud:", err);
                                        alert(err.response?.data?.error || "Error al cancelar la solicitud");
                                      }
                                    }
                                  }}
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Cancelar
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <div className="text-center py-8">
              <p className="text-[var(--color-text-secondary)] mb-4">
                Gestiona tus conversaciones desde la página de mensajes
              </p>
              <Link href="/messages">
                <Button variant="primary">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ir a Mensajes
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* Mi Perfil */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Actualiza tu información de perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      placeholder="Tu nombre"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={user?.email || ""}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+34 XXX XXX XXX"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      placeholder="Tu ciudad"
                      value={profileData.city}
                      onChange={(e) =>
                        setProfileData({ ...profileData, city: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea
                    id="bio"
                    placeholder="Cuéntanos sobre ti y tu amor por los animales"
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    rows={4}
                  />
                </div>

                <Button
                  variant="primary"
                  className="w-full md:w-auto"
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                >
                  {savingProfile ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuración de Cuenta</CardTitle>
                <CardDescription>
                  Administra tu cuenta y privacidad
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Cambiar Contraseña
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cambiar Contraseña</DialogTitle>
                      <DialogDescription>
                        Ingresa tu nueva contraseña. Debe tener al menos 6 caracteres.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="newPassword">Nueva Contraseña</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                          }
                          placeholder="Mínimo 6 caracteres"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                          }
                          placeholder="Repite la contraseña"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setPasswordDialogOpen(false);
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                        disabled={changingPassword}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleChangePassword}
                        disabled={changingPassword}
                      >
                        {changingPassword ? "Cambiando..." : "Cambiar Contraseña"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Eliminar Cuenta
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Eliminar Cuenta</DialogTitle>
                      <DialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente tu cuenta y todos tus datos.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción eliminará:
                      </p>
                      <ul className="list-disc list-inside mt-2 text-sm text-[var(--color-text-secondary)] space-y-1">
                        <li>Todas tus publicaciones de mascotas</li>
                        <li>Tus favoritos</li>
                        <li>Tus solicitudes de adopción</li>
                        <li>Toda tu información de perfil</li>
                      </ul>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteDialogOpen(false)}
                        disabled={deletingAccount}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={deletingAccount}
                      >
                        {deletingAccount ? "Eliminando..." : "Eliminar Cuenta"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
