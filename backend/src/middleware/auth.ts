/**
 * Middleware de autenticación Firebase
 * Verifica el token ID de Firebase en cada request protegido
 */

import { Request, Response, NextFunction } from "express";
import { firebaseAdmin } from "../config/firebaseAdmin";

// Extender el tipo Request para incluir el usuario autenticado
export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

/**
 * Middleware que verifica el token de Firebase
 * El token debe venir en el header Authorization como "Bearer <token>"
 */
export const verifyFirebaseToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        error: "No se proporcionó un token de autenticación",
      });
      return;
    }

    // Extraer el token (remover "Bearer ")
    const token = authHeader.split("Bearer ")[1];

    if (!token) {
      res.status(401).json({
        error: "Token de autenticación inválido",
      });
      return;
    }

    // Verificar el token con Firebase Admin
    if (!firebaseAdmin) {
      res.status(500).json({ error: "Firebase Admin no está inicializado" });
      return;
    }
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

    // Agregar la información del usuario al request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };

    // Continuar con el siguiente middleware
    next();
  } catch (error: any) {
    console.error("Error al verificar token:", error);

    if (error.code === "auth/id-token-expired") {
      res.status(401).json({
        error: "El token ha expirado. Por favor, inicia sesión nuevamente",
      });
      return;
    }

    if (error.code === "auth/id-token-revoked") {
      res.status(401).json({
        error: "El token ha sido revocado",
      });
      return;
    }

    res.status(401).json({
      error: "Token de autenticación inválido",
    });
  }
};

