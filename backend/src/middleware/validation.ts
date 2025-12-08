/**
 * Middleware de validación
 * Valida y sanitiza los datos de entrada
 */

import { Request, Response, NextFunction } from "express";

/**
 * Sanitizar string: eliminar espacios al inicio/final y caracteres peligrosos
 */
export const sanitizeString = (str: string, maxLength?: number): string => {
  if (typeof str !== "string") return "";
  
  let sanitized = str.trim();
  
  // Limitar longitud si se especifica
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
};

/**
 * Validar URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
};

/**
 * Validar email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar que un número esté en un rango
 */
export const isNumberInRange = (
  value: number,
  min: number,
  max: number
): boolean => {
  return typeof value === "number" && value >= min && value <= max;
};

/**
 * Validaciones para crear/actualizar mascota
 */
export const validatePetData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, type, age, sex, size, city, description, photoUrl, photos } = req.body;
  const errors: string[] = [];

  // Validar nombre
  if (name !== undefined) {
    const sanitizedName = sanitizeString(name, 100);
    if (!sanitizedName || sanitizedName.length < 2) {
      errors.push("El nombre debe tener al menos 2 caracteres");
    } else if (sanitizedName.length > 100) {
      errors.push("El nombre no puede exceder 100 caracteres");
    } else {
      req.body.name = sanitizedName;
    }
  }

  // Validar tipo
  if (type !== undefined && type !== "dog" && type !== "cat") {
    errors.push("El tipo debe ser 'dog' o 'cat'");
  }

  // Validar edad
  if (age !== undefined) {
    const ageNum = typeof age === "string" ? parseInt(age, 10) : age;
    if (isNaN(ageNum) || !isNumberInRange(ageNum, 0, 30)) {
      errors.push("La edad debe ser un número entre 0 y 30 años");
    } else {
      req.body.age = ageNum;
    }
  }

  // Validar sexo
  if (sex !== undefined && sex !== "male" && sex !== "female") {
    errors.push("El sexo debe ser 'male' o 'female'");
  }

  // Validar tamaño
  if (size !== undefined && size !== "small" && size !== "medium" && size !== "large") {
    errors.push("El tamaño debe ser 'small', 'medium' o 'large'");
  }

  // Validar ciudad
  if (city !== undefined) {
    const sanitizedCity = sanitizeString(city, 100);
    if (!sanitizedCity || sanitizedCity.length < 2) {
      errors.push("La ciudad debe tener al menos 2 caracteres");
    } else if (sanitizedCity.length > 100) {
      errors.push("La ciudad no puede exceder 100 caracteres");
    } else {
      req.body.city = sanitizedCity;
    }
  }

  // Validar descripción
  if (description !== undefined) {
    const sanitizedDescription = sanitizeString(description, 2000);
    if (sanitizedDescription.length > 2000) {
      errors.push("La descripción no puede exceder 2000 caracteres");
    } else {
      req.body.description = sanitizedDescription;
    }
  }

  // Validar URL de foto
  if (photoUrl !== undefined && photoUrl !== "") {
    if (!isValidUrl(photoUrl)) {
      errors.push("La URL de la foto no es válida");
    } else if (photoUrl.length > 500) {
      errors.push("La URL de la foto es demasiado larga");
    }
  }

  // Validar array de fotos
  if (photos !== undefined) {
    if (!Array.isArray(photos)) {
      errors.push("photos debe ser un array");
    } else {
      if (photos.length > 10) {
        errors.push("No se pueden agregar más de 10 fotos");
      }
      photos.forEach((photo, index) => {
        if (typeof photo !== "string") {
          errors.push(`La foto en la posición ${index} debe ser una URL válida`);
        } else if (!isValidUrl(photo)) {
          errors.push(`La URL de la foto en la posición ${index} no es válida`);
        } else if (photo.length > 500) {
          errors.push(`La URL de la foto en la posición ${index} es demasiado larga`);
        }
      });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Errores de validación",
      details: errors,
    });
  }

  next();
};

/**
 * Validaciones para actualizar perfil de usuario
 */
export const validateProfileData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { displayName, phone, city, bio } = req.body;
  const errors: string[] = [];

  // Validar nombre
  if (displayName !== undefined) {
    const sanitizedName = sanitizeString(displayName, 100);
    if (sanitizedName.length > 100) {
      errors.push("El nombre no puede exceder 100 caracteres");
    } else {
      req.body.displayName = sanitizedName;
    }
  }

  // Validar teléfono
  if (phone !== undefined && phone !== "") {
    const sanitizedPhone = sanitizeString(phone, 20);
    // Validar formato básico de teléfono (números, espacios, +, -, paréntesis)
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(sanitizedPhone)) {
      errors.push("El formato del teléfono no es válido");
    } else if (sanitizedPhone.length < 8) {
      errors.push("El teléfono debe tener al menos 8 caracteres");
    } else {
      req.body.phone = sanitizedPhone;
    }
  }

  // Validar ciudad
  if (city !== undefined && city !== "") {
    const sanitizedCity = sanitizeString(city, 100);
    if (sanitizedCity.length > 100) {
      errors.push("La ciudad no puede exceder 100 caracteres");
    } else {
      req.body.city = sanitizedCity;
    }
  }

  // Validar biografía
  if (bio !== undefined && bio !== "") {
    const sanitizedBio = sanitizeString(bio, 500);
    if (sanitizedBio.length > 500) {
      errors.push("La biografía no puede exceder 500 caracteres");
    } else {
      req.body.bio = sanitizedBio;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Errores de validación",
      details: errors,
    });
  }

  next();
};

/**
 * Validaciones para solicitud de adopción
 */
export const validateAdoptionRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { petId, message } = req.body;
  const errors: string[] = [];

  // Validar petId
  if (!petId || typeof petId !== "string" || petId.trim().length === 0) {
    errors.push("petId es requerido");
  } else if (petId.length > 100) {
    errors.push("petId inválido");
  } else {
    req.body.petId = petId.trim();
  }

  // Validar mensaje
  if (message !== undefined && message !== null && message !== "") {
    const sanitizedMessage = sanitizeString(message, 1000);
    if (sanitizedMessage.length > 1000) {
      errors.push("El mensaje no puede exceder 1000 caracteres");
    } else {
      req.body.message = sanitizedMessage;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Errores de validación",
      details: errors,
    });
  }

  next();
};

/**
 * Validar ID de parámetro (funciona con cualquier nombre: id, petId, requestId, etc.)
 */
export const validateId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Buscar cualquier parámetro que termine en "Id" o sea exactamente "id"
  const idParams = Object.keys(req.params).filter(
    key => key === "id" || key.toLowerCase().endsWith("id")
  );

  for (const paramKey of idParams) {
    const idValue = req.params[paramKey];

    if (!idValue || typeof idValue !== "string" || idValue.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: `${paramKey} inválido`,
      });
    }

    // Validar que el ID no contenga caracteres peligrosos
    if (!/^[a-zA-Z0-9_-]+$/.test(idValue)) {
      return res.status(400).json({
        success: false,
        error: `${paramKey} contiene caracteres inválidos`,
      });
    }

    if (idValue.length > 100) {
      return res.status(400).json({
        success: false,
        error: `${paramKey} demasiado largo`,
      });
    }

    // Sanitizar el ID
    req.params[paramKey] = idValue.trim();
  }

  next();
};

