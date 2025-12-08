/**
 * Servicio para gestionar conversaciones
 * Conecta con el backend API
 */

import api from "../api";

export interface Conversation {
  id: string;
  participants: string[];
  petId?: string;
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: number;
  };
  createdAt: number;
  updatedAt: number;
  unreadCount: Record<string, number>;
}

export interface CreateConversationDto {
  participantId: string;
  petId?: string;
}

/**
 * Obtener todas las conversaciones del usuario autenticado
 */
export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const response = await api.get<{ success: boolean; data: Conversation[] }>(
      "/conversations"
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener conversaciones:", error);
    throw error;
  }
};

/**
 * Obtener una conversación por ID
 */
export const getConversationById = async (
  id: string
): Promise<Conversation> => {
  try {
    const response = await api.get<{ success: boolean; data: Conversation }>(
      `/conversations/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener conversación:", error);
    throw error;
  }
};

/**
 * Crear o obtener una conversación existente
 */
export const getOrCreateConversation = async (
  data: CreateConversationDto
): Promise<Conversation> => {
  try {
    const response = await api.post<{ success: boolean; data: Conversation }>(
      "/conversations",
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al crear/obtener conversación:", error);
    throw error;
  }
};

/**
 * Marcar una conversación como leída
 */
export const markConversationAsRead = async (id: string): Promise<void> => {
  try {
    await api.put(`/conversations/${id}/read`);
  } catch (error) {
    console.error("Error al marcar conversación como leída:", error);
    throw error;
  }
};

