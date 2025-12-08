/**
 * Estructura completa de la base de datos Firestore
 * Define todas las colecciones, tipos y relaciones
 */

// ==================== COLECCIONES ====================
export const COLLECTIONS = {
  USERS: "users",
  PETS: "pets",
  FAVORITES: "favorites",
  ADOPTION_REQUESTS: "adoptionRequests",
  MESSAGES: "messages",
  CONVERSATIONS: "conversations",
  NOTIFICATIONS: "notifications",
  REPORTS: "reports",
} as const;

// ==================== TIPOS DE DATOS ====================

/**
 * Usuario en Firestore
 */
export interface UserDocument {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  phone?: string;
  city?: string;
  bio?: string;
  role?: "admin" | "user"; // Rol del usuario (admin o user por defecto)
  createdAt: number;
  updatedAt: number;
  lastLoginAt?: number;
  isActive: boolean;
}

/**
 * Mascota en Firestore
 */
export interface PetDocument {
  id: string;
  name: string;
  type: "dog" | "cat";
  age: number;
  sex: "male" | "female";
  size?: "small" | "medium" | "large";
  city: string;
  description: string;
  photoUrl: string;
  photos?: string[];
  ownerId: string;
  createdAt: number;
  updatedAt: number;
  status: "available" | "adopted" | "pending";
  views: number;
  likes: number;
}

/**
 * Favorito (relación usuario-mascota)
 */
export interface FavoriteDocument {
  id: string;
  userId: string;
  petId: string;
  createdAt: number;
}

/**
 * Solicitud de adopción
 */
export interface AdoptionRequestDocument {
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
 * Mensaje entre usuarios
 */
export interface MessageDocument {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  petId?: string; // Opcional: si el mensaje está relacionado con una mascota
  content: string;
  read: boolean;
  createdAt: number;
}

/**
 * Conversación entre usuarios
 */
export interface ConversationDocument {
  id: string;
  participants: string[]; // Array de user IDs
  petId?: string; // Opcional: si la conversación es sobre una mascota
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: number;
  };
  createdAt: number;
  updatedAt: number;
  unreadCount: Record<string, number>; // userId -> count
}

/**
 * Notificación para usuarios
 */
export interface NotificationDocument {
  id: string;
  userId: string;
  type: "adoption_request" | "adoption_response" | "message" | "favorite" | "pet_status_change";
  title: string;
  message: string;
  relatedPetId?: string;
  relatedUserId?: string;
  relatedRequestId?: string;
  read: boolean;
  createdAt: number;
}

/**
 * Reporte de contenido
 */
export interface ReportDocument {
  id: string;
  reporterId: string;
  type: "pet" | "user" | "message";
  reportedPetId?: string;
  reportedUserId?: string;
  reportedMessageId?: string;
  reason: "spam" | "inappropriate" | "false_information" | "harassment" | "other";
  description: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  createdAt: number;
  reviewedAt?: number;
  reviewedBy?: string;
}

// ==================== ÍNDICES NECESARIOS ====================
/**
 * Índices compuestos necesarios en Firestore:
 * 
 * Colección: pets
 * - type + createdAt (desc)
 * - city + createdAt (desc)
 * - ownerId + createdAt (desc)
 * - status + createdAt (desc)
 * - type + city + createdAt (desc)
 * 
 * Colección: favorites
 * - userId + createdAt (desc)
 * - petId + createdAt (desc)
 * 
 * Colección: adoptionRequests
 * - petId + createdAt (desc)
 * - requesterId + createdAt (desc)
 * - ownerId + status + createdAt (desc)
 * 
 * Colección: messages
 * - conversationId + createdAt (asc)
 * - receiverId + read + createdAt (desc)
 * 
 * Colección: conversations
 * - participants (array-contains) + updatedAt (desc)
 */

// ==================== HELPERS ====================

/**
 * Crear documento de usuario con valores por defecto
 */
export const createUserDocument = (data: Partial<UserDocument> & { uid: string; email: string }): UserDocument => {
  const now = Date.now();
  return {
    uid: data.uid,
    email: data.email,
    displayName: data.displayName,
    photoURL: data.photoURL,
    emailVerified: data.emailVerified || false,
    phone: data.phone,
    city: data.city,
    bio: data.bio,
    createdAt: data.createdAt || now,
    updatedAt: now,
    lastLoginAt: now,
    isActive: true,
  };
};

/**
 * Crear documento de mascota con valores por defecto
 */
export const createPetDocument = (
  data: Partial<PetDocument> & {
    name: string;
    type: "dog" | "cat";
    age: number;
    sex: "male" | "female";
    city: string;
    description: string;
    photoUrl: string;
    ownerId: string;
  }
): Omit<PetDocument, "id"> => {
  const now = Date.now();
  return {
    name: data.name,
    type: data.type,
    age: data.age,
    sex: data.sex,
    city: data.city,
    description: data.description,
    photoUrl: data.photoUrl,
    ownerId: data.ownerId,
    createdAt: now,
    updatedAt: now,
    status: "available",
    views: 0,
    likes: 0,
  };
};

