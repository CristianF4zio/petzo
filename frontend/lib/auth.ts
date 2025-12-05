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

