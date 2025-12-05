/**
 * Rutas para subida de archivos
 * Maneja la subida de imágenes a Cloudinary
 */

import { Router } from "express";
import multer from "multer";
import { verifyFirebaseToken, AuthenticatedRequest } from "../middleware/auth";
import cloudinary from "../config/cloudinary";
import { asyncHandler } from "../middleware/errorHandler";
import { Readable } from "stream";

const router = Router();

// Configurar multer para almacenar en memoria (no en disco)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Solo permitir imágenes
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos de imagen"));
    }
  },
});

/**
 * POST /api/uploads/pet-photo
 * Sube una foto de mascota a Cloudinary
 * Requiere autenticación
 */
router.post(
  "/pet-photo",
  verifyFirebaseToken,
  upload.single("photo"),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No se proporcionó ningún archivo",
      });
    }

    // Bandera para evitar múltiples respuestas
    let responseSent = false;

    const sendErrorResponse = (error: any, message: string) => {
      if (!responseSent) {
        responseSent = true;
        console.error(message, error);
        res.status(500).json({
          success: false,
          error: message,
        });
      }
    };

    try {
      // Crear un stream desde el buffer del archivo
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "petzo/pets", // Carpeta en Cloudinary
          resource_type: "image",
          transformation: [
            {
              width: 800,
              height: 800,
              crop: "limit",
              quality: "auto",
            },
          ],
        },
        (error, result) => {
          if (error) {
            return sendErrorResponse(error, "Error al subir la imagen");
          }

          if (!result) {
            return sendErrorResponse(null, "No se recibió respuesta de Cloudinary");
          }

          if (!responseSent) {
            responseSent = true;
            res.json({
              success: true,
              data: {
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
              },
            });
          }
        }
      );

      // Manejar errores del stream de Cloudinary
      stream.on("error", (error) => {
        sendErrorResponse(error, "Error en el stream de Cloudinary");
      });

      // Convertir el buffer a stream y subirlo
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);

      // Manejar errores del bufferStream
      bufferStream.on("error", (error) => {
        sendErrorResponse(error, "Error al leer el archivo");
      });

      // Manejar errores durante el pipe
      bufferStream.on("end", () => {
        // Stream completado exitosamente
      });

      // Pipe con manejo de errores
      bufferStream.pipe(stream).on("error", (error) => {
        sendErrorResponse(error, "Error al transferir el archivo");
      });
    } catch (error) {
      sendErrorResponse(error, "Error al procesar la imagen");
    }
  })
);

export default router;

