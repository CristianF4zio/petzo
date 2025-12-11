/**
 * Funciones de utilidad para autenticación
 * Wrapper sobre Firebase Auth para facilitar el uso
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "./firebaseClient";
import api from "./api";

const googleProvider = new GoogleAuthProvider();

/**
 * Iniciar sesión con email y contraseña
 */
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Asegurar que el usuario esté guardado en Firestore
    try {
      await api.post("/auth/register", {
        displayName: userCredential.user.displayName || null,
        photoURL: userCredential.user.photoURL || null,
        emailVerified: userCredential.user.emailVerified,
      });
    } catch (error: any) {
      // Solo mostrar error si no es un error de Firestore no inicializado
      if (error.response?.status !== 500 || !error.response?.data?.error?.includes("Firestore")) {
        console.error("Error al guardar usuario en Firestore:", error);
      }
      // No fallar el login si hay error al guardar en Firestore
    }

    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Registrar nuevo usuario con email y contraseña
 */
export const registerWithEmail = async (
  email: string,
  password: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Guardar usuario en Firestore después del registro
    try {
      await api.post("/auth/register", {
        displayName: userCredential.user.displayName || null,
        photoURL: userCredential.user.photoURL || null,
      });
    } catch (error: any) {
      // Solo mostrar error si no es un error de Firestore no inicializado
      if (error.response?.status !== 500 || !error.response?.data?.error?.includes("Firestore")) {
        console.error("Error al guardar usuario en Firestore:", error);
      }
      // No fallar el registro si hay error al guardar en Firestore
    }

    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Iniciar sesión con Google
 */
export const loginWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);

    // Guardar o actualizar usuario en Firestore después del login con Google
    try {
      await api.post("/auth/register", {
        displayName: userCredential.user.displayName || null,
        photoURL: userCredential.user.photoURL || null,
        emailVerified: userCredential.user.emailVerified,
      });
    } catch (error: any) {
      // Solo mostrar error si no es un error de Firestore no inicializado
      if (error.response?.status !== 500 || !error.response?.data?.error?.includes("Firestore")) {
        console.error("Error al guardar usuario en Firestore:", error);
      }
      // No fallar el login si hay error al guardar en Firestore
    }

    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Cerrar sesión
 */
export const logout = async () => {
  try {
    await signOut(auth);
    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Obtener el usuario actual
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Cambiar contraseña del usuario
 */
export const changePassword = async (newPassword: string) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return {
        success: false,
        error: "No hay usuario autenticado",
      };
    }

    // updatePassword está disponible en el objeto User de Firebase Auth
    await (user as any).updatePassword(newPassword);

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Error al cambiar la contraseña",
    };
  }
};

/**
 * Eliminar cuenta del usuario
 */
export const deleteAccount = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return {
        success: false,
        error: "No hay usuario autenticado",
      };
    }

    // Eliminar usuario de Firebase Auth
    await user.delete();

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Error al eliminar la cuenta",
    };
  }
};

