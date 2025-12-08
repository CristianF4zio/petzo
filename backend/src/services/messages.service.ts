/**
 * Servicio para manejar mensajes entre usuarios
 * Permite enviar, recibir y gestionar mensajes en conversaciones
 */

import { db } from "../config/firebaseAdmin";
import { MessageDocument } from "../types/database";
import { updateConversationLastMessage } from "./conversations.service";

const MESSAGES_COLLECTION = "messages";

export interface Message extends MessageDocument {}

/**
 * Crear un nuevo mensaje
 */
export const createMessage = async (
  conversationId: string,
  senderId: string,
  receiverId: string,
  content: string,
  petId?: string
): Promise<Message> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const now = Date.now();
    const messageData: Omit<Message, "id"> = {
      conversationId,
      senderId,
      receiverId,
      petId,
      content: content.trim(),
      read: false,
      createdAt: now,
    };

    // Validar contenido
    if (!messageData.content || messageData.content.length === 0) {
      throw new Error("El mensaje no puede estar vacío");
    }

    if (messageData.content.length > 1000) {
      throw new Error("El mensaje es demasiado largo (máximo 1000 caracteres)");
    }

    // Crear mensaje
    const docRef = await db.collection(MESSAGES_COLLECTION).add(messageData);

    // Actualizar última mensaje en la conversación
    try {
      await updateConversationLastMessage(
        conversationId,
        {
          content: messageData.content,
          senderId,
          createdAt: now,
        },
        receiverId
      );
    } catch (error) {
      console.error("Error al actualizar última mensaje en conversación:", error);
      // No lanzar error, el mensaje ya se creó
    }

    return {
      id: docRef.id,
      ...messageData,
    };
  } catch (error: any) {
    if (
      error.message.includes("vacío") ||
      error.message.includes("demasiado largo")
    ) {
      throw error;
    }
    console.error("Error al crear mensaje:", error);
    throw new Error("Error al enviar mensaje");
  }
};

/**
 * Obtener todos los mensajes de una conversación
 */
export const getConversationMessages = async (
  conversationId: string,
  userId: string,
  limit: number = 50
): Promise<Message[]> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    // Verificar que el usuario tiene acceso a esta conversación
    // (esto se valida en las rutas, pero lo verificamos aquí también)
    const conversationDoc = await db
      .collection("conversations")
      .doc(conversationId)
      .get();

    if (!conversationDoc.exists) {
      throw new Error("Conversación no encontrada");
    }

    const conversation = conversationDoc.data();
    if (!conversation?.participants.includes(userId)) {
      throw new Error("No tienes permiso para ver estos mensajes");
    }

    // Obtener mensajes
    const snapshot = await db
      .collection(MESSAGES_COLLECTION)
      .where("conversationId", "==", conversationId)
      .orderBy("createdAt", "asc")
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[];
  } catch (error: any) {
    if (
      error.message === "Conversación no encontrada" ||
      error.message.includes("permiso")
    ) {
      throw error;
    }
    console.error("Error al obtener mensajes:", error);
    throw new Error("Error al obtener mensajes");
  }
};

/**
 * Marcar mensajes como leídos
 */
export const markMessagesAsRead = async (
  conversationId: string,
  userId: string
): Promise<void> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    // Obtener mensajes no leídos donde el usuario es el receptor
    const snapshot = await db
      .collection(MESSAGES_COLLECTION)
      .where("conversationId", "==", conversationId)
      .where("receiverId", "==", userId)
      .where("read", "==", false)
      .get();

    if (snapshot.empty) {
      return; // No hay mensajes sin leer
    }

    // Actualizar todos los mensajes como leídos
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();

    // Actualizar contador de no leídos en la conversación
    try {
      const { markConversationAsRead } = await import("./conversations.service");
      await markConversationAsRead(conversationId, userId);
    } catch (error) {
      console.error("Error al actualizar contador de conversación:", error);
      // No lanzar error, los mensajes ya se marcaron como leídos
    }
  } catch (error) {
    console.error("Error al marcar mensajes como leídos:", error);
    throw new Error("Error al marcar mensajes como leídos");
  }
};

/**
 * Obtener mensajes no leídos de un usuario
 */
export const getUnreadMessages = async (
  userId: string
): Promise<Message[]> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const snapshot = await db
      .collection(MESSAGES_COLLECTION)
      .where("read", "==", false)
      .where("receiverId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[];
  } catch (error: any) {
    console.error("Error al obtener mensajes no leídos:", error);
    
    // Manejar errores de índice faltante o en construcción
    if (error?.code === 9 || error?.details?.includes("index")) {
      const indexLink = error?.details?.match(/https:\/\/console\.firebase\.google\.com[^\s]+/)?.[0];
      const isBuilding = error?.details?.includes("currently building");
      
      if (indexLink) {
        if (isBuilding) {
          console.warn(`⏳ ÍNDICE EN CONSTRUCCIÓN`);
          console.warn(`📋 El índice está siendo construido. Esto puede tardar unos minutos.`);
          console.warn(`🔗 Ver estado aquí: ${indexLink}`);
          throw new Error(`El índice está siendo construido. Espera unos minutos y vuelve a intentar. Ver estado: ${indexLink}`);
        } else {
          console.error(`⚠️ ÍNDICE FALTANTE EN FIRESTORE`);
          console.error(`📋 Firestore requiere un índice compuesto para esta consulta.`);
          console.error(`🔗 Crea el índice aquí: ${indexLink}`);
          console.error(`💡 También puedes crear los índices manualmente en: https://console.firebase.google.com/project/petzo-c1dd5/firestore/indexes`);
          throw new Error(`Índice faltante en Firestore. Crea el índice aquí: ${indexLink}`);
        }
      }
    }
    
    throw new Error("Error al obtener mensajes no leídos");
  }
};

/**
 * Obtener un mensaje por ID
 */
export const getMessageById = async (
  messageId: string,
  userId: string
): Promise<Message> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const doc = await db.collection(MESSAGES_COLLECTION).doc(messageId).get();

    if (!doc.exists) {
      throw new Error("Mensaje no encontrado");
    }

    const message = {
      id: doc.id,
      ...doc.data(),
    } as Message;

    // Verificar que el usuario es remitente o receptor
    if (message.senderId !== userId && message.receiverId !== userId) {
      throw new Error("No tienes permiso para ver este mensaje");
    }

    return message;
  } catch (error: any) {
    if (
      error.message === "Mensaje no encontrado" ||
      error.message.includes("permiso")
    ) {
      throw error;
    }
    console.error("Error al obtener mensaje:", error);
    throw new Error("Error al obtener mensaje");
  }
};

