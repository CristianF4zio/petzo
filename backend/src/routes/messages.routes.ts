/**
 * Rutas de mensajes
 * Endpoints para enviar y recibir mensajes en conversaciones
 */

import { Router } from "express";
import { verifyFirebaseToken, AuthenticatedRequest } from "../middleware/auth";
import {
  createMessage,
  getConversationMessages,
  markMessagesAsRead,
  getUnreadMessages,
  getMessageById,
} from "../services/messages.service";
import { asyncHandler } from "../middleware/errorHandler";
import { validateId, sanitizeString } from "../middleware/validation";
import { notifyNewMessage } from "../services/notifications.service";

const router = Router();

/**
 * GET /api/messages/unread
 * Obtiene todos los mensajes no leídos del usuario autenticado
 */
router.get(
  "/unread",
  verifyFirebaseToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const messages = await getUnreadMessages(req.user.uid);

    res.json({
      success: true,
      data: messages,
      count: messages.length,
    });
  })
);

/**
 * GET /api/messages/conversation/:conversationId
 * Obtiene todos los mensajes de una conversación
 * Query params: limit (opcional, default: 50)
 */
router.get(
  "/conversation/:conversationId",
  verifyFirebaseToken,
  validateId,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { conversationId } = req.params; // Ya está sanitizado por validateId
    
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : 50;

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        error: "El límite debe ser un número entre 1 y 100",
      });
    }

    const messages = await getConversationMessages(
      conversationId,
      req.user.uid,
      limit
    );

    res.json({
      success: true,
      data: messages,
      count: messages.length,
    });
  })
);

/**
 * GET /api/messages/:id
 * Obtiene un mensaje específico por ID
 */
router.get(
  "/:id",
  verifyFirebaseToken,
  validateId,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { id } = req.params; // Ya está sanitizado por validateId
    
    const message = await getMessageById(id, req.user.uid);

    res.json({
      success: true,
      data: message,
    });
  })
);

/**
 * POST /api/messages
 * Crea un nuevo mensaje
 * Body: { conversationId: string, receiverId: string, content: string, petId?: string }
 */
router.post(
  "/",
  verifyFirebaseToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { conversationId, receiverId, content, petId } = req.body;

    // Validaciones
    if (!conversationId || typeof conversationId !== "string" || conversationId.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "conversationId es requerido",
      });
    }

    if (!receiverId || typeof receiverId !== "string" || receiverId.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "receiverId es requerido",
      });
    }

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "El contenido del mensaje es requerido",
      });
    }

    // Sanitizar y validar contenido
    const sanitizedContent = sanitizeString(content, 1000);
    if (sanitizedContent.length === 0) {
      return res.status(400).json({
        success: false,
        error: "El contenido del mensaje no puede estar vacío",
      });
    }

    if (sanitizedContent.length > 1000) {
      return res.status(400).json({
        success: false,
        error: "El mensaje es demasiado largo (máximo 1000 caracteres)",
      });
    }

    if (receiverId === req.user.uid) {
      return res.status(400).json({
        success: false,
        error: "No puedes enviarte un mensaje a ti mismo",
      });
    }

    try {
      const message = await createMessage(
        conversationId.trim(),
        req.user.uid,
        receiverId.trim(),
        sanitizedContent,
        petId ? petId.trim() : undefined
      );

      // Enviar notificación al receptor
      try {
        await notifyNewMessage(
          receiverId.trim(),
          req.user.uid,
          petId ? petId.trim() : undefined,
          sanitizedContent
        );
      } catch (error) {
        console.error("Error al enviar notificación:", error);
        // No fallar la creación si la notificación falla
      }

      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (error: any) {
      if (error.message.includes("vacío") || error.message.includes("demasiado largo")) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }
      throw error;
    }
  })
);

/**
 * PUT /api/messages/conversation/:conversationId/read
 * Marca todos los mensajes de una conversación como leídos
 */
router.put(
  "/conversation/:conversationId/read",
  verifyFirebaseToken,
  validateId,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { conversationId } = req.params; // Ya está sanitizado por validateId
    
    await markMessagesAsRead(conversationId, req.user.uid);

    res.json({
      success: true,
      message: "Mensajes marcados como leídos",
    });
  })
);

export default router;

