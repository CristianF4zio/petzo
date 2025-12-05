/**
 * Dashboard del usuario
 * Muestra las mascotas publicadas por el usuario autenticado y sus favoritos
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Eye, MessageCircle, Edit, Trash2, Plus } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
import { getAvailablePets, MockPet } from "@/lib/mockData";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  
  // Simulación de datos del usuario
  const [userPets] = useState<MockPet[]>(
    getAvailablePets().slice(0, 3) // Simulamos 3 mascotas del usuario
  );
  const [favoritePets] = useState<MockPet[]>(
    getAvailablePets().slice(3, 6) // Simulamos 3 favoritas
  );

  const stats = {
    publications: userPets.length,
    views: 234,
    contacts: 12,
    favorites: favoritePets.length,
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] mb-2">
              Mi Dashboard
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)]">
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
        <Card className="mb-8 bg-gradient-to-r from-[var(--color-primary)] to-[#ff8787] border-none text-white">
          <CardContent className="p-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-white/30">
                <AvatarImage src={user?.photoURL || undefined} />
                <AvatarFallback className="bg-white text-[var(--color-primary)] text-2xl">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {user?.displayName || "Usuario PETZO"}
                </h2>
                <p className="text-white/90">{user?.email}</p>
                <Badge className="mt-2 bg-white/20 hover:bg-white/30 border-none">
                  Miembro activo
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-primary)]/10 mx-auto mb-3">
                <Edit className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <div className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">
                {stats.publications}
              </div>
              <div className="text-sm text-[var(--color-text-secondary)]">
                Publicaciones
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-secondary)]/10 mx-auto mb-3">
                <Eye className="w-6 h-6 text-[var(--color-secondary)]" />
              </div>
              <div className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">
                {stats.views}
              </div>
              <div className="text-sm text-[var(--color-text-secondary)]">
                Visualizaciones
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-accent)]/10 mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-[var(--color-accent)]" />
              </div>
              <div className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">
                {stats.contacts}
              </div>
              <div className="text-sm text-[var(--color-text-secondary)]">
                Contactos
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 mx-auto mb-3">
                <Heart className="w-6 h-6 text-pink-500" />
              </div>
              <div className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">
                {stats.favorites}
              </div>
              <div className="text-sm text-[var(--color-text-secondary)]">
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
                {userPets.map((pet) => (
                  <div key={pet.id} className="relative group">
                    <PetCard
                      id={pet.id}
                      name={pet.name}
                      species={pet.species}
                      breed={pet.breed}
                      age={pet.age}
                      imageUrl={pet.images[0]}
                      location={pet.city}
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
                        className="h-9 w-9 p-0 bg-white border-red-500 text-red-500 hover:bg-red-50 shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
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
                {favoritePets.map((pet) => (
                  <PetCard
                    key={pet.id}
                    id={pet.id}
                    name={pet.name}
                    species={pet.species}
                    breed={pet.breed}
                    age={pet.age}
                    imageUrl={pet.images[0]}
                    location={pet.city}
                  />
                ))}
              </div>
            )}
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
                      defaultValue={user?.displayName || ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      defaultValue={user?.email || ""}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" type="tel" placeholder="+34 XXX XXX XXX" />
                  </div>
                  <div>
                    <Label htmlFor="city">Ciudad</Label>
                    <Input id="city" placeholder="Tu ciudad" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Biografía</Label>
                  <Input
                    id="bio"
                    placeholder="Cuéntanos sobre ti y tu amor por los animales"
                  />
                </div>

                <Button variant="primary" className="w-full md:w-auto">
                  Guardar Cambios
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
                <Button variant="outline" className="w-full">
                  Cambiar Contraseña
                </Button>
                <Button variant="outline" className="w-full text-red-600 border-red-300 hover:bg-red-50">
                  Eliminar Cuenta
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
