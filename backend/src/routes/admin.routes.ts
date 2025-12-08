/**
 * Rutas de administración
 * Endpoints para administradores del sistema
 */

import { Router } from "express";
import { verifyFirebaseToken, AuthenticatedRequest } from "../middleware/auth";
import { verifyAdmin } from "../middleware/admin";
import { asyncHandler } from "../middleware/errorHandler";
import { validateId } from "../middleware/validation";
import { getAllPets, updatePetStatusAsAdmin, deletePetAsAdmin } from "../services/pets.service";
import { getReports, updateReportStatus } from "../services/reports.service";
import { getAllUsers } from "../services/users.service";
import { PaginationParams } from "../types/pagination";
import { PetFilters } from "../types/filters";

const router = Router();

// Todas las rutas de admin requieren verificación de administrador

/**
 * GET /api/admin/users
 * Listar usuarios (solo administradores)
 */
router.get(
  "/users",
  verifyFirebaseToken,
  verifyAdmin,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { page, limit } = req.query;
    const pagination: PaginationParams = {};

    if (page !== undefined) {
      pagination.page = parseInt(page as string, 10);
    }
    if (limit !== undefined) {
      pagination.limit = parseInt(limit as string, 10);
    }

    const result = await getAllUsers(pagination);

    res.json({
      success: true,
      ...result,
    });
  })
);

/**
 * GET /api/admin/pets
 * Listar todas las mascotas (solo administradores)
 */
router.get(
  "/pets",
  verifyFirebaseToken,
  verifyAdmin,
  asyncHandler(async (req: AuthenticatedRequest, res) => {

    const {
      page,
      limit,
      type,
      city,
      status,
      search,
    } = req.query;

    const filters: PetFilters = {};
    const pagination: PaginationParams = {};

    if (type === "dog" || type === "cat") {
      filters.type = type;
    }
    if (typeof city === "string") {
      filters.city = city;
    }
    if (status === "available" || status === "adopted" || status === "pending") {
      filters.status = status;
    }
    if (typeof search === "string" && search.trim().length > 0) {
      filters.search = search.trim();
    }

    if (page !== undefined) {
      pagination.page = parseInt(page as string, 10);
    }
    if (limit !== undefined) {
      pagination.limit = parseInt(limit as string, 10);
    }

    const result = await getAllPets(filters, pagination);

    res.json({
      success: true,
      ...result,
    });
  })
);

/**
 * PUT /api/admin/pets/:id/status
 * Cambiar estado de una mascota (solo administradores)
 */
router.put(
  "/pets/:id/status",
  verifyFirebaseToken,
  verifyAdmin,
  validateId,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["available", "adopted", "pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Estado inválido. Debe ser: available, adopted o pending",
      });
    }

    const updatedPet = await updatePetStatusAsAdmin(id, status);

    res.json({
      success: true,
      data: updatedPet,
      message: `Estado de mascota actualizado a ${status}`,
    });
  })
);

/**
 * DELETE /api/admin/pets/:id
 * Eliminar mascota (solo administradores)
 */
router.delete(
  "/pets/:id",
  verifyFirebaseToken,
  verifyAdmin,
  validateId,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;

    await deletePetAsAdmin(id);

    res.json({
      success: true,
      message: "Mascota eliminada por administrador",
    });
  })
);

/**
 * GET /api/admin/reports
 * Ver reportes (solo administradores)
 */
router.get(
  "/reports",
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
 * PUT /api/admin/reports/:id/resolve
 * Resolver reporte (solo administradores)
 */
router.put(
  "/reports/:id/resolve",
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

