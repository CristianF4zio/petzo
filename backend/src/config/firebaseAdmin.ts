/**
 * Configuración e inicialización de Firebase Admin SDK
 * Se usa para verificar tokens de autenticación y acceder a Firestore
 */

import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Verificar que las variables de entorno estén configuradas
if (!process.env.FIREBASE_PROJECT_ID) {
  throw new Error("FIREBASE_PROJECT_ID no está configurado en las variables de entorno");
}

if (!process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error("FIREBASE_PRIVATE_KEY no está configurado en las variables de entorno");
}

if (!process.env.FIREBASE_CLIENT_EMAIL) {
  throw new Error("FIREBASE_CLIENT_EMAIL no está configurado en las variables de entorno");
}

// Inicializar Firebase Admin solo si no está ya inicializado
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    console.log("✅ Firebase Admin inicializado correctamente");
  } catch (error) {
    console.error("❌ Error al inicializar Firebase Admin:", error);
    throw error;
  }
}

export const firebaseAdmin = admin;
export const db = admin.firestore();

