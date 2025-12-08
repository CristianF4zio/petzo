/**
 * Utilidades para validar imágenes
 * Valida magic bytes para asegurar que el archivo es realmente una imagen
 */

/**
 * Magic bytes de diferentes formatos de imagen
 */
const IMAGE_SIGNATURES: Record<string, Buffer[]> = {
  jpeg: [Buffer.from([0xff, 0xd8, 0xff])],
  png: [Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
  gif: [
    Buffer.from([0x47, 0x49, 0x46, 0x38, 0x37, 0x61]), // GIF87a
    Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]), // GIF89a
  ],
  webp: [Buffer.from([0x52, 0x49, 0x46, 0x46])], // RIFF header
  bmp: [Buffer.from([0x42, 0x4d])],
};

/**
 * Validar que un buffer es realmente una imagen
 */
export const validateImageBuffer = (buffer: Buffer, mimetype: string): boolean => {
  if (!buffer || buffer.length < 4) {
    return false;
  }

  // Obtener el tipo de imagen del mimetype
  const imageType = mimetype.split("/")[1]?.toLowerCase();
  if (!imageType) {
    return false;
  }

  // Normalizar nombres de tipos
  const normalizedType = imageType === "jpg" ? "jpeg" : imageType;

  // Verificar si el tipo está soportado
  const signatures = IMAGE_SIGNATURES[normalizedType];
  if (!signatures) {
    // Si no tenemos firma para este tipo, confiar en el mimetype
    return true;
  }

  // Verificar magic bytes
  for (const signature of signatures) {
    if (buffer.subarray(0, signature.length).equals(signature)) {
      return true;
    }
  }

  // Para WebP, verificar también el header completo
  if (normalizedType === "webp") {
    const webpHeader = buffer.subarray(8, 12);
    if (webpHeader.equals(Buffer.from("WEBP"))) {
      return true;
    }
  }

  return false;
};

/**
 * Obtener el tipo de imagen desde los magic bytes
 */
export const getImageTypeFromBuffer = (buffer: Buffer): string | null => {
  if (!buffer || buffer.length < 4) {
    return null;
  }

  for (const [type, signatures] of Object.entries(IMAGE_SIGNATURES)) {
    for (const signature of signatures) {
      if (buffer.subarray(0, signature.length).equals(signature)) {
        return type === "jpeg" ? "jpg" : type;
      }
    }
  }

  // Verificar WebP específicamente
  if (buffer.subarray(0, 4).equals(Buffer.from([0x52, 0x49, 0x46, 0x46]))) {
    const webpHeader = buffer.subarray(8, 12);
    if (webpHeader.equals(Buffer.from("WEBP"))) {
      return "webp";
    }
  }

  return null;
};

