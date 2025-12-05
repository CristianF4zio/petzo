/**
 * Rutas de mascotas
 * Endpoints CRUD para gestionar mascotas
 */

import { Router } from "express";
import { verifyFirebaseToken, AuthenticatedRequest } from "../middleware/auth";
import {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
} from "../services/pets.service";
import { asyncHandler } from "../middleware/errorHandler";
import { CreatePetDto, UpdatePetDto } from "../types/Pet";

const router = Router();

/**
 * GET /api/pets
 * Obtiene todas las mascotas (con filtros opcionales)
 * Query params: type, city, ownerId
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { type, city, ownerId } = req.query;

    const filters: {
      type?: "dog" | "cat";
      city?: string;
      ownerId?: string;
    } = {};

    if (type === "dog" || type === "cat") {
      filters.type = type;
    }
    if (typeof city === "string") {
      filters.city = city;
    }
    if (typeof ownerId === "string") {
      filters.ownerId = ownerId;
    }

    const pets = await getAllPets(filters);

    res.json({
      success: true,
      data: pets,
      count: pets.length,
    });
  })
);

/**
 * GET /api/pets/:id
 * Obtiene una mascota por ID
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const pet = await getPetById(id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: "Mascota no encontrada",
      });
    }

    res.json({
      success: true,
      data: pet,
    });
  })
);

/**
 * POST /api/pets
 * Crea una nueva mascota (requiere autenticación)
 */
router.post(
  "/",
  verifyFirebaseToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const petData: CreatePetDto = req.body;

    // Validación básica
    if (!petData.name || !petData.type || !petData.city) {
      return res.status(400).json({
        success: false,
        error: "Faltan campos requeridos: name, type, city",
      });
    }

    // Validar tipo
    if (petData.type !== "dog" && petData.type !== "cat") {
      return res.status(400).json({
        success: false,
        error: "El tipo debe ser 'dog' o 'cat'",
      });
    }

    // Validar sexo
    if (petData.sex && petData.sex !== "male" && petData.sex !== "female") {
      return res.status(400).json({
        success: false,
        error: "El sexo debe ser 'male' o 'female'",
      });
    }

    const newPet = await createPet(petData, req.user.uid);

    res.status(201).json({
      success: true,
      data: newPet,
    });
  })
);

/**
 * PUT /api/pets/:id
 * Actualiza una mascota existente (requiere autenticación y ser el dueño)
 */
router.put(
  "/:id",
  verifyFirebaseToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { id } = req.params;
    const petData: UpdatePetDto = req.body;

    // Validar tipo si se proporciona
    if (petData.type && petData.type !== "dog" && petData.type !== "cat") {
      return res.status(400).json({
        success: false,
        error: "El tipo debe ser 'dog' o 'cat'",
      });
    }

    // Validar sexo si se proporciona
    if (petData.sex && petData.sex !== "male" && petData.sex !== "female") {
      return res.status(400).json({
        success: false,
        error: "El sexo debe ser 'male' o 'female'",
      });
    }

    try {
      const updatedPet = await updatePet(id, petData, req.user.uid);

      res.json({
        success: true,
        data: updatedPet,
      });
    } catch (error: any) {
      if (error.message === "Mascota no encontrada") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      if (error.message.includes("permiso")) {
        return res.status(403).json({
          success: false,
          error: error.message,
        });
      }
      throw error;
    }
  })
);

/**
 * DELETE /api/pets/:id
 * Elimina una mascota (requiere autenticación y ser el dueño)
 */
router.delete(
  "/:id",
  verifyFirebaseToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { id } = req.params;

    try {
      await deletePet(id, req.user.uid);

      res.json({
        success: true,
        message: "Mascota eliminada correctamente",
      });
    } catch (error: any) {
      if (error.message === "Mascota no encontrada") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      if (error.message.includes("permiso")) {
        return res.status(403).json({
          success: false,
          error: error.message,
        });
      }
      throw error;
    }
  })
);

export default router;

