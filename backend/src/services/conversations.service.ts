/**
 * Servicio para manejar conversaciones entre usuarios
 * Permite crear y gestionar conversaciones de mensajería
 */

import { db } from "../config/firebaseAdmin";
import { ConversationDocument } from "../types/database";

const CONVERSATIONS_COLLECTION = "conversations";

export interface Conversation extends ConversationDocument {}

/**
 * Crear o obtener una conversación existente entre dos usuarios
 */
export const getOrCreateConversation = async (
  participant1Id: string,
  participant2Id: string,
  petId?: string
): Promise<Conversation> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    // Ordenar IDs para asegurar consistencia
    const participants = [participant1Id, participant2Id].sort();

    // Buscar conversación existente usando array-contains
    // Necesitamos verificar ambas combinaciones posibles
    const existingSnapshot = await db
      .collection(CONVERSATIONS_COLLECTION)
      .where("participants", "array-contains", participant1Id)
      .get();

    // Filtrar manualmente para encontrar la conversación con ambos participantes
    const existingDoc = existingSnapshot.docs.find((doc) => {
      const docParticipants = doc.data().participants || [];
      return (
        docParticipants.includes(participant1Id) &&
        docParticipants.includes(participant2Id) &&
        docParticipants.length === 2
      );
    });

    if (existingDoc) {
      return {
        id: existingDoc.id,
        ...existingDoc.data(),
      } as Conversation;
    }

    // Crear nueva conversación
    const now = Date.now();
    const conversationData: Omit<Conversation, "id"> = {
      participants,
      petId,
      createdAt: now,
      updatedAt: now,
      unreadCount: {
        [participant1Id]: 0,
        [participant2Id]: 0,
      },
    };

    const docRef = await db
      .collection(CONVERSATIONS_COLLECTION)
      .add(conversationData);

    return {
      id: docRef.id,
      ...conversationData,
    };
  } catch (error) {
    console.error("Error al crear/obtener conversación:", error);
    throw new Error("Error al crear conversación");
  }
};

/**
 * Obtener todas las conversaciones de un usuario
 */
export const getUserConversations = async (
  userId: string
): Promise<Conversation[]> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const snapshot = await db
      .collection(CONVERSATIONS_COLLECTION)
      .where("participants", "array-contains", userId)
      .orderBy("updatedAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Conversation[];
  } catch (error: any) {
    console.error("Error al obtener conversaciones:", error);
    
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
    
    throw new Error("Error al obtener conversaciones");
  }
};

/**
 * Obtener una conversación por ID
 */
export const getConversationById = async (
  conversationId: string,
  userId: string
): Promise<Conversation> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const doc = await db
      .collection(CONVERSATIONS_COLLECTION)
      .doc(conversationId)
      .get();

    if (!doc.exists) {
      throw new Error("Conversación no encontrada");
    }

    const conversation = {
      id: doc.id,
      ...doc.data(),
    } as Conversation;

    // Verificar que el usuario es participante
    if (!conversation.participants.includes(userId)) {
      throw new Error("No tienes permiso para ver esta conversación");
    }

    return conversation;
  } catch (error: any) {
    if (error.message === "Conversación no encontrada" || error.message.includes("permiso")) {
      throw error;
    }
    console.error("Error al obtener conversación:", error);
    throw new Error("Error al obtener conversación");
  }
};

/**
 * Actualizar última mensaje y timestamp de conversación
 */
export const updateConversationLastMessage = async (
  conversationId: string,
  lastMessage: {
    content: string;
    senderId: string;
    createdAt: number;
  },
  receiverId: string
): Promise<void> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const conversationRef = db
      .collection(CONVERSATIONS_COLLECTION)
      .doc(conversationId);

    const conversationDoc = await conversationRef.get();
    if (!conversationDoc.exists) {
      throw new Error("Conversación no encontrada");
    }

    const conversation = conversationDoc.data() as Conversation;

    // Incrementar contador de no leídos para el receptor
    const unreadCount = conversation.unreadCount || {};
    unreadCount[receiverId] = (unreadCount[receiverId] || 0) + 1;

    await conversationRef.update({
      lastMessage,
      updatedAt: Date.now(),
      unreadCount,
    });
  } catch (error) {
    console.error("Error al actualizar última mensaje:", error);
    throw new Error("Error al actualizar conversación");
  }
};

/**
 * Marcar mensajes como leídos en una conversación
 */
export const markConversationAsRead = async (
  conversationId: string,
  userId: string
): Promise<void> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const conversationRef = db
      .collection(CONVERSATIONS_COLLECTION)
      .doc(conversationId);

    const conversationDoc = await conversationRef.get();
    if (!conversationDoc.exists) {
      throw new Error("Conversación no encontrada");
    }

    const conversation = conversationDoc.data() as Conversation;

    // Verificar que el usuario es participante
    if (!conversation.participants.includes(userId)) {
      throw new Error("No tienes permiso para esta conversación");
    }

    // Resetear contador de no leídos para este usuario
    const unreadCount = conversation.unreadCount || {};
    unreadCount[userId] = 0;

    await conversationRef.update({
      unreadCount,
    });
  } catch (error: any) {
    if (error.message.includes("permiso") || error.message === "Conversación no encontrada") {
      throw error;
    }
    console.error("Error al marcar como leído:", error);
    throw new Error("Error al marcar conversación como leída");
  }
};

/**
 * Eliminar una conversación (solo si ambos participantes están de acuerdo)
 */
export const deleteConversation = async (
  conversationId: string,
  userId: string
): Promise<void> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const conversationDoc = await db
      .collection(CONVERSATIONS_COLLECTION)
      .doc(conversationId)
      .get();

    if (!conversationDoc.exists) {
      throw new Error("Conversación no encontrada");
    }

    const conversation = conversationDoc.data() as Conversation;

    // Verificar que el usuario es participante
    if (!conversation.participants.includes(userId)) {
      throw new Error("No tienes permiso para eliminar esta conversación");
    }

    // En lugar de eliminar, podríamos marcar como archivada
    // Por ahora, no permitimos eliminación directa según las reglas de seguridad
    throw new Error("No se permite eliminar conversaciones");
  } catch (error: any) {
    if (
      error.message.includes("permiso") ||
      error.message === "Conversación no encontrada" ||
      error.message.includes("No se permite")
    ) {
      throw error;
    }
    console.error("Error al eliminar conversación:", error);
    throw new Error("Error al eliminar conversación");
  }
};

