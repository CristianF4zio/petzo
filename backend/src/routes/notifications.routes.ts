/**
 * Rutas para notificaciones
 */

import { Router } from "express";
import { verifyFirebaseToken, AuthenticatedRequest } from "../middleware/auth";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationsCount,
  deleteNotification,
} from "../services/notifications.service";
import { asyncHandler } from "../middleware/errorHandler";
import { validateId } from "../middleware/validation";
import { PaginationParams } from "../types/pagination";

const router = Router();

/**
 * GET /api/notifications
 * Obtiene las notificaciones del usuario autenticado
 * Query params: page, limit, unreadOnly
 */
router.get(
  "/",
  verifyFirebaseToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { page, limit, unreadOnly } = req.query;
    const pagination: PaginationParams = {};

    if (page !== undefined) {
      pagination.page = parseInt(page as string, 10);
    }
    if (limit !== undefined) {
      pagination.limit = parseInt(limit as string, 10);
    }

    const result = await getUserNotifications(
      req.user.uid,
      pagination,
      unreadOnly === "true"
    );

    res.json({
      success: true,
      ...result,
    });
  })
);

/**
 * GET /api/notifications/unread-count
 * Obtiene el conteo de notificaciones no leídas
 */
router.get(
  "/unread-count",
  verifyFirebaseToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const count = await getUnreadNotificationsCount(req.user.uid);

    res.json({
      success: true,
      count,
    });
  })
);

/**
 * PUT /api/notifications/:id/read
 * Marca una notificación como leída
 */
router.put(
  "/:id/read",
  verifyFirebaseToken,
  validateId,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { id } = req.params;

    try {
      await markNotificationAsRead(id, req.user.uid);

      res.json({
        success: true,
        message: "Notificación marcada como leída",
      });
    } catch (error: any) {
      if (error.message === "Notificación no encontrada") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      if (error.message.includes("permiso")) {
        return res.status(403).json({
          success: false,
          error: error.message,
        });
      }
      throw error;
    }
  })
);

/**
 * PUT /api/notifications/read-all
 * Marca todas las notificaciones como leídas
 */
router.put(
  "/read-all",
  verifyFirebaseToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    await markAllNotificationsAsRead(req.user.uid);

    res.json({
      success: true,
      message: "Todas las notificaciones marcadas como leídas",
    });
  })
);

/**
 * DELETE /api/notifications/:id
 * Elimina una notificación
 */
router.delete(
  "/:id",
  verifyFirebaseToken,
  validateId,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { id } = req.params;

    try {
      await deleteNotification(id, req.user.uid);

      res.json({
        success: true,
        message: "Notificación eliminada",
      });
    } catch (error: any) {
      if (error.message === "Notificación no encontrada") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      if (error.message.includes("permiso")) {
        return res.status(403).json({
          success: false,
          error: error.message,
        });
      }
      throw error;
    }
  })
);

export default router;

