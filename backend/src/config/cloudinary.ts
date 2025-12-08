/**
 * Configuración de Cloudinary para almacenamiento de imágenes
 */

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import logger from "./logger";

dotenv.config();

// Modo desarrollo: Cloudinary opcional
const isDevelopment = process.env.NODE_ENV !== "production";
const skipCloudinary = isDevelopment && (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === "demo-cloud");

if (skipCloudinary) {
  logger.warn("Modo desarrollo: Cloudinary deshabilitado (usando credenciales demo)");
  console.log("⚠️  Modo desarrollo: Cloudinary deshabilitado (usando credenciales demo)");
  console.log("💡 Para habilitar Cloudinary, configura credenciales reales en el archivo .env");
} else {
  // Verificar que las variables de entorno estén configuradas
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error("CLOUDINARY_CLOUD_NAME no está configurado");
  }

  if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error("CLOUDINARY_API_KEY no está configurado");
  }

  if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error("CLOUDINARY_API_SECRET no está configurado");
  }

  // Configurar Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
    api_key: process.env.CLOUDINARY_API_KEY.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
  });

  logger.info("Cloudinary configurado correctamente", {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
  console.log("✅ Cloudinary configurado correctamente");
  console.log(`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`   API Key: ${process.env.CLOUDINARY_API_KEY.substring(0, 4)}...`);
}

export default skipCloudinary ? null : cloudinary;

