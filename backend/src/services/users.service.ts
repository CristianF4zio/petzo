/**
 * Servicio para manejar la lógica relacionada con usuarios
 * Interactúa con Firebase Auth y Firestore
 */

import { firebaseAdmin, db } from "../config/firebaseAdmin";

const USERS_COLLECTION = "users";

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt: number;
  updatedAt: number;
  phone?: string;
  city?: string;
  bio?: string;
  role?: "admin" | "user";
}

/**
 * Crear o actualizar un usuario en Firestore
 */
export const createOrUpdateUser = async (userData: {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
}): Promise<UserData> => {
  try {
    if (!db || !firebaseAdmin) {
      console.warn("⚠️ Firestore no está inicializado, saltando guardado de usuario");
      // Retornar datos básicos si Firestore no está disponible
      return {
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        emailVerified: userData.emailVerified || false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    }

    const userRef = db.collection(USERS_COLLECTION).doc(userData.uid);
    const userDoc = await userRef.get();

    const now = Date.now();
    const userInfo: Partial<UserData> = {
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName || null,
      photoURL: userData.photoURL || null,
      emailVerified: userData.emailVerified || false,
      updatedAt: now,
    };

    if (!userDoc.exists) {
      // Crear nuevo usuario
      userInfo.createdAt = now;
      await userRef.set(userInfo);
      console.log(`✅ Usuario creado en Firestore: ${userData.uid}`);
    } else {
      // Actualizar usuario existente
      await userRef.update(userInfo);
      console.log(`✅ Usuario actualizado en Firestore: ${userData.uid}`);
    }

    // Obtener el documento completo
    const updatedDoc = await userRef.get();
    return updatedDoc.data() as UserData;
  } catch (error) {
    console.error("Error al crear/actualizar usuario:", error);
    throw new Error("Error al guardar la información del usuario");
  }
};

/**
 * Obtener información del usuario desde Firestore
 */
export const getUserFromFirestore = async (uid: string): Promise<UserData | null> => {
  try {
    if (!db || !firebaseAdmin) {
      return null;
    }

    const userDoc = await db.collection(USERS_COLLECTION).doc(uid).get();

    if (!userDoc.exists) {
      return null;
    }

    const data = userDoc.data();
    return {
      ...data,
      uid: userDoc.id,
      role: data?.role || "user", // Por defecto es 'user' si no está definido
    } as UserData;
  } catch (error) {
    console.error("Error al obtener usuario de Firestore:", error);
    throw new Error("Error al obtener la información del usuario");
  }
};

/**
 * Obtener información del usuario autenticado (desde Firebase Auth y Firestore)
 */
export const getUserById = async (uid: string): Promise<UserData> => {
  try {
    if (!firebaseAdmin) {
      throw new Error("Firebase Admin no está inicializado");
    }

    // Obtener de Firebase Auth
    const userRecord = await firebaseAdmin.auth().getUser(uid);
    
    // Intentar obtener de Firestore
    let firestoreUser: UserData | null = null;
    try {
      firestoreUser = await getUserFromFirestore(uid);
    } catch (error) {
      console.warn("No se pudo obtener usuario de Firestore:", error);
    }

    // Combinar datos de Auth y Firestore
    return {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: firestoreUser?.displayName || userRecord.displayName,
      photoURL: firestoreUser?.photoURL || userRecord.photoURL,
      emailVerified: userRecord.emailVerified,
      phone: firestoreUser?.phone,
      city: firestoreUser?.city,
      bio: firestoreUser?.bio,
      createdAt: firestoreUser?.createdAt,
      updatedAt: firestoreUser?.updatedAt,
    };
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    throw new Error("Error al obtener la información del usuario");
  }
};

/**
 * Actualizar información adicional del usuario
 */
export const updateUserProfile = async (
  uid: string,
  updates: {
    displayName?: string;
    phone?: string;
    city?: string;
    bio?: string;
  }
): Promise<UserData> => {
  try {
    if (!db || !firebaseAdmin) {
      throw new Error("Firestore no está inicializado");
    }

    const userRef = db.collection(USERS_COLLECTION).doc(uid);
    
    const updateData = {
      ...updates,
      updatedAt: Date.now(),
    };

    await userRef.set(updateData, { merge: true });

    // Actualizar también en Firebase Auth si hay displayName
    if (updates.displayName && firebaseAdmin) {
      await firebaseAdmin.auth().updateUser(uid, {
        displayName: updates.displayName,
      });
    }

    const updatedDoc = await userRef.get();
    return updatedDoc.data() as UserData;
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    throw new Error("Error al actualizar el perfil del usuario");
  }
};

/**
 * Listar usuarios con paginación (solo admin)
 */
export const getAllUsers = async (
  pagination?: { page?: number; limit?: number }
): Promise<{
  users: UserData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const page = pagination?.page || 1;
    const limit = Math.min(pagination?.limit || 20, 100);
    const offset = (page - 1) * limit;

    // Obtener total de usuarios
    const totalSnapshot = await db.collection(USERS_COLLECTION).count().get();
    const total = totalSnapshot.data().count;

    // Obtener usuarios con paginación
    const snapshot = await db
      .collection(USERS_COLLECTION)
      .orderBy("createdAt", "desc")
      .offset(offset)
      .limit(limit)
      .get();

    const users: UserData[] = [];
    for (const doc of snapshot.docs) {
      const userData = doc.data() as UserData;
      users.push({
        ...userData,
        uid: doc.id,
      });
    }

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    throw new Error("Error al listar usuarios");
  }
};

