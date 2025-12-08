/**
 * Rutas para solicitudes de adopción
 * Endpoints relacionados con solicitudes de adopción
 */

import { Router } from "express";
import { verifyFirebaseToken, AuthenticatedRequest } from "../middleware/auth";
import {
  createAdoptionRequest,
  getPetAdoptionRequests,
  getUserAdoptionRequests,
  getReceivedAdoptionRequests,
  updateAdoptionRequestStatus,
  cancelAdoptionRequest,
  getAdoptionRequestById,
} from "../services/adoptionRequests.service";
import { getPetById } from "../services/pets.service";
import { asyncHandler } from "../middleware/errorHandler";
import { validateAdoptionRequest, validateId } from "../middleware/validation";
import {
  notifyAdoptionRequest,
  notifyAdoptionResponse,
} from "../services/notifications.service";

const router = Router();

/**
 * POST /api/adoption-requests
 * Crea una nueva solicitud de adopción
 */
router.post(
  "/",
  verifyFirebaseToken,
  validateAdoptionRequest,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { petId, message } = req.body;

    // Obtener la mascota para obtener el ownerId
    const pet = await getPetById(petId);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: "Mascota no encontrada",
      });
    }

    if (pet.ownerId === req.user.uid) {
      return res.status(400).json({
        success: false,
        error: "No puedes solicitar adoptar tu propia mascota",
      });
    }

    if (pet.status !== "available") {
      return res.status(400).json({
        success: false,
        error: "Esta mascota ya no está disponible para adopción",
      });
    }

    const request = await createAdoptionRequest(
      petId,
      req.user.uid,
      pet.ownerId,
      message
    );

    // Enviar notificación al propietario
    try {
      await notifyAdoptionRequest(
        pet.ownerId,
        req.user.uid,
        petId,
        pet.name,
        request.id
      );
    } catch (error) {
      console.error("Error al enviar notificación:", error);
      // No fallar la creación si la notificación falla
    }

    res.status(201).json({
      success: true,
      data: request,
    });
  })
);

/**
 * GET /api/adoption-requests/pet/:petId
 * Obtiene las solicitudes de adopción de una mascota
 */
router.get(
  "/pet/:petId",
  verifyFirebaseToken,
  validateId,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { petId } = req.params;

    // Verificar que el usuario es el propietario de la mascota
    const pet = await getPetById(petId);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: "Mascota no encontrada",
      });
    }

    if (pet.ownerId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        error: "No tienes permiso para ver estas solicitudes",
      });
    }

    const requests = await getPetAdoptionRequests(petId);

    res.json({
      success: true,
      data: requests,
      count: requests.length,
    });
  })
);

/**
 * GET /api/adoption-requests/my-requests
 * Obtiene las solicitudes de adopción del usuario (como solicitante)
 */
router.get(
  "/my-requests",
  verifyFirebaseToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const requests = await getUserAdoptionRequests(req.user.uid);

    res.json({
      success: true,
      data: requests,
      count: requests.length,
    });
  })
);

/**
 * GET /api/adoption-requests/received
 * Obtiene las solicitudes recibidas por el usuario (como propietario)
 */
router.get(
  "/received",
  verifyFirebaseToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { status } = req.query;

    const requests = await getReceivedAdoptionRequests(
      req.user.uid,
      status as any
    );

    res.json({
      success: true,
      data: requests,
      count: requests.length,
    });
  })
);

/**
 * PUT /api/adoption-requests/:requestId/status
 * Actualiza el estado de una solicitud de adopción
 */
router.put(
  "/:requestId/status",
  verifyFirebaseToken,
  validateId,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { requestId } = req.params; // Ya está sanitizado por validateId
    const { status } = req.body;

    if (!status || !["approved", "rejected", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Estado inválido. Debe ser: approved, rejected o cancelled",
      });
    }

    let updatedRequest;
    
    if (status === "cancelled") {
      // El solicitante puede cancelar
      updatedRequest = await cancelAdoptionRequest(requestId, req.user.uid);
    } else {
      // Solo el propietario puede aprobar o rechazar
      const request = await getAdoptionRequestById(requestId);
      if (!request) {
        return res.status(404).json({
          success: false,
          error: "Solicitud no encontrada",
        });
      }

      updatedRequest = await updateAdoptionRequestStatus(
        requestId,
        req.user.uid,
        status
      );

      // Enviar notificación al solicitante
      try {
        const pet = await getPetById(updatedRequest.petId, false);
        if (pet) {
          await notifyAdoptionResponse(
            updatedRequest.requesterId,
            req.user.uid,
            updatedRequest.petId,
            pet.name,
            status,
            requestId
          );
        }
      } catch (error) {
        console.error("Error al enviar notificación:", error);
        // No fallar la actualización si la notificación falla
      }
    }

    res.json({
      success: true,
      data: updatedRequest,
      message: `Solicitud ${status === "approved" ? "aprobada" : status === "rejected" ? "rechazada" : "cancelada"} correctamente`,
    });
  })
);

export default router;

