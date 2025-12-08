/**
 * Rutas para reportes
 */

import { Router } from "express";
import { verifyFirebaseToken, AuthenticatedRequest } from "../middleware/auth";
import { verifyAdmin } from "../middleware/admin";
import {
  createReport,
  getReports,
  updateReportStatus,
} from "../services/reports.service";
import { asyncHandler } from "../middleware/errorHandler";
import { validateId } from "../middleware/validation";
import { PaginationParams } from "../types/pagination";

const router = Router();

/**
 * POST /api/reports
 * Crear un reporte
 */
router.post(
  "/",
  verifyFirebaseToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { type, reportedPetId, reportedUserId, reportedMessageId, reason, description } = req.body;

    // Validaciones
    if (!type || !["pet", "user", "message"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Tipo de reporte inválido. Debe ser: pet, user o message",
      });
    }

    if (!reason || !["spam", "inappropriate", "false_information", "harassment", "other"].includes(reason)) {
      return res.status(400).json({
        success: false,
        error: "Razón inválida",
      });
    }

    if (!description || typeof description !== "string" || description.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "La descripción es requerida",
      });
    }

    if (description.length > 1000) {
      return res.status(400).json({
        success: false,
        error: "La descripción no puede exceder 1000 caracteres",
      });
    }

    // Validar que al menos uno de los IDs relacionados esté presente
    if (type === "pet" && !reportedPetId) {
      return res.status(400).json({
        success: false,
        error: "reportedPetId es requerido para reportes de tipo 'pet'",
      });
    }

    if (type === "user" && !reportedUserId) {
      return res.status(400).json({
        success: false,
        error: "reportedUserId es requerido para reportes de tipo 'user'",
      });
    }

    if (type === "message" && !reportedMessageId) {
      return res.status(400).json({
        success: false,
        error: "reportedMessageId es requerido para reportes de tipo 'message'",
      });
    }

    const report = await createReport({
      reporterId: req.user.uid,
      type,
      reportedPetId,
      reportedUserId,
      reportedMessageId,
      reason,
      description: description.trim(),
    });

    res.status(201).json({
      success: true,
      data: report,
    });
  })
);

/**
 * GET /api/reports
 * Obtener reportes (solo administradores)
 * Requiere permisos de administrador
 */
router.get(
  "/",
  verifyFirebaseToken,
  verifyAdmin,
  asyncHandler(async (req: AuthenticatedRequest, res) => {

    const { page, limit, status } = req.query;
    const pagination: PaginationParams = {};

    if (page !== undefined) {
      pagination.page = parseInt(page as string, 10);
    }
    if (limit !== undefined) {
      pagination.limit = parseInt(limit as string, 10);
    }

    const result = await getReports(
      pagination,
      status as "pending" | "reviewed" | "resolved" | "dismissed" | undefined
    );

    res.json({
      success: true,
      ...result,
    });
  })
);

/**
 * PUT /api/reports/:id/status
 * Actualizar estado de un reporte (solo administradores)
 */
router.put(
  "/:id/status",
  verifyFirebaseToken,
  verifyAdmin,
  validateId,
  asyncHandler(async (req: AuthenticatedRequest, res) => {

    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["reviewed", "resolved", "dismissed"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Estado inválido. Debe ser: reviewed, resolved o dismissed",
      });
    }

    try {
      const updatedReport = await updateReportStatus(id, status, req.user.uid);

      res.json({
        success: true,
        data: updatedReport,
      });
    } catch (error: any) {
      if (error.message === "Reporte no encontrado") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      throw error;
    }
  })
);

export default router;

