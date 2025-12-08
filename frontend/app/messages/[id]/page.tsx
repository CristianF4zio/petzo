/**
 * Página de conversación individual
 * Muestra los mensajes de una conversación y permite enviar nuevos mensajes
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Image as ImageIcon } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  getConversationById,
  Conversation,
  markConversationAsRead,
} from "@/lib/services/conversations.service";
import {
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
  Message,
} from "@/lib/services/messages.service";
import { getUserById } from "@/lib/services/users.service";
import { getPetById } from "@/lib/services/pets.service";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export default function ConversationPage() {
  return (
    <ProtectedRoute>
      <ConversationContent />
    </ProtectedRoute>
  );
}

function ConversationContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherParticipant, setOtherParticipant] = useState<{
    id: string;
    name: string;
    photoURL?: string;
  } | null>(null);
  const [pet, setPet] = useState<{ id: string; name: string; photoUrl: string } | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && params.id) {
      loadConversation();
    }
  }, [user, params.id]);

  useEffect(() => {
    // Scroll al final cuando hay nuevos mensajes
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversation = async () => {
    if (!user || !params.id) return;

    try {
      setLoading(true);
      setError(null);

      // Cargar conversación
      const conv = await getConversationById(params.id as string);
      setConversation(conv);

      // Obtener el otro participante
      const otherParticipantId = conv.participants.find((id) => id !== user.uid);
      if (otherParticipantId) {
        try {
          const otherUser = await getUserById(otherParticipantId);
          setOtherParticipant({
            id: otherUser.id,
            name: otherUser.name || otherUser.email || "Usuario",
            photoURL: otherUser.photoURL,
          });
        } catch (err) {
          console.error("Error al obtener usuario:", err);
          setOtherParticipant({
            id: otherParticipantId,
            name: "Usuario",
          });
        }
      }

      // Obtener información de la mascota si existe
      if (conv.petId) {
        try {
          const petData = await getPetById(conv.petId);
          setPet({
            id: petData.id,
            name: petData.name,
            photoUrl:
              petData.photos && petData.photos.length > 0
                ? petData.photos[0]
                : petData.photoUrl,
          });
        } catch (err) {
          console.error("Error al obtener mascota:", err);
        }
      }

      // Cargar mensajes
      await loadMessages();

      // Marcar como leída
      try {
        await markConversationAsRead(conv.id);
        await markMessagesAsRead(conv.id);
      } catch (err) {
        console.error("Error al marcar como leída:", err);
      }
    } catch (err: any) {
      console.error("Error al cargar conversación:", err);
      setError("Error al cargar la conversación");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!params.id) return;

    try {
      const msgs = await getConversationMessages(params.id as string, 100);
      // Ordenar por fecha (más antiguos primero)
      msgs.sort((a, b) => a.createdAt - b.createdAt);
      setMessages(msgs);
    } catch (err) {
      console.error("Error al cargar mensajes:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !conversation || !messageContent.trim() || sending) return;

    const otherParticipantId = conversation.participants.find((id) => id !== user.uid);
    if (!otherParticipantId) return;

    setSending(true);
    try {
      const newMessage = await sendMessage({
        conversationId: conversation.id,
        receiverId: otherParticipantId,
        content: messageContent.trim(),
        petId: conversation.petId,
      });

      // Agregar mensaje a la lista localmente
      setMessages([...messages, newMessage]);
      setMessageContent("");

      // Recargar mensajes para asegurar sincronización
      setTimeout(() => {
        loadMessages();
      }, 500);
    } catch (err: any) {
      console.error("Error al enviar mensaje:", err);
      alert(err.response?.data?.error || "Error al enviar el mensaje");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    } else if (days === 1) {
      return `Ayer ${date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`;
    } else {
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const groupMessagesByDate = (msgs: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = "";

    msgs.forEach((msg) => {
      const msgDate = new Date(msg.createdAt).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ date: msgDate, messages: [] });
      }

      groups[groups.length - 1].messages.push(msg);
    });

    return groups;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-[var(--color-text-secondary)]">Cargando conversación...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">😿</div>
              <h3 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
                {error || "Conversación no encontrada"}
              </h3>
              <Link href="/messages">
                <Button className="mt-6">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a mensajes
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <Navbar />

      <div className="max-w-4xl mx-auto w-full px-6 lg:px-8 py-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link href="/messages">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="w-10 h-10">
              <AvatarImage src={otherParticipant?.photoURL} alt={otherParticipant?.name} />
              <AvatarFallback>
                {otherParticipant?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-[var(--color-text-primary)]">
                {otherParticipant?.name || "Usuario"}
              </h2>
              {pet && (
                <Link href={`/pets/${pet.id}`} className="text-sm text-[var(--color-primary)] hover:underline">
                  Sobre: {pet.name}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mascota relacionada */}
        {pet && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={pet.photoUrl}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--color-text-muted)] mb-1">
                    Conversación sobre
                  </p>
                  <Link
                    href={`/pets/${pet.id}`}
                    className="font-semibold text-[var(--color-primary)] hover:underline"
                  >
                    {pet.name}
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messageGroups.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-[var(--color-text-secondary)]">
                No hay mensajes aún. ¡Envía el primero!
              </p>
            </div>
          ) : (
            messageGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* Separador de fecha */}
                <div className="flex items-center gap-4 my-4">
                  <div className="flex-1 border-t border-[var(--color-border)]"></div>
                  <span className="text-xs text-[var(--color-text-muted)] font-medium">
                    {group.date}
                  </span>
                  <div className="flex-1 border-t border-[var(--color-border)]"></div>
                </div>

                {/* Mensajes del día */}
                {group.messages.map((msg, msgIndex) => {
                  const isOwnMessage = msg.senderId === user?.uid;
                  const showAvatar =
                    msgIndex === 0 ||
                    group.messages[msgIndex - 1].senderId !== msg.senderId;

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 mb-2 ${isOwnMessage ? "flex-row-reverse" : ""}`}
                    >
                      {showAvatar && !isOwnMessage && (
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarImage
                            src={otherParticipant?.photoURL}
                            alt={otherParticipant?.name}
                          />
                          <AvatarFallback>
                            {otherParticipant?.name?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      {showAvatar && isOwnMessage && <div className="w-8"></div>}
                      {!showAvatar && <div className="w-8"></div>}

                      <div
                        className={`flex flex-col max-w-[70%] ${isOwnMessage ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            isOwnMessage
                              ? "bg-[var(--color-primary)] text-white"
                              : "bg-white border border-[var(--color-border)]"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {msg.content}
                          </p>
                        </div>
                        <span className="text-xs text-[var(--color-text-muted)] mt-1 px-1">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input de mensaje */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Escribe un mensaje..."
            rows={1}
            className="resize-none min-h-[60px] max-h-[120px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            maxLength={1000}
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!messageContent.trim() || sending}
            className="self-end"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
        {messageContent.length > 0 && (
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            {messageContent.length}/1000 caracteres
          </p>
        )}
      </div>
    </div>
  );
}

