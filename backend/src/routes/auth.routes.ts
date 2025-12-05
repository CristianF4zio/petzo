/**
 * Rutas de autenticación
 * Endpoints relacionados con la autenticación del usuario
 */

import { Router } from "express";
import { verifyFirebaseToken, AuthenticatedRequest } from "../middleware/auth";
import { getUserById } from "../services/users.service";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

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

export default router;

