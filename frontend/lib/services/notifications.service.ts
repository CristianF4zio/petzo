/**
 * Servicio para gestionar notificaciones
 */

import api from "../api";

export interface Notification {
  id: string;
  userId: string;
  type: "favorite" | "adoption_request" | "adoption_update" | "message" | "system";
  title: string;
  message: string;
  relatedPetId?: string;
  relatedUserId?: string;
  relatedAdoptionRequestId?: string;
  relatedMessageId?: string;
  read: boolean;
  createdAt: number;
}

export interface PaginatedNotifications {
  data: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Obtener notificaciones del usuario
 */
export const getNotifications = async (
  page: number = 1,
  limit: number = 20,
  unreadOnly: boolean = false
): Promise<PaginatedNotifications> => {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (unreadOnly) params.append("unreadOnly", "true");

    const response = await api.get<{ success: boolean } & PaginatedNotifications>(
      `/notifications?${params.toString()}`
    );
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    throw error;
  }
};

/**
 * Obtener conteo de notificaciones no leídas
 */
export const getUnreadCount = async (): Promise<number> => {
  try {
    const response = await api.get<{ success: boolean; count: number }>(
      "/notifications/unread-count"
    );
    return response.data.count;
  } catch (error) {
    console.error("Error al obtener conteo de notificaciones:", error);
    throw error;
  }
};

/**
 * Marcar notificación como leída
 */
export const markAsRead = async (id: string): Promise<void> => {
  try {
    await api.put(`/notifications/${id}/read`);
  } catch (error) {
    console.error("Error al marcar notificación como leída:", error);
    throw error;
  }
};

/**
 * Marcar todas las notificaciones como leídas
 */
export const markAllAsRead = async (): Promise<void> => {
  try {
    await api.put("/notifications/read-all");
  } catch (error) {
    console.error("Error al marcar todas las notificaciones como leídas:", error);
    throw error;
  }
};

/**
 * Eliminar notificación
 */
export const deleteNotification = async (id: string): Promise<void> => {
  try {
    await api.delete(`/notifications/${id}`);
  } catch (error) {
    console.error("Error al eliminar notificación:", error);
    throw error;
  }
};

