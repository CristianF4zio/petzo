/**
 * Rutas de autenticación
 * Endpoints relacionados con la autenticación del usuario
 */

import { Router } from "express";
import { verifyFirebaseToken, AuthenticatedRequest } from "../middleware/auth";
import {
  getUserById,
  createOrUpdateUser,
  updateUserProfile,
} from "../services/users.service";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

/**
 * POST /api/auth/register
 * Crea o actualiza un usuario en Firestore después del registro
 */
router.post(
  "/register",
  verifyFirebaseToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { displayName, photoURL } = req.body;

    try {
      const user = await createOrUpdateUser({
        uid: req.user.uid,
        email: req.user.email || "",
        displayName: displayName,
        photoURL: photoURL,
        emailVerified: false,
      });

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      console.error("Error al registrar usuario:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Error al registrar usuario",
      });
    }
  })
);

/**
 * GET /api/auth/me
 * Obtiene la información del usuario autenticado
 */
router.get(
  "/me",
  verifyFirebaseToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const user = await getUserById(req.user.uid);

    res.json({
      success: true,
      user,
    });
  })
);

/**
 * PUT /api/auth/profile
 * Actualiza el perfil del usuario
 */
router.put(
  "/profile",
  verifyFirebaseToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { displayName, phone, city, bio } = req.body;

    try {
      const updatedUser = await updateUserProfile(req.user.uid, {
        displayName,
        phone,
        city,
        bio,
      });

      res.json({
        success: true,
        user: updatedUser,
      });
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Error al actualizar el perfil",
      });
    }
  })
);

export default router;

