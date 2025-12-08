/**
 * Rutas para favoritos
 * Endpoints relacionados con favoritos de mascotas
 */

import { Router } from "express";
import { verifyFirebaseToken, AuthenticatedRequest } from "../middleware/auth";
import {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  isFavorite,
  getPetFavoriteCount,
} from "../services/favorites.service";
import { asyncHandler } from "../middleware/errorHandler";
import { validateId } from "../middleware/validation";
import { notifyFavorite } from "../services/notifications.service";
import { getPetById } from "../services/pets.service";

const router = Router();

/**
 * GET /api/favorites
 * Obtiene todos los favoritos del usuario autenticado
 */
router.get(
  "/",
  verifyFirebaseToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const favorites = await getUserFavorites(req.user.uid);

    res.json({
      success: true,
      data: favorites,
      count: favorites.length,
    });
  })
);

/**
 * POST /api/favorites/:petId
 * Agrega una mascota a favoritos
 */
router.post(
  "/:petId",
  verifyFirebaseToken,
  validateId,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { petId } = req.params;

    const favorite = await addFavorite(req.user.uid, petId);

    // Enviar notificación al propietario de la mascota
    try {
      const pet = await getPetById(petId, false);
      if (pet && pet.ownerId !== req.user.uid) {
        await notifyFavorite(pet.ownerId, req.user.uid, petId, pet.name);
      }
    } catch (error) {
      console.error("Error al enviar notificación:", error);
      // No fallar la creación si la notificación falla
    }

    res.status(201).json({
      success: true,
      data: favorite,
    });
  })
);

/**
 * DELETE /api/favorites/:petId
 * Elimina una mascota de favoritos
 */
router.delete(
  "/:petId",
  verifyFirebaseToken,
  validateId,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { petId } = req.params;

    await removeFavorite(req.user.uid, petId);

    res.json({
      success: true,
      message: "Favorito eliminado correctamente",
    });
  })
);

/**
 * GET /api/favorites/check/:petId
 * Verifica si una mascota está en favoritos del usuario
 */
router.get(
  "/check/:petId",
  verifyFirebaseToken,
  validateId,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { petId } = req.params;

    const favorite = await isFavorite(req.user.uid, petId);

    res.json({
      success: true,
      isFavorite: favorite,
    });
  })
);

/**
 * GET /api/favorites/count/:petId
 * Obtiene el conteo de favoritos de una mascota
 */
router.get(
  "/count/:petId",
  validateId,
  asyncHandler(async (req, res) => {
    const { petId } = req.params;

    const count = await getPetFavoriteCount(petId);

    res.json({
      success: true,
      count,
    });
  })
);

export default router;

