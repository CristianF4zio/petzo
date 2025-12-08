/**
 * Servicio para manejar notificaciones
 */

import { db } from "../config/firebaseAdmin";
import { COLLECTIONS } from "../types/database";
import { NotificationDocument } from "../types/database";
import { PaginationParams, PaginationResult, normalizePagination } from "../types/pagination";

const NOTIFICATIONS_COLLECTION = COLLECTIONS.NOTIFICATIONS;

/**
 * Crear una notificación
 */
export const createNotification = async (
  notification: Omit<NotificationDocument, "id" | "createdAt" | "read">
): Promise<NotificationDocument> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const newNotification: Omit<NotificationDocument, "id"> = {
      ...notification,
      read: false,
      createdAt: Date.now(),
    };

    const docRef = await db
      .collection(NOTIFICATIONS_COLLECTION)
      .add(newNotification);

    return {
      id: docRef.id,
      ...newNotification,
    };
  } catch (error) {
    console.error("Error al crear notificación:", error);
    throw new Error("Error al crear la notificación");
  }
};

/**
 * Obtener notificaciones de un usuario
 */
export const getUserNotifications = async (
  userId: string,
  pagination?: PaginationParams,
  unreadOnly: boolean = false
): Promise<PaginationResult<NotificationDocument>> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const { page, limit, offset } = normalizePagination(pagination || {});

    let query: FirebaseFirestore.Query = db
      .collection(NOTIFICATIONS_COLLECTION)
      .where("userId", "==", userId);

    if (unreadOnly) {
      query = query.where("read", "==", false);
    }

    query = query.orderBy("createdAt", "desc");

    // Obtener total
    const totalSnapshot = await query.get();
    const total = totalSnapshot.size;

    // Aplicar paginación
    const snapshot = await query.offset(offset).limit(limit).get();

    const notifications: NotificationDocument[] = [];
    snapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
      } as NotificationDocument);
    });

    return {
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: offset + limit < total,
        hasPrev: offset > 0,
      },
    };
  } catch (error: any) {
    console.error("Error al obtener notificaciones:", error);
    
    // Manejar errores de índice en Firestore
    if (error?.code === 9 && error?.details?.includes("index")) {
      const indexLinkMatch = error.details.match(/https:\/\/console\.firebase\.google\.com[^\s]+/);
      const indexLink = indexLinkMatch ? indexLinkMatch[0] : null;
      
      // Verificar si el índice está en construcción o falta
      const isBuilding = error?.details?.includes("currently building");
      
      if (isBuilding) {
        console.warn("\n⏳ ÍNDICE EN CONSTRUCCIÓN");
        console.warn("📋 El índice de Firestore está siendo construido.");
        console.warn("⏱️  Esto puede tomar unos minutos. Por favor espera y vuelve a intentar.");
        if (indexLink) {
          console.warn(`🔗 Ver estado del índice: ${indexLink}`);
        }
        console.warn("💡 También puedes ver el estado en:");
        console.warn("   https://console.firebase.google.com/project/petzo-c1dd5/firestore/indexes");
        
        throw new Error(
          `El índice de Firestore está en construcción. Por favor espera unos minutos y vuelve a intentar. ${indexLink ? `Ver estado: ${indexLink}` : ""}`
        );
      } else {
        console.error("\n⚠️ ÍNDICE FALTANTE EN FIRESTORE");
        console.error("📋 Firestore requiere un índice compuesto para esta consulta.");
        if (indexLink) {
          console.error(`🔗 Crea el índice aquí: ${indexLink}`);
        }
        console.error("💡 También puedes crear los índices manualmente en:");
        console.error("   https://console.firebase.google.com/project/petzo-c1dd5/firestore/indexes");
        
        throw new Error(
          `Índice faltante en Firestore. ${indexLink ? `Crea el índice aquí: ${indexLink}` : "Revisa la consola para ver el enlace de creación."}`
        );
      }
    }
    
    throw new Error("Error al obtener las notificaciones");
  }
};

/**
 * Marcar notificación como leída
 */
