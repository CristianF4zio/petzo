/**
 * Middleware para verificar que el usuario es administrador
 * Los administradores se identifican por un campo 'role: admin' en Firestore
 */

import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth";
import { getUserFromFirestore } from "../services/users.service";
import { asyncHandler } from "./errorHandler";

/**
 * Verifica que el usuario autenticado es administrador
 * Los administradores tienen role: 'admin' en su documento de Firestore
 */
export const verifyAdmin = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Usuario no autenticado",
      });
    }

    try {
      // Obtener información del usuario desde Firestore
      const userData = await getUserFromFirestore(req.user.uid);

      // Verificar si el usuario tiene rol de administrador
      // Por defecto, si no existe el campo role, no es admin
      // Para hacer un usuario admin, agregar role: 'admin' en su documento de Firestore
      const isAdmin = userData?.role === "admin";

      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          error: "Acceso denegado. Se requieren permisos de administrador.",
        });
      }

      // Usuario es admin, continuar
      next();
    } catch (error: any) {
      console.error("Error al verificar permisos de administrador:", error);
      return res.status(500).json({
        success: false,
        error: "Error al verificar permisos de administrador",
      });
    }
  }
);

