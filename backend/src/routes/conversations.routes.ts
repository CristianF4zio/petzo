/**
 * Rutas de conversaciones
 * Endpoints para gestionar conversaciones entre usuarios
 */

import { Router } from "express";
import { verifyFirebaseToken, AuthenticatedRequest } from "../middleware/auth";
import {
  getOrCreateConversation,
  getUserConversations,
  getConversationById,
  markConversationAsRead,
} from "../services/conversations.service";
import { asyncHandler } from "../middleware/errorHandler";
import { validateId } from "../middleware/validation";

const router = Router();

/**
 * GET /api/conversations
 * Obtiene todas las conversaciones del usuario autenticado
 */
router.get(
  "/",
  verifyFirebaseToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const conversations = await getUserConversations(req.user.uid);

    res.json({
      success: true,
      data: conversations,
      count: conversations.length,
    });
  })
);

/**
 * GET /api/conversations/:id
 * Obtiene una conversación específica por ID
 */
router.get(
  "/:id",
  verifyFirebaseToken,
  validateId,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { id } = req.params;
    const conversation = await getConversationById(id, req.user.uid);

    res.json({
      success: true,
      data: conversation,
    });
  })
);

/**
 * POST /api/conversations
 * Crea una nueva conversación o obtiene una existente
 * Body: { participantId: string, petId?: string }
 */
router.post(
  "/",
  verifyFirebaseToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { participantId, petId } = req.body;

    if (!participantId || typeof participantId !== "string" || participantId.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "participantId es requerido",
      });
    }

    if (participantId.trim() === req.user.uid) {
      return res.status(400).json({
        success: false,
        error: "No puedes crear una conversación contigo mismo",
      });
    }

    // Validar formato de ID si se proporciona petId
    if (petId && (typeof petId !== "string" || petId.trim().length === 0)) {
      return res.status(400).json({
        success: false,
        error: "petId inválido",
      });
    }

    const conversation = await getOrCreateConversation(
      req.user.uid,
      participantId.trim(),
      petId ? petId.trim() : undefined
    );

    res.status(201).json({
      success: true,
      data: conversation,
    });
  })
);

/**
 * PUT /api/conversations/:id/read
 * Marca una conversación como leída
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
    await markConversationAsRead(id, req.user.uid);

    res.json({
      success: true,
      message: "Conversación marcada como leída",
    });
  })
);

export default router;