export const markNotificationAsRead = async (
  notificationId: string,
  userId: string
): Promise<void> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const notification = await db
      .collection(NOTIFICATIONS_COLLECTION)
      .doc(notificationId)
      .get();

    if (!notification.exists) {
      throw new Error("Notificación no encontrada");
    }

    const notificationData = notification.data() as NotificationDocument;

    if (notificationData.userId !== userId) {
      throw new Error("No tienes permiso para modificar esta notificación");
    }

    await db
      .collection(NOTIFICATIONS_COLLECTION)
      .doc(notificationId)
      .update({
        read: true,
      });
  } catch (error: any) {
    console.error("Error al marcar notificación como leída:", error);
    throw error;
  }
};

/**
 * Marcar todas las notificaciones como leídas
 */
export const markAllNotificationsAsRead = async (
  userId: string
): Promise<void> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const snapshot = await db
      .collection(NOTIFICATIONS_COLLECTION)
      .where("userId", "==", userId)
      .where("read", "==", false)
      .get();

    const batch = db.batch();
    snapshot.forEach((doc) => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();
  } catch (error) {
    console.error("Error al marcar todas las notificaciones como leídas:", error);
    throw new Error("Error al marcar las notificaciones como leídas");
  }
};

/**
 * Obtener conteo de notificaciones no leídas
 */
export const getUnreadNotificationsCount = async (
  userId: string
): Promise<number> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const snapshot = await db
      .collection(NOTIFICATIONS_COLLECTION)
      .where("userId", "==", userId)
      .where("read", "==", false)
      .get();

    return snapshot.size;
  } catch (error) {
    console.error("Error al obtener conteo de notificaciones:", error);
    throw new Error("Error al obtener el conteo de notificaciones");
  }
};

/**
 * Eliminar notificación
 */
export const deleteNotification = async (
  notificationId: string,
  userId: string
): Promise<void> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const notification = await db
      .collection(NOTIFICATIONS_COLLECTION)
      .doc(notificationId)
      .get();

    if (!notification.exists) {
      throw new Error("Notificación no encontrada");
    }

    const notificationData = notification.data() as NotificationDocument;

    if (notificationData.userId !== userId) {
      throw new Error("No tienes permiso para eliminar esta notificación");
    }

    await db.collection(NOTIFICATIONS_COLLECTION).doc(notificationId).delete();
  } catch (error: any) {
    console.error("Error al eliminar notificación:", error);
    throw error;
  }
};

/**
 * Crear notificación de solicitud de adopción
 */
export const notifyAdoptionRequest = async (
  ownerId: string,
  requesterId: string,
  petId: string,
  petName: string,
  requestId: string
): Promise<void> => {
  await createNotification({
    userId: ownerId,
    type: "adoption_request",
    title: "Nueva solicitud de adopción",
    message: `Tienes una nueva solicitud de adopción para ${petName}`,
    relatedPetId: petId,
    relatedUserId: requesterId,
    relatedRequestId: requestId,
  });
};

/**
 * Crear notificación de respuesta a solicitud
 */
export const notifyAdoptionResponse = async (
  requesterId: string,
  ownerId: string,
  petId: string,
  petName: string,
  status: "approved" | "rejected",
  requestId: string
): Promise<void> => {
  const statusText = status === "approved" ? "aprobada" : "rechazada";
  await createNotification({
    userId: requesterId,
    type: "adoption_response",
    title: `Solicitud de adopción ${statusText}`,
    message: `Tu solicitud de adopción para ${petName} ha sido ${statusText}`,
    relatedPetId: petId,
    relatedUserId: ownerId,
    relatedRequestId: requestId,
  });
};

/**
 * Crear notificación de nuevo mensaje
 */
export const notifyNewMessage = async (
  receiverId: string,
  senderId: string,
  petId: string | undefined,
  messagePreview: string
): Promise<void> => {
  await createNotification({
    userId: receiverId,
    type: "message",
    title: "Nuevo mensaje",
    message: messagePreview.substring(0, 100),
    relatedPetId: petId,
    relatedUserId: senderId,
  });
};

/**
 * Crear notificación de favorito
 */
export const notifyFavorite = async (
  ownerId: string,
  userId: string,
  petId: string,
  petName: string
): Promise<void> => {
  await createNotification({
    userId: ownerId,
    type: "favorite",
    title: "Nueva marca de favorito",
    message: `A alguien le gusta ${petName}`,
    relatedPetId: petId,
    relatedUserId: userId,
  });
};

