/**
 * Rutas para estadísticas
 */

import { Router } from "express";
import {
  getOverviewStats,
  getPetsByCity,
  getMostViewedPets,
  getMostFavoritedPets,
} from "../services/stats.service";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

/**
 * GET /api/stats/overview
 * Obtiene estadísticas generales
 */
router.get(
  "/overview",
  asyncHandler(async (req, res) => {
    const stats = await getOverviewStats();

    res.json({
      success: true,
      data: stats,
    });
  })
);

/**
 * GET /api/stats/pets-by-city
 * Obtiene mascotas agrupadas por ciudad
 * Query params: limit (default: 10)
 */
router.get(
  "/pets-by-city",
  asyncHandler(async (req, res) => {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;

    const stats = await getPetsByCity(limit);

    res.json({
      success: true,
      data: stats,
    });
  })
);

/**
 * GET /api/stats/most-viewed
 * Obtiene las mascotas más vistas
 * Query params: limit (default: 10)
 */
router.get(
  "/most-viewed",
  asyncHandler(async (req, res) => {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;

    const pets = await getMostViewedPets(limit);

    res.json({
      success: true,
      data: pets,
    });
  })
);

/**
 * GET /api/stats/most-favorited
 * Obtiene las mascotas más favoritas
 * Query params: limit (default: 10)
 */
router.get(
  "/most-favorited",
  asyncHandler(async (req, res) => {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;

    const pets = await getMostFavoritedPets(limit);

    res.json({
      success: true,
      data: pets,
    });
  })
);

export default router;

