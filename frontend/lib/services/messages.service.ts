/**
 * Servicio para gestionar mensajes
 * Conecta con el backend API
 */

import api from "../api";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  petId?: string;
  content: string;
  read: boolean;
  createdAt: number;
}

export interface CreateMessageDto {
  conversationId: string;
  receiverId: string;
  content: string;
  petId?: string;
}

/**
 * Obtener mensajes no leídos del usuario autenticado
 */
export const getUnreadMessages = async (): Promise<Message[]> => {
  try {
    const response = await api.get<{ success: boolean; data: Message[] }>(
      "/messages/unread"
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener mensajes no leídos:", error);
    throw error;
  }
};

/**
 * Obtener mensajes de una conversación
 */
export const getConversationMessages = async (
  conversationId: string,
  limit: number = 50
): Promise<Message[]> => {
  try {
    const response = await api.get<{ success: boolean; data: Message[] }>(
      `/messages/conversation/${conversationId}?limit=${limit}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    throw error;
  }
};

/**
 * Obtener un mensaje por ID
 */
export const getMessageById = async (id: string): Promise<Message> => {
  try {
    const response = await api.get<{ success: boolean; data: Message }>(
      `/messages/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener mensaje:", error);
    throw error;
  }
};

/**
 * Enviar un mensaje
 */
export const sendMessage = async (messageData: CreateMessageDto): Promise<Message> => {
  try {
    const response = await api.post<{ success: boolean; data: Message }>(
      "/messages",
      messageData
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    throw error;
  }
};

/**
 * Marcar mensajes de una conversación como leídos
 */
export const markMessagesAsRead = async (conversationId: string): Promise<void> => {
  try {
    await api.put(`/messages/conversation/${conversationId}/read`);
  } catch (error) {
    console.error("Error al marcar mensajes como leídos:", error);
    throw error;
  }
};

