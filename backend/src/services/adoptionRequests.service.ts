/**
 * Servicio para manejar solicitudes de adopción
 * Permite a los usuarios solicitar adoptar una mascota
 */

import { db } from "../config/firebaseAdmin";
import { COLLECTIONS } from "../types/database";

const ADOPTION_REQUESTS_COLLECTION = COLLECTIONS.ADOPTION_REQUESTS;

export interface AdoptionRequest {
  id: string;
  petId: string;
  requesterId: string;
  ownerId: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  message?: string;
  createdAt: number;
  updatedAt: number;
  respondedAt?: number;
}

/**
 * Crear una solicitud de adopción
 */
export const createAdoptionRequest = async (
  petId: string,
  requesterId: string,
  ownerId: string,
  message?: string
): Promise<AdoptionRequest> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    // Verificar si ya existe una solicitud pendiente
    const existing = await db
      .collection(ADOPTION_REQUESTS_COLLECTION)
      .where("petId", "==", petId)
      .where("requesterId", "==", requesterId)
      .where("status", "==", "pending")
      .limit(1)
      .get();

    if (!existing.empty) {
      throw new Error("Ya existe una solicitud pendiente para esta mascota");
    }

    const now = Date.now();
    const requestData = {
      petId,
      requesterId,
      ownerId,
      status: "pending" as const,
      message: message || undefined,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await db
      .collection(ADOPTION_REQUESTS_COLLECTION)
      .add(requestData);

    return {
      id: docRef.id,
      ...requestData,
      message: requestData.message || undefined,
    };
  } catch (error: any) {
    console.error("Error al crear solicitud de adopción:", error);
    throw error;
  }
};

/**
 * Obtener solicitudes de adopción de una mascota
 */
export const getPetAdoptionRequests = async (
  petId: string
): Promise<AdoptionRequest[]> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const snapshot = await db
      .collection(ADOPTION_REQUESTS_COLLECTION)
      .where("petId", "==", petId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AdoptionRequest[];
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    throw new Error("Error al obtener solicitudes de adopción");
  }
};

/**
 * Obtener solicitudes de adopción de un usuario (como solicitante)
 */
export const getUserAdoptionRequests = async (
  userId: string
): Promise<AdoptionRequest[]> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const snapshot = await db
      .collection(ADOPTION_REQUESTS_COLLECTION)
      .where("requesterId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AdoptionRequest[];
  } catch (error: any) {
    console.error("Error al obtener solicitudes del usuario:", error);
    
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
    
    throw new Error("Error al obtener solicitudes de adopción");
  }
};

/**
 * Obtener solicitudes recibidas por un usuario (como propietario)
 */
export const getReceivedAdoptionRequests = async (
  userId: string,
  status?: AdoptionRequest["status"]
): Promise<AdoptionRequest[]> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    let query = db
      .collection(ADOPTION_REQUESTS_COLLECTION)
      .where("ownerId", "==", userId);

    if (status) {
      query = query.where("status", "==", status);
    }

    const snapshot = await query.orderBy("createdAt", "desc").get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AdoptionRequest[];
  } catch (error: any) {
    console.error("Error al obtener solicitudes recibidas:", error);
    
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
    
    throw new Error("Error al obtener solicitudes recibidas");
  }
};

/**
 * Actualizar el estado de una solicitud de adopción
 */
/**
 * Obtener solicitud por ID
 */
export const getAdoptionRequestById = async (
  requestId: string
): Promise<AdoptionRequest | null> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const doc = await db
      .collection(ADOPTION_REQUESTS_COLLECTION)
      .doc(requestId)
      .get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as AdoptionRequest;
  } catch (error) {
    console.error("Error al obtener solicitud:", error);
    throw new Error("Error al obtener la solicitud");
  }
};

export const updateAdoptionRequestStatus = async (
  requestId: string,
  ownerId: string,
  status: "approved" | "rejected" | "cancelled"
): Promise<AdoptionRequest> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const docRef = db
      .collection(ADOPTION_REQUESTS_COLLECTION)
      .doc(requestId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error("Solicitud no encontrada");
    }

    const request = doc.data() as AdoptionRequest;

    if (request.ownerId !== ownerId) {
      throw new Error("No tienes permiso para actualizar esta solicitud");
    }

    if (request.status !== "pending") {
      throw new Error("La solicitud ya ha sido procesada");
    }

    const now = Date.now();
    await docRef.update({
      status,
      updatedAt: now,
      respondedAt: now,
    });

    // Si se aprueba, actualizar el estado de la mascota
    if (status === "approved") {
      const petRef = db.collection(COLLECTIONS.PETS).doc(request.petId);
      await petRef.update({
        status: "adopted",
        updatedAt: now,
      });

      // Rechazar todas las demás solicitudes pendientes para esta mascota
      const pendingRequests = await db
        .collection(ADOPTION_REQUESTS_COLLECTION)
        .where("petId", "==", request.petId)
        .where("status", "==", "pending")
        .get();

      const batch = db.batch();
      pendingRequests.docs.forEach((reqDoc) => {
        if (reqDoc.id !== requestId) {
          batch.update(reqDoc.ref, {
            status: "rejected",
            updatedAt: now,
            respondedAt: now,
          });
        }
      });
      await batch.commit();
    }

    const updatedDoc = await docRef.get();
    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    } as AdoptionRequest;
  } catch (error: any) {
    console.error("Error al actualizar solicitud:", error);
    throw error;
  }
};

/**
 * Cancelar una solicitud de adopción (solo el solicitante)
 */
export const cancelAdoptionRequest = async (
  requestId: string,
  requesterId: string
): Promise<AdoptionRequest> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const docRef = db
      .collection(ADOPTION_REQUESTS_COLLECTION)
      .doc(requestId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error("Solicitud no encontrada");
    }

    const request = doc.data() as AdoptionRequest;

    if (request.requesterId !== requesterId) {
      throw new Error("No tienes permiso para cancelar esta solicitud");
    }

    if (request.status !== "pending") {
      throw new Error("No se puede cancelar una solicitud procesada");
    }

    const now = Date.now();
    await docRef.update({
      status: "cancelled",
      updatedAt: now,
    });

    const updatedDoc = await docRef.get();
    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    } as AdoptionRequest;
  } catch (error: any) {
    console.error("Error al cancelar solicitud:", error);
    throw error;
  }
};

