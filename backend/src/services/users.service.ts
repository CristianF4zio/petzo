/**
 * Servicio para manejar la lógica relacionada con usuarios
 * Interactúa con Firebase Auth y Firestore
 */

import { firebaseAdmin } from "../config/firebaseAdmin";

/**
 * Obtener información del usuario autenticado
 */
export const getUserById = async (uid: string) => {
  try {
    const userRecord = await firebaseAdmin.auth().getUser(uid);
    return {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      emailVerified: userRecord.emailVerified,
    };
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    throw new Error("Error al obtener la información del usuario");
  }
};

