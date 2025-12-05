/**
 * Configuración de Firebase Client SDK
 * Se usa para autenticación en el frontend (login, registro)
 */

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

// Configuración de Firebase desde variables de entorno
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// Validar que todas las variables estén configuradas
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("⚠️ Firebase no está configurado correctamente. Verifica tu archivo .env.local");
}

// Inicializar Firebase solo si no está ya inicializado
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Obtener instancia de Auth
export const auth = getAuth(app);

export default app;

