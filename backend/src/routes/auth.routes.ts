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
import { validateProfileData, validateId } from "../middleware/validation";
import { firebaseAdmin } from "../config/firebaseAdmin";

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
  validateProfileData,
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

/**
 * POST /api/auth/send-verification-email
 * Envía un email de verificación
 */
router.post(
  "/send-verification-email",
  verifyFirebaseToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    try {
      const user = await firebaseAdmin.auth().getUser(req.user.uid);

      if (user.emailVerified) {
        return res.status(400).json({
          success: false,
          error: "El email ya está verificado",
        });
      }

      // En Firebase Admin, necesitamos generar un link de verificación
      // Nota: Esto requiere configuración adicional en producción
      const actionCodeSettings = {
        url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/verify-email`,
        handleCodeInApp: false,
      };

      // En producción, usarías Firebase Admin para generar el link
      // Por ahora, retornamos un mensaje informativo
      res.json({
        success: true,
        message: "Por favor, verifica tu email desde la aplicación",
        // En producción, aquí iría el link de verificación
      });
    } catch (error: any) {
      console.error("Error al enviar email de verificación:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Error al enviar el email de verificación",
      });
    }
  })
);

/**
 * POST /api/auth/forgot-password
 * Solicita recuperación de contraseña
 */
router.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        success: false,
        error: "Email es requerido",
      });
    }

    try {
      // Verificar que el usuario existe
      const user = await firebaseAdmin.auth().getUserByEmail(email);

      // Generar link de recuperación
      const actionCodeSettings = {
        url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/reset-password`,
        handleCodeInApp: false,
      };

      // En producción, aquí se enviaría el email con el link
      // Por ahora, retornamos un mensaje informativo
      res.json({
        success: true,
        message: "Si el email existe, recibirás un enlace para recuperar tu contraseña",
        // En producción, no se debería confirmar si el email existe por seguridad
      });
    } catch (error: any) {
      // Por seguridad, no revelamos si el email existe o no
      res.json({
        success: true,
        message: "Si el email existe, recibirás un enlace para recuperar tu contraseña",
      });
    }
  })
);

/**
 * POST /api/auth/reset-password
 * Restablece la contraseña con un código
 */
router.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const { code, newPassword } = req.body;

    if (!code || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Código y nueva contraseña son requeridos",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    try {
      // En producción, verificarías el código con Firebase Auth
      // Por ahora, retornamos un mensaje informativo
      res.json({
        success: true,
        message: "Contraseña restablecida correctamente",
      });
    } catch (error: any) {
      console.error("Error al restablecer contraseña:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Error al restablecer la contraseña",
      });
    }
  })
);

/**
 * GET /api/auth/user/:id
 * Obtiene un usuario por ID
 */
router.get(
  "/user/:id",
  verifyFirebaseToken,
  validateId,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { id } = req.params;

    try {
      const user = await getUserById(id);

      res.json({
        success: true,
        user,
      });
    } catch (error: any) {
      if (error.message === "Usuario no encontrado") {
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
