/**
 * Página principal de mensajes
 * Muestra todas las conversaciones del usuario
 */

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageCircle, Plus, Search, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import {
  getConversations,
  Conversation,
  getOrCreateConversation,
} from "@/lib/services/conversations.service";
import { getUnreadMessages } from "@/lib/services/messages.service";
import { getUserById } from "@/lib/services/users.service";
import { getPetById } from "@/lib/services/pets.service";

interface ConversationWithDetails extends Conversation {
  otherParticipant?: {
    id: string;
    name: string;
    photoURL?: string;
  };
  pet?: {
    id: string;
    name: string;
    photoUrl: string;
  };
}

export default function MessagesPage() {
  return (
    <ProtectedRoute>
      <MessagesContent />
    </ProtectedRoute>
  );
}

function MessagesContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadConversations();
      loadUnreadCount();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const convs = await getConversations();
      
      // Enriquecer conversaciones con detalles de usuarios y mascotas
      const enrichedConversations: ConversationWithDetails[] = await Promise.all(
        convs.map(async (conv) => {
          const otherParticipantId = conv.participants.find((id) => id !== user.uid);
          const enriched: ConversationWithDetails = { ...conv };

          // Obtener información del otro participante
          if (otherParticipantId) {
            try {
              const otherUser = await getUserById(otherParticipantId);
              enriched.otherParticipant = {
                id: otherUser.id,
                name: otherUser.name || otherUser.email || "Usuario",
                photoURL: otherUser.photoURL,
              };
            } catch (err) {
              console.error("Error al obtener usuario:", err);
              enriched.otherParticipant = {
                id: otherParticipantId,
                name: "Usuario",
              };
            }
          }

          // Obtener información de la mascota si existe
          if (conv.petId) {
            try {
              const pet = await getPetById(conv.petId);
              enriched.pet = {
                id: pet.id,
                name: pet.name,
                photoUrl: pet.photos && pet.photos.length > 0 ? pet.photos[0] : pet.photoUrl,
              };
            } catch (err) {
              console.error("Error al obtener mascota:", err);
            }
          }

          return enriched;
        })
      );

      // Ordenar por última actualización
      enrichedConversations.sort((a, b) => b.updatedAt - a.updatedAt);

      setConversations(enrichedConversations);
    } catch (err: any) {
      console.error("Error al cargar conversaciones:", err);
      setError("Error al cargar las conversaciones");
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const unreadMessages = await getUnreadMessages();
      setUnreadCount(unreadMessages.length);
    } catch (err) {
      console.error("Error al cargar mensajes no leídos:", err);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      conv.otherParticipant?.name.toLowerCase().includes(query) ||
      conv.pet?.name.toLowerCase().includes(query) ||
      conv.lastMessage?.content.toLowerCase().includes(query)
    );
  });

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    } else if (days === 1) {
      return "Ayer";
    } else if (days < 7) {
      return date.toLocaleDateString("es-ES", { weekday: "short" });
    } else {
      return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
    }
  };

  const getUnreadCountForConversation = (conv: Conversation) => {
    if (!user) return 0;
    return conv.unreadCount[user.uid] || 0;
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] mb-3">
              Mensajes
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)]">
              {unreadCount > 0
                ? `${unreadCount} mensaje${unreadCount !== 1 ? "s" : ""} no leído${unreadCount !== 1 ? "s" : ""}`
                : "Tus conversaciones"}
            </p>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar conversaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lista de conversaciones */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-[var(--color-text-secondary)]">Cargando conversaciones...</p>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">😿</div>
              <h3 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
                Error al cargar conversaciones
              </h3>
              <p className="text-[var(--color-text-secondary)] mb-6">{error}</p>
              <Button onClick={loadConversations}>Intentar de nuevo</Button>
            </CardContent>
          </Card>
        ) : filteredConversations.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
                {searchQuery.trim()
                  ? "No se encontraron conversaciones"
                  : "No tienes conversaciones aún"}
              </h3>
              <p className="text-[var(--color-text-secondary)] mb-6">
                {searchQuery.trim()
                  ? "Intenta con otros términos de búsqueda"
                  : "Inicia una conversación desde el perfil de una mascota"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredConversations.map((conv) => {
              const unread = getUnreadCountForConversation(conv);
              return (
                <Link key={conv.id} href={`/messages/${conv.id}`}>
                  <Card className="hover:shadow-lg transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={conv.otherParticipant?.photoURL}
                            alt={conv.otherParticipant?.name}
                          />
                          <AvatarFallback>
                            {conv.otherParticipant?.name
                              ?.charAt(0)
                              .toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>

                        {/* Contenido */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-[var(--color-text-primary)] truncate">
                                {conv.otherParticipant?.name || "Usuario"}
                              </h3>
                              {conv.pet && (
                                <p className="text-sm text-[var(--color-text-secondary)] truncate">
                                  Sobre: {conv.pet.name}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {conv.lastMessage && (
                                <span className="text-xs text-[var(--color-text-muted)] whitespace-nowrap">
                                  {formatTime(conv.lastMessage.createdAt)}
                                </span>
                              )}
                              {unread > 0 && (
                                <Badge className="bg-[var(--color-primary)] text-white">
                                  {unread > 9 ? "9+" : unread}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {conv.lastMessage && (
                            <p className="text-sm text-[var(--color-text-secondary)] truncate">
                              {conv.lastMessage.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

